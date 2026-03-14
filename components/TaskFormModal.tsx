
import React, { useState, useEffect } from 'react';
import { Task, TaskType, TaskCategory, Priority } from '../types';
import { CATEGORY_ICONS, PRIORITY_COLORS } from '../constants';
import { X, Calendar, Flag, Tag, Check } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.FIXED);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.OTHER);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setCategory(initialData.category);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate || '');
    } else {
      // Reset defaults for new task
      setTitle('');
      setType(TaskType.FIXED);
      setCategory(TaskCategory.OTHER);
      setPriority(Priority.MEDIUM);
      setDueDate('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: initialData?.id, // Pass ID if editing
      title,
      type,
      category,
      priority,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-paper rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-serif text-stone-800 font-bold italic">
            {initialData ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full text-lg bg-stone-50 border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-banana/50 focus:border-banana transition-all placeholder-stone-300 text-stone-800"
              autoFocus
            />
          </div>

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Type</label>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType(TaskType.FIXED)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === TaskType.FIXED ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Daily Ritual
              </button>
              <button
                type="button"
                onClick={() => setType(TaskType.FLEXIBLE)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === TaskType.FLEXIBLE ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
              >
                One-off Mission
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 ml-1">
              {type === TaskType.FIXED ? "Resets every day. Good for building habits." : "Completed once. Good for projects and to-dos."}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
               <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                 <Tag size={12} /> Category
               </label>
               <select 
                 value={category}
                 onChange={(e) => setCategory(e.target.value as TaskCategory)}
                 className="w-full bg-stone-50 border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:ring-banana/50 focus:border-banana cursor-pointer"
               >
                 {Object.values(TaskCategory).map(cat => (
                   <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                 ))}
               </select>
            </div>

            {/* Priority */}
            <div>
               <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                 <Flag size={12} /> Priority
               </label>
               <select 
                 value={priority}
                 onChange={(e) => setPriority(e.target.value as Priority)}
                 className="w-full bg-stone-50 border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:ring-banana/50 focus:border-banana cursor-pointer"
               >
                 {Object.values(Priority).map(p => (
                   <option key={p} value={p}>{p}</option>
                 ))}
               </select>
            </div>

            {/* Due Date */}
            <div className="col-span-2">
               <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                 <Calendar size={12} /> Due Date <span className="text-stone-300 font-normal lowercase">(optional)</span>
               </label>
               <input 
                 type="date"
                 value={dueDate}
                 onChange={(e) => setDueDate(e.target.value)}
                 className="w-full bg-stone-50 border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:ring-banana/50 focus:border-banana"
               />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-3">
             <button 
               type="button" 
               onClick={onClose}
               className="px-6 py-3 rounded-xl text-stone-500 font-bold text-sm hover:bg-stone-100 transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit"
               disabled={!title.trim()}
               className="px-8 py-3 rounded-xl bg-stone-800 text-banana font-bold text-sm hover:bg-stone-900 transition-colors shadow-lg shadow-stone-200 disabled:opacity-50 flex items-center gap-2"
             >
               {initialData ? 'Save Changes' : 'Create Entry'} <Check size={16} />
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};
