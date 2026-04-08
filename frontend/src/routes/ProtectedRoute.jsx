import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Strictly verify if localStorage is cleared globally 
    const handleStorageChange = () => {
      if (!localStorage.getItem('nexus_token')) {
        setIsValid(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const localToken = localStorage.getItem('nexus_token');
  const localUserStr = localStorage.getItem('nexus_user');
  
  // Real-time check of auth presence
  if (!token || !user || !localToken || !localUserStr || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cross-compartment role checks
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const rolePath = user.role === 'admin' ? '/admin/dashboard' : 
                     user.role === 'manager' ? '/manager/dashboard' : 
                     '/employee/dashboard';
    
    return <Navigate to={rolePath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
