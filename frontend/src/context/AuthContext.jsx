import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Set global Axios configurations
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true; // Required to pass session cookie between port 5173 and 5000

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session is already active
  const checkAuth = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Log in customer or admin
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      setUser(res.data.user);
      toast.success(res.data.message || 'Login successful!');
      return res.data.user;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Invalid email or password';
      toast.error(errMsg);
      throw error;
    }
  };

  /**
   * Register a new customer
   */
  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, phone });
      toast.success(res.data.message || 'Registration completed successfully!');
      return res.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed, please check inputs';
      toast.error(errMsg);
      throw error;
    }
  };

  /**
   * Terminate active session
   */
  const logout = async () => {
    try {
      const res = await axios.post('/auth/logout');
      setUser(null);
      toast.success(res.data.message || 'Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not complete logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
