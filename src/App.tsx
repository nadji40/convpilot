import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Contact } from './pages/Contact';
import { Pricing } from './pages/Pricing';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Platform } from './pages/Platform';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/dashboard/Overview';
import { Universe } from './pages/dashboard/Universe';
import { Instrument } from './pages/dashboard/Instrument';
import { Aggregations } from './pages/dashboard/Aggregations';
import { Portfolio } from './pages/dashboard/Portfolio';
import { PerformanceAttribution } from './pages/dashboard/PerformanceAttribution';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Public pages - accessible without authentication */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/platform" element={<Platform />} />
      
      {/* Protected dashboard routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/universe" 
        element={
          <ProtectedRoute>
            <Universe />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/instrument/:isin" 
        element={
          <ProtectedRoute>
            <Instrument />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/aggregations" 
        element={
          <ProtectedRoute>
            <Aggregations />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/portfolio" 
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/performance" 
        element={
          <ProtectedRoute>
            <PerformanceAttribution />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </AuthProvider>
    </Router>
  );
}
