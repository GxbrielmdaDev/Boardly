import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/boards" replace />;
  return <LoginForm />;
}
