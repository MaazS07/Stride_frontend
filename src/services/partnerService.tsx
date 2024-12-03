import { api } from '../utils/api';
import { IPartner, IPartnerBase, IPartnerMetrics } from "../types/partner";

export const partnerService = {
  // Create a new partner
  createPartner: async (partnerData: IPartnerBase) => {
    // Ensure all optional fields have default values
    const completePartnerData = {
      ...partnerData,
      status: partnerData.status || 'active',
      currentLoad: partnerData.currentLoad ?? 0,
      metrics: {
        rating: partnerData.metrics?.rating ?? 5.0,
        completedOrders: partnerData.metrics?.completedOrders ?? 0,
        cancelledOrders: partnerData.metrics?.cancelledOrders ?? 0
      }
    };

    try {
      const response = await api.post('/partners', completePartnerData);
      return response.data as IPartner;
    } catch (error) {
      console.error('Create partner error:', error.response?.data);
      throw error;
    }
  },

  // Get all partners
  getPartners: async () => {
    const response = await api.get('/partners');
    return response.data as IPartner[];
  },

  // Update a partner
  updatePartner: async (partnerId: string, updateData: Partial<IPartner>) => {
    const response = await api.put(`/partners/${partnerId}`, updateData);
    return response.data as IPartner;
  },

  // Delete a partner
  deletePartner: async (partnerId: string) => {
    const response = await api.delete(`/partners/${partnerId}`);
    return response.data;
  },

  // Get partner metrics
  getPartnerMetrics: async () => {
    const response = await api.get('/partners/metrics');
    return response.data as IPartnerMetrics;
  },

  // Get specific partner by ID
  getPartnerById: async (partnerId: string) => {
    const response = await api.get(`/partners/${partnerId}`);
    return response.data as IPartner;
  },

  // Update partner status
  updatePartnerStatus: async (partnerId: string, status: 'active' | 'inactive') => {
    const response = await api.put(`/partners/${partnerId}/status`, { status });
    return response.data as IPartner;
  },

  // Update partner metrics
  updatePartnerMetrics: async (
    partnerId: string, 
    metrics: {
      rating?: number;
      completedOrders?: number;
      cancelledOrders?: number;
    }
  ) => {
    const response = await api.put(`/partners/${partnerId}/metrics`, metrics);
    return response.data as IPartner;
  },

  // Get partners by area
  getPartnersByArea: async (area: string) => {
    const response = await api.get('/partners', {
      params: { area }
    });
    return response.data as IPartner[];
  }
};