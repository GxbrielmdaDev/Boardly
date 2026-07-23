import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/boards/:id" element={<BoardPage />} />
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
}
