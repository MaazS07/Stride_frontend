import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { assignmentService } from '../services/assignmentService';
import { Order } from '../types/order';
import { IPartner } from '../types/partner';
import { FaTruck, FaBox, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DeliveryPartner: React.FC = () => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const partner = user as unknown as IPartner;

  useEffect(() => {
    if (partner?._id) {
      fetchAssignedOrders();
    }
  }, [partner?._id]);

  const fetchAssignedOrders = async () => {
    try {
      // Use assignmentService instead of orderService
      const orders = await assignmentService.getPartnerOrders(partner._id);
      setAssignedOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch assigned orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Use assignmentService for status update
      await assignmentService.updateOrderStatus(orderId, newStatus, partner._id);
      toast.success('Order status updated successfully');
      fetchAssignedOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
        <p className="text-gray-600">Manage your assigned deliveries and update their status</p>
      </div>

      {assignedOrders.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No deliveries assigned</h3>
          <p className="mt-1 text-sm text-gray-500">You currently don't have any deliveries assigned.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">
                  Order #{order.orderNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Customer</h3>
                  <p className="text-sm text-gray-600">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">{order.customer.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                  <p className="text-sm text-gray-600">{order.customer.address}</p>
                  <p className="text-sm text-gray-600">Area: {order.area}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Items</h3>
                  <ul className="text-sm text-gray-600">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  {order.status !== 'delivered' && (
                    <div className="flex space-x-3">
                      {order.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'picked')}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaTruck className="mr-2" />
                          Mark as Picked
                        </button>
                      )}
                      {order.status === 'picked' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FaCheckCircle className="mr-2" />
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPartner;