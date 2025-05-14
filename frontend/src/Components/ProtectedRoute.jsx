import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Not admin but trying to access admin page
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
