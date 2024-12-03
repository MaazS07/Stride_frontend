export interface Assignment {
  _id: string;
  orderId: string | { [key: string]: any }; // Allow for complex object
  partnerId?: string | { [key: string]: any } | null;
  createdAt: string;
  status: string;
  reason?: string;
}

export interface AssignmentMetrics {
  totalAssigned: number;
  successRate: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
}