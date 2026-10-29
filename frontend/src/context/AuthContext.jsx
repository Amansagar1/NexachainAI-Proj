'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------ Client Local Storage Initialization ------------------------------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('nexachain_user');
      const savedToken = localStorage.getItem('nexachain_token');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  // ------------------------------ Load User Profile from Server ------------------------------
  const loadUser = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem('nexachain_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/auth/me');
      if (response.data?.data?.user) {
        setUser(response.data.data.user);
        localStorage.setItem('nexachain_user', JSON.stringify(response.data.data.user));
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user: userData, token: authToken } = response.data.data;

    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexachain_token', authToken);
      localStorage.setItem('nexachain_user', JSON.stringify(userData));
    }
    return userData;
  };

  const register = async (registerData) => {
    const response = await apiClient.post('/auth/register', registerData);
    const { user: userData, token: authToken } = response.data.data;

    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexachain_token', authToken);
      localStorage.setItem('nexachain_user', JSON.stringify(userData));
    }
    return userData;
  };

  const logout = () => {
    try {
      apiClient.post('/auth/logout').catch(() => {});
    } catch (e) {}
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexachain_token');
      localStorage.removeItem('nexachain_user');
    }
  };

  const updateUserBalance = (newBalance) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, walletBalance: newBalance };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexachain_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        refreshUser: loadUser,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
