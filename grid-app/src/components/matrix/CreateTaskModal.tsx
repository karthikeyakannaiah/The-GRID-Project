import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { X, Calendar, Tag, Target } from 'lucide-react';
import type { Quadrant } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
}

export function CreateTaskModal({ isOpen, onClose, initialTitle = '' }: CreateTaskModalProps) {
  const { addTask } = useTaskStore();
  
  const [title, setTitle] = useState(initialTitle);
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>('inbox');
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      addTask(title.trim(), tags, dueDate || undefined, selectedQuadrant);
      
      // Reset form
      setTitle('');
      setTagInput('');
      setDueDate('');
      setSelectedQuadrant('inbox');
      onClose();
    }
  };

  if (!isOpen) return null;

  const quadrants = [
    { 
      id: 'q1' as Quadrant, 
      label: 'Urgent & Important', 
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Do First'
    },
    { 
      id: 'q2' as Quadrant, 
      label: 'Not Urgent & Important', 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Schedule'
    },
    { 
      id: 'q3' as Quadrant, 
      label: 'Urgent & Not Important', 
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: 'Delegate'
    },
    { 
      id: 'q4' as Quadrant, 
      label: 'Not Urgent & Not Important', 
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Eliminate'
    },
    { 
      id: 'inbox' as Quadrant, 
      label: 'Inbox: Unsorted', 
      color: 'bg-gray-400 hover:bg-gray-500',
      description: 'Triage Later'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000000] w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-4 border-black flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            <h3 className="font-black uppercase tracking-wider text-xl">Create Mission</h3>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Mission Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full border-2 border-black p-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_#000000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              autoFocus
            />
          </div>

          {/* Quadrant Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
              Select Quadrant
            </label>
            <div className="grid grid-cols-2 gap-3">
              {quadrants.map((quadrant) => (
                <button
                  key={quadrant.id}
                  type="button"
                  onClick={() => setSelectedQuadrant(quadrant.id)}
                  className={`
                    p-4 border-2 transition-all text-left
                    ${selectedQuadrant === quadrant.id 
                      ? 'border-black shadow-[4px_4px_0px_0px_#000000] scale-105' 
                      : 'border-gray-300 hover:border-black'
                    }
                    ${quadrant.color} text-white font-bold
                  `}
                >
                  <div className="text-sm uppercase tracking-wide">{quadrant.label}</div>
                  <div className="text-xs opacity-90 mt-1">{quadrant.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tags */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="work, urgent, design..."
                className="w-full border-2 border-gray-300 p-2 font-mono text-sm focus:border-black outline-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border-2 border-gray-300 p-2 font-mono text-sm focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3 justify-end border-t-2 border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 font-bold uppercase text-xs hover:bg-gray-100 border-2 border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-black text-white font-bold uppercase text-xs hover:bg-accent border-2 border-black hover:border-accent transition-colors shadow-[4px_4px_0px_0px_#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              Create Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
