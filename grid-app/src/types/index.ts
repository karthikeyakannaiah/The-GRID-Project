export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4' | 'inbox';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'done';
  quadrant: Quadrant;
  createdAt: number;
  completedAt?: number;
  tags?: string[];
  dueDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  intervalMinutes: number; // 0 = Daily, >0 = Interval in minutes
  logs: number[]; // Timestamps in MS
  streak: number;
  createdAt: number;
}

export interface JournalCollection {
  id: string;
  title: string;
  color: string; // css class e.g. "bg-pink-500"
}

export interface JournalEntry {
  id: string;
  collectionId: string;
  title: string;
  content: string;
  date: string; // ISO string
  tags: string[];
}
