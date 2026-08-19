import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/healthStore';

// Fallback logic for localhost based on platform if env var is missing
export const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Host machine local Wi-Fi IP for Expo Go / physical mobile device access
  return 'http://10.149.181.45:5000/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = useAuthStore.getState().user as any;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic error handler interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' || !error.response) {
      console.warn('API Warning: Unable to reach backend server at', getBaseUrl());
    } else {
      console.warn('API Response Error:', error.response?.status, error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

