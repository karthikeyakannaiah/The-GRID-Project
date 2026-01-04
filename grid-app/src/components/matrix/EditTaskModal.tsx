import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { X, Calendar, Tag } from 'lucide-react';


interface EditTaskModalProps {
  taskId: string;
  onClose: () => void;
}

export function EditTaskModal({ taskId, onClose }: EditTaskModalProps) {
  const { tasks, updateTask } = useTaskStore();
  const task = tasks.find(t => t.id === taskId);
  
  // Initialize state directly
  const [title, setTitle] = useState(task?.title || '');
  const [tagInput, setTagInput] = useState(task?.tags ? task.tags.join(', ') : '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Parse tags (comma separated)
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      
      updateTask(task.id, {
        title: title.trim(),
        tags,
        dueDate: dueDate || undefined
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-md flex flex-col">
         {/* Header */}
         <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-50">
            <h3 className="font-bold uppercase tracking-wider">Edit Task</h3>
            <button onClick={onClose}><X className="w-5 h-5"/></button>
         </div>

         <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Task Title</label>
               <input
                 type="text"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
                 className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                 autoFocus
               />
            </div>

            {/* Tags */}
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                 <Tag className="w-3 h-3" /> Tags (Comma separated)
               </label>
               <input
                 type="text"
                 value={tagInput}
                 onChange={e => setTagInput(e.target.value)}
                 placeholder="work, design, urgent..."
                 className="w-full border-2 border-gray-300 p-2 font-mono text-sm focus:border-black outline-none"
               />
            </div>

            {/* Due Date */}
            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                 <Calendar className="w-3 h-3" /> Due Date
               </label>
               <input
                 type="date"
                 value={dueDate}
                 onChange={e => setDueDate(e.target.value)}
                 className="w-full border-2 border-gray-300 p-2 font-mono text-sm focus:border-black outline-none"
               />
            </div>

            <div className="pt-4 flex gap-2 justify-end">
               <button type="button" onClick={onClose} className="px-4 py-2 font-bold uppercase text-xs hover:bg-gray-100">Cancel</button>
               <button type="submit" className="px-6 py-2 bg-black text-white font-bold uppercase text-xs hover:bg-accent border-2 border-black hover:border-accent">Save Changes</button>
            </div>
         </form>
      </div>
    </div>
  );
}
