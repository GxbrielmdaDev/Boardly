import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';
import useThemeStore from './store/themeStore';

function ThemeProvider({ children }) {
  const dark = useThemeStore((s) => s.dark);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
