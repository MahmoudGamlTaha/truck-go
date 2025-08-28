import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, SubscriptionPlan } from '../types';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  // Mock data for demonstration
  const mockUsers = {
    'admin@company.com': {
      id: 1,
      email: 'admin@company.com',
      first_name: 'John',
      last_name: 'Admin',
      role: UserRole.ADMIN,
      company_id: 1,
      is_active: true
    },
    'assignee@company.com': {
      id: 2,
      email: 'assignee@company.com',
      first_name: 'Jane',
      last_name: 'Manager',
      role: UserRole.ASSIGNEE,
      company_id: 1,
      branch_id: 1,
      is_active: true
    },
    'driver@company.com': {
      id: 3,
      email: 'driver@company.com',
      first_name: 'Mike',
      last_name: 'Driver',
      role: UserRole.DRIVER,
      company_id: 1,
      branch_id: 1,
      truck_id: 1,
      is_active: true
    }
  };

  const mockCompany = {
    id: 1,
    name: 'TruckFlow Logistics',
    address: '123 Business St, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@truckflow.com',
    license: 'TFL-2024-001',
    is_active: true
  };

  const mockSubscription = {
    id: 1,
    company_id: 1,
    plan: SubscriptionPlan.PROFESSIONAL,
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    features: {
      maxTrucks: 25,
      maxDrivers: 50,
      maxBranches: 5,
      realTimeTracking: true,
      advancedReports: true,
      apiAccess: false
    }
  };

  useEffect(() => {
    // Check authentication on app load
    const checkAuth = async () => {
      if (token) {
        try {
          // Set the token in apiService
          apiService.setToken(token);
          
          // Validate the token by getting the current user
          const userData = await authService.getCurrentUser();
          
          if (userData && userData.user) {
            setUser(userData.user);
            setCompany(userData.company || null);
            setSubscription(userData.subscription || null);
          } else {
            // Invalid response, clear authentication
            localStorage.removeItem('auth_token');
            apiService.setToken(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // Token is invalid or expired
          localStorage.removeItem('auth_token');
          apiService.setToken(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      // Use authService to call the login API endpoint
      const response = await authService.login({ email, password });
      
      if (response && response.token) {
        apiService.setToken(response.token); // This now handles localStorage
        setToken(response.token);
        setUser(response.user);
        setCompany(response.company);
        setSubscription(response.subscription || null);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during login. Please try again.' 
      };
    }
  };

  const logout = () => {
    // apiService.setToken(null) will handle removing 'auth_token' from localStorage
    apiService.setToken(null);
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
    setCompany(null);
    setSubscription(null);
  };

  const register = async (registrationData) => {
    try {
      // Use authService to call the register API endpoint
      const response = await authService.register(registrationData);
      
      if (response && response.token) {
        apiService.setToken(response.token); // This now handles localStorage
        setToken(response.token);
        setUser(response.user);
        // Company is not set here because the visitor needs to create it
        setCompany(null);
        setSubscription(null);
        return { success: true, data: response };
      }

      // Backend register does not return a token; attempt auto-login
      if (response && (response.id || response.email)) {
        const { email, password } = registrationData?.user || {};
        if (email && password) {
          const loginRes = await authService.login({ email, password });
          if (loginRes && loginRes.token) {
            apiService.setToken(loginRes.token);
            setToken(loginRes.token);
            setUser(loginRes.user);
            setCompany(null);
            setSubscription(null);
            return { success: true, data: loginRes };
          }
        }
        return {
          success: false,
          error: 'Registration succeeded, but automatic login failed. Please log in with your credentials.'
        };
      }

      return { 
        success: false, 
        error: (response && response.message) || 'Registration failed. Please try again.' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during registration. Please try again.' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    // Mock profile update
    setUser(prev => ({ ...prev, ...profileData }));
    return { success: true };
  };
  const getCurrentUser = async () => {
    return JSON.parse(localStorage.getItem('user'));
  };
  const value = {
    user,
    company,
    subscription,
    loading,
    login,
    logout,
    register,
    updateProfile,
    getCurrentUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isAssignee: user?.role === UserRole.ASSIGNEE,
    isDriver: user?.role === UserRole.DRIVER,
    isVisitor: user?.role === UserRole.VISITOR
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

