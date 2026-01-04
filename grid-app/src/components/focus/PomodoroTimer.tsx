import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

type TimerMode = 'focus' | 'short' | 'long';

const TIMERS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMERS.focus);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound here ideally
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMERS[mode]);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(TIMERS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-2 border-black bg-white p-6 md:p-12 flex flex-col items-center justify-center space-y-8 h-full min-h-[400px]">
      <div className="flex gap-2 mb-4">
        {(['focus', 'short', 'long'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={cn(
              "px-3 py-1 font-bold uppercase text-xs tracking-wider border-2 border-transparent transition-all",
              mode === m ? "border-black bg-gray-100" : "text-gray-400 hover:text-black"
            )}
          >
            {m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="text-[6rem] md:text-[8rem] font-black leading-none tracking-tighter tabular-nums select-none">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "h-16 w-16 flex items-center justify-center rounded-full border-2 border-black transition-all hover:scale-105 active:scale-95",
            isActive ? "bg-white text-black" : "bg-black text-white"
          )}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="h-16 w-16 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-8">
        {isActive ? 'Session in Progress' : 'Ready to Start'}
      </p>
    </div>
  );
}
