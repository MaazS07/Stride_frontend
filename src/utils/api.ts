// src/utils/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://stride-backend5.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to add the auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or however you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




