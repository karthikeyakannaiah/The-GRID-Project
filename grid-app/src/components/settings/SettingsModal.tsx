import { useState, useRef } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useHabitStore } from '../../store/useHabitStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Download, Upload, X, AlertTriangle, Check, Archive, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { pomodoro, updatePomodoroSettings, autoArchiveDelay, updateAutoArchiveDelay } = useSettingsStore();
  const { archivedTasks, restoreTask } = useTaskStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showArchive, setShowArchive] = useState(false);

  // Input States for Pomodoro
  const [workTime, setWorkTime] = useState(pomodoro.workMinutes);
  const [shortBreak, setShortBreak] = useState(pomodoro.shortBreakMinutes);
  const [longBreak, setLongBreak] = useState(pomodoro.longBreakMinutes);
  const [archiveDelay, setArchiveDelay] = useState(autoArchiveDelay);

  const handleSaveSettings = () => {
    updatePomodoroSettings({
      workMinutes: workTime,
      shortBreakMinutes: shortBreak,
      longBreakMinutes: longBreak
    });
    updateAutoArchiveDelay(archiveDelay);
    onClose();
  };

  const handleExport = () => {
    const data = {
      version: '1.0',
      timestamp: Date.now(),
      tasks: useTaskStore.getState().tasks,
      habits: useHabitStore.getState().habits,
      journal: {
        collections: useJournalStore.getState().collections,
        entries: useJournalStore.getState().entries,
      },
      settings: useSettingsStore.getState(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grid-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Basic Validation
        if (!json.version || !json.tasks || !json.habits) {
           throw new Error("Invalid Backup File");
        }

        // Hydrate Stores
        useTaskStore.setState({ tasks: json.tasks });
        useHabitStore.setState({ habits: json.habits });
        if (json.journal) {
           useJournalStore.setState({ 
             collections: json.journal.collections,
             entries: json.journal.entries 
           });
        }
        if (json.settings) {
           useSettingsStore.setState(json.settings);
           // Update local state to reflect imported settings
           setWorkTime(json.settings.pomodoro.workMinutes);
           setShortBreak(json.settings.pomodoro.shortBreakMinutes);
           setLongBreak(json.settings.pomodoro.longBreakMinutes);
        }

        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (err) {
        console.error(err);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_#000000] p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 hover:bg-gray-100 p-1 rounded">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">System Settings</h2>

        {/* SECTION: POMODORO */}
        <div className="mb-8">
          <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Timer Configuration</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <label className="text-xs font-bold uppercase text-gray-500">Focus Duration</label>
               <input 
                 type="number" 
                 value={workTime} 
                 onChange={e => setWorkTime(Number(e.target.value))}
                 className="w-16 border-2 border-gray-200 p-1 font-mono text-center font-bold focus:border-black outline-none"
               />
            </div>
            <div className="flex justify-between items-center">
               <label className="text-xs font-bold uppercase text-gray-500">Short Break</label>
               <input 
                 type="number" 
                 value={shortBreak} 
                 onChange={e => setShortBreak(Number(e.target.value))}
                 className="w-16 border-2 border-gray-200 p-1 font-mono text-center font-bold focus:border-black outline-none"
               />
            </div>
            <div className="flex justify-between items-center">
               <label className="text-xs font-bold uppercase text-gray-500">Long Break</label>
               <input 
                 type="number" 
                 value={longBreak} 
                 onChange={e => setLongBreak(Number(e.target.value))}
                 className="w-16 border-2 border-gray-200 p-1 font-mono text-center font-bold focus:border-black outline-none"
               />
            </div>
          </div>
        </div>

        {/* SECTION: AUTO-ARCHIVE */}
        <div className="mb-8">
          <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Auto-Archive Settings</h3>
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Archive Completed Tasks After</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Immediately', value: 0 },
                { label: '1 Day', value: 24 },
                { label: '1 Week', value: 168 },
                { label: 'Never', value: -1 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setArchiveDelay(preset.value)}
                  className={`
                    p-2 border-2 font-bold text-xs uppercase transition-all
                    ${
                      archiveDelay === preset.value
                        ? 'border-black bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                        : 'border-gray-300 hover:border-black'
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: DATA MANAGEMENT */}
        <div className="mb-8">
           <h3 className="font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Data Management</h3>
           <div className="flex gap-4">
              <button 
                onClick={handleExport}
                className="flex-1 border-2 border-black p-3 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all shadow-[2px_2px_0px_0px_#000]"
              >
                 <Download className="w-4 h-4" /> Export
              </button>
              
              <div className="flex-1 relative">
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept=".json" 
                   onChange={handleImport}
                   className="hidden"
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full border-2 border-black p-3 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all shadow-[2px_2px_0px_0px_#000]"
                 >
                    <Upload className="w-4 h-4" /> Import
                 </button>
              </div>
           </div>

           {/* Import Status Messages */}
           {importStatus === 'success' && (
              <div className="mt-2 text-green-600 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-2">
                 <Check className="w-3 h-3" /> Restore Successful
              </div>
           )}
           {importStatus === 'error' && (
              <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-2">
                 <AlertTriangle className="w-3 h-3" /> Restore Failed
              </div>
           )}
        </div>

        {/* SECTION: ARCHIVE VIEW */}
        <div className="mb-8">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="w-full font-bold uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2 flex items-center justify-between hover:text-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Archive ({archivedTasks.length})
            </div>
            {showArchive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showArchive && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {archivedTasks.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">No archived tasks</p>
              ) : (
                archivedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-200 p-3 flex items-start justify-between hover:border-gray-400 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Quadrant: {task.quadrant.toUpperCase()} • Completed: {new Date(task.completedAt || 0).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Restore task"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <button 
          onClick={handleSaveSettings}
          className="w-full bg-black text-white p-3 font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-[4px_4px_0px_0px_#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
