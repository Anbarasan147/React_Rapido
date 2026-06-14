import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authStatus, setAuthStatus } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        // If they left off in onboarding, login, or otp, resume from there
        if (authStatus === 'splash') {
          setAuthStatus('onboarding');
          navigate('/onboarding');
        } else {
          navigate(`/${authStatus}`);
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, authStatus, navigate, setAuthStatus]);

  return (
    <div className="absolute inset-0 bg-[#FFE600] flex flex-col items-center justify-between py-16 z-50 select-none">
      <div /> {/* Spacer */}

      {/* Pulsing Rapido Logo Mockup */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
          className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center shadow-2xl relative"
        >
          {/* Custom logo icon representing speed and wheels */}
          <svg viewBox="0 0 24 24" className="w-14 h-14 fill-[#FFE600]">
            <path d="M21 7.76c0-.52-.36-.97-.86-1.09L8.43 3.7C7.62 3.5 6.8 4.1 6.8 4.93v5.19L3.8 8.9c-.8-.23-1.6.38-1.6 1.21v8.96c0 .52.36.97.86 1.09l11.71 2.97c.81.2 1.63-.4 1.63-1.23V16.8l3-1.22c.8-.32 1.3-.98 1.3-1.81V7.76zm-6 11.31l-6-1.52v-4.18l6 1.52v4.18zm4-5.21l-3 1.22v-3.79l3-1.22v3.79z" />
          </svg>
          {/* Speed line swooshes */}
          <div className="absolute -left-3 top-6 w-5 h-1 bg-black rounded-full" />
          <div className="absolute -left-5 top-10 w-7 h-1 bg-black rounded-full" />
          <div className="absolute -left-2 top-14 w-4 h-1 bg-black rounded-full" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-extrabold text-black tracking-tighter"
        >
          rapido
        </motion.h1>
        <span className="text-xs font-semibold text-black/60 tracking-widest uppercase -mt-2">
          Bike Taxi & Auto
        </span>
      </div>

      {/* Loading bar */}
      <div className="w-36 h-1.5 bg-black/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ left: '-100%', width: '30%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full bg-black rounded-full relative"
        />
      </div>
    </div>
  );
};

export default SplashPage;
