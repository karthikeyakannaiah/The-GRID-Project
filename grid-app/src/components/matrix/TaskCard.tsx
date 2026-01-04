import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { GripVertical, X, Check, Edit2, Calendar, Tag } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { EditTaskModal } from './EditTaskModal';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { toggleTask, deleteTask } = useTaskStore();
  const [showEdit, setShowEdit] = useState(false);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-black bg-gray-200 h-[100px]"
      />
    );
  }

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group relative bg-white border-2 border-black p-3 mb-3 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_#000000] transition-all",
          task.status === 'done' && "opacity-60 grayscale bg-gray-50 bg-stripe-pattern"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-black"
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-bold uppercase text-sm leading-tight break-words",
              task.status === 'done' && "line-through"
            )}>
              {task.title}
            </h4>
            
            {/* Metadata Row */}
            <div className="flex flex-wrap gap-2 mt-2">
               {/* Due Date */}
               {task.dueDate && (
                 <div className={cn(
                   "flex items-center gap-1 text-[10px] font-mono border border-black px-1",
                   isOverdue ? "bg-red-500 text-white border-red-500" : "bg-gray-100 text-gray-600"
                 )}>
                   <Calendar className="w-3 h-3" />
                   {format(new Date(task.dueDate), 'MMM dd')}
                 </div>
               )}

               {/* Tags */}
               {task.tags?.map(tag => (
                 <div key={tag} className="flex items-center gap-1 text-[10px] font-mono bg-gray-100 text-gray-500 border border-gray-300 px-1">
                   <Tag className="w-3 h-3" />
                   {tag}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2">
            <button 
              onClick={() => setShowEdit(true)}
              className="p-1 hover:bg-yellow-100 border border-transparent hover:border-black transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button 
              onClick={() => toggleTask(task.id)}
              className="p-1 hover:bg-green-100 border border-transparent hover:border-black transition-colors"
              title={task.status === 'done' ? "Undo" : "Complete"}
            >
              <Check className={cn("w-3 h-3", task.status === 'done' && "text-green-600")} />
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-1 hover:bg-red-100 border border-transparent hover:border-black transition-colors"
              title="Delete"
            >
              <X className="w-3 h-3" />
            </button>
        </div>
      </div>

      {showEdit && <EditTaskModal taskId={task.id} onClose={() => setShowEdit(false)} />}
    </>
  );
}
