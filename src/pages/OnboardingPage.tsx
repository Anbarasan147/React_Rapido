import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { ChevronRight } from 'lucide-react';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    title: 'Ride Bike Taxis',
    subtitle: 'Fastest Way to Beat Traffic',
    description: 'Zip through traffic jams, arrive on time, and pay pocket-friendly fares for daily solo commutes.',
    emoji: '🏍️',
    color: 'from-amber-400/20 to-yellow-500/10'
  },
  {
    title: 'Book Auto Cabin',
    subtitle: 'Zero Hassle, Fixed Fares',
    description: 'Get doorstep pick-up with professional drivers, completely free from offline bargaining or last-minute cancellations.',
    emoji: '🛺',
    color: 'from-orange-500/20 to-amber-500/10'
  },
  {
    title: 'Instant Delivery',
    subtitle: 'Deliver Packages in a Snap',
    description: 'Send keys, documents, lunchboxes, or gifts across the city with real-time route tracking.',
    emoji: '📦',
    color: 'from-blue-500/20 to-indigo-500/10'
  }
];

export const OnboardingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const { setAuthStatus } = useAuth();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setAuthStatus('login');
    navigate('/login');
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const current = SLIDES[currentSlide];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0C0C0E] select-none h-full">
      {/* Top Header */}
      <div className="flex justify-between items-center h-8">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-[#FFE600] rounded-lg flex items-center justify-center font-extrabold text-[10px] text-black">R</div>
          <span className="text-sm font-bold text-white tracking-tight">rapido</span>
        </div>
        {currentSlide < SLIDES.length - 1 && (
          <button 
            onClick={handleSkip} 
            className="text-xs font-semibold text-[#8E8E93] hover:text-[#FFE600] transition-colors cursor-pointer"
          >
            Skip
          </button>
        )}
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col justify-center my-6 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col items-center text-center px-4"
          >
            {/* Mascot / Icon container */}
            <div className={`w-44 h-44 rounded-full bg-gradient-to-b ${current.color} flex items-center justify-center text-8xl mb-8 shadow-inner border border-white/5`}>
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {current.emoji}
              </motion.span>
            </div>

            <span className="text-xs font-bold text-[#FFE600] tracking-widest uppercase mb-1">
              {current.title}
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
              {current.subtitle}
            </h2>
            <p className="text-sm text-[#8E8E93] leading-relaxed max-w-[280px]">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="flex flex-col gap-6">
        {/* Slide indicator dots */}
        <div className="flex justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#FFE600]' : 'w-1.5 bg-[#3A3A42]'}`}
            />
          ))}
        </div>

        {/* Button */}
        <Button
          onClick={handleNext}
          fullWidth
          variant="primary"
          icon={currentSlide === SLIDES.length - 1 ? undefined : <ChevronRight size={18} className="text-black inline -mt-0.5" />}
        >
          {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
