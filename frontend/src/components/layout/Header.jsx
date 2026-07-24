import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import boardlyLogo from '../../assets/boardly.png';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between shadow-sm dark:shadow-lg">
      <Link to="/boards" className="flex items-center gap-3">
        <img src={boardlyLogo} alt="Boardly" className="h-12 w-auto" />
        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Boardly</span>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition border border-slate-200 dark:border-slate-600"
          title={dark ? 'Modo claro' : 'Modo escuro'}
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 rounded-full pl-3 pr-4 py-1.5 border border-slate-200 dark:border-slate-600/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{user?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
