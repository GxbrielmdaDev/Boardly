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
      className="bg-white dark:bg-slate-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-650 transition border border-slate-200 dark:border-slate-600/30 break-words overflow-hidden"
    >
      <p className="text-slate-900 dark:text-white text-sm break-words">{card.title}</p>
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: label.color + '30', color: label.color, border: `1px solid ${label.color}60` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      {card.due_date && (
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          {new Date(card.due_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
