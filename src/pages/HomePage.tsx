import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, MapPin, Bike, Car, ArrowRight, Wallet, History, Gift, HelpCircle, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { MapContainer } from '../components/MapContainer';
import { PROMO_BANNERS, MOCK_LOCATIONS } from '../mock-data';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { pickup, setPickup, setDrop, setCategory, resetBooking } = useBooking();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const unreadCount = 2;
  const navigate = useNavigate();


  // Set default pickup to user's home or first mock location if not set
  useEffect(() => {
    if (!pickup) {
      const defaultPickup = user?.savedAddresses?.home || MOCK_LOCATIONS[0];
      setPickup(defaultPickup);
    }
  }, [pickup, user, setPickup]);

  const handleCategorySelect = (category: 'bike' | 'auto' | 'cab' | 'parcel') => {
    setCategory(category);
    navigate('/search-location');
  };

  const handleQuickBook = (destination: typeof MOCK_LOCATIONS[0]) => {
    // If pickup is not set, use default
    if (!pickup) {
      setPickup(user?.savedAddresses?.home || MOCK_LOCATIONS[0]);
    }
    setDrop(destination);
    navigate('/ride-selector');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
      
      {/* Sidebar Navigation Menu Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Sidebar Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 z-50 cursor-pointer"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 bottom-0 left-0 w-3/4 max-w-[300px] bg-[#16161B] border-r border-[#24242B] z-50 flex flex-col justify-between py-6"
            >
              <div>
                {/* User Profile Summary */}
                <div 
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate('/settings');
                  }}
                  className="px-6 pb-6 border-b border-[#24242B] flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFE600] flex items-center justify-center text-black font-bold text-lg">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{user?.name || 'Rider'}</h3>
                    <p className="text-xs text-[#8E8E93] truncate">{user?.phone}</p>
                    <div className="inline-flex items-center gap-1 bg-[#FFE600]/10 border border-[#FFE600]/20 rounded-full px-1.5 py-0.5 mt-1">
                      <span className="text-[10px] font-bold text-[#FFE600]">★ 4.9</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#8E8E93]" />
                </div>

                {/* Navigation Links */}
                <div className="mt-4 px-2 space-y-1">
                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/history'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <History size={18} className="text-[#8E8E93]" />
                    <span>My Rides</span>
                  </button>
                  
                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/wallet'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <Wallet size={18} className="text-[#8E8E93]" />
                    <span>Payment & Wallet</span>
                  </button>

                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/notifications'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <div className="relative">
                      <Bell size={18} className="text-[#8E8E93]" />
                      {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
                    </div>
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/referrals'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <Gift size={18} className="text-[#8E8E93]" />
                    <span>Refer & Earn</span>
                  </button>

                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/help'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <HelpCircle size={18} className="text-[#8E8E93]" />
                    <span>Help & Support</span>
                  </button>

                  <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    <Settings size={18} className="text-[#8E8E93]" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Logout at bottom */}
              <div className="px-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/5 transition-all text-sm font-bold cursor-pointer text-left"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Header Overlay */}
      <div className="absolute top-12 left-4 right-4 z-30 flex justify-between items-center pointer-events-none">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 rounded-2xl bg-[#16161B]/95 backdrop-blur-md border border-[#24242B] flex items-center justify-center text-white shadow-lg pointer-events-auto cursor-pointer active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>

        {/* Current Location Display Tag */}
        <div className="flex-1 max-w-[65%] mx-3 py-2 px-3 rounded-2xl bg-[#16161B]/95 backdrop-blur-md border border-[#24242B] flex items-center gap-1.5 shadow-lg pointer-events-auto cursor-pointer" onClick={() => navigate('/search-location')}>
          <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
          <span className="text-[11px] font-bold text-white truncate text-left flex-1">
            {pickup ? pickup.name : 'Setting pickup location...'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-2xl bg-[#16161B]/95 backdrop-blur-md border border-[#24242B] flex items-center justify-center text-white shadow-lg pointer-events-auto cursor-pointer relative active:scale-95 transition-transform"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#16161B]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Live Map Background (takes full viewport) */}
      <div className="flex-1 z-10 w-full h-full">
        <MapContainer />
      </div>

      {/* Bottom Panel Container */}
      <div className="z-20 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#24242B] p-5 rounded-t-3xl flex flex-col gap-4 shadow-2xl relative">
        
        {/* Fake Drag indicator for aesthetics */}
        <div className="w-10 h-1 bg-[#24242B] rounded-full self-center -mt-2 mb-1" />

        {/* Search Bar - Destination Input */}
        <button
          onClick={() => {
            resetBooking();
            navigate('/search-location');
          }}
          className="w-full bg-[#16161B] border border-[#24242B] rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-all"
        >
          <Search size={18} className="text-[#8E8E93] flex-shrink-0" />
          <span className="text-base text-[#545458] font-medium flex-1">Where are you going?</span>
        </button>

        {/* Ride Category Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mt-1">
          {[
            { id: 'bike', label: 'Bike Taxi', icon: <Bike size={24} className="text-black" />, desc: 'Beat traffic', labelBg: 'bg-[#FFE600]', badge: 'Fastest' },
            { id: 'auto', label: 'Auto', icon: <span className="text-xl">🛺</span>, desc: 'Everyday ride', labelBg: 'bg-[#FF9500]/20', badge: 'Popular' },
            { id: 'cab', label: 'Cab AC', icon: <Car size={22} className="text-white" />, desc: 'Comfortable', labelBg: 'bg-[#007AFF]/20' },
            { id: 'parcel', label: 'Parcel', icon: <span className="text-xl">📦</span>, desc: 'Instant send', labelBg: 'bg-[#34C759]/20' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id as any)}
              className="flex flex-col items-center bg-[#16161B] border border-[#24242B] hover:border-[#FFE600] rounded-2xl p-2.5 transition-all text-center relative cursor-pointer group"
            >
              {cat.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                  {cat.badge}
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.id === 'bike' ? 'bg-[#FFE600]' : 'bg-[#24242B] group-hover:bg-[#FFE600]/10'} mb-1.5 transition-colors`}>
                {cat.id === 'cab' ? (
                  <Car size={20} className="text-white group-hover:text-[#FFE600]" />
                ) : (
                  cat.icon
                )}
              </div>
              <span className="text-xs font-bold text-white">{cat.label}</span>
              <span className="text-[9px] text-[#8E8E93] mt-0.5 leading-none truncate w-full">{cat.desc}</span>
            </button>
          ))}
        </div>

        {/* Saved & Recent Places */}
        <div className="border-t border-[#24242B]/60 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide">Saved & Recent Places</span>
          </div>
          <div className="space-y-2.5 max-h-24 overflow-y-auto no-scrollbar">
            {/* Home Address shortcut */}
            {user?.savedAddresses?.home && (
              <div
                onClick={() => handleQuickBook(user.savedAddresses.home!)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    🏠
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Home</h4>
                    <p className="text-[10px] text-[#8E8E93] truncate w-48">{user.savedAddresses.home.name}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#545458]" />
              </div>
            )}

            {/* Work Address shortcut */}
            {user?.savedAddresses?.work && (
              <div
                onClick={() => handleQuickBook(user.savedAddresses.work!)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Work</h4>
                    <p className="text-[10px] text-[#8E8E93] truncate w-48">{user.savedAddresses.work.name}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#545458]" />
              </div>
            )}
            
            {/* Quick destination: Koramangala */}
            <div
              onClick={() => handleQuickBook(MOCK_LOCATIONS[1])}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#24242B] flex items-center justify-center text-white flex-shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{MOCK_LOCATIONS[1].name}</h4>
                  <p className="text-[10px] text-[#8E8E93] truncate w-48">{MOCK_LOCATIONS[1].address}</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#545458]" />
            </div>
          </div>
        </div>

        {/* Promotional Banners Carousel */}
        <div className="border-t border-[#24242B]/60 pt-3">
          <div className="flex overflow-x-auto gap-3.5 no-scrollbar pb-1">
            {PROMO_BANNERS.map((banner) => (
              <div
                key={banner.id}
                onClick={() => navigate('/wallet')}
                className={`flex-shrink-0 w-64 p-3.5 rounded-2xl bg-gradient-to-r ${banner.color} text-left flex flex-col justify-between h-24 shadow-md cursor-pointer hover:brightness-105 transition-all`}
              >
                <div>
                  <span className="text-[9px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {banner.code}
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1 leading-tight">{banner.title}</h4>
                </div>
                <p className="text-[11px] font-semibold text-white/90 leading-tight">{banner.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
