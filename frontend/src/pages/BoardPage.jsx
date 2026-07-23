import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import useBoardStore from '../store/boardStore';
import Header from '../components/layout/Header';
import ListColumn from '../components/board/ListColumn';
import CardItem from '../components/board/CardItem';
import CardModal from '../components/board/CardModal';
import { useAuth } from '../hooks/useAuth';

export default function BoardPage() {
  useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBoard, lists, boardLabels, loading, loadBoard, createList, createCard, moveCard } = useBoardStore();
  const [listTitle, setListTitle] = useState('');
  const [activeCard, setActiveCard] = useState(null);
  const [modalCardId, setModalCardId] = useState(null);
  const [newCardTitles, setNewCardTitles] = useState({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    loadBoard(Number(id));
  }, [id, loadBoard]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    await createList(Number(id), { title: listTitle.trim() });
    setListTitle('');
  };

  const handleAddCard = async (listId) => {
    const title = newCardTitles[listId]?.trim();
    if (!title) return;
    await createCard(listId, { title });
    setNewCardTitles((prev) => ({ ...prev, [listId]: '' }));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    for (const list of lists) {
      const card = list.cards.find((c) => `card-${c.id}` === active.id);
      if (card) {
        setActiveCard(card);
        return;
      }
    }
  };

  const handleDragEnd = async (event) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const cardId = Number(active.id.toString().replace('card-', ''));
    const overId = over.id.toString();

    let targetListId, position;

    if (overId.startsWith('list-')) {
      targetListId = Number(overId.replace('list-', ''));
      const targetList = lists.find((l) => l.id === targetListId);
      position = targetList ? (targetList.cards.length > 0 ? targetList.cards[targetList.cards.length - 1].position + 1 : 1) : 1;
    } else {
      const overCard = lists.flatMap((l) => l.cards).find((c) => `card-${c.id}` === overId);
      if (!overCard) return;
      targetListId = overCard.list_id;
      position = overCard.position;
    }

    await moveCard(cardId, { list_id: targetListId, position });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Board não encontrado</p>
          <button onClick={() => navigate('/boards')} className="text-blue-400 hover:underline">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-1 p-4 overflow-x-auto bg-slate-900">
        <div className="flex gap-4 items-start min-h-[calc(100vh-80px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                newCardTitle={newCardTitles[list.id] || ''}
                onNewCardTitleChange={(val) =>
                  setNewCardTitles((prev) => ({ ...prev, [list.id]: val }))
                }
                onAddCard={() => handleAddCard(list.id)}
                onDeleteList={() => useBoardStore.getState().deleteList(list.id)}
                onCardClick={(cardId) => setModalCardId(cardId)}
              />
            ))}

            <DragOverlay>
              {activeCard ? (
                <div className="bg-slate-800 rounded-lg p-3 shadow-xl border border-blue-500/50 w-72 opacity-90">
                  <p className="text-white text-sm font-medium">{activeCard.title}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <form onSubmit={handleAddList} className="min-w-[272px]">
            <input
              type="text"
              placeholder="+ Adicionar lista"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="w-full p-3 rounded bg-slate-800/80 text-white placeholder-slate-400 border border-slate-700/50 focus:border-blue-500 outline-none backdrop-blur-sm"
            />
          </form>
        </div>
      </div>

      {modalCardId && (
        <CardModal
          cardId={modalCardId}
          onClose={() => setModalCardId(null)}
          boardLabels={boardLabels}
        />
      )}
    </div>
  );
}
