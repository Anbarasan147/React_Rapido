import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { Button } from '../components/Button';

export const ReferralPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const referralCode = 'RAPID50X';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    alert(`Referral message copied! Send this code: ${referralCode} to your friends.`);
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
        <span className="text-sm font-bold text-white">Refer & Earn</span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-6 items-center text-center">
        
        {/* Gift Illustration Box */}
        <div className="w-40 h-40 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/20 flex items-center justify-center text-7xl shadow-inner mt-4 animate-bounce duration-[2000ms]">
          🎁
        </div>

        {/* Headlines */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white">Invite Friends, Earn Cash</h2>
          <p className="text-xs text-[#8E8E93] leading-relaxed max-w-[280px]">
            Share your invite code with friends. You both get <strong className="text-[#FFE600]">₹50</strong> in wallet money when they complete their first ride!
          </p>
        </div>

        {/* Referral Code Box */}
        <div className="w-full bg-[#16161B] border border-[#24242B] rounded-2xl p-4 flex flex-col items-center gap-3">
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide">Your Invite Code</span>
          <div className="flex items-center gap-4 w-full justify-center">
            <h3 className="text-2xl font-black text-white tracking-widest pl-6">{referralCode}</h3>
            <button
              onClick={handleCopy}
              className="w-9 h-9 rounded-xl bg-[#24242B] hover:bg-[#32323D] flex items-center justify-center text-[#FFE600] border border-[#3A3A42]/30 cursor-pointer transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Earning Stats */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          <div className="bg-[#16161B] border border-[#24242B] rounded-2xl p-4 text-left">
            <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">Total Earned</span>
            <h3 className="text-xl font-extrabold text-[#FFE600] mt-1">₹150.00</h3>
          </div>
          <div className="bg-[#16161B] border border-[#24242B] rounded-2xl p-4 text-left">
            <span className="text-[9px] text-[#8E8E93] uppercase font-bold block">Friends Joined</span>
            <h3 className="text-xl font-extrabold text-white mt-1">3 Joined</h3>
          </div>
        </div>

        {/* Invite list */}
        <div className="w-full space-y-3 text-left">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Friend Status</span>
          <div className="bg-[#16161B] border border-[#24242B] rounded-2xl p-2.5 space-y-2">
            {[
              { name: 'Karthik Raja', status: 'Completed 1st Ride', reward: '₹50 credited', color: 'text-emerald-500' },
              { name: 'Preeti Sharma', status: 'Registered', reward: 'Pending ride', color: 'text-amber-500' },
              { name: 'Vijay Anand', status: 'Completed 1st Ride', reward: '₹50 credited', color: 'text-emerald-500' }
            ].map((friend, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-xl hover:bg-white/2 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{friend.name}</h4>
                  <span className="text-[9px] text-[#8E8E93] block mt-1">{friend.status}</span>
                </div>
                <span className={`text-[10px] font-bold ${friend.color}`}>{friend.reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleShare}
          fullWidth
          icon={<Share2 size={16} />}
          className="mt-2"
        >
          Share Invite Code
        </Button>

      </div>
    </div>
  );
};

export default ReferralPage;
