import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { JournalCollection, JournalEntry } from '../types';

interface JournalState {
  collections: JournalCollection[];
  entries: JournalEntry[];
  activeCollectionId: string | null;
  activeEntryId: string | null;
  
  createCollection: (title: string, color?: string) => void;
  deleteCollection: (id: string) => void;
  setActiveCollection: (id: string | null) => void;
  
  addEntry: (collectionId: string, title: string, content: string) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setActiveEntry: (id: string | null) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      collections: [
        { id: 'daily', title: 'Daily Log', color: 'bg-black' }
      ],
      entries: [],
      activeCollectionId: 'daily',
      activeEntryId: null,

      createCollection: (title, color = 'bg-gray-500') => set((state) => ({
        collections: [
          ...state.collections, 
          { id: uuidv4(), title, color }
        ]
      })),

      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter(c => c.id !== id),
        entries: state.entries.filter(e => e.collectionId !== id),
        activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId
      })),

      setActiveCollection: (id) => set({ activeCollectionId: id, activeEntryId: null }),

      addEntry: (collectionId, title, content) => set((state) => {
        const newEntry: JournalEntry = {
          id: uuidv4(),
          collectionId,
          title,
          content,
          date: new Date().toISOString(),
          tags: []
        };
        return {
          entries: [newEntry, ...state.entries],
          activeEntryId: newEntry.id
        };
      }),

      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map(e => e.id === id ? { ...e, ...updates } : e)
      })),

      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id),
        activeEntryId: state.activeEntryId === id ? null : state.activeEntryId
      })),

      setActiveEntry: (id) => set({ activeEntryId: id }),
    }),
    {
      name: 'grid-journal-storage',
    }
  )
);
