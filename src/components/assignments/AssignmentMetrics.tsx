import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/assignmentService';
import { AssignmentMetrics } from '../../types/assignment';

const AssignmentMetricsComponent: React.FC = () => {
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignmentMetrics();
  }, []);

  const fetchAssignmentMetrics = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAssignmentMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignment metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricsCard = () => {
    if (!metrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Assignments Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Assignments</h3>
          <p className="text-3xl font-bold text-blue-600">
            {metrics.totalAssigned}
          </p>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className={`text-3xl font-bold ${
            metrics.successRate > 80 
              ? 'text-green-600' 
              : metrics.successRate > 50 
                ? 'text-yellow-600' 
                : 'text-red-600'
          }`}>
            {metrics.successRate.toFixed(2)}%
          </p>
        </div>

        {/* Failure Reasons Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Failure Reasons</h3>
          {metrics.failureReasons.length > 0 ? (
            <ul className="space-y-2">
              {metrics.failureReasons.map((reason, index) => (
                <li 
                  key={index} 
                  className="flex justify-between items-center text-sm"
                >
                  <span className="truncate">{reason.reason}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    {reason.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No failure reasons</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assignment Metrics</h2>
        <button 
          onClick={fetchAssignmentMetrics}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Refresh Metrics
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="animate-pulse">Loading metrics...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Metrics Content */}
      {!loading && !error && renderMetricsCard()}
    </div>
  );
};

export default AssignmentMetricsComponent;