import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import Header from '../components/layout/Header';
import { useAuth } from '../hooks/useAuth';

export default function BoardsPage() {
  useAuth();
  const navigate = useNavigate();
  const { boards, loadBoards, createBoard, deleteBoard } = useBoardStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const board = await createBoard({ title: title.trim() });
    setTitle('');
    setShowForm(false);
    navigate(`/boards/${board.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Meus Boards</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            + Novo Board
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Título do board"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-3 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
              autoFocus
            />
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">Criar</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition">Cancelar</button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="relative group rounded-lg p-5 cursor-pointer min-h-[120px] transition hover:brightness-110"
              style={{ backgroundColor: board.background_color }}
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              <h3 className="text-white font-semibold text-lg">{board.title}</h3>
              {board.description && (
                <p className="text-slate-300 text-sm mt-1">{board.description}</p>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-400 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
