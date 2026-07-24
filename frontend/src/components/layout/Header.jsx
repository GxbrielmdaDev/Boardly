import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import boardlyLogo from '../../assets/boardly.png';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/boards" className="flex items-center gap-3">
        <img src={boardlyLogo} alt="Boardly" className="h-16 w-auto" />
        <span className="text-2xl font-bold text-white tracking-tight">Boardly</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-700/50 rounded-full pl-3 pr-4 py-1.5 border border-slate-600/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="text-slate-200 text-sm font-medium">{user?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-full hover:bg-slate-700/50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
