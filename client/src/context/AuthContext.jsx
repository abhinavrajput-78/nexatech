import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.data?.success && res.data?.admin) {
        setAdmin(res.data.admin);
      } else {
        setAdmin(null);
      }
    } catch (_) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data?.success && res.data?.admin) {
      setAdmin(res.data.admin);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
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
