import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { MapContainer } from '../components/MapContainer';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

const SEARCH_MESSAGES = [
  'Contacting captains nearby...',
  'Finding the fastest ride for you...',
  'Almost there! Matching your ride...',
  'Securing a captain at best price...'
];

export const DriverSearchPage: React.FC = () => {
  const { bookingStatus, cancelBooking, selectedCategory } = useBooking();
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  // Rotate messages every 1.2 seconds for realistic loading feel
  useEffect(() => {
    if (bookingStatus !== 'searching') return;
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % SEARCH_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [bookingStatus]);

  // Reactive redirect when driver is assigned
  useEffect(() => {
    if (bookingStatus === 'assigned' || bookingStatus === 'arriving') {
      navigate('/driver-assigned');
    } else if (bookingStatus === 'idle') {
      navigate('/home');
    }
  }, [bookingStatus, navigate]);

  const handleCancel = () => {
    cancelBooking();
    navigate('/ride-selector');
  };

  const currentVehicleName = selectedCategory?.name || 'Ride';

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
      
      {/* Map Background */}
      <div className="flex-1 z-10 w-full h-full">
        <MapContainer />
      </div>

      {/* Bottom Searching Sheet */}
      <div className="z-20 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#24242B] p-6 rounded-t-3xl flex flex-col items-center gap-6 shadow-2xl relative">
        
        {/* Pulsing Radar Loader */}
        <div className="w-28 h-28 relative flex items-center justify-center mt-2">
          {/* Radar Waves */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 bg-[#FFE600] rounded-full"
              initial={{ scale: 0.2, opacity: 0.6 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: ring * 0.7,
                ease: 'easeOut'
              }}
            />
          ))}
          
          {/* Central Pulsing Sphere */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full bg-[#FFE600] border-4 border-[#0C0C0E] shadow-xl flex items-center justify-center text-black font-extrabold text-lg relative z-10"
          >
            🚕
          </motion.div>
        </div>

        {/* Text descriptions */}
        <div className="text-center space-y-1.5 max-w-[280px]">
          <h3 className="text-base font-extrabold text-white">Searching for {currentVehicleName}</h3>
          <p className="text-xs text-[#8E8E93] h-4 transition-all duration-300">
            {SEARCH_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleCancel}
          variant="outline"
          fullWidth
          className="mt-2 text-[#8E8E93] border-[#24242B]"
        >
          Cancel Booking
        </Button>
      </div>
    </div>
  );
};

export default DriverSearchPage;
