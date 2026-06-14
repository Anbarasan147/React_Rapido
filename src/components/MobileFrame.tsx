import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-radial from-[#1e1e24] to-[#0a0a0c] flex items-center justify-center p-0 md:p-6 overflow-hidden select-none">
      {/* Smartphone Device Frame (only active on md screens and above) */}
      <div className="relative w-full h-screen md:w-[412px] md:h-[846px] bg-[#0C0C0E] md:rounded-[48px] md:border-[10px] md:border-[#1E1E24] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Camera Notch (Desktop frame only) */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#101010] rounded-full mr-12" />
          <div className="w-1.5 h-1.5 bg-[#080808] rounded-full" />
        </div>

        {/* Mobile Status Bar */}
        <div className="h-10 bg-black/40 backdrop-blur-md px-6 pt-2 flex justify-between items-center text-xs font-semibold text-white select-none z-50 absolute top-0 left-0 right-0">
          <div>{time}</div>
          <div className="flex items-center gap-1.5">
            <Signal size={12} className="stroke-[2.5]" />
            <Wifi size={12} className="stroke-[2.5]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px]">98%</span>
              <Battery size={14} className="stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Main Application Container */}
        <div className="flex-1 w-full h-full relative pt-10 pb-4 md:pb-6 overflow-hidden flex flex-col bg-[#0C0C0E]">
          {children}
        </div>

        {/* Home Indicator (Desktop frame only) */}
        <div className="hidden md:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};

export default MobileFrame;
