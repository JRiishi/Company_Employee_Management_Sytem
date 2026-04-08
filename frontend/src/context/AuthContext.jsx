import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logoutAPI } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexus_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('nexus_token'));

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('nexus_token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('nexus_refresh_token', data.refresh_token);
        }
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        return data.user;
      }
      throw new Error("Invalid server response");
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('nexus_token')) {
        await logoutAPI();
      }
    } catch(err) {
      console.warn("Logout endpoint error, but forcing local clear.");
    } finally {
      setToken(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.hash = '#/login';
      window.location.reload(); // Force full app reset
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
