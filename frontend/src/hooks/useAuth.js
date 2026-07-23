import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function useAuth(requireAuth = true) {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !user) {
      navigate('/login');
    }
  }, [user, navigate, requireAuth]);

  return { user, setUser, logout, isAuthenticated: !!user };
}
