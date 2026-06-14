import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OtpPage: React.FC = () => {
  const { phoneNumber, verifyOtp } = useAuth();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showNotification, setShowNotification] = useState(false);
  
  const navigate = useNavigate();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Start countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Simulate receiving SMS after 1.5 seconds
  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 1500);

    return () => clearTimeout(notificationTimer);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, '');
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    setError('');

    // Focus next input
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      setError('');

      // Focus previous input
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    const success = await verifyOtp(otpCode);
    if (success) {
      // AuthContext handles changing status to 'profile-setup' or 'authenticated'
      navigate('/profile-setup');
    } else {
      setError('Incorrect OTP. Try "123456"');
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(new Array(6).fill(''));
    setError('');
    setShowNotification(false);
    setTimeout(() => {
      setShowNotification(true);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0C0C0E] select-none h-full relative">
      {/* Simulated SMS Push Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="absolute top-4 left-4 right-4 bg-[#16161B] border border-[#24242B] rounded-2xl p-4 shadow-2xl flex items-start gap-3 z-50 cursor-pointer"
            onClick={() => {
              setOtp(['1', '2', '3', '4', '5', '6']);
              setShowNotification(false);
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#FFE600] flex items-center justify-center flex-shrink-0">
              <MessageSquare size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#8E8E93]">Messages</span>
                <span className="text-[10px] text-[#545458]">now</span>
              </div>
              <h4 className="text-xs font-semibold text-white mt-0.5">Rapido Verification Code</h4>
              <p className="text-[11px] text-[#8E8E93] mt-0.5">
                Your Rapido OTP is <strong className="text-[#FFE600]">123456</strong>. Valid for 5 mins. Tap to auto-fill.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section */}
      <div className="flex flex-col gap-6 pt-4">
        {/* Back button and title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')} 
            className="w-9 h-9 rounded-full bg-[#16161B] border border-[#24242B] flex items-center justify-center text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-bold text-[#8E8E93]">OTP Verification</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Enter OTP</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#8E8E93]">Sent to +91 {phoneNumber || '98765 XXXXX'}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="text-xs font-bold text-[#FFE600] underline cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>

        {/* OTP Input Fields */}
        <form onSubmit={handleVerify} className="mt-4 flex flex-col gap-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-14 text-center text-xl font-bold bg-[#16161B] border rounded-2xl text-white transition-all focus:outline-none
                  ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-[#24242B] focus:border-[#FFE600] focus:ring-2 focus:ring-amber-500/20'}
                `}
              />
            ))}
          </div>

          {error && <span className="text-xs text-red-500 font-semibold text-center">{error}</span>}
        </form>
      </div>

      {/* Bottom Section */}
      <div className="space-y-5">
        {timer > 0 ? (
          <p className="text-xs text-[#8E8E93] text-center">
            Resend OTP in <span className="text-white font-bold">{timer}s</span>
          </p>
        ) : (
          <div className="text-center">
            <button
              onClick={handleResend}
              className="text-xs font-bold text-[#FFE600] hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        )}

        <Button
          onClick={handleVerify}
          fullWidth
          disabled={otp.join('').length !== 6}
          isLoading={isLoading}
        >
          Verify & Proceed
        </Button>
      </div>
    </div>
  );
};

export default OtpPage;
