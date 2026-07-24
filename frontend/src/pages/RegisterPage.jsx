import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/boards" replace />;
  return <RegisterForm />;
}
