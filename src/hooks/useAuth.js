// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('data'));

    if (!token || (token && token.expired)) {
      localStorage.removeItem('data');
      navigate('/');
    }
  }, [navigate]);
};

export default useAuth;
