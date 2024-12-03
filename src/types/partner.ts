// types/partner.ts
export interface IPartnerBase {
  name: string;
  email: string;
  password: string;
  phone: string;
  areas: string[];
  shift: {
    start: string;
    end: string;
  };
  status?: 'active' | 'inactive';
  currentLoad?: number;
  metrics?: {
    rating?: number;
    completedOrders?: number;
    cancelledOrders?: number;
  };
}

export interface IPartner extends IPartnerBase {
  _id: string;
  status: 'active' | 'inactive';
  currentLoad: number;
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPartnerMetrics {
  totalActive: number;
  avgRating: number;
  topAreas: string[];
}