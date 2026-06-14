import React, { createContext, useContext, useState } from 'react';
import type { UserProfile, Location } from '../types';
import { INITIAL_USER } from '../mock-data';


export type AuthStatus = 'splash' | 'onboarding' | 'login' | 'otp' | 'profile-setup' | 'authenticated';

interface AuthContextType {
  isAuthenticated: boolean;
  authStatus: AuthStatus;
  user: UserProfile | null;
  phoneNumber: string;
  setAuthStatus: (status: AuthStatus) => void;
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  completeProfile: (name: string, email: string, gender: 'male' | 'female' | 'other') => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  saveAddress: (type: 'home' | 'work' | 'other', location: Location, label?: string) => void;
  deleteAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStatus, setAuthStatusState] = useState<AuthStatus>(() => {
    const saved = localStorage.getItem('rapido_auth_status');
    return (saved as AuthStatus) || 'splash';
  });
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rapido_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    return localStorage.getItem('rapido_temp_phone') || '';
  });

  const setAuthStatus = (status: AuthStatus) => {
    setAuthStatusState(status);
    localStorage.setItem('rapido_auth_status', status);
  };

  const requestOtp = async (phone: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPhoneNumber(phone);
    localStorage.setItem('rapido_temp_phone', phone);
    setAuthStatus('otp');
    return true;
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulate correct OTP (any 6 digit number works, or specifically 123456)
    if (code === '123456' || code.length === 6) {
      if (user) {
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('profile-setup');
      }
      return true;
    }
    return false;
  };

  const completeProfile = (name: string, email: string, gender: 'male' | 'female' | 'other') => {
    const newUser: UserProfile = {
      ...INITIAL_USER,
      name,
      email,
      gender,
      phone: phoneNumber
    };
    setUser(newUser);
    localStorage.setItem('rapido_user', JSON.stringify(newUser));
    setAuthStatus('authenticated');
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('rapido_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setPhoneNumber('');
    setAuthStatusState('login');
    localStorage.removeItem('rapido_user');
    localStorage.removeItem('rapido_auth_status');
    localStorage.removeItem('rapido_temp_phone');
  };

  const saveAddress = (type: 'home' | 'work' | 'other', location: Location, label?: string) => {
    if (!user) return;
    const updatedAddresses = { ...user.savedAddresses };

    if (type === 'home') {
      updatedAddresses.home = location;
    } else if (type === 'work') {
      updatedAddresses.work = location;
    } else if (type === 'other' && label) {
      // Avoid duplicate labels or IDs
      const cleanLabel = label.trim();
      const existingIdx = updatedAddresses.others.findIndex(a => a.label.toLowerCase() === cleanLabel.toLowerCase());
      if (existingIdx > -1) {
        updatedAddresses.others[existingIdx].location = location;
      } else {
        updatedAddresses.others.push({
          id: `addr_${Date.now()}`,
          label: cleanLabel,
          location
        });
      }
    }

    updateProfile({ savedAddresses: updatedAddresses });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = {
      ...user.savedAddresses,
      others: user.savedAddresses.others.filter(a => a.id !== id)
    };
    updateProfile({ savedAddresses: updatedAddresses });
  };

  const isAuthenticated = authStatus === 'authenticated' && user !== null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authStatus,
        user,
        phoneNumber,
        setAuthStatus,
        requestOtp,
        verifyOtp,
        completeProfile,
        updateProfile,
        logout,
        saveAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
