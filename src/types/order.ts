import { IPartnerBase } from "./partner";

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    _id: string;
    orderNumber: string;
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    area: string;
    items: OrderItem[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: string;
    totalAmount: number;
    assignedTo?: IPartnerBase;
    createdAt: string;
  }