import { useTaskStore } from '../../store/useTaskStore';
import { cn } from '../../lib/utils';
import { Check, ArrowRight } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';

export function FocusView() {
  const { tasks, toggleTask } = useTaskStore();
  const q1Tasks = tasks.filter(t => t.quadrant === 'q1' && t.status === 'todo');
  const completedQ1 = tasks.filter(t => t.quadrant === 'q1' && t.status === 'done');
  
  const allQ1 = [...q1Tasks, ...completedQ1];

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-in fade-in zoom-in-95 duration-300">
       {/* Left Column: Timer */}
       <div className="flex-1 min-h-[400px]">
          <PomodoroTimer />
       </div>

       {/* Right Column: Active Queue */}
       <div className="flex-1 border-2 border-black bg-white flex flex-col overflow-hidden">
          <header className="p-4 border-b-2 border-black bg-gray-50">
             <h2 className="text-xl font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                active queue <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{q1Tasks.length}</span>
             </h2>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {allQ1.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                  No tasks in Q1.
               </div>
            ) : (
                allQ1.map((task) => (
                    <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                        "group w-full text-left p-6 border-2 border-black transition-all duration-200 relative overflow-hidden",
                        "hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5",
                        task.status === 'done' 
                            ? "bg-gray-100 opacity-50 grayscale" 
                            : "bg-white"
                        )}
                    >
                        <div className="flex justify-between items-center relative z-10">
                        <span className={cn(
                            "text-lg font-bold uppercase tracking-wide",
                            task.status === 'done' && "line-through"
                        )}>
                            {task.title}
                        </span>
                        
                        {task.status === 'done' ? (
                            <Check className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        )}
                        </div>
                    </button>
                    ))
            )}
          </div>
       </div>
    </div>
  );
}
