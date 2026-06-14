import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, ChevronRight, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { MOCK_LOCATIONS } from '../mock-data';
import { Button } from '../components/Button';


export const SettingsPage: React.FC = () => {
  const { user, saveAddress, deleteAddress, logout } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [selectedLoc, setSelectedLoc] = useState(MOCK_LOCATIONS[0]);
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('other');

  const navigate = useNavigate();

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressType === 'other' && !newLabel.trim()) return;

    saveAddress(addressType, selectedLoc, newLabel);
    setNewLabel('');
    setShowAddressModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={() => navigate('/home')} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">Settings</span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        
        {/* Profile Card Summary */}
        <div 
          onClick={() => navigate('/edit-profile')}
          className="bg-[#16161B] border border-[#24242B] hover:border-[#FFE600]/30 rounded-3xl p-4 flex justify-between items-center cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-2xl bg-[#FFE600] flex items-center justify-center text-black font-extrabold text-base">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-none">{user?.name}</h4>
              <p className="text-[9px] text-[#8E8E93] mt-1.5">{user?.phone} • {user?.email || 'No Email'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#FFE600]">Edit</span>
            <ChevronRight size={14} className="text-[#8E8E93]" />
          </div>
        </div>

        {/* Saved Addresses Management */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider">Saved Places</span>
            <button
              onClick={() => { setAddressType('other'); setShowAddressModal(true); }}
              className="text-[10px] font-bold text-[#FFE600] hover:underline"
            >
              + Add New
            </button>
          </div>

          <div className="bg-[#16161B] border border-[#24242B] rounded-3xl p-3 space-y-1 text-left">
            {/* Home Address */}
            <div className="flex justify-between items-center p-2 rounded-xl hover:bg-white/2">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏠</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Home</h4>
                  <p className="text-[9px] text-[#8E8E93] truncate w-44">
                    {user?.savedAddresses.home ? user.savedAddresses.home.name : 'Not set'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setAddressType('home'); setShowAddressModal(true); }}
                className="text-[9px] font-bold text-[#FFE600] bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg"
              >
                Set
              </button>
            </div>

            {/* Work Address */}
            <div className="flex justify-between items-center p-2 rounded-xl hover:bg-white/2 border-t border-[#24242B]/40">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏢</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Work</h4>
                  <p className="text-[9px] text-[#8E8E93] truncate w-44">
                    {user?.savedAddresses.work ? user.savedAddresses.work.name : 'Not set'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setAddressType('work'); setShowAddressModal(true); }}
                className="text-[9px] font-bold text-[#FFE600] bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg"
              >
                Set
              </button>
            </div>

            {/* Custom Addresses */}
            {user?.savedAddresses.others.map((addr) => (
              <div key={addr.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-white/2 border-t border-[#24242B]/40">
                <div className="flex items-center gap-3">
                  <Heart size={16} className="text-pink-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{addr.label}</h4>
                    <p className="text-[9px] text-[#8E8E93] truncate w-44">{addr.location.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-[9px] font-bold text-red-500 hover:text-red-600 px-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Configurations List */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">App Settings</span>
          <div className="bg-[#16161B] border border-[#24242B] rounded-3xl p-2.5 space-y-1">
            <div className="flex justify-between items-center p-3">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#8E8E93]" />
                <span className="text-xs font-bold text-white">Push Notifications</span>
              </div>
              <input type="checkbox" defaultChecked className="w-8 h-4 rounded-full bg-[#24242B] accent-[#FFE600]" />
            </div>

            <div className="flex justify-between items-center p-3 border-t border-[#24242B]/40">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-[#8E8E93]" />
                <span className="text-xs font-bold text-white">Location Sharing</span>
              </div>
              <input type="checkbox" defaultChecked className="w-8 h-4 rounded-full bg-[#24242B] accent-[#FFE600]" />
            </div>

            <div 
              onClick={() => navigate('/about')}
              className="flex justify-between items-center p-3 border-t border-[#24242B]/40 cursor-pointer hover:bg-white/2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-[#8E8E93]" />
                <span className="text-xs font-bold text-white">About Rapido Clone</span>
              </div>
              <ChevronRight size={14} className="text-[#8E8E93]" />
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer active:scale-95 transition-all"
        >
          <LogOut size={16} />
          <span>Log Out Account</span>
        </button>

      </div>

      {/* Add/Set Address Modal Sheet */}
      {showAddressModal && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-end">
          <form onSubmit={handleSaveAddress} className="w-full bg-[#16161B] border-t border-[#24242B] rounded-t-3xl p-5 flex flex-col gap-4 z-50 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-[#24242B]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Set {addressType === 'home' ? 'Home' : addressType === 'work' ? 'Work' : 'Custom'} Address
              </h3>
              <button type="button" onClick={() => setShowAddressModal(false)} className="text-xs text-[#8E8E93]">✕</button>
            </div>

            {addressType === 'other' && (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">Address Label</label>
                <input
                  type="text"
                  placeholder="e.g. Gym, Library, Friend"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-[#0C0C0E] text-white border border-[#24242B] focus:border-[#FFE600] rounded-2xl px-4 py-3.5 text-sm focus:outline-none placeholder-[#545458]"
                  required
                />
              </div>
            )}

            {/* Select Location from Mock list */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">Select Location</label>
              <select
                value={MOCK_LOCATIONS.findIndex(l => l.name === selectedLoc.name)}
                onChange={(e) => setSelectedLoc(MOCK_LOCATIONS[parseInt(e.target.value)])}
                className="bg-[#0C0C0E] text-white border border-[#24242B] focus:border-[#FFE600] rounded-2xl px-4 py-3.5 text-sm focus:outline-none"
              >
                {MOCK_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={idx}>{loc.name}</option>
                ))}
              </select>
            </div>

            <Button type="submit" fullWidth>
              Save Address
            </Button>
          </form>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
