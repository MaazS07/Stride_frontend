import { api } from '../utils/api';
import { User } from '../types/user';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  loginPartner: async (email: string, password: string) => {
    const response = await api.post('/auth/partner/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (email: string, password: string, role: string) => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        role 
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
