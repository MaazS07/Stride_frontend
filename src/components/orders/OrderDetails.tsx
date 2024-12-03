import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/order';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Note: You'll need to add this method to your orderService
      const orderDetails = await orderService.getOrderById(orderId);
      setOrder(orderDetails);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch order details', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (order) {
      try {
        const updatedOrder = await orderService.updateOrderStatus(order._id, newStatus);
        setOrder(updatedOrder);
      } catch (error) {
        console.error('Failed to update order status', error);
        setError('Failed to update order status');
      }
    }
  };

  const handleAssignOrder = async () => {
    if (order) {
      try {
        const assignedOrder = await orderService.assignOrder(order._id);
        setOrder(assignedOrder);
      } catch (error) {
        console.error('Failed to assign order', error);
        setError('Failed to assign order');
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!order) return <div className="text-center p-4">No order found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
          <div>
            <span className="font-semibold">Status: </span>
            <span className={`
              px-3 py-1 rounded text-sm 
              ${order.status === 'pending' && 'bg-yellow-200 text-yellow-800'}
              ${order.status === 'assigned' && 'bg-blue-200 text-blue-800'}
              ${order.status === 'picked' && 'bg-orange-200 text-orange-800'}
              ${order.status === 'delivered' && 'bg-green-200 text-green-800'}
            `}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Customer Details</h3>
            <p>Name: {order.customer.name}</p>
            <p>Phone: {order.customer.phone}</p>
            <p>Address: {order.customer.address}</p>
          </div>
          <div>
            <h3 className="font-semibold">Order Information</h3>
            <p>Area: {order.area}</p>
            <p>Scheduled For: {new Date(order.scheduledFor).toLocaleString()}</p>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">${item.price.toFixed(2)}</td>
                  <td className="border p-2">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <button 
              onClick={handleAssignOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Assign Order
            </button>
          )}

          {['pending', 'assigned', 'picked'].includes(order.status) && (
            <>
              {order.status === 'pending' && (
                <button 
                  onClick={() => handleStatusUpdate('assigned')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Mark as Assigned
                </button>
              )}

              {order.status === 'assigned' && (
                <button 
                  onClick={() => handleStatusUpdate('picked')}
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Mark as Picked
                </button>
              )}

              {order.status === 'picked' && (
                <button 
                  onClick={() => handleStatusUpdate('delivered')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Mark as Delivered
                </button>
              )}
            </>
          )}
        </div>

        {order.assignedTo && (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <h3 className="font-semibold">Assigned Delivery Partner</h3>
            <p>Name: {order.assignedTo.name}</p>
            <p>Email: {order.assignedTo.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;