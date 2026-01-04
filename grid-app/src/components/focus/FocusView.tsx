import { useTaskStore } from '../../store/useTaskStore';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';
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

           <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                          "group w-full text-left p-3 border-2 border-black transition-all duration-200 relative",
                          "shadow-[4px_4px_0px_0px_#000000]",
                          "hover:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5",
                          "active:shadow-[2px_2px_0px_0px_#000000] active:translate-y-[2px] active:translate-x-[2px]",
                          task.status === 'done' 
                            ? "bg-gray-100 opacity-60" 
                            : "bg-white"
                        )}
                    >
                        <div className="flex justify-between items-center gap-3">
                          <span className={cn(
                            "font-bold uppercase tracking-wide text-sm flex-1",
                            task.status === 'done' && "line-through text-gray-500"
                          )}>
                            {task.title}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex gap-1">
                                {task.tags.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-200 border border-gray-400 font-mono uppercase">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Checkbox */}
                            {task.status === 'done' ? (
                              <div className="w-6 h-6 border-2 border-black bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-black bg-white group-hover:bg-gray-50 group-hover:scale-110 transition-all flex items-center justify-center">
                                {/* Empty checkbox - shows on hover it's clickable */}
                              </div>
                            )}
                          </div>
                        </div>
                    </button>
                    ))
            )}
          </div>
       </div>
    </div>
  );
}
