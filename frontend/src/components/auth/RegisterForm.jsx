import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { register } from '../../services/authService';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(username, email, password);
      setUser(user);
      navigate('/boards');
    } catch (err) {
      setError(err.response?.data?.detail || 'Falha no cadastro');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg w-full max-w-md space-y-4 border border-slate-200 dark:border-slate-700 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Boardly</h1>
        <h2 className="text-lg text-slate-600 dark:text-slate-300 text-center">Crie sua conta</h2>
        {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none"
          required
        />
        <button type="submit" className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
          Cadastrar
        </button>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          Já tem conta? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
