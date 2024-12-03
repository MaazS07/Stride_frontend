import { api } from '../utils/api';
import { Order, OrderItem } from '../types/order';

export const orderService = {
  createOrder: async (orderData: {
    customer: { name: string; phone: string; address: string };
    area: string;
    items: OrderItem[];
    scheduledFor: string;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrderById: async (orderId?: string): Promise<Order | null> => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  getOrders: async (filters?: { 
    status?: string; 
    area?: string; 
    date?: string 
  }) => {
    const response = await api.get('/orders', { params: filters });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  assignOrder: async (orderId: string) => {
    const response = await api.post(`/orders/${orderId}/assign`);
    return response.data;
  },
};