import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  dismissible = true,
  className = ''
}) => {
  // Lock body scroll when open (only on actual mobile viewports)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={dismissible ? onClose : undefined}
            className="absolute inset-0 bg-black/60 z-40 cursor-pointer"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            drag={dismissible ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 250 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (dismissible && onClose && info.offset.y > 100) {
                onClose();
              }
            }}
            className={`absolute bottom-0 left-0 right-0 max-h-[85%] bg-[#16161B] rounded-t-3xl border-t border-[#24242B] shadow-2xl z-50 flex flex-col pb-safe ${className}`}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-[#3A3A42] rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-5 pb-2 border-b border-[#24242B]/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {dismissible && onClose && (
                  <button 
                    onClick={onClose} 
                    className="w-7 h-7 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default BottomSheet;
