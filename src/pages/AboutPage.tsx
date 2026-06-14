import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code2, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={() => navigate('/settings')} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">About Project</span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6 text-left">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-3 my-4">
          <div className="w-16 h-16 bg-[#FFE600] rounded-2xl flex items-center justify-center font-extrabold text-3xl text-black shadow-xl shadow-yellow-500/10">
            R
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Rapido Clone</h2>
            <span className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">Version 1.0.0 (Edu)</span>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="bg-[#16161B] border border-amber-500/20 rounded-3xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-500">
            <BookOpen size={16} />
            <h4 className="text-xs font-extrabold uppercase tracking-wide">Educational Demo</h4>
          </div>
          <p className="text-[11px] text-[#8E8E93] leading-relaxed">
            This application is a frontend clone built for educational, portfolio, and demonstration purposes only. It uses mock location routing, simulated driver movement, and local JSON structures. It does not connect to any production backend APIs, make financial transactions, or utilize official Rapido trademarked materials.
          </p>
        </div>

        {/* Tech Stack List */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Development Stack</span>
          <div className="bg-[#16161B] border border-[#24242B] rounded-3xl p-4 space-y-3.5">
            <div className="flex gap-3">
              <Code2 size={16} className="text-[#FFE600] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white leading-none">React 18 & TypeScript</h4>
                <p className="text-[10px] text-[#8E8E93] mt-1 leading-normal">
                  Strictly typed component architectures, custom state hooks, and robust rendering workflows.
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#24242B]/40 pt-3.5">
              <Globe size={16} className="text-[#FFE600] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white leading-none">React Leaflet & OpenStreetMap</h4>
                <p className="text-[10px] text-[#8E8E93] mt-1 leading-normal">
                  High-performance vector mapping with programmatic coordinate interpolation and custom marker rotations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* App Footer */}
        <div className="text-center text-[10px] text-[#545458] mt-4 space-y-1">
          <p>© 2026 Developed by Anbarasan V.</p>
          <p>All assets and details are mock representations.</p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
