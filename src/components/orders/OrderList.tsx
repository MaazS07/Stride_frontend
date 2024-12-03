import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiCalendar, 
  FiMapPin, 
  FiCheckCircle, 
  FiClock, 
  FiTruck, 
  FiPackage 
} from 'react-icons/fi';
import { Order } from '../../types/order';
import { orderService } from '../../services/orderService';
import { Link } from 'react-router-dom';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    area: '',
    date: ''
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await orderService.getOrders(filters);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderOrderStatus = (status: string) => {
    const statusConfigs = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: FiClock 
      },
      assigned: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: FiPackage 
      },
      picked: { 
        color: 'bg-orange-100 text-orange-800', 
        icon: FiTruck 
      },
      delivered: { 
        color: 'bg-green-100 text-green-800', 
        icon: FiCheckCircle 
      }
    };

    const { color, icon: StatusIcon } = statusConfigs[status as keyof typeof statusConfigs];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
        {status}
      </span>
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesArea = !filters.area || order.area.toLowerCase().includes(filters.area.toLowerCase());
      const matchesDate = !filters.date || new Date(order.scheduledFor).toISOString().split('T')[0] === filters.date;
      return matchesStatus && matchesArea && matchesDate;
    });
  }, [orders, filters]);

  return (
    <div className="min-h-screen  bg-gray-50 p-6">
       
     



  
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[80vw] mx-auto bg-white shadow-lg rounded-xl overflow-hidden"
      >
       <div className="p-6 bg-gradient-to-r from-blue-100 to-white text-white flex flex-wrap justify-between items-center gap-4">
  {/* Title Section */}
  <h1 className="text-5xl font-bold text-blue-900 tracking-wide flex-grow">
    Orders
  </h1>

  {/* Filters Button */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
    className="flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-all text-blue-900 shadow-md"
  >
    <FiFilter className="mr-2 text-3xl" />
    Filters
  </motion.button>
  <Link
  to="/orders/create"
  className="px-6 py-3 bg-blue-500 text-white text-xl font-semibold rounded-md shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center justify-center"
>
  Create Order
</Link>

  {/* Create Order Button */}
 
</div>


        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-100 p-4 grid grid-cols-3 gap-4 overflow-hidden"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked">Picked</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="area" 
                    placeholder="Filter by Area"
                    value={filters.area}
                    onChange={handleFilterChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="date" 
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                {['Order Number', 'Customer', 'Area', 'Total Amount', 'Status', 'Scheduled For'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 hover:bg-gray-100/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-lg text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{order.customer.name}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{order.area}</td>
                    <td className="px-6 py-4 text-lg font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">{renderOrderStatus(order.status)}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{new Date(order.scheduledFor).toLocaleString()}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-500"
          >
            No orders found matching your filters.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderList;