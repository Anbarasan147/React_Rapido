import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Location, Driver, RideCategory, BookingStatus, VehicleType } from '../types';
import { RIDE_CATEGORIES, MOCK_DRIVERS } from '../mock-data';


interface BookingContextType {
  pickup: Location | null;
  drop: Location | null;
  selectedCategory: RideCategory | null;
  fare: number;
  paymentMethod: string;
  bookingStatus: BookingStatus;
  assignedDriver: Driver | null;
  otp: string;
  progress: number;
  driverLocation: { lat: number; lng: number } | null;
  driverHeading: number;
  routeCoordinates: [number, number][];
  setPickup: (loc: Location | null) => void;
  setDrop: (loc: Location | null) => void;
  setCategory: (catId: VehicleType | null) => void;
  setPaymentMethod: (method: string) => void;
  startBooking: () => void;
  cancelBooking: () => void;
  startRideSimulation: () => void;
  completeTrip: () => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to calculate distance in km using Haversine formula
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

// Generate points along a straight line between two coordinates
const interpolatePoints = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  steps: number
): [number, number][] => {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = start.lat + (end.lat - start.lat) * ratio;
    const lng = start.lng + (end.lng - start.lng) * ratio;
    points.push([lat, lng]);
  }
  return points;
};

// Calculate heading angle in degrees between two coordinates
const getHeading = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
  const dy = to.lat - from.lat;
  const dx = Math.cos(Math.PI / 180 * from.lat) * (to.lng - from.lng);
  let angle = Math.atan2(dx, dy) * 180 / Math.PI;
  if (angle < 0) angle += 360;
  return angle;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [drop, setDrop] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RideCategory | null>(null);
  const [fare, setFare] = useState<number>(0);
  const [paymentMethod, setPaymentMethodState] = useState<string>('cash');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [driverHeading, setDriverHeading] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recalculate fare when pickup, drop or category changes
  useEffect(() => {
    if (pickup && drop && selectedCategory) {
      const distance = getDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);
      const calculatedFare = Math.round(
        selectedCategory.baseFare + distance * selectedCategory.perKmRate
      );
      setFare(calculatedFare);
    } else {
      setFare(0);
    }
  }, [pickup, drop, selectedCategory]);

  const setCategory = (catId: VehicleType | null) => {
    if (!catId) {
      setSelectedCategory(null);
      return;
    }
    const cat = RIDE_CATEGORIES.find((c) => c.id === catId);
    if (cat) setSelectedCategory(cat);
  };

  const setPaymentMethod = (method: string) => {
    setPaymentMethodState(method);
  };

  const clearSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const cancelBooking = () => {
    clearSimulation();
    setBookingStatus('cancelled');
    setTimeout(() => {
      resetBooking();
    }, 1500);
  };

  const resetBooking = () => {
    clearSimulation();
    setBookingStatus('idle');
    setAssignedDriver(null);
    setOtp('');
    setProgress(0);
    setDriverLocation(null);
    setDriverHeading(0);
    setRouteCoordinates([]);
  };

  // Step 1: Start booking -> searching driver
  const startBooking = () => {
    if (!pickup || !drop || !selectedCategory) return;
    setBookingStatus('searching');
    setProgress(0);

    // Simulate searching for driver
    setTimeout(() => {
      // Find a driver matching selected category
      const pool = MOCK_DRIVERS.filter((d) => d.vehicleType === selectedCategory.id);
      const driver = pool[Math.floor(Math.random() * pool.length)] || MOCK_DRIVERS[0];

      // Generate a mock driver start location near the pickup
      const angle = Math.random() * 2 * Math.PI;
      const offsetRadius = 0.008; // approx 800m
      const driverStart = {
        lat: pickup.lat + offsetRadius * Math.sin(angle),
        lng: pickup.lng + offsetRadius * Math.cos(angle)
      };

      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

      setAssignedDriver({
        ...driver,
        lat: driverStart.lat,
        lng: driverStart.lng
      });
      setDriverLocation(driverStart);
      setOtp(generatedOtp);
      setBookingStatus('assigned');

      // Begin driver arrival phase after 2 seconds of showing "Assigned"
      setTimeout(() => {
        simulateDriverArrival(driverStart, pickup);
      }, 2000);

    }, 3500); // 3.5 seconds matching radar animation
  };

  // Step 2: Driver moves from start location to Pickup
  const simulateDriverArrival = (start: { lat: number; lng: number }, pickupLoc: Location) => {
    setBookingStatus('arriving');
    setProgress(0);

    const steps = 40;
    const path = interpolatePoints(start, pickupLoc, steps);
    setRouteCoordinates(path);
    
    let currentStep = 0;
    clearSimulation();

    simulationIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        clearSimulation();
        setDriverLocation(pickupLoc);
        setBookingStatus('started'); // Driver arrived, ride starting
        setProgress(0);
        return;
      }

      const currentLoc = { lat: path[currentStep][0], lng: path[currentStep][1] };
      const nextLoc = { lat: path[currentStep + 1][0], lng: path[currentStep + 1][1] };
      
      setDriverLocation(currentLoc);
      setDriverHeading(getHeading(currentLoc, nextLoc));
      setProgress(Math.round((currentStep / steps) * 100));
      currentStep++;
    }, 250); // Takes ~10 seconds to arrive
  };

  // Step 3: Start ride from Pickup to Drop
  const startRideSimulation = () => {
    if (!pickup || !drop) return;
    setBookingStatus('started');
    setProgress(0);

    const steps = 60;
    const path = interpolatePoints(pickup, drop, steps);
    setRouteCoordinates(path);

    let currentStep = 0;
    clearSimulation();

    simulationIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        clearSimulation();
        setDriverLocation(drop);
        setBookingStatus('completed');
        setProgress(100);
        
        // Add to ride history
        const savedHistory = localStorage.getItem('rapido_ride_history');
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const newRide = {
          id: `rap_${Math.floor(100000 + Math.random() * 900000)}`,
          pickup,
          drop,
          category: selectedCategory?.id || 'bike',
          fare,
          driver: assignedDriver,
          paymentMethod,
          date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
        localStorage.setItem('rapido_ride_history', JSON.stringify([newRide, ...history]));
        return;
      }

      const currentLoc = { lat: path[currentStep][0], lng: path[currentStep][1] };
      const nextLoc = currentStep + 1 < steps 
        ? { lat: path[currentStep + 1][0], lng: path[currentStep + 1][1] }
        : drop;

      setDriverLocation(currentLoc);
      setDriverHeading(getHeading(currentLoc, nextLoc));
      setProgress(Math.round((currentStep / steps) * 100));
      currentStep++;
    }, 300); // Takes ~18 seconds to transit
  };

  const completeTrip = () => {
    resetBooking();
  };

  return (
    <BookingContext.Provider
      value={{
        pickup,
        drop,
        selectedCategory,
        fare,
        paymentMethod,
        bookingStatus,
        assignedDriver,
        otp,
        progress,
        driverLocation,
        driverHeading,
        routeCoordinates,
        setPickup,
        setDrop,
        setCategory,
        setPaymentMethod,
        startBooking,
        cancelBooking,
        startRideSimulation,
        completeTrip,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
