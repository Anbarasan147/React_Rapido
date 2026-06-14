import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { MapContainer } from '../components/MapContainer';
import { ShieldAlert, Share2, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RideTrackingPage: React.FC = () => {
  const {
    bookingStatus,
    assignedDriver,
    pickup,
    drop,
    progress,
    fare,
    completeTrip
  } = useBooking();

  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  // Redirect if trip completes or cancels
  useEffect(() => {
    if (bookingStatus === 'completed') {
      navigate('/trip-completed');
    } else if (bookingStatus === 'idle') {
      navigate('/home');
    }
  }, [bookingStatus, navigate]);

  const handleShareStatus = () => {
    setShowShareModal(true);
    setTimeout(() => {
      setShowShareModal(false);
      alert('Trip tracking link copied to clipboard!');
    }, 1500);
  };

  if (!assignedDriver || !pickup || !drop) return null;

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
      
      {/* Dev Controls (Top Right) */}
      <div className="absolute top-14 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/90 border border-emerald-500/30 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-2xl max-w-[150px]">
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest text-center">Dev Controls</span>
          <button
            onClick={() => {
              // Directly trigger completion
              const savedHistory = localStorage.getItem('rapido_ride_history');
              const history = savedHistory ? JSON.parse(savedHistory) : [];
              const newRide = {
                id: `rap_${Math.floor(100000 + Math.random() * 900000)}`,
                pickup,
                drop,
                category: assignedDriver.vehicleType,
                fare,
                driver: assignedDriver,
                paymentMethod: 'cash',
                date: new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };
              localStorage.setItem('rapido_ride_history', JSON.stringify([newRide, ...history]));
              completeTrip();
              navigate('/trip-completed');
            }}
            className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[9px] py-1 px-2 rounded-lg cursor-pointer transition-all"
          >
            <CheckCircle size={10} /> Force Arrive
          </button>
        </div>
      </div>

      {/* Map Background with Driver Marker moving along route */}
      <div className="flex-1 z-10 w-full h-full">
        <MapContainer />
      </div>

      {/* Bottom Ride Status Sheet */}
      <div className="z-20 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#24242B] p-5 rounded-t-3xl flex flex-col gap-4 shadow-2xl relative text-left">
        
        {/* Trip Header Status */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24242B]/60">
          <div>
            <span className="text-[9px] font-bold text-[#FFE600] uppercase tracking-wider block bg-amber-500/10 px-2 py-0.5 rounded-md w-max">
              Trip In Progress
            </span>
            <h3 className="text-sm font-extrabold text-white truncate max-w-[200px] mt-1.5">
              Heading to {drop.name}
            </h3>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-500 justify-end">
              <Clock size={14} />
              <span className="text-xs font-black">{Math.max(1, Math.round((100 - progress) / 5))} mins</span>
            </div>
            <span className="text-[9px] text-[#8E8E93] block mt-0.5">Estimated Arrival</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-[#8E8E93]">
            <span>Pickup: {pickup.name.split(',')[0]}</span>
            <span>{progress}% Completed</span>
          </div>
          <div className="w-full h-2 bg-[#24242B] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#FFE600] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Captain Card Preview */}
        <div className="flex items-center gap-3 bg-[#16161B] border border-[#24242B] rounded-2xl p-3">
          <img
            src={assignedDriver.avatar}
            alt={assignedDriver.name}
            className="w-10 h-10 rounded-xl object-cover border border-[#24242B]"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white leading-none">{assignedDriver.name}</h4>
            <p className="text-[10px] text-[#8E8E93] mt-1 truncate">{assignedDriver.vehicleName} • {assignedDriver.vehicleNumber}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-white">₹{fare}</span>
            <span className="text-[9px] text-[#8E8E93] block">Cash Ride</span>
          </div>
        </div>

        {/* Bottom Actions: Share, SOS */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={handleShareStatus}
            className="flex-1 bg-[#16161B] border border-[#24242B] hover:border-[#32323D] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer active:scale-95 transition-all"
          >
            <Share2 size={16} />
            <span>Share Status</span>
          </button>

          <button
            onClick={() => alert('Emergency SOS alert activated. Emergency services have been pinged.')}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-lg shadow-red-500/10"
          >
            <ShieldAlert size={16} />
            <span>SOS Help</span>
          </button>
        </div>

      </div>

      {/* Simulated Share sheet status overlay */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#16161B] border border-[#24242B] p-6 rounded-3xl text-center space-y-4 max-w-[280px]">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-xl">
                🔗
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Generating Tracking Link</h4>
                <p className="text-xs text-[#8E8E93]">Sharing real-time ETA and coordinates with safety contacts...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RideTrackingPage;
