import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Quadrant } from '../../types';
import { cn } from '../../lib/utils';
import { TaskCard } from './TaskCard';

interface QuadrantContainerProps {
  id: Quadrant;
  title: string;
  tasks: Task[];
  className?: string;
  headerClassName?: string;
}

export function QuadrantContainer({ 
  id, 
  title, 
  tasks, 
  className,
  headerClassName 
}: QuadrantContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full border-2 border-black bg-canvas transition-colors",
        isOver && "bg-gray-100 ring-2 ring-black/10 inset-0", // Highlight when dragging over
        className
      )}
    >
      <header className={cn(
        "p-4 border-b-2 border-black font-bold uppercase tracking-wider flex justify-between items-center bg-white",
        headerClassName
      )}>
        {title}
        <span className="text-xs bg-black text-white px-2 py-1 rounded-none">
          {tasks.length}
        </span>
      </header>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[150px]">
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium italic border-2 border-dashed border-gray-200">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
