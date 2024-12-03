import React, { useState, useEffect } from 'react';
import { Assignment } from '../../types/assignment';
import { assignmentService } from '../../services/assignmentService';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

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

  const safeExtractValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    return typeof value === 'object' ? value._id || value.id || JSON.stringify(value) : String(value);
  };

  const renderAssignmentStatus = (status: string) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100'}`}>
        {status === 'success' ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
        {safeExtractValue(status)}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Assignment List</h2>

      {/* Loading and Error States */}
      {loading && <div className="flex items-center"><FaSpinner className="animate-spin mr-2" /> Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Assignments Table */}
      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Partner ID</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id} className="hover:bg-gray-100">
                <td className="p-2 border">{safeExtractValue(assignment.orderId)}</td>
                <td className="p-2 border">{safeExtractValue(assignment.partnerId)}</td>
                <td className="p-2 border">{assignment.createdAt ? new Date(assignment.createdAt).toLocaleString() : 'N/A'}</td>
                <td className="p-2 border">{renderAssignmentStatus(assignment.status)}</td>
                <td className="p-2 border">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Run</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignmentList;