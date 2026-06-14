import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Phone } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { requestOtp } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // numbers only
    if (value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const success = await requestOtp(phone);
      if (success) {
        navigate('/otp');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0C0C0E] select-none h-full">
      {/* Top Section */}
      <div className="flex flex-col gap-6 pt-4">
        {/* Branding header */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-[#FFE600] rounded-lg flex items-center justify-center font-extrabold text-[10px] text-black">R</div>
          <span className="text-sm font-bold text-white tracking-tight">rapido</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Enter mobile number</h2>
          <p className="text-xs text-[#8E8E93]">We will send you a 6-digit OTP to verify your account</p>
        </div>

        {/* Phone Input Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="00000 00000"
            prefixText="+91"
            value={phone}
            onChange={handlePhoneChange}
            error={error}
            icon={<Phone size={18} className="text-[#8E8E93]" />}
            autoFocus
          />
        </form>
      </div>

      {/* Bottom Actions and Disclaimer */}
      <div className="space-y-5">
        <p className="text-[10px] text-[#545458] text-center px-4 leading-normal">
          By proceeding, you agree to Rapido's{' '}
          <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> &{' '}
          <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
        </p>
        
        <Button
          onClick={handleSubmit}
          fullWidth
          disabled={phone.length !== 10}
          isLoading={isLoading}
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
