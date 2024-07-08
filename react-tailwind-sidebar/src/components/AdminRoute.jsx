import React from "react";
// Outlet is used to identify the log-in situation
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If userInfo exists, all private routes will be open using Outlet, if not, will be redirect to login page and replace the past history
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
