// src/utils/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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




