import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CardItem from './CardItem';

export default function ListColumn({
  list,
  newCardTitle,
  onNewCardTitleChange,
  onAddCard,
  onDeleteList,
  onCardClick,
}) {
  const { setNodeRef } = useDroppable({ id: `list-${list.id}` });

  return (
    <div className="bg-slate-800/80 rounded-lg w-72 shrink-0 backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
        <h3 className="text-white font-semibold text-sm">{list.title}</h3>
        <button
          onClick={onDeleteList}
          className="text-slate-500 hover:text-red-400 text-xs transition"
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} className="p-2 space-y-2 min-h-[60px]">
        <SortableContext items={list.cards.map((c) => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} onClick={() => onCardClick(card.id)} />
          ))}
        </SortableContext>
      </div>

      <div className="p-2 border-t border-slate-700/50">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="+ Adicionar card"
            value={newCardTitle}
            onChange={(e) => onNewCardTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAddCard()}
            className="flex-1 p-2 rounded bg-slate-700/50 text-white text-sm placeholder-slate-400 border border-slate-600/50 focus:border-blue-500 outline-none"
          />
          <button
            onClick={onAddCard}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
