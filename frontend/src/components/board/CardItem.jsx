import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function CardItem({ card, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `card-${card.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-slate-650 transition border border-slate-600/30"
    >
      <p className="text-white text-sm">{card.title}</p>
      {card.label && (
        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
          {card.label}
        </span>
      )}
      {card.due_date && (
        <p className="text-slate-400 text-xs mt-1">
          {new Date(card.due_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
