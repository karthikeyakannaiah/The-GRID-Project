import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '../types';
import { isSameDay, subDays } from 'date-fns';

interface HabitState {
  habits: Habit[];
  addHabit: (title: string, intervalMinutes: number) => void;
  logHabit: (id: string) => void;
  removeHabit: (id: string) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [
        // Default habits
        { 
          id: 'h1', 
          title: 'Daily Journal', 
          intervalMinutes: 0, 
          logs: [], 
          streak: 0, 
          createdAt: Date.now() 
        },
        { 
          id: 'h2', 
          title: 'Hydrate', 
          intervalMinutes: 60, // Every hour
          logs: [], 
          streak: 0, 
          createdAt: Date.now() 
        },
      ],
      addHabit: (title, intervalMinutes) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: uuidv4(),
              title,
              intervalMinutes,
              logs: [],
              streak: 0,
              createdAt: Date.now(),
            },
          ],
        })),
      logHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            
            const now = Date.now();
            const newLogs = [...habit.logs, now];
            
            // Recalculate streak (Basic logic: if daily, check consecutive days)
            // For intervals, streak might be total reps or daily consistency.
            // Let's keep it simple: Streak = consecutive days with at least one log.
            let streak = 0;
            // ... (streak calculation could be complex, omitting deep logic for MVP to match "Swiss Grid" simplicity)
            // Actually, let's do a simple streak check for Daily Habits.
            if (habit.intervalMinutes === 0) {
               // Check if logged yesterday? 
               // For now, let's just increment if it's the first log of the day? 
               // Or simpler: Just calculate on render or simple counter.
               // Let's just track log count for version 1 refactor as requested by user?
               // User asked for "streak: number".
               // Let's calc streak by looking back from today.
               let currentStreak = 0;
               const today = new Date();
               // Check today
               if (newLogs.some(l => isSameDay(l, today))) {
                 currentStreak++;
                 // Check yesterday, etc.
                 for (let i = 1; i < 365; i++) {
                   const d = subDays(today, i);
                   if (newLogs.some(l => isSameDay(l, d))) {
                     currentStreak++;
                   } else {
                     break;
                   }
                 }
               }
               streak = currentStreak;
            } else {
               // For interval habits, streak = total reps for now? Or keep 0.
               streak = newLogs.length; 
            }

            return {
              ...habit,
              logs: newLogs,
              streak
            };
          }),
        })),
      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
    }),
    {
      name: 'grid-habit-storage-v2', // Changed name to reset storage due to schema break
      version: 2,
    }
  )
);
