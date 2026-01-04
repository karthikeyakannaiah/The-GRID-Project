import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskStore } from '../../store/useTaskStore';
import { QuadrantContainer } from './QuadrantContainer';
import { TaskCard } from './TaskCard';
import type { Quadrant } from '../../types';

export function MatrixView() {
  const { tasks, moveTask } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const inboxTasks = tasks.filter(t => t.quadrant === 'inbox');
  const q1Tasks = tasks.filter(t => t.quadrant === 'q1');
  const q2Tasks = tasks.filter(t => t.quadrant === 'q2');
  const q3Tasks = tasks.filter(t => t.quadrant === 'q3');
  const q4Tasks = tasks.filter(t => t.quadrant === 'q4');

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver() {
    // Optional: Could implement real-time sorting logic here for smoother UX
    // But for basic Kanban, standard DND Kit behavior is often enough.
    // We strictly care about the container dropped into.
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) { 
      setActiveId(null);
      return; 
    }

    const activeId = active.id as string;
    // The 'over.id' could be a specific task ID (if dropped on a task) 
    // or a container ID (if dropped on an empty space).
    // We need to figure out which Quadrant the 'over' target belongs to.
    
    // Check if we dropped directly onto a container (id is 'q1', 'q2', etc.)
    const isContainer = ['q1', 'q2', 'q3', 'q4', 'inbox'].includes(over.id as string);
    
    let targetQuadrant: Quadrant | null = null;

    if (isContainer) {
      targetQuadrant = over.id as Quadrant;
    } else {
      // If we dropped over another task, find that task's quadrant
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) {
        targetQuadrant = overTask.quadrant;
      }
    }

    // Move task if we found a valid target quadrant
    if (targetQuadrant) {
       // Only move if changed? Or always move to support reordering (if backend supported it)
       // Our store just updates the quadrant property, so order depends on array order.
       // Reordering within the list would require array manipulation in the store.
       // For now, simpler implementation: Just update quadrant property.
       const currentTask = tasks.find(t => t.id === activeId);
       if (currentTask && currentTask.quadrant !== targetQuadrant) {
         moveTask(activeId, targetQuadrant);
       }
    }

    setActiveId(null);
  }

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Inbox Sidebar - 25% on desktop */}
        <aside className="lg:col-span-1 h-full">
           <QuadrantContainer 
             id="inbox" 
             title="Inbox (Unsorted)" 
             tasks={inboxTasks} 
             className="bg-gray-50/50"
             headerClassName="bg-gray-100"
           />
        </aside>

        {/* Matrix Grid - 75% on desktop */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <QuadrantContainer 
            id="q1" 
            title="Q1: Do First (Urgent & Important)" 
            tasks={q1Tasks} 
            headerClassName="bg-accent text-white border-accent"
          />
          <QuadrantContainer 
            id="q2" 
            title="Q2: Schedule (Important, Not Urgent)" 
            tasks={q2Tasks} 
          />
          <QuadrantContainer 
            id="q3" 
            title="Q3: Delegate (Urgent, Not Important)" 
            tasks={q3Tasks} 
          />
          <QuadrantContainer 
            id="q4" 
            title="Q4: Eliminate (Neither)" 
            tasks={q4Tasks} 
          />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
