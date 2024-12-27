import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Trash2, 
  ShoppingCart, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  PackagePlus 
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { OrderItem } from '../../types/order';
import toast, { Toaster } from 'react-hot-toast';

const CreateOrder: React.FC = () => {
  // All state declarations remain the same
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [area, setArea] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, price: 0 },
  ]);

  // All handlers remain the same
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
    toast.success('New item added to order');
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, index) => index !== indexToRemove));
      toast.success('Item removed from order');
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
  };

  const resetForm = () => {
    setCustomer({ name: '', phone: '', address: '' });
    setArea('');
    setScheduledFor('');
    setItems([{ name: '', quantity: 1, price: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Creating your order...');
    
    try {
      const orderData = {
        customer,
        area,
        items,
        scheduledFor,
      };
      const newOrder = await orderService.createOrder(orderData);
      
      toast.dismiss(loadingToast);
      toast.success('Order created successfully! 🎉', {
        duration: 5000,
        icon: '🛍️',
      });
      
      console.log('Order created:', newOrder);
      resetForm();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create order. Please try again.', {
        duration: 5000,
        icon: '❌',
      });
      console.error('Order creation failed', error);
    }
  };

  return (
    <>
      {/* Add Toaster component at the top level of your component */}
      <Toaster
        position="top-right"
        toastOptions={{
          // Custom default options
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-2xl border-2 border-gray-100"
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ShoppingCart className="mr-3 text-blue-600" />
          Create New Order
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <label className="block mb-2 text-gray-700 flex items-center">
                <User className="mr-2 text-blue-500" /> Customer Name
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                required
                placeholder="Enter customer name"
              />
            </div>

            <div className="relative">
              <label className="block mb-2 text-gray-700 flex items-center">
                <Phone className="mr-2 text-green-500" /> Phone
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                required
                placeholder="Customer phone number"
              />
            </div>
          </motion.div>

          {/* Address and Area */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <label className="block mb-2 text-gray-700 flex items-center">
                <MapPin className="mr-2 text-red-500" /> Address
              </label>
              <textarea
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 h-24"
                required
                placeholder="Full delivery address"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 flex items-center">
                <MapPin className="mr-2 text-purple-500" /> Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                required
                placeholder="Delivery area"
              />
            </div>
          </motion.div>

          {/* Scheduled Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-gray-700 flex items-center">
              <Calendar className="mr-2 text-orange-500" /> Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              required
            />
          </motion.div>

          {/* Order Items Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <PackagePlus className="mr-2 text-teal-500" /> Order Items
              </h3>
              <motion.button
                type="button"
                onClick={handleAddItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                <PlusCircle className="mr-2" /> Add Item
              </motion.button>
            </div>

            {items.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex space-x-2 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="w-1/2 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity || 1}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-1/4 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price || 0}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-1/4 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="0"
                  step="0.01"
                  required
                />
                {items.length > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center"
                  >
                    <Trash2 />
                  </motion.button>
                )}
              </motion.div>
            ))}

            <div className="bg-gray-100 p-4 rounded-lg mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Order Value:</span>
              <span className="text-2xl font-bold text-green-600">
                ${calculateTotalPrice()}
              </span>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-lg hover:from-blue-600 hover:to-teal-600 transition duration-300 flex items-center justify-center text-lg font-semibold"
          >
            <ShoppingCart className="mr-3" /> Create Order
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default CreateOrder;