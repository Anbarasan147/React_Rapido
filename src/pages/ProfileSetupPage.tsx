import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Mail } from 'lucide-react';

export const ProfileSetupPage: React.FC = () => {
  const { completeProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; gender?: string }>({});
  
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors: { name?: string; email?: string; gender?: string } = {};
    if (!name.trim()) {
      tempErrors.name = 'Full name is required';
    }
    
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!gender) {
      tempErrors.gender = 'Please select your gender';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      completeProfile(name, email, gender as 'male' | 'female' | 'other');
      navigate('/home');
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
          <h2 className="text-2xl font-black text-white">Create Profile</h2>
          <p className="text-xs text-[#8E8E93]">Help us customize your ride experience</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            icon={<User size={18} />}
          />

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            icon={<Mail size={18} />}
          />

          {/* Gender selection chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">
              Gender
            </span>
            <div className="flex gap-3">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGender(g);
                    setErrors(prev => ({ ...prev, gender: undefined }));
                  }}
                  className={`
                    flex-1 py-3 px-4 border rounded-2xl font-semibold text-sm capitalize transition-all duration-200 cursor-pointer
                    ${gender === g 
                      ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-md shadow-yellow-500/5' 
                      : 'bg-[#16161B] text-white border-[#24242B] hover:border-[#32323D]'}
                  `}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && (
              <span className="text-xs text-red-500 font-medium pl-1">{errors.gender}</span>
            )}
          </div>
        </form>
      </div>

      {/* Bottom Button */}
      <div>
        <Button
          onClick={handleSubmit}
          fullWidth
          disabled={!name.trim() || !gender}
        >
          Register & Log In
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
