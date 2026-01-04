import { format, subDays, isSameDay } from 'date-fns';
import { useHabitStore } from '../../store/useHabitStore';
import { cn } from '../../lib/utils';

export function HabitStats() {
  const { habits } = useHabitStore();

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 font-medium italic border-2 border-dashed border-gray-300">
        No habits tracked yet. Add one above!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {habits.map((habit) => {
        const totalLogs = habit.logs.length;
        const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
        
        return (
          <div key={habit.id} className="border-2 border-black p-4 bg-white hover:shadow-[4px_4px_0px_0px_#000000] transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold uppercase text-lg">{habit.title}</h3>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  {habit.intervalMinutes === 0 ? 'Daily Routine' : `Every ${habit.intervalMinutes / 60} hrs`}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black text-accent">{habit.streak}</span>
                <span className="text-xs font-bold uppercase text-gray-400">Streak</span>
              </div>
            </div>

            {/* Heatmap / Activity */}
            <div className="space-y-2">
               <div className="flex justify-between items-end text-xs font-bold uppercase text-gray-400 mb-1">
                 <span>Last 7 Days</span>
                 <span>{totalLogs} Total Reps</span>
               </div>
               <div className="flex gap-1 h-8">
                 {last7Days.map((day) => {
                   const dayLogs = habit.logs.filter(ts => isSameDay(new Date(ts), day)).length;
                   
                   return (
                     <div 
                       key={day.toISOString()} 
                       className={cn(
                         "flex-1 border-2 border-black flex items-center justify-center font-mono text-[10px]",
                         dayLogs > 0 ? "bg-accent/80 text-white" : "bg-gray-100 text-gray-300"
                       )}
                       title={`${format(day, 'MMM dd')}: ${dayLogs} logs`}
                     >
                       {dayLogs > 0 ? dayLogs : ''}
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
