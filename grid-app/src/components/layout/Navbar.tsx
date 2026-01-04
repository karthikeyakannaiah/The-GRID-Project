import { useState } from 'react';
import { LayoutGrid, AppWindow, Activity, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type Tab = 'plan' | 'focus' | 'habits' | 'journal';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);

  const tabs: { id: Tab; icon: typeof LayoutGrid; label: string }[] = [
    { id: 'plan', icon: LayoutGrid, label: 'Plan' },
    { id: 'focus', icon: AppWindow, label: 'Focus' },
    { id: 'habits', icon: Activity, label: 'Habits' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full shadow-2xl border border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative p-3 rounded-full transition-all duration-300 group",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <div className="relative z-10">
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              
              {/* Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/15 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTab === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-gray-800 shadow-xl whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Hover Scale Effect */}
              <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-105 transition-transform duration-200" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
