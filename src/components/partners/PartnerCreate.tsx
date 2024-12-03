import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaPlus, FaClock, FaMapMarkedAlt, FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner } from 'react-icons/fa';
import { IPartnerBase } from '../../types/partner';
import { partnerService } from '../../services/partnerService';

const PartnerCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IPartnerBase>({
    name: '',
    email: '',
    phone: '',
    password: '',
    areas: [],
    shift: {
      start: '09:00',
      end: '17:00'
    },
    status: 'active',
    currentLoad: 0,
    metrics: {
      rating: 5.0,
      completedOrders: 0,
      cancelledOrders: 0
    }
  });

  const [newArea, setNewArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested fields like shift
    if (name.startsWith('shift.')) {
      const shiftField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shift: {
          ...prev.shift,
          [shiftField]: value
        }
      }));
    } 
    // Handle nested metrics fields
    else if (name.startsWith('metrics.')) {
      const metricsField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [metricsField]: Number(value)
        }
      }));
    } 
    // Handle other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddArea = () => {
    if (newArea && !formData.areas.includes(newArea)) {
      setFormData(prev => ({
        ...prev,
        areas: [...prev.areas, newArea.trim()]
      }));
      setNewArea('');
    }
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter(area => area !== areaToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (formData.areas.length === 0) {
      setError('Please add at least one area');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Use the partnerService to create partner
      await partnerService.createPartner(formData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/partners');
      }, 2000);
    } catch (err) {
      // Improved error handling
      const errorMessage = err.response?.data?.error || 'Failed to create partner';
      setError(errorMessage);
      console.error('Partner creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-200 px-8 py-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create New Partner
          </h1>
          <p className="mt-2 text-blue-100">Add a new partner to your network</p>
        </div>

        {success && (
          <div className="m-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg" role="alert">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-xl mr-3" />
              <p className="text-green-700 font-medium">Partner created successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="m-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg" role="alert">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="mr-2 text-blue-500" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Enter partner name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="partner@example.com"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone className="mr-2 text-blue-500" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaLock className="mr-2 text-blue-500" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaClock className="mr-2 text-blue-500" />
                  Shift Times
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="shift.start"
                      value={formData.shift.start}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      name="shift.end"
                      value={formData.shift.end}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" />
                  Areas
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter area name"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus className="text-lg" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-gray-50 rounded-lg">
                  {formData.areas.map((area) => (
                    <span
                      key={area}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2 font-medium text-sm"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="text-blue-600 hover:text-red-500 transition-colors"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </span>
                  ))}
                  {formData.areas.length === 0 && (
                    <p className="text-gray-400 text-sm">No areas added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/partners')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Creating...
                  </>
                ) : (
                  'Create Partner'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerCreate;