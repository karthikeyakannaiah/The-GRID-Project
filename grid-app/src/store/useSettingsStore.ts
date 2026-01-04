import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}

interface SettingsState {
  theme: 'light' | 'dark';
  pomodoro: PomodoroSettings;
  autoArchiveDelay: number; // in hours, -1 for never
  
  toggleTheme: () => void;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  updateAutoArchiveDelay: (hours: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      pomodoro: {
        workMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
      },
      autoArchiveDelay: 24,

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      updatePomodoroSettings: (settings) =>
        set((state) => ({
          pomodoro: { ...state.pomodoro, ...settings },
        })),

      updateAutoArchiveDelay: (hours) =>
        set(() => ({ autoArchiveDelay: hours })),
    }),
    {
      name: 'grid-settings',
    }
  )
);
