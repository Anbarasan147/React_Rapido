import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { MobileFrame } from './components/MobileFrame';

// Import Pages
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import HomePage from './pages/HomePage';
import SearchLocationPage from './pages/SearchLocationPage';
import RideSelectorPage from './pages/RideSelectorPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import DriverSearchPage from './pages/DriverSearchPage';
import DriverAssignedPage from './pages/DriverAssignedPage';
import RideTrackingPage from './pages/RideTrackingPage';
import TripCompletionPage from './pages/TripCompletionPage';
import HistoryPage from './pages/HistoryPage';
import WalletPage from './pages/WalletPage';
import NotificationsPage from './pages/NotificationsPage';
import ReferralPage from './pages/ReferralPage';
import HelpPage from './pages/HelpPage';
import SettingsPage from './pages/SettingsPage';
import EditProfilePage from './pages/EditProfilePage';
import AboutPage from './pages/AboutPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authStatus } = useAuth();
  
  if (!isAuthenticated) {
    if (authStatus === 'splash') return <Navigate to="/" replace />;
    if (authStatus === 'onboarding') return <Navigate to="/onboarding" replace />;
    if (authStatus === 'login') return <Navigate to="/login" replace />;
    if (authStatus === 'otp') return <Navigate to="/otp" replace />;
    if (authStatus === 'profile-setup') return <Navigate to="/profile-setup" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route wrapper with app frame
const AppContent: React.FC = () => {
  return (
    <MobileFrame>
      <Routes>
        {/* Public / Authentication Routes */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />

        {/* Protected Core Application Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-location"
          element={
            <ProtectedRoute>
              <SearchLocationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride-selector"
          element={
            <ProtectedRoute>
              <RideSelectorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-methods"
          element={
            <ProtectedRoute>
              <PaymentMethodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-search"
          element={
            <ProtectedRoute>
              <DriverSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-assigned"
          element={
            <ProtectedRoute>
              <DriverAssignedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride-tracking"
          element={
            <ProtectedRoute>
              <RideTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-completed"
          element={
            <ProtectedRoute>
              <TripCompletionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <ReferralPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileFrame>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
