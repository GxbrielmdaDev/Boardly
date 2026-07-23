import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <Link to="/boards" className="text-xl font-bold text-white">Boardly</Link>
      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
