import { useState } from 'react';
import { useJournalStore } from '../../store/useJournalStore';
import { cn } from '../../lib/utils';
import { Plus, Trash2, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function JournalPage() {
  const { 
    collections, 
    entries, 
    activeCollectionId, 
    activeEntryId,
    createCollection, 
    deleteCollection, 
    setActiveCollection,
    addEntry,
    updateEntry,
    deleteEntry,
    setActiveEntry
  } = useJournalStore();

  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Derived State
  const filteredEntries = entries
    .filter(e => e.collectionId === activeCollectionId)
    .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const activeEntry = entries.find(e => e.id === activeEntryId);

  // Handlers
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionTitle.trim()) {
      createCollection(newCollectionTitle.trim());
      setNewCollectionTitle('');
      setIsCreatingCollection(false);
    }
  };

  const handleCreateEntry = () => {
    if (activeCollectionId) {
       addEntry(activeCollectionId, '', '');
    }
  };

  // 3-Pane Layout
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 border-2 border-black bg-white shadow-[8px_8px_0px_0px_#000000]">
      
      {/* PANE 1: LIBRARY (Sidebar) */}
      <div className="w-64 border-r-2 border-black bg-gray-50 flex flex-col">
          <div className="p-4 border-b-2 border-black flex justify-between items-center bg-gray-100">
             <span className="font-bold uppercase tracking-wider text-sm">Library</span>
             <button onClick={() => setIsCreatingCollection(true)} className="hover:bg-gray-200 p-1 rounded-sm"><Plus className="w-4 h-4"/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {/* New Collection Form */}
             {isCreatingCollection && (
                <form onSubmit={handleCreateCollection} className="mb-2">
                   <input 
                     autoFocus
                     className="w-full text-xs font-bold border-2 border-black p-1" 
                     placeholder="Collection Name..."
                     value={newCollectionTitle}
                     onChange={e => setNewCollectionTitle(e.target.value)}
                     onBlur={() => !newCollectionTitle && setIsCreatingCollection(false)}
                   />
                </form>
             )}

             {collections.map(collection => (
               <button
                 key={collection.id}
                 onClick={() => setActiveCollection(collection.id)}
                 className={cn(
                   "w-full text-left p-2 flex items-center gap-2 border-2 transition-all group",
                   activeCollectionId === collection.id 
                     ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_#666]" 
                     : "bg-white text-gray-700 border-transparent hover:border-gray-300"
                 )}
               >
                 <div className={cn("w-3 h-12 rounded-sm border border-white/20", collection.color || "bg-gray-400")} />
                 <span className="font-bold text-xs uppercase truncate flex-1">{collection.title}</span>
                 {collection.id !== 'daily' && (
                    <div onClick={(e) => { e.stopPropagation(); deleteCollection(collection.id); }} className="opacity-0 group-hover:opacity-100 hover:text-red-400">
                       <Trash2 className="w-3 h-3" />
                    </div>
                 )}
               </button>
             ))}
          </div>
      </div>

      {/* PANE 2: ENTRY LIST */}
      <div className="w-80 border-r-2 border-black flex flex-col bg-white/50">
          <div className="p-4 border-b-2 border-black h-14 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <Search className="w-4 h-4" />
                <input 
                  className="bg-transparent outline-none text-xs font-mono w-full" 
                  placeholder="Search entries..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
          </div>

          <div className="flex-1 overflow-y-auto">
             {filteredEntries.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-50">
                  <FileText className="w-8 h-8" />
                  <span className="text-xs uppercase font-bold">No Entries</span>
               </div>
             ) : (
               filteredEntries.map(entry => (
                 <button
                   key={entry.id}
                   onClick={() => setActiveEntry(entry.id)}
                   className={cn(
                     "w-full text-left p-4 border-b border-gray-100 hover:bg-yellow-50 transition-colors group relative",
                     activeEntryId === entry.id && "bg-yellow-50"
                   )}
                 >
                    <h4 className={cn("font-bold text-sm mb-1 truncate", !entry.title && "text-gray-400 italic")}>
                      {entry.title || "Untitled Entry"}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-400 block mb-1">
                      {format(new Date(entry.date), 'MMM dd, HH:mm')}
                    </span>
                    <p className="text-xs text-gray-500 line-clamp-2 pr-4 h-8 leading-relaxed">
                      {entry.content}
                    </p>

                    <div 
                      onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                      className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                 </button>
               ))
             )}
          </div>

          <button 
             onClick={handleCreateEntry}
             className="p-3 border-t-2 border-black bg-gray-50 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-colors"
          >
             <Plus className="w-4 h-4" /> New Entry
          </button>
      </div>

      {/* PANE 3: EDITOR */}
      <div className="flex-1 flex flex-col relative bg-white">
         {activeEntry ? (
            <>
              <div className="p-8 pb-4">
                 <input
                   className="w-full text-3xl font-bold font-display outline-none placeholder:text-gray-200"
                   placeholder="Title..."
                   value={activeEntry.title}
                   onChange={(e) => updateEntry(activeEntry.id, { title: e.target.value })}
                 />
                 <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
                    <span>{format(new Date(activeEntry.date), 'MMMM do, yyyy')}</span>
                    <span>•</span>
                    <span>{format(new Date(activeEntry.date), 'h:mm a')}</span>
                 </div>
              </div>
              
              <textarea
                className="flex-1 w-full resize-none p-8 pt-4 outline-none text-lg leading-relaxed font-serif text-gray-700 placeholder:text-gray-100"
                placeholder="Start writing..."
                value={activeEntry.content}
                onChange={(e) => updateEntry(activeEntry.id, { content: e.target.value })}
              />
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
               <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
               </div>
               <p className="font-bold uppercase tracking-widest text-xs">Select or Create an Entry</p>
            </div>
         )}
      </div>
    </div>
  );
}
