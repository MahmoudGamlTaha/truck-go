import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { MainLayout } from './components/Layout/MainLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { SubscriptionManagement } from './pages/Subscription/SubscriptionManagement';
import { CompanySettings } from './pages/Company/CompanySettings';
import { DriverManagement } from './pages/Drivers/DriverManagement';
import { FleetManagement } from './pages/Fleet/FleetManagement';
import { RouteManagement } from './pages/Routes/RouteManagement';
import { CargoManagement } from './pages/Cargo/CargoManagement';
import RealTimeTracking from './pages/Tracking/RealTimeTracking';
import ReportsAnalytics from './pages/Reports/ReportsAnalytics';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/app/dashboard" />;
};

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public auth routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected dashboard routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fleet" element={<FleetManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="routes" element={<RouteManagement />} />
            <Route path="cargo" element={<CargoManagement />} />
            <Route path="tracking" element={<RealTimeTracking />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="my-truck" element={<FleetManagement />} />
            <Route path="profile" element={<Dashboard />} />
            <Route path="subscription" element={<SubscriptionManagement />} />
            <Route path="company" element={<CompanySettings />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  </ApiProvider>
  );
}

export default App;

