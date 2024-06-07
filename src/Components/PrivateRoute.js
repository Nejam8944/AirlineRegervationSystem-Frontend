// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Components/AuthContext'; // Ensure the correct path to AuthContext

const PrivateRoute = ({ role, children }) => {
  const { auth } = useAuth();

  if (!auth) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (role && auth.role !== role) {
    // Logged in, but not the right role, redirect to login
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
