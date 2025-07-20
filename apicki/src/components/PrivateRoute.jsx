import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ session, children }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
