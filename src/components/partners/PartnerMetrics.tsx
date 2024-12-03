import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  StarIcon, 
  MapPinIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { IPartnerMetrics } from '../../types/partner';

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay: number;
  children?: React.ReactNode;
}> = ({ title, value, icon, color, gradient, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
  >
    <div className={`absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 transform ${gradient} opacity-10 rounded-full blur-2xl`} />
    
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-xl ${color} bg-opacity-10 p-2`}>
          {icon}
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`text-xs font-medium ${color} bg-opacity-10 rounded-full px-3 py-1`}
        >
          Live Data
        </motion.div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        {children}
      </div>
    </div>
  </motion.div>
);

const PartnerMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<IPartnerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/partners/metrics', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12"
        >
          <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-red-50 p-4 text-center"
      >
        <p className="text-red-600 font-medium">{error}</p>
      </motion.div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Partner Analytics</h2>
          <p className="text-gray-500">Real-time metrics and insights</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-blue-600 cursor-pointer"
        >
          <ArrowTrendingUpIcon className="h-5 w-5" />
          <span className="text-sm font-medium">View Details</span>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Partners"
          value={metrics.totalActive.toLocaleString()}
          icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
          color="text-blue-600"
          gradient="bg-blue-600"
          delay={0}
        />

        <MetricCard
          title="Average Rating"
          value={metrics.avgRating.toFixed(1)}
          icon={<StarIcon className="h-6 w-6 text-yellow-600" />}
          color="text-yellow-600"
          gradient="bg-yellow-600"
          delay={0.1}
        >
          <div className="flex items-center gap-1 text-yellow-600">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <StarIcon
                  className={`h-4 w-4 ${
                    i < Math.floor(metrics.avgRating)
                      ? 'fill-yellow-500'
                      : 'fill-gray-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </MetricCard>

        <MetricCard
          title="Top Areas"
          value={`${metrics.topAreas.length} Regions`}
          icon={<MapPinIcon className="h-6 w-6 text-green-600" />}
          color="text-green-600"
          gradient="bg-green-600"
          delay={0.2}
        >
          <div className="flex flex-wrap gap-2 mt-3">
            <AnimatePresence>
              {metrics.topAreas.map((area, index) => (
                <motion.span
                  key={area}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                >
                  <CheckBadgeIcon className="h-3 w-3" />
                  {area}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

export default PartnerMetrics;