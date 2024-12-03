import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  ShoppingCart, Truck, Users, BarChart2, TrendingUp, Package,
  Clock, CheckCircle, AlertCircle, AlertTriangle, Activity,
  Calendar, TrendingDown, PieChart as PieChartIcon
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { partnerService } from '../services/partnerService';
import { assignmentService } from '../services/assignmentService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    assignedOrders: 0,
    totalPartners: 0,
    assignmentSuccessRate: 0,
    orderTrends: [] as any[],
    partnerActivity: [] as any[]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const orders = await orderService.getOrders();
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
        const assignedOrders = orders.filter((o: any) => o.status === 'assigned').length;
        const partners = await partnerService.getPartners();
        const assignmentMetrics = await assignmentService.getAssignmentMetrics();

        // Mock data for trends - replace with actual data
        const mockOrderTrends = [
          { month: 'Jan', orders: 65, success: 52 },
          { month: 'Feb', orders: 78, success: 60 },
          { month: 'Mar', orders: 90, success: 75 },
          { month: 'Apr', orders: 81, success: 68 },
          { month: 'May', orders: 95, success: 82 },
          { month: 'Jun', orders: 110, success: 98 }
        ];

        const mockPartnerActivity = [
          { time: '00:00', active: 20 },
          { time: '04:00', active: 15 },
          { time: '08:00', active: 45 },
          { time: '12:00', active: 50 },
          { time: '16:00', active: 42 },
          { time: '20:00', active: 30 }
        ];

        setStats({
          totalOrders: orders.length,
          pendingOrders,
          assignedOrders,
          totalPartners: partners.length,
          assignmentSuccessRate: assignmentMetrics.successRate,
          orderTrends: mockOrderTrends,
          partnerActivity: mockPartnerActivity
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const StatCard: React.FC<{
    icon: React.ComponentType;
    title: string;
    value: number;
    subtitle?: string;
    trend?: number;
    color: string;
    bgColor: string;
  }> = ({ icon: Icon, title, value, subtitle, trend, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="ml-1 text-sm font-semibold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold mt-2 text-gray-800">{value.toLocaleString()}</p>
          {subtitle && <p className="ml-2 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const EmptyState: React.FC<{ icon: React.ComponentType; message: string }> = ({ icon: Icon, message }) => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <Icon className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg">{message}</p>
    </div>
  );

  const ChartCard: React.FC<{
    title: string;
    icon: React.ComponentType;
    children: React.ReactNode;
    className?: string;
  }> = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Icon className="w-5 h-5 mr-2" /> {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const orderDistributionData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Assigned', value: stats.assignedOrders }
  ];

  const COLORS = ['#FFA726', '#66BB6A', '#42A5F5', '#EC407A'];

  const MetricCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType;
    description: string;
    trend?: number;
  }> = ({ title, value, icon: Icon, description, trend }) => (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold mt-2">{value}%</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const hasOrderData = stats.totalOrders > 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Operations Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={ShoppingCart}
          title="Total Orders"
          value={stats.totalOrders}
          trend={12}
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard 
          icon={Truck}
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Needs attention"
          color="text-yellow-600"
          bgColor="bg-white"
        />
        <StatCard 
          icon={Users}
          title="Total Partners"
          value={stats.totalPartners}
          trend={5}
          color="text-green-600"
          bgColor="bg-white"
        />
        <StatCard 
          icon={CheckCircle}
          title="Assignment Rate"
          value={stats.assignmentSuccessRate}
          subtitle="Last 30 days"
          color="text-purple-600"
          bgColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Distribution" icon={PieChartIcon}>
          {hasOrderData ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={AlertTriangle} 
              message="No orders to display" 
            />
          )}
        </ChartCard>

        <ChartCard title="Key Metrics" icon={Activity}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Assignment Success"
              value={stats.assignmentSuccessRate}
              icon={CheckCircle}
              description="Orders successfully assigned"
              trend={8}
            />
            <MetricCard
              title="Partner Utilization"
              value={75}
              icon={Users}
              description="Average partner capacity"
              trend={-3}
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Trends" icon={BarChart2}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.orderTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#42A5F5" name="Total Orders" />
                <Bar dataKey="success" fill="#66BB6A" name="Successful Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Partner Activity" icon={Users}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.partnerActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#EC407A" 
                  fill="#EC407A" 
                  fillOpacity={0.3}
                  name="Active Partners"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Performance Overview" icon={Activity}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.orderTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#42A5F5" 
                  name="Total Orders"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#66BB6A" 
                  name="Success Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;