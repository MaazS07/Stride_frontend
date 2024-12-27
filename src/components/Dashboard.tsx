import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  ShoppingCart, Truck, Users, BarChart2, TrendingUp, Package,
  Clock, CheckCircle, AlertCircle, AlertTriangle, Activity,
  Calendar, TrendingDown, PieChart as PieChartIcon, MapPin
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { partnerService } from '../services/partnerService';
import { assignmentService } from '../services/assignmentService';

// Types
interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  assignedOrders: number;
  totalPartners: number;
  assignmentSuccessRate: number;
  orderTrends: Array<{
    month: string;
    orders: number;
    success: number;
  }>;
  partnerActivity: Array<{
    time: string;
    active: number;
  }>;
  locationPerformance: Array<{
    location: string;
    ordersCompleted: number;
    partners: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    assignedOrders: 0,
    totalPartners: 0,
    assignmentSuccessRate: 0,
    orderTrends: [],
    partnerActivity: [],
    locationPerformance: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processOrderTrends = (orders: any[]) => {
    const monthlyData: { [key: string]: { orders: number; success: number } } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    months.forEach(month => {
      monthlyData[month] = { orders: 0, success: 0 };
    });

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      if (monthlyData[month]) {
        monthlyData[month].orders++;
        if (order.status === 'completed') {
          monthlyData[month].success++;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      orders: data.orders,
      success: data.success,
      successRate: data.orders > 0 ? (data.success / data.orders * 100).toFixed(1) : 0,
      partnerUtilization: ((data.success + data.orders * 0.3) / stats.totalPartners * 100).toFixed(1)
    }));
  };

  const processLocationStats = (orders: any[], partners: any[]) => {
    const locationData: { [key: string]: { orders: number; partners: number } } = {};

    orders.forEach(order => {
      const location = order.area || 'Unknown';
      if (!locationData[location]) {
        locationData[location] = { orders: 0, partners: 0 };
      }
      if (order.status === 'delivered') {
        locationData[location].orders++;
      }
    });

    partners.forEach(partner => {
      const location = partner.area || 'Unknown';
      if (!locationData[location]) {
        locationData[location] = { orders: 0, partners: 0 };
      }
      locationData[location].partners++;
    });

    return Object.entries(locationData).map(([location, data]) => ({
      location,
      ordersCompleted: data.orders,
      partners: data.partners
    }));
  };

  const calculatePartnerActivity = (partners: any[]) => {
    return [
      { time: '00:00', active: Math.round(partners.length * 0.3) },
      { time: '04:00', active: Math.round(partners.length * 0.2) },
      { time: '08:00', active: Math.round(partners.length * 0.8) },
      { time: '12:00', active: Math.round(partners.length * 0.9) },
      { time: '16:00', active: Math.round(partners.length * 0.7) },
      { time: '20:00', active: Math.round(partners.length * 0.5) }
    ];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [orders, partners, assignmentMetrics] = await Promise.all([
          orderService.getOrders(),
          partnerService.getPartners(),
          assignmentService.getAssignmentMetrics()
        ]);

        const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
        const assignedOrders = orders.filter((order: any) => order.status === 'assigned').length;

        setStats({
          totalOrders: orders.length,
          pendingOrders,
          assignedOrders,
          totalPartners: partners.length,
          assignmentSuccessRate: assignmentMetrics.successRate,
          orderTrends: processOrderTrends(orders),
          partnerActivity: calculatePartnerActivity(partners),
          locationPerformance: processLocationStats(orders, partners)
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
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

  const ChartCard = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Icon className="w-5 h-5 mr-2" /> {title}
        </h2>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#FFA726', '#66BB6A', '#42A5F5', '#EC407A'];
  const orderDistributionData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Assigned', value: stats.assignedOrders }
  ];

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
        />
        <StatCard 
          icon={Truck}
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Needs attention"
          color="text-yellow-600"
        />
        <StatCard 
          icon={Users}
          title="Total Partners"
          value={stats.totalPartners}
          trend={5}
          color="text-green-600"
        />
        <StatCard 
          icon={CheckCircle}
          title="Assignment Rate"
          value={stats.assignmentSuccessRate}
          subtitle="Last 30 days"
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Distribution" icon={PieChartIcon}>
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

        <ChartCard title="Location Performance" icon={MapPin}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.locationPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="ordersCompleted" fill="#FFA726" name="Completed Orders" />
                <Bar yAxisId="right" dataKey="partners" fill="#42A5F5" name="Partners" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;