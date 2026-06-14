import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ArrowUpDown, Clock, Heart } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_LOCATIONS } from '../mock-data';
import type { Location } from '../types';


export const SearchLocationPage: React.FC = () => {
  const { pickup, setPickup, drop, setDrop } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickupSearch, setPickupSearch] = useState(pickup?.name || '');
  const [dropSearch, setDropSearch] = useState(drop?.name || '');
  const [activeInput, setActiveInput] = useState<'pickup' | 'drop'>('drop');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  const pickupRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLInputElement>(null);

  // Auto focus the active input
  useEffect(() => {
    if (activeInput === 'pickup' && pickupRef.current) {
      pickupRef.current.focus();
    } else if (activeInput === 'drop' && dropRef.current) {
      dropRef.current.focus();
    }
  }, [activeInput]);

  // Filter locations on search query change
  const handleSearchChange = (val: string, type: 'pickup' | 'drop') => {
    if (type === 'pickup') {
      setPickupSearch(val);
    } else {
      setDropSearch(val);
    }

    if (!val.trim()) {
      setFilteredLocations([]);
      return;
    }

    const matched = MOCK_LOCATIONS.filter(loc =>
      loc.name.toLowerCase().includes(val.toLowerCase()) ||
      loc.address.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredLocations(matched);
  };

  const handleSelectLocation = (loc: Location) => {
    if (activeInput === 'pickup') {
      setPickup(loc);
      setPickupSearch(loc.name);
      // Switch focus to drop
      setActiveInput('drop');
      setFilteredLocations([]);
    } else {
      setDrop(loc);
      setDropSearch(loc.name);
      setFilteredLocations([]);
      
      // If we have both, go to ride selector
      if (pickup || pickupSearch) {
        navigate('/ride-selector');
      } else {
        setActiveInput('pickup');
      }
    }
  };

  const swapLocations = () => {
    const tempLoc = pickup;
    setPickup(drop);
    setDrop(tempLoc);
    setPickupSearch(drop?.name || '');
    setDropSearch(pickup?.name || '');
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white">
      {/* Header with search inputs */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex flex-col gap-4">
        
        {/* Back Button and Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack} 
            className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-bold text-white">Select Routes</span>
        </div>

        {/* Pickup and Drop fields container */}
        <div className="flex items-center gap-4 relative">
          
          {/* Connector graphics (dot-dash-dot) */}
          <div className="flex flex-col items-center gap-1.5 absolute left-3 top-7 bottom-7 w-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white/20" />
            <div className="w-0.5 flex-1 bg-[#24242B]" />
            <div className="w-2.5 h-2.5 bg-red-500 rounded-sm border border-white/20" />
          </div>

          <div className="flex-1 flex flex-col gap-3 pl-8">
            {/* Pickup Input */}
            <div className={`flex items-center gap-2 px-3 py-2 bg-[#0C0C0E] border rounded-xl transition-all
              ${activeInput === 'pickup' ? 'border-[#FFE600] ring-1 ring-amber-500/20' : 'border-[#24242B]'}
            `}>
              <input
                ref={pickupRef}
                type="text"
                placeholder="Enter pickup location"
                value={pickupSearch}
                onChange={(e) => handleSearchChange(e.target.value, 'pickup')}
                onFocus={() => setActiveInput('pickup')}
                className="bg-transparent text-xs text-white w-full focus:outline-none placeholder-[#545458] font-medium"
              />
              {pickupSearch && (
                <button 
                  onClick={() => { setPickupSearch(''); setPickup(null); }}
                  className="text-xs text-[#8E8E93] hover:text-white px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Drop Input */}
            <div className={`flex items-center gap-2 px-3 py-2 bg-[#0C0C0E] border rounded-xl transition-all
              ${activeInput === 'drop' ? 'border-[#FFE600] ring-1 ring-amber-500/20' : 'border-[#24242B]'}
            `}>
              <input
                ref={dropRef}
                type="text"
                placeholder="Where to?"
                value={dropSearch}
                onChange={(e) => handleSearchChange(e.target.value, 'drop')}
                onFocus={() => setActiveInput('drop')}
                className="bg-transparent text-xs text-white w-full focus:outline-none placeholder-[#FFE600] font-bold"
              />
              {dropSearch && (
                <button 
                  onClick={() => { setDropSearch(''); setDrop(null); }}
                  className="text-xs text-[#8E8E93] hover:text-white px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapLocations}
            className="w-9 h-9 rounded-xl bg-[#24242B] border border-[#3A3A42] flex items-center justify-center text-[#FFE600] cursor-pointer hover:bg-[#32323D] active:scale-95 transition-all"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        {filteredLocations.length > 0 ? (
          /* Search Results */
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Search Results</span>
            <div className="space-y-1">
              {filteredLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full flex gap-3.5 p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#24242B] flex items-center justify-center text-white flex-shrink-0">
                    <MapPin size={16} className={activeInput === 'pickup' ? 'text-emerald-500' : 'text-red-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{loc.name}</h4>
                    <p className="text-[10px] text-[#8E8E93] truncate mt-0.5">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Suggestions and Shortcuts */
          <div className="space-y-6">
            
            {/* Quick Saved Shortcuts */}
            <div className="grid grid-cols-2 gap-3">
              {user?.savedAddresses?.home && (
                <button
                  onClick={() => handleSelectLocation(user.savedAddresses.home!)}
                  className="flex items-center gap-3 bg-[#16161B] border border-[#24242B] rounded-2xl p-3 text-left active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="text-lg">🏠</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">Home</h4>
                    <p className="text-[9px] text-[#8E8E93] truncate">{user.savedAddresses.home.name}</p>
                  </div>
                </button>
              )}

              {user?.savedAddresses?.work && (
                <button
                  onClick={() => handleSelectLocation(user.savedAddresses.work!)}
                  className="flex items-center gap-3 bg-[#16161B] border border-[#24242B] rounded-2xl p-3 text-left active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="text-lg">🏢</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">Work</h4>
                    <p className="text-[9px] text-[#8E8E93] truncate">{user.savedAddresses.work.name}</p>
                  </div>
                </button>
              )}
            </div>

            {/* Recent Searches */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Recent Destinations</span>
              <div className="space-y-1 bg-[#16161B] border border-[#24242B] rounded-2xl p-2.5">
                {[MOCK_LOCATIONS[1], MOCK_LOCATIONS[5], MOCK_LOCATIONS[6]].map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <Clock size={16} className="text-[#8E8E93] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{loc.name}</h4>
                      <p className="text-[9px] text-[#8E8E93] truncate mt-0.5">{loc.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Locations */}
            {user?.savedAddresses?.others && user.savedAddresses.others.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Saved Addresses</span>
                <div className="space-y-1 bg-[#16161B] border border-[#24242B] rounded-2xl p-2.5">
                  {user.savedAddresses.others.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => handleSelectLocation(addr.location)}
                      className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <Heart size={16} className="text-pink-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{addr.label}</h4>
                        <p className="text-[9px] text-[#8E8E93] truncate mt-0.5">{addr.location.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchLocationPage;
