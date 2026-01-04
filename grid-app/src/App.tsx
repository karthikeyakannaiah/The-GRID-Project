import { useState, useEffect } from 'react';
import { MatrixView } from './components/matrix/MatrixView';
import { FocusView } from './components/focus/FocusView';
import { HabitsPage } from './components/habits/HabitsPage';
import { JournalPage } from './components/journal/JournalPage';
import { Navbar } from './components/layout/Navbar';
import { SettingsModal } from './components/settings/SettingsModal';
import { CreateTaskModal } from './components/matrix/CreateTaskModal';
import type { Tab } from './components/layout/Navbar';
import { useTaskStore } from './store/useTaskStore';
import { useSettingsStore } from './store/useSettingsStore';
import { SlidersHorizontal, Settings } from 'lucide-react';
import { cn } from './lib/utils';


function App() {
  const { addTask, runAutoArchive, tasks } = useTaskStore();
  const { autoArchiveDelay } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Run auto-archive on mount and when tasks or delay changes
  useEffect(() => {
    // Small delay to ensure store is hydrated from localStorage
    const timer = setTimeout(() => {
      runAutoArchive(autoArchiveDelay);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tasks, autoArchiveDelay, runAutoArchive]);

  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-accent selection:text-white pb-32">
      {/* App Header - Persistent */}
      <header className={cn(
        "mx-auto flex justify-between items-end transition-all duration-500 ease-in-out",
        activeTab === 'plan' ? "p-8 pb-4 max-w-7xl" : "p-4 max-w-7xl"
      )}>
        <div className="transition-all duration-500 flex items-center gap-4">
          <div>
            <h1 className={cn(
              "font-black tracking-tight mb-1 transition-all duration-500",
              activeTab === 'plan' ? "text-4xl" : "text-xl"
            )}>
              GRID<span className="text-accent">.</span>OS
            </h1>
            <p className={cn(
              "font-mono text-sm text-gray-500 uppercase tracking-widest transition-all duration-500",
              activeTab === 'plan' ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
            )}>
              Productivity System
            </p>
          </div>

          <button 
             onClick={() => setIsSettingsOpen(true)}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
          >
             <Settings className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Add Task - Only in Plan Mode */}
        <div className={cn(
          "transition-all duration-500 origin-right",
          activeTab === 'plan' ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-10 pointer-events-none w-0 overflow-hidden"
        )}>
           <form onSubmit={handleQuickCapture} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="QUICK CAPTURE..."
              className="border-2 border-black p-2 font-bold uppercase w-64 focus:outline-none focus:ring-4 focus:ring-accent/20 bg-white shadow-[4px_4px_0px_0px_#000000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
            />
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="bg-black text-white p-2 border-2 border-black hover:bg-accent hover:border-accent transition-colors shadow-[4px_4px_0px_0px_#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        {activeTab === 'plan' && <MatrixView />}
        {activeTab === 'focus' && <FocusView />}
        {activeTab === 'habits' && <HabitsPage />}
        {activeTab === 'journal' && <JournalPage />}
      </main>

      {/* Floating Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* AI Credits Footer */}
      <div className="fixed bottom-2 w-full text-center pointer-events-none z-40 animate-in fade-in duration-1000 delay-500">
        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          Build Using AI (gemini-3-pro & Sonnet-4.5)
        </p>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTaskTitle('');
        }} 
        initialTitle={newTaskTitle}
      />
    </div>
  );
}

export default App;
