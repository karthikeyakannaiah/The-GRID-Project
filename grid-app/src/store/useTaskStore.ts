import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Quadrant } from '../types';

interface TaskState {
  tasks: Task[];
  archivedTasks: Task[];
  addTask: (title: string, tags?: string[], dueDate?: string, quadrant?: Quadrant) => void;
  moveTask: (id: string, targetQuadrant: Quadrant) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  runAutoArchive: (hoursDelay: number) => void;
  restoreTask: (id: string) => void;
}


export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      archivedTasks: [],
      addTask: (title, tags = [], dueDate, quadrant = 'inbox') =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: uuidv4(),
              title,
              status: 'todo',
              quadrant,
              createdAt: Date.now(),
              tags,
              dueDate
            },
          ],
        })),
      moveTask: (id, targetQuadrant) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, quadrant: targetQuadrant } : task
          ),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const isDone = task.status === 'done';
            return {
              ...task,
              status: isDone ? 'todo' : 'done',
              completedAt: isDone ? undefined : Date.now()
            };
          }),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          archivedTasks: state.archivedTasks.filter((task) => task.id !== id),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      
      runAutoArchive: (hoursDelay) => {
        if (hoursDelay < 0) return;
        const now = Date.now();
        const delayMs = hoursDelay * 60 * 60 * 1000;
        
        set((state) => {
           const active = [] as Task[];
           const toArchive = [] as Task[];

           state.tasks.forEach(task => {
             if (task.status === 'done' && task.completedAt && (now - task.completedAt > delayMs)) {
               toArchive.push(task);
             } else {
               active.push(task);
             }
           });

           if (toArchive.length === 0) return state;

           return {
             tasks: active,
             archivedTasks: [...state.archivedTasks, ...toArchive]
           };
        });
      },

      restoreTask: (id) => 
        set((state) => {
           const taskToRestore = state.archivedTasks.find(t => t.id === id);
           if (!taskToRestore) return state;

           return {
             archivedTasks: state.archivedTasks.filter(t => t.id !== id),
             tasks: [...state.tasks, { ...taskToRestore, status: 'todo', completedAt: undefined }]
           };
        }),
    }),
    {
      name: 'grid-task-storage',
    }
  )
);
