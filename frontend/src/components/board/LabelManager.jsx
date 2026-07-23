import { useState, useEffect } from 'react';
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

export default function LabelManager({ boardId, onClose }) {
  const [labels, setLabels] = useState([]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  useEffect(() => {
    loadLabels();
  }, [boardId]);

  const loadLabels = async () => {
    const data = await labelService.getLabels(boardId);
    setLabels(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await labelService.createLabel(boardId, { name: newName.trim(), color: newColor });
    setNewName('');
    loadLabels();
  };

  const handleUpdate = async (id) => {
    await labelService.updateLabel(id, { name: editName.trim(), color: editColor });
    setEditingId(null);
    loadLabels();
  };

  const handleDelete = async (id) => {
    await labelService.deleteLabel(id);
    loadLabels();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-16 z-50" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Gerenciar Etiquetas</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleAdd} className="mb-6 p-3 bg-slate-700/50 rounded">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Nova etiqueta</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome da etiqueta"
              className="flex-1 p-2 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {LABEL_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setNewColor(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition ${newColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </form>

        <div className="space-y-2">
          {labels.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">Nenhuma etiqueta criada ainda</p>
          )}
          {labels.map((label) => (
            <div key={label.id} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded group">
              <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              {editingId === label.id ? (
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-1 rounded bg-slate-600 text-white text-sm border border-blue-500 outline-none"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    {LABEL_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setEditColor(c.value)}
                        className={`w-5 h-5 rounded-full border ${editColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                  <button onClick={() => handleUpdate(label.id)} className="text-green-400 hover:text-green-300 text-xs">ok</button>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-white text-sm">{label.name}</span>
                  <button
                    onClick={() => { setEditingId(label.id); setEditName(label.name); setEditColor(label.color); }}
                    className="text-slate-500 hover:text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    editar
                  </button>
                  <button
                    onClick={() => handleDelete(label.id)}
                    className="text-slate-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    excluir
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
