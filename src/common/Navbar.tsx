import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaShoppingCart, 
  FaTruck, 
  FaUserFriends, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
          >
            <FaHome className="mr-2" /> Dashboard
          </Link>
          <Link 
            to="/orders" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
          >
            <FaShoppingCart className="mr-2" /> Orders
          </Link>
          <Link 
            to="/partners" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
          >
            <FaUserFriends className="mr-2" /> Partners
          </Link>
          <Link 
            to="/assignments" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition"
          >
            <FaTruck className="mr-2" /> Assignments
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user?.email}</span>
          <button 
            onClick={logout} 
            className="flex items-center text-red-600 hover:text-red-800 transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;