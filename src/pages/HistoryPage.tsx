import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bike, Car, Receipt } from 'lucide-react';
import { Button } from '../components/Button';
import type { VehicleType } from '../types';


interface HistoryItem {
  id: string;
  pickup: { name: string; address: string };
  drop: { name: string; address: string };
  category: VehicleType;
  fare: number;
  paymentMethod: string;
  date: string;
  driver?: { name: string; vehicleName: string; vehicleNumber: string; avatar: string };
}

export const HistoryPage: React.FC = () => {
  const [rides, setRides] = useState<HistoryItem[]>([]);
  const [selectedRide, setSelectedRide] = useState<HistoryItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('rapido_ride_history');
    if (saved) {
      setRides(JSON.parse(saved));
    }
  }, []);

  const handleBack = () => {
    navigate('/home');
  };

  const getCategoryIcon = (cat: VehicleType) => {
    switch (cat) {
      case 'bike':
        return <Bike size={18} className="text-[#FFE600]" />;
      case 'auto':
        return <span className="text-base">🛺</span>;
      case 'cab':
        return <Car size={18} className="text-blue-400" />;
      case 'parcel':
      default:
        return <span className="text-base">📦</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={handleBack} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">My Ride History</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        {rides.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
            <div className="w-16 h-16 rounded-full bg-[#16161B] border border-[#24242B] flex items-center justify-center text-3xl">
              🏍️
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Rides Yet</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed max-w-[200px]">
                You haven't taken any rides yet. Book a ride now to see your history here!
              </p>
            </div>
          </div>
        ) : (
          /* Rides List */
          <div className="space-y-3">
            {rides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => setSelectedRide(ride)}
                className="bg-[#16161B] border border-[#24242B] hover:border-[#FFE600]/30 rounded-2xl p-4 flex flex-col gap-3 text-left transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-[#24242B]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#24242B] flex items-center justify-center">
                      {getCategoryIcon(ride.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white capitalize">{ride.category} Taxi</h4>
                      <span className="text-[8px] font-semibold text-[#8E8E93]">{ride.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#FFE600]">₹{ride.fare}</span>
                    <span className="text-[8px] text-[#8E8E93] block capitalize">{ride.paymentMethod}</span>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-2 text-[10px] text-[#8E8E93]">
                  <div className="truncate flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="truncate flex-1">{ride.pickup.name}</span>
                  </div>
                  <div className="truncate flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-sm bg-red-500 flex-shrink-0" />
                    <span className="truncate flex-1">{ride.drop.name}</span>
                  </div>
                </div>

                {/* Driver short details */}
                {ride.driver && (
                  <div className="flex items-center gap-2 bg-[#0C0C0E]/40 p-2 rounded-xl border border-[#24242B]/50 mt-1">
                    <img
                      src={ride.driver.avatar}
                      alt={ride.driver.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-white truncate">{ride.driver.name}</p>
                      <p className="text-[8px] text-[#8E8E93] truncate">{ride.driver.vehicleName}</p>
                    </div>
                    <span className="text-[8px] font-bold text-white bg-[#24242B] px-1.5 py-0.5 rounded">
                      {ride.driver.vehicleNumber}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Detail Sheet Overlay */}
      {selectedRide && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="w-full bg-[#16161B] border-t border-[#24242B] rounded-t-3xl p-6 flex flex-col gap-4 max-h-[85%] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#24242B]">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-[#FFE600]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ride Invoice</h3>
              </div>
              <button 
                onClick={() => setSelectedRide(null)} 
                className="w-7 h-7 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Receipt Content */}
            <div className="space-y-4 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8E93]">Ride ID</span>
                <span className="font-bold text-white">{selectedRide.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8E93]">Date & Time</span>
                <span className="font-bold text-white">{selectedRide.date}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8E93]">Vehicle Category</span>
                <span className="font-bold text-white capitalize">{selectedRide.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8E8E93]">Payment Method</span>
                <span className="font-bold text-white capitalize">{selectedRide.paymentMethod}</span>
              </div>

              <div className="border-t border-[#24242B] pt-3 flex justify-between text-sm">
                <span className="font-bold text-white">Total Fare Charged</span>
                <span className="font-black text-[#FFE600]">₹{selectedRide.fare}</span>
              </div>

              {/* Path addresses */}
              <div className="bg-[#0C0C0E] p-3 rounded-2xl space-y-3 border border-[#24242B]/60 text-xs">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white">Pickup Location</h4>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5 leading-relaxed">{selectedRide.pickup.address}</p>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-[#24242B]/40 pt-3">
                  <div className="w-1.5 h-1.5 rounded-sm bg-red-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white">Dropoff Location</h4>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5 leading-relaxed">{selectedRide.drop.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setSelectedRide(null)}
              fullWidth
              variant="outline"
              className="mt-2"
            >
              Close Invoice
            </Button>

          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
