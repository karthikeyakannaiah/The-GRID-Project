import { HabitTracker } from './HabitTracker';
import { HabitStats } from './HabitStats';


export function HabitsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header className="text-center py-8">
        <h2 className="text-3xl font-extrabold uppercase tracking-tighter">Habit Command Center</h2>
        <p className="text-gray-500 font-medium">Build Consistency. Track Progress.</p>
      </header>

      {/* Tracker Row */}
      <section className="bg-gray-50 p-8 border-2 border-black">
         <h3 className="font-bold uppercase text-sm text-gray-400 mb-4">Daily Actions</h3>
         <HabitTracker />
      </section>

      {/* Analytics Grid */}
      <section>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold uppercase text-sm text-gray-400">Analytics Dashboard</h3>
         </div>
         {/* Inline Stats (Modify HabitStats if needed to remove modal wrapper, or just use it as is for now?) 
             User requested "Bottom Row: The Analytics Grid". 
             Let's use HabitStats but strip the modal container if possible, or just render it inline.
             Looking at HabitStats.tsx, it has a fixed overlay. We should refactor it or wrap it.
             For now, let's just make a new wrapper or modify HabitStats to support 'inline' mode.
             Actually, let's just assume we refactor HabitStats later or just render it as is. 
             Wait, HabitStats is a Modal. Let's create a wrapper or just use the content. 
             Let's blindly render it and see, but likely it needs modification.
             Actually, let's modify HabitStats.tsx in the next step to support 'inline' prop.
             For now, putting a placeholder.
         */}
         <div className="space-y-4">
             <HabitStats />
         </div>
      </section>
    </div>
  );
}
