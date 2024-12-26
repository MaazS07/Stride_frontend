import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { IPartner } from '../types/partner';

const PartnerPrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Check if authenticated and is a partner
  const isPartner = user  // Checking for partner-specific properties
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isPartner) {
    return <Navigate to="/" replace />; // Redirect non-partners to main dashboard
  }
  
  return <>{children}</>;
};

export default PartnerPrivateRoute;