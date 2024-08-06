// src/components/ProtectedRoute.js
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ element }) => {
  useAuth();
  return element;
};

export default ProtectedRoute;
