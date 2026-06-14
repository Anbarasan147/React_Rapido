export interface Location {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export type VehicleType = 'bike' | 'auto' | 'cab' | 'parcel';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  tripsCount: number;
  vehicleType: VehicleType;
  vehicleName: string;
  vehicleNumber: string;
  lat: number;
  lng: number;
  angle?: number; // for map marker rotation
}

export interface RideCategory {
  id: VehicleType;
  name: string;
  description: string;
  baseFare: number;
  perKmRate: number;
  eta: number; // in minutes
  capacity: number;
}

export type BookingStatus =
  | 'idle'
  | 'searching'
  | 'assigned'
  | 'arriving'
  | 'started'
  | 'completed'
  | 'cancelled';

export interface RideBooking {
  id: string;
  pickup: Location;
  drop: Location;
  category: VehicleType | null;
  fare: number;
  status: BookingStatus;
  driver: Driver | null;
  paymentMethod: string;
  otp: string;
  createdAt: string;
  progress: number; // 0 to 100 for tracking simulation
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other' | '';
  savedAddresses: {
    home?: Location;
    work?: Location;
    others: { id: string; label: string; location: Location }[];
  };
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'promo' | 'system' | 'ride';
}

export interface PromoOffer {
  code: string;
  description: string;
  discount: number; // percentage or flat
  type: 'percentage' | 'flat';
  maxDiscount?: number;
}
