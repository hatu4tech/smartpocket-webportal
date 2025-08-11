import React, { useState, useEffect, createContext } from 'react';
import { apiService } from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token');
  };

  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await apiService.request('/auth/profile');
      console.log('Profile response:', response);
      
      // Handle different possible response structures
      let userData = null;
      if (response.success && response.data) {
        userData = response.data;
      } else if (response.user) {
        userData = response.user;
      } else if (response.id || response.email) {
        // Direct user object
        userData = response;
      }

      if (userData && userData.id) {
        setUser(userData);
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.warn('Invalid profile response structure:', response);
        // Fallback to stored user data if API fails but token exists
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      
      // Check if we have stored user data as fallback
      const storedUser = getUserFromStorage();
      if (storedUser) {
        console.log('Using stored user data as fallback');
        setUser(storedUser);
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getUserFromStorage();
      
      console.log('Initializing auth - Token:', !!token, 'Stored user:', !!storedUser);
      
      if (token) {
        if (storedUser) {
          // Set user immediately from storage, then verify with API
          setUser(storedUser);
          setLoading(false);
          
          // Optionally fetch fresh profile in background
          try {
            await fetchProfile();
          } catch (error) {
            console.warn('Background profile fetch failed:', error);
          }
        } else {
          // No stored user, must fetch from API
          await fetchProfile();
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

 const login = async (credentials) => {
  try {
    const response = await apiService.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('Login response:', response);

    // Check if the response indicates success
    if (response.success && response.data) {
      const { access_token, refresh_token, user } = response.data;
      
      if (access_token && user) {
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token || '');
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return response;
      }
    }

    // If we get here, the response structure wasn't what we expected
    throw new Error('Login failed - invalid response structure');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

  const logout = async () => {
    try {
      await apiService.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  // Always render children, let App component handle loading state
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};