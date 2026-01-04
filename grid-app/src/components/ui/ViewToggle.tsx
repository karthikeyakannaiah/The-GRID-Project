import { cn } from '../../lib/utils';
import { LayoutGrid, Target } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'planner' | 'focus';
  setViewMode: (mode: 'planner' | 'focus') => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex border-2 border-black bg-white">
      <button
        onClick={() => setViewMode('planner')}
        className={cn(
          "px-4 py-2 flex items-center gap-2 font-bold uppercase text-sm transition-colors",
          viewMode === 'planner' 
            ? "bg-black text-white" 
            : "bg-white text-black hover:bg-gray-50"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Plan
      </button>
      <div className="w-[2px] bg-black" />
      <button
        onClick={() => setViewMode('focus')}
        className={cn(
          "px-4 py-2 flex items-center gap-2 font-bold uppercase text-sm transition-colors",
          viewMode === 'focus' 
            ? "bg-black text-white" 
            : "bg-white text-black hover:bg-gray-50"
        )}
      >
        <Target className="w-4 h-4" />
        Focus
      </button>
    </div>
  );
}
