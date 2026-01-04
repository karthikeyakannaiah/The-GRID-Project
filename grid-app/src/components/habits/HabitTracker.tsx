import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { useHabitStore } from '../../store/useHabitStore';
import { cn } from '../../lib/utils';
import { Plus, X, Clock } from 'lucide-react';

export function HabitTracker() {
  const { habits, logHabit, addHabit, removeHabit } = useHabitStore();
  
  // State for Add Modal
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitInterval, setNewHabitInterval] = useState(0); // 0 = Daily

  // Re-render every minute to update cooldowns
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000); // 1 min tick
    return () => clearInterval(timer);
  }, []);
  const now = Date.now(); // We use Date.now() for calculation, component re-renders on 'tick' update.

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitTitle.trim()) {
      addHabit(newHabitTitle.trim(), newHabitInterval);
      setNewHabitTitle('');
      setNewHabitInterval(0);
      setIsAdding(false);
    }
  };

  const getHabitStatus = (habit: typeof habits[0]) => {
     // Daily Habit Logic
     if (habit.intervalMinutes === 0) {
       const hasLogToday = habit.logs.some(ts => isSameDay(new Date(ts), new Date()));
       return hasLogToday ? 'completed' : 'ready';
     }

     // Interval Habit Logic
     if (habit.logs.length === 0) return 'ready';
     
     const lastLog = habit.logs[habit.logs.length - 1];
     const msSinceLast = now - lastLog;
     const msRequired = habit.intervalMinutes * 60 * 1000;
     
     if (msSinceLast < msRequired) {
       const msRemaining = msRequired - msSinceLast;
       const minsRemaining = Math.ceil(msRemaining / 60000);
       return { status: 'cooldown', minsRemaining };
     }
     
     return 'ready';
  };

  return (
    <div className="flex flex-wrap gap-4 py-4 items-center">
      {habits.map((habit) => {
        const status = getHabitStatus(habit);
        const isCompletedDaily = status === 'completed';
        const isCooldown = typeof status === 'object' && status.status === 'cooldown';
        const minsRemaining = isCooldown ? (status as { minsRemaining: number }).minsRemaining : 0;

        return (
          <div key={habit.id} className="group relative">
            <button
              disabled={isCompletedDaily || isCooldown} // Disable if done or cooling down
              onClick={() => logHabit(habit.id)}
              className={cn(
                "h-24 w-24 flex flex-col items-center justify-center gap-2 p-2 transition-all relative overflow-hidden",
                "border-2 border-black font-bold uppercase text-sm tracking-wider",
                
                // Ready State
                !isCompletedDaily && !isCooldown && "bg-white text-ink hover:shadow-[4px_4px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 active:shadow-none",
                
                // Completed Daily State
                isCompletedDaily && "bg-accent text-white border-accent cursor-default",
                
                // Cooldown State
                isCooldown && "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              )}
            >
              <span className="text-center truncate w-full px-1">{habit.title}</span>
              
              {/* Icon / Status Indicator */}
              {isCompletedDaily && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
              
              {!isCompletedDaily && !isCooldown && (
                <div className="w-3 h-3 border-2 border-black rounded-full" />
              )}

              {isCooldown && (
                <div className="flex flex-col items-center mt-1">
                   <Clock className="w-4 h-4 mb-1 animate-pulse" />
                   <span className="text-[10px] font-mono">{minsRemaining}m</span>
                </div>
              )}
            </button>
            
            <button
               onClick={() => removeHabit(habit.id)}
               className="absolute -top-2 -right-2 bg-white border-2 border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      {/* Add New Habit Button/Form */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="h-48 w-48 border-2 border-black bg-white flex flex-col p-4 shadow-[4px_4px_0px_0px_#000000] z-20 absolute top-20 left-10 md:static md:h-auto md:w-auto md:shadow-none">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold uppercase text-xs">New Habit</span>
              <button type="button" onClick={() => setIsAdding(false)}><X className="w-4 h-4"/></button>
            </div>
            
            <input 
              autoFocus
              type="text" 
              placeholder="NAME..."
              value={newHabitTitle}
              onChange={e => setNewHabitTitle(e.target.value)}
              className="w-full border-b-2 border-gray-200 focus:border-black outline-none font-bold uppercase text-sm mb-3 py-1 bg-transparent"
            />
            
            <label className="text-[10px] font-bold uppercase text-gray-500 mb-1">Frequency</label>
            <select 
              value={newHabitInterval}
              onChange={e => setNewHabitInterval(Number(e.target.value))}
              className="w-full text-xs font-mono border-2 border-gray-200 p-1 mb-4 outline-none focus:border-black"
            >
              <option value={0}>Daily (Once/Day)</option>
              <option value={30}>Every 30 Mins</option>
              <option value={60}>Every 1 Hour</option>
              <option value={120}>Every 2 Hours</option>
              <option value={240}>Every 4 Hours</option>
            </select>

            <button type="submit" className="bg-black text-white p-2 font-bold uppercase text-xs hover:bg-accent w-full mt-auto">
              Create Habit
            </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-400 hover:border-black hover:text-black transition-colors"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
