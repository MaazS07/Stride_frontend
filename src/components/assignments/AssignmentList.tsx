import React, { useState, useEffect } from 'react';
import { Assignment } from '../../types/assignment';
import { assignmentService } from '../../services/assignmentService';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import OrderPartnerAssignment from '../orders/OrderPartnerAssignment';
import AssignmentMetricsComponent from './AssignmentMetrics';

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '' as 'success' | 'failed' | '',
    fromDate: '',
    toDate: '',
    orderId: '',
    partnerId: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, [JSON.stringify(filters)]);

  const handleRunAssignment = async (orderId: string | { [key: string]: any }) => {
    try {
      setLoading(true);
      // Extract string ID if orderId is an object
      const orderIdString = typeof orderId === 'object' ? 
        (orderId._id?.toString() || orderId.id?.toString() || '') : 
        orderId.toString();
        
      const result = await assignmentService.runAssignment(orderIdString);
      
      if (result.success) {
        fetchAssignments();
        toast.success('Partner assigned successfully');
      } else {
        toast.error(result.error || 'No available partners in area');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to run assignment');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const filterParams = {
        ...(filters.status && { status: filters.status }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        ...(filters.orderId && { orderId: filters.orderId }),
        ...(filters.partnerId && { partnerId: filters.partnerId })
      };

      const data = await assignmentService.getAssignments(filterParams);
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error('Full error:', err);
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const safeExtractId = (value: string | { [key: string]: any } | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      return value._id?.toString() || 
             value.id?.toString() || 
             JSON.stringify(value);
    }
    return value.toString();
  };

  const renderAssignmentStatus = (assignment: Assignment) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <div className="space-y-1">
        <span className={`px-2 py-1 rounded text-xs ${statusColors[assignment.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
          {assignment.status === 'success' ? (
            <FaCheckCircle className="inline mr-1" />
          ) : (
            <FaTimesCircle className="inline mr-1" />
          )}
          {assignment.status}
        </span>
        {assignment.status === 'failed' && assignment.reason && (
          <div className="text-xs text-red-600 mt-1">
            Reason: {assignment.reason}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Assignment List</h2>
      
      <AssignmentMetricsComponent/>
      <OrderPartnerAssignment />
      {loading && <div className="flex items-center"><FaSpinner className="animate-spin mr-2" /> Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Actions</th>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Partner ID</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="hover:bg-gray-100">
                  <td className="p-2 border">
                    <button
                      onClick={() => handleRunAssignment(assignment.orderId)}
                      disabled={loading || assignment.status === 'success'}
                      className={`px-3 py-1 rounded ${
                        assignment.status === 'success'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : 'Run'}
                    </button>
                  </td>
                  <td className="p-2 border">{safeExtractId(assignment.orderId)}</td>
                  <td className="p-2 border">{safeExtractId(assignment.partnerId) || 'Not assigned'}</td>
                  <td className="p-2 border">{safeExtractId(assignment.name) || 'Not assigned'}</td>


                  {/* <td className="p-2 border">
                    {assignment.createdAt ? new Date(assignment.).toLocaleString() : 'N/A'}
                  </td> */}
                  <td className="p-2 border">{renderAssignmentStatus(assignment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;