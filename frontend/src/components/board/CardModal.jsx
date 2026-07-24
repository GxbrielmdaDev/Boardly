import { useEffect, useState } from 'react';
import useBoardStore from '../../store/boardStore';
import * as commentService from '../../services/commentService';
import * as labelService from '../../services/labelService';

const LABEL_COLORS = [
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Cinza', value: '#6b7280' },
];

export default function CardModal({ cardId, onClose, boardLabels }) {
  const { lists, currentBoard, updateCard, deleteCard, loadLabels } = useBoardStore();
  const allCards = lists.flatMap((l) => l.cards);
  const card = allCards.find((c) => c.id === cardId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3b82f6');
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editLabelName, setEditLabelName] = useState('');

  const boardId = currentBoard?.id;

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setSelectedLabelIds(card.labels?.map((l) => l.id) || []);
      loadComments();
    }
  }, [card]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(cardId);
      setComments(data);
    } catch {
    }
  };

  const toggleLabel = (labelId) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const handleCreateLabel = async (e) => {
    e.preventDefault();
    if (!newLabelName.trim() || !boardId) return;
    await labelService.createLabel(boardId, { name: newLabelName.trim(), color: newLabelColor });
    setNewLabelName('');
    setNewLabelColor('#3b82f6');
    await loadLabels(boardId);
  };

  const handleUpdateLabel = async (labelId) => {
    if (!editLabelName.trim()) return;
    await labelService.updateLabel(labelId, { name: editLabelName.trim() });
    setEditingLabelId(null);
    if (boardId) await loadLabels(boardId);
  };

  const handleDeleteLabel = async (labelId) => {
    await labelService.deleteLabel(labelId);
    setSelectedLabelIds((prev) => prev.filter((id) => id !== labelId));
    if (boardId) await loadLabels(boardId);
  };

  const handleSave = async () => {
    await updateCard(cardId, { title, description: description || null, label_ids: selectedLabelIds });
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
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-start justify-center pt-16 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-500 outline-none flex-1 mr-4"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg">✕</button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1 block">Etiquetas</label>

          <div className="flex flex-wrap gap-1 mb-2">
            {boardLabels
              .filter((l) => selectedLabelIds.includes(l.id))
              .map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium cursor-pointer"
                  style={{ backgroundColor: label.color + '30', color: label.color, border: `1px solid ${label.color}60` }}
                  onClick={() => toggleLabel(label.id)}
                >
                  {label.name}
                  <span className="text-xs opacity-70">✕</span>
                </span>
              ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLabelPicker(!showLabelPicker)}
              className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm border border-slate-300 dark:border-slate-600 hover:border-blue-500 transition"
            >
              {boardLabels.length === 0 ? 'Nenhuma etiqueta disponível' : '+ Adicionar etiqueta'}
            </button>

            {showLabelPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 p-2 shadow-xl z-10 min-w-[240px] max-h-72 overflow-y-auto">
                {boardLabels.map((label) => {
                  const isSelected = selectedLabelIds.includes(label.id);
                  if (editingLabelId === label.id) {
                    return (
                      <div key={label.id} className="flex items-center gap-1 p-1">
                        <input
                          type="text"
                          value={editLabelName}
                          onChange={(e) => setEditLabelName(e.target.value)}
                          className="flex-1 p-1 rounded bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white text-xs border border-blue-500 outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateLabel(label.id)}
                        />
                        <button onClick={() => handleUpdateLabel(label.id)} className="text-green-600 dark:text-green-400 hover:text-green-500 text-xs">ok</button>
                        <button onClick={() => setEditingLabelId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">✕</button>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={label.id}
                      className="flex items-center gap-2 p-1.5 rounded group hover:bg-slate-100 dark:hover:bg-slate-600/50 cursor-pointer"
                      onClick={() => toggleLabel(label.id)}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 shrink-0 ${isSelected ? 'border-blue-500 dark:border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-slate-700 dark:text-white text-sm flex-1">{label.name}</span>
                      {isSelected && <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>}
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingLabelId(label.id); setEditLabelName(label.name); }}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        editar
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLabel(label.id); }}
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        excluir
                      </button>
                    </div>
                  );
                })}

                <div className="border-t border-slate-200 dark:border-slate-600 mt-2 pt-2">
                  <form onSubmit={handleCreateLabel} className="flex gap-1 mb-1">
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      placeholder="Nova etiqueta..."
                      className="flex-1 p-1 rounded bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white text-xs border border-slate-300 dark:border-slate-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                    >
                      +Add
                    </button>
                  </form>
                  <div className="flex gap-1 flex-wrap">
                    {LABEL_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setNewLabelColor(c.value)}
                        className={`w-4 h-4 rounded-full border ${newLabelColor === c.value ? 'border-blue-500 dark:border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1 block">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Adicione uma descrição..."
            className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm border border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none resize-none"
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
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded text-sm transition"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-600 text-slate-700 dark:text-white rounded text-sm transition"
            >
              Excluir
            </button>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Comentários</h4>
          <div className="space-y-3 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-slate-100 dark:bg-slate-700/50 rounded p-3">
                <p className="text-slate-900 dark:text-white text-sm">{c.content}</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
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
              className="flex-1 p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm border border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none"
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
