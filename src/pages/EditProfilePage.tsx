import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const EditProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>(user?.gender || '');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    updateProfile({
      name,
      email,
      gender: gender as 'male' | 'female' | 'other'
    });

    navigate('/settings');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0C0C0E] select-none h-full text-white">
      {/* Top Section */}
      <div className="flex flex-col gap-6 pt-4">
        {/* Back button and title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/settings')} 
            className="w-9 h-9 rounded-full bg-[#16161B] border border-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-bold text-white">Edit Profile</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-5 text-left">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            icon={<User size={18} />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            icon={<Mail size={18} />}
          />

          {/* Gender Select */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">
              Gender
            </span>
            <div className="flex gap-3">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
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
          </div>

          {error && <span className="text-xs text-red-500 font-semibold text-center mt-2">{error}</span>}
        </form>
      </div>

      {/* Save Button */}
      <div>
        <Button
          onClick={handleSave}
          fullWidth
          disabled={!name.trim() || !gender}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfilePage;
