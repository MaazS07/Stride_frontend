import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Edit2,
  Trash2,
  Loader,
  Filter,
  ChevronDown,
} from "lucide-react";
import { IPartner } from "../../types/partner";
import { partnerService } from "../../services/partnerService";
import PartnerEditModal from "./PartnerEditModel";

const PartnerList = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("");
  const [uniqueAreas, setUniqueAreas] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<IPartner | null>(null);
  useEffect(() => {
    fetchPartners();
  }, [selectedArea]);
  const handleUpdatePartner = (updatedPartner: IPartner) => {
    // Update the partners list with the updated partner
    setPartners((currentPartners) =>
      currentPartners.map((partner) =>
        partner._id === updatedPartner._id ? updatedPartner : partner
      )
    );
  };
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = selectedArea
        ? await partnerService.getPartnersByArea(selectedArea)
        : await partnerService.getPartners();
      setPartners(data);

      const areas = Array.from(
        new Set(data.flatMap((partner) => partner.areas))
      );
      setUniqueAreas(areas);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    partnerId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      await partnerService.updatePartnerStatus(partnerId, newStatus);
      fetchPartners();
    } catch (error) {
      console.error("Error updating partner status:", error);
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await partnerService.deletePartner(partnerId);
        fetchPartners();
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
          >
            Partner Management
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/partners/create")}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Partner
          </motion.button>
        </div>

        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">Filter by Area</span>
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 w-64 bg-white rounded-lg shadow-xl z-10 p-2"
              >
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                    setIsFilterOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">All Areas</option>
                  {uniqueAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader className="h-12 w-12 text-blue-600 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Areas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Metrics
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {partners.map((partner) => (
                      <motion.tr
                        key={partner._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {partner.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {partner.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {partner.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {partner.areas.map((area) => (
                              <span
                                key={area}
                                className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={partner.status}
                            onChange={(e) =>
                              handleStatusChange(
                                partner._id,
                                e.target.value as "active" | "inactive"
                              )
                            }
                            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors duration-200 ${
                              partner.status === "active"
                                ? "text-green-700 bg-green-50 hover:bg-green-100"
                                : "text-red-700 bg-red-50 hover:bg-red-100"
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">
                                Rating:
                              </span>
                              <span className="ml-2 text-yellow-500">
                                {partner.metrics.rating.toFixed(1)} ★
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">
                                Completed:
                              </span>
                              <span className="ml-2 text-green-600">
                                {partner.metrics.completedOrders}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">
                                Cancelled:
                              </span>
                              <span className="ml-2 text-red-600">
                                {partner.metrics.cancelledOrders}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                        {selectedPartner && (
  <PartnerEditModal
    partner={selectedPartner}
    onClose={() => setSelectedPartner(null)}
    onUpdate={handleUpdatePartner}
  />
)}
                          <div className="flex items-center space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedPartner(partner)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <Edit2 className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeletePartner(partner._id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PartnerList;
