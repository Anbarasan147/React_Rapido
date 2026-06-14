import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { MapContainer } from '../components/MapContainer';
import { Button } from '../components/Button';
import { ArrowLeft, Wallet, Percent, Users, Bike, Car, ArrowRight } from 'lucide-react';
import { RIDE_CATEGORIES, MOCK_OFFERS } from '../mock-data';

export const RideSelectorPage: React.FC = () => {
  const {
    pickup,
    drop,
    selectedCategory,
    setCategory,
    paymentMethod,
    startBooking
  } = useBooking();
  
  const [selectedOfferCode, setSelectedOfferCode] = useState<string>('');
  const [showPromoSheet, setShowPromoSheet] = useState(false);
  const navigate = useNavigate();

  // If no pickup/drop is selected, bounce to home
  if (!pickup || !drop) {
    React.useEffect(() => {
      navigate('/home');
    }, [navigate]);
    return null;
  }

  // Calculate distances for pricing
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = getDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);

  // Apply discount if active
  const appliedOffer = MOCK_OFFERS.find(o => o.code === selectedOfferCode);

  const selectedCategoryFare = React.useMemo(() => {
    if (!selectedCategory) return 0;
    const base = Math.round(selectedCategory.baseFare + distance * selectedCategory.perKmRate);
    let catDiscount = 0;
    if (appliedOffer) {
      if (appliedOffer.code === 'BIKE50' && selectedCategory.id !== 'bike') {
        catDiscount = 0;
      } else if (appliedOffer.code === 'AUTOPASS' && selectedCategory.id !== 'auto') {
        catDiscount = 0;
      } else {
        if (appliedOffer.type === 'flat') {
          catDiscount = appliedOffer.discount;
        } else {
          const percentVal = (base * appliedOffer.discount) / 100;
          catDiscount = appliedOffer.maxDiscount ? Math.min(percentVal, appliedOffer.maxDiscount) : percentVal;
        }
      }
    }
    return Math.max(10, Math.round(base - catDiscount));
  }, [selectedCategory, distance, appliedOffer]);


  const handleBookRide = () => {
    startBooking();
    navigate('/driver-search');
  };

  const handleApplyOffer = (code: string) => {
    setSelectedOfferCode(code);
    setShowPromoSheet(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
      {/* Floating Back Button */}
      <div className="absolute top-12 left-4 z-30">
        <button
          onClick={() => navigate('/search-location')}
          className="w-10 h-10 rounded-2xl bg-[#16161B]/95 backdrop-blur-md border border-[#24242B] flex items-center justify-center text-white shadow-lg cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Map Background with Route Polylines */}
      <div className="flex-1 z-10 w-full h-full">
        <MapContainer />
      </div>

      {/* Bottom Booking Details Panel */}
      <div className="z-20 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#24242B] p-5 rounded-t-3xl flex flex-col gap-4 shadow-2xl relative">
        {/* Route Summary (Compact view) */}
        <div className="flex items-center gap-3 bg-[#16161B]/80 border border-[#24242B] rounded-2xl p-3 text-left">
          <div className="flex flex-col items-center gap-1.5 w-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="w-0.5 h-3 bg-[#24242B]" />
            <div className="w-2 h-2 bg-red-500 rounded-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#8E8E93] truncate">Pickup: <strong className="text-white">{pickup.name}</strong></div>
            <div className="text-[10px] text-[#8E8E93] truncate mt-0.5">Drop: <strong className="text-white">{drop.name}</strong></div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-[#FFE600]">{distance.toFixed(1)} km</span>
          </div>
        </div>

        {/* Ride Category Cards List */}
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto no-scrollbar">
          {RIDE_CATEGORIES.map((category) => {
            const isSelected = selectedCategory?.id === category.id;
            const categoryBaseFare = Math.round(category.baseFare + distance * category.perKmRate);
            
            // Adjust individual fare if promo applied to that type
            let catDiscount = 0;
            if (appliedOffer) {
              if (appliedOffer.code === 'BIKE50' && category.id !== 'bike') {
                catDiscount = 0; // BIKE50 only for bike
              } else if (appliedOffer.code === 'AUTOPASS' && category.id !== 'auto') {
                catDiscount = 0; // AUTOPASS only for auto
              } else {
                if (appliedOffer.type === 'flat') {
                  catDiscount = appliedOffer.discount;
                } else {
                  const percentVal = (categoryBaseFare * appliedOffer.discount) / 100;
                  catDiscount = appliedOffer.maxDiscount ? Math.min(percentVal, appliedOffer.maxDiscount) : percentVal;
                }
              }
            }
            
            const catFinalFare = Math.max(10, Math.round(categoryBaseFare - catDiscount));

            return (
              <button
                key={category.id}
                onClick={() => setCategory(category.id)}
                className={`
                  flex items-center justify-between p-3 border rounded-2xl text-left transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'bg-[#FFE600]/10 border-[#FFE600] ring-1 ring-amber-500/10' 
                    : 'bg-[#16161B] border-[#24242B] hover:border-[#32323D]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-[#24242B] ${isSelected ? 'text-[#FFE600]' : 'text-white'}`}>
                    {category.id === 'bike' && <Bike size={22} />}
                    {category.id === 'auto' && <span className="text-xl">🛺</span>}
                    {category.id === 'cab' && <Car size={20} />}
                    {category.id === 'parcel' && <span className="text-xl">📦</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{category.name}</span>
                      <span className="flex items-center gap-0.5 text-[9px] text-[#8E8E93] bg-[#24242B] px-1.5 py-0.5 rounded-md">
                        <Users size={8} /> {category.capacity}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5">{category.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    {catDiscount > 0 && (
                      <span className="text-[9px] line-through text-[#545458]">₹{categoryBaseFare}</span>
                    )}
                    <span className="text-sm font-extrabold text-white">₹{catFinalFare}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-500 block mt-0.5">ETA: {category.eta} mins</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Promo Code & Payment Bar */}
        <div className="flex gap-2.5 mt-1">
          {/* Payment Method Selector */}
          <button
            onClick={() => navigate('/payment-methods')}
            className="flex-1 bg-[#16161B] border border-[#24242B] hover:border-[#32323D] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#FFE600]" />
              <div className="text-left">
                <span className="text-[9px] text-[#8E8E93] uppercase tracking-wide block leading-none mb-0.5">Payment</span>
                <span className="text-xs font-bold text-white capitalize">{paymentMethod}</span>
              </div>
            </div>
            <ArrowRight size={12} className="text-[#545458]" />
          </button>

          {/* Promo Code Selection */}
          <button
            onClick={() => setShowPromoSheet(true)}
            className={`
              flex-1 border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all
              ${selectedOfferCode 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-[#16161B] border-[#24242B] hover:border-[#32323D]'}
            `}
          >
            <div className="flex items-center gap-2">
              <Percent size={16} className={selectedOfferCode ? 'text-emerald-500' : 'text-[#8E8E93]'} />
              <div className="text-left">
                <span className="text-[9px] text-[#8E8E93] uppercase tracking-wide block leading-none mb-0.5">Coupon</span>
                <span className={`text-xs font-bold ${selectedOfferCode ? 'text-emerald-500' : 'text-white'}`}>
                  {selectedOfferCode ? selectedOfferCode : 'Apply Promo'}
                </span>
              </div>
            </div>
            {selectedOfferCode ? (
              <span 
                onClick={(e) => { e.stopPropagation(); setSelectedOfferCode(''); }}
                className="text-[10px] text-[#8E8E93] hover:text-white px-1.5 py-0.5 rounded bg-[#24242B]"
              >
                ✕
              </span>
            ) : (
              <ArrowRight size={12} className="text-[#545458]" />
            )}
          </button>
        </div>

        {/* Confirmation Button */}
        <Button
          onClick={handleBookRide}
          fullWidth
          disabled={!selectedCategory}
        >
          Book {selectedCategory ? `${selectedCategory.name} - ₹${selectedCategoryFare}` : 'Ride'}
        </Button>
      </div>

      {/* Promos Modal/Bottom Sheet */}
      {showPromoSheet && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-end">
          <div className="w-full bg-[#16161B] border-t border-[#24242B] rounded-t-3xl p-5 flex flex-col gap-4 max-h-[60%] z-50 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center pb-2 border-b border-[#24242B]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Available Coupons</h3>
              <button onClick={() => setShowPromoSheet(false)} className="text-xs text-[#8E8E93]">✕</button>
            </div>
            
            <div className="space-y-3.5 py-2">
              {MOCK_OFFERS.map((offer) => (
                <div key={offer.code} className="border border-[#24242B] bg-[#0c0c0e] p-3 rounded-2xl flex justify-between items-center">
                  <div className="text-left">
                    <span className="bg-[#FFE600] text-black font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                      {offer.code}
                    </span>
                    <p className="text-xs text-white font-semibold mt-1.5">{offer.description}</p>
                  </div>
                  <button
                    onClick={() => handleApplyOffer(offer.code)}
                    className="text-xs font-bold text-[#FFE600] bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 hover:bg-[#FFE600] hover:text-black transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideSelectorPage;
