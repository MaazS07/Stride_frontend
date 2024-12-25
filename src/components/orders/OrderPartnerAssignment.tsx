import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import { Order } from '../../types/order';
import { IPartner } from '../../types/partner';
import { orderService } from '../../services/orderService';
import { partnerService } from '../../services/partnerService';

const OrderPartnerAssignment = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [filteredPartners, setFilteredPartners] = useState<IPartner[]>([]);
  const [error, setError] = useState<string>('');

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      filterAvailablePartners();
    } else {
      setFilteredPartners([]);
    }
  }, [selectedOrder, partners]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [ordersData, partnersData] = await Promise.all([
        orderService.getOrders({ status: 'pending' }),
        partnerService.getPartners()
      ]);
      setOrders(ordersData);
      setPartners(partnersData.filter(partner => partner.status === 'active'));
      setError('');
    } catch (error) {
      setError('Failed to fetch initial data');
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAvailablePartners = () => {
    const order = orders.find(o => o._id === selectedOrder);
    if (order) {
      const availablePartners = partners.filter(partner => 
        partner.status === 'active' && 
        partner.areas.includes(order.area)
      );
      setFilteredPartners(availablePartners);
    }
  };

  const handleAssignPartner = async (partnerId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/orders/${selectedOrder}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ partnerId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign partner');
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchInitialData();
        setSelectedOrder('');
        alert('Partner assigned successfully');
      } else {
        throw new Error(data.error || 'Failed to assign partner');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign partner');
      console.error('Error assigning partner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
          <FiAlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FiPackage className="mr-2" />
              Order Partner Assignment
            </h1>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
            <div className="space-y-4">
              <AnimatePresence>
                {orders.map(order => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOrder === order._id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOrder(order._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                        <p className="text-gray-600">Customer: {order.customer.name}</p>
                        <p className="text-gray-600">Area: {order.area}</p>
                        <p className="text-gray-600">Amount: ${order.totalAmount.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm">
                          Scheduled: {new Date(order.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending orders available
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUserCheck className="mr-2" />
                Available Partners
              </h2>

              <div className="space-y-4">
                {filteredPartners.map(partner => (
                  <div
                    key={partner._id}
                    className="p-4 border rounded-lg hover:border-gray-300 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{partner.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Areas: {partner.areas.join(', ')}</p>
                          <p>Status: {partner.status}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignPartner(partner._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Assigning...' : 'Assign Partner'}
                      </motion.button>
                    </div>
                  </div>
                ))}

                {filteredPartners.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No available partners for this area
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderPartnerAssignment;
