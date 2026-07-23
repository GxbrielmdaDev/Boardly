import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import Header from '../components/layout/Header';
import { useAuth } from '../hooks/useAuth';

function generateBoardColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 50%, 40%)`;
}

export default function BoardsPage() {
  useAuth();
  const navigate = useNavigate();
  const { boards, loadBoards, createBoard, deleteBoard } = useBoardStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const board = await createBoard({
      title: title.trim(),
      description: description.trim() || null,
      background_color: generateBoardColor(),
    });
    setTitle('');
    setDescription('');
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
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <form
              onSubmit={handleCreate}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700 shadow-xl"
            >
              <h2 className="text-white text-lg font-bold mb-4">Criar Novo Board</h2>
              <input
                type="text"
                placeholder="Título do board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none mb-3"
                autoFocus
              />
              <textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none mb-4 resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              className="relative group rounded-lg p-5 cursor-pointer min-h-[120px] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border border-white/10 hover:border-white/20"
              style={{ backgroundColor: board.background_color }}
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <h3 className="text-white font-semibold text-lg relative z-10">
                {board.title}
              </h3>
              {board.description && (
                <p className="text-slate-300 text-sm mt-2 relative z-10 line-clamp-2">
                  {board.description}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBoard(board.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-400 transition z-20"
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
