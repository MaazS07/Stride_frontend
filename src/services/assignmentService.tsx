import { api } from '../utils/api';
import { Assignment,AssignmentMetrics } from '../types/assignment';

export const assignmentService = {
  // Get assignment metrics
  getAssignmentMetrics: async () => {
    const response = await api.get('/assignments/metrics');
    return response.data as AssignmentMetrics;
  },

  getAssignments: async (filters?: {
    orderId?: string;
    partnerId?: string;
    status?: 'success' | 'failed';
    fromDate?: string;
    toDate?: string;
  }) => {
    try {
      const response = await api.get('/assignments', { params: filters });
      
      const assignments: Assignment[] = response.data.map((item: any) => ({
        _id: item._id || '',
        // Extract meaningful identifier from object
        orderId: typeof item.orderId === 'object' 
          ? (item.orderId._id || item.orderId.id || JSON.stringify(item.orderId)) 
          : (item.orderId || ''),
        partnerId: typeof item.partnerId === 'object'
          ? (item.partnerId._id || item.partnerId.id || JSON.stringify(item.partnerId)) 
          : (item.partnerId || null),
        createdAt: item.createdAt || '',
        status: item.status || '',
        reason: item.reason || ''
      }));

      return assignments;
    } catch (error) {
      console.error('Failed to fetch assignments', error);
      return [];
    }
  },



  runAssignment: async (orderId: string) => {
    const response = await api.post('/assignments/run', { orderId });
    return response.data;
  },

  // Get specific assignment by ID
  getAssignmentById: async (assignmentId: string) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data as Assignment;
  },

  // Update assignment status
  updateAssignmentStatus: async (
    assignmentId: string,
    status: 'success' | 'failed',
    reason?: string
  ) => {
    const response = await api.put(`/assignments/${assignmentId}/status`, {
      status,
      reason
    });
    return response.data as Assignment;
  },

  // Get assignments by partner
  getPartnerAssignments: async (partnerId: string) => {
    const response = await api.get(`/assignments/partner/${partnerId}`);
    return response.data as Assignment[];
  },

  // Get assignments by order
  getOrderAssignments: async (orderId: string) => {
    const response = await api.get(`/assignments/order/${orderId}`);
    return response.data as Assignment[];
  },

  // Batch run assignments for multiple orders
  runBatchAssignments: async (orderIds: string[]) => {
    const response = await api.post('/assignments/run-batch', { orderIds });
    return response.data as Assignment[];
  },

  // Get assignment statistics for a time period
  getAssignmentStats: async (fromDate: string, toDate: string) => {
    const response = await api.get('/assignments/stats', {
      params: {
        fromDate,
        toDate
      }
    });
    return response.data as {
      totalAssignments: number;
      successfulAssignments: number;
      failedAssignments: number;
      averageResponseTime: number;
    };
  }
};