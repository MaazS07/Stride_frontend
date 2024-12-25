export interface Assignment {
  _id: string;
  orderId: string | { [key: string]: any }; // Allow for complex object
  partnerId?: string | { [key: string]: any } | null;
  status: string;
  reason?: string;
  name:string
}

export interface AssignmentMetrics {
  totalAssigned: number;
  successRate: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
}