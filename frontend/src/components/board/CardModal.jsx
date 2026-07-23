import { useEffect, useState } from 'react';
import useBoardStore from '../../store/boardStore';
import * as commentService from '../../services/commentService';

export default function CardModal({ cardId, onClose }) {
  const { lists, updateCard, deleteCard } = useBoardStore();
  const allCards = lists.flatMap((l) => l.cards);
  const card = allCards.find((c) => c.id === cardId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setLabel(card.label || '');
      loadComments();
    }
  }, [card]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(cardId);
      setComments(data);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    await updateCard(cardId, { title, description: description || null, label: label || null });
    onClose();
  };

  const handleDelete = async () => {
    await deleteCard(cardId);
    onClose();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await commentService.createComment(cardId, { content: newComment.trim() });
    setNewComment('');
    loadComments();
  };

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-16 z-50" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-white bg-transparent border-b border-transparent focus:border-blue-500 outline-none flex-1 mr-4"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-slate-400 uppercase mb-1 block">Etiqueta</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="ex: Bug, Funcionalidade"
            className="w-full p-2 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-slate-400 uppercase mb-1 block">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Adicione uma descrição..."
            className="w-full p-2 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
          >
            Salvar
          </button>
          {showDelete ? (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
              >
                Confirmar exclusão
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 bg-slate-700 hover:bg-red-600 text-white rounded text-sm transition"
            >
              Excluir
            </button>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Comentários</h4>
          <div className="space-y-3 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-slate-700/50 rounded p-3">
                <p className="text-white text-sm">{c.content}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 p-2 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
