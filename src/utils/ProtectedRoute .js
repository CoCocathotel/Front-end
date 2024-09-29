import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedPositions, fallbackPath }) => {
  const userData = JSON.parse(localStorage.getItem("user-provider"));
  const positionType = userData?.pos || "guest"; 
  
  return allowedPositions.includes(positionType) ? element : <Navigate to={fallbackPath} />;
};

export default ProtectedRoute;
