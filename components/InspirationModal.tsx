
import React, { useState, useEffect } from 'react';
import { Inspiration } from '../types';
import { getLocationName } from '../services/locationService';
import { X, Send, MapPin, Clock, Zap, History } from 'lucide-react';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, location: string) => void;
  history: Inspiration[];
  onDelete: (id: string) => void;
}

export const InspirationModal: React.FC<InspirationModalProps> = ({ isOpen, onClose, onSave, history, onDelete }) => {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('Locating...');

  useEffect(() => {
    if (isOpen) {
      getLocationName().then(loc => setLocation(loc));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text, location);
    setText('');
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FDFCF8] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-stone-200">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-banana rounded-xl text-stone-900 shadow-lg shadow-banana/20 rotate-3">
                <Zap size={22} fill="currentColor" />
            </div>
            <div>
                <h2 className="text-2xl font-display font-bold text-stone-800">Inspiration Station</h2>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {location}
                </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
            {/* Input Area */}
            <div className="p-6 bg-white relative">
                <div className="absolute top-6 right-6 text-stone-200 pointer-events-none">
                    <Zap size={100} strokeWidth={0.5} />
                </div>
                <textarea 
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Capture the spark before it fades..."
                    className="w-full h-32 bg-stone-50/50 rounded-xl border-none p-4 text-xl font-hand leading-relaxed text-stone-800 placeholder-stone-300 focus:ring-0 transition-all resize-none z-10 relative"
                ></textarea>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] text-stone-400 font-mono">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</span>
                    <button 
                        onClick={handleSave}
                        disabled={!text.trim()}
                        className="bg-stone-900 text-banana px-6 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                        Save Spark <Send size={14} />
                    </button>
                </div>
            </div>

            {/* History Section */}
            <div className="bg-stone-50 min-h-full p-6 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                    <History size={12} /> Recent Sparks
                </h3>
                
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-center text-stone-400 italic text-sm py-8">No sparks captured yet. The mind is a blank canvas.</p>
                    ) : (
                        history.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all group relative animate-in slide-in-from-bottom-2 duration-300">
                                <p className="text-stone-700 font-hand text-lg leading-relaxed mb-2 pl-2 border-l-2 border-banana">{item.content}</p>
                                <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
                                    <span className="flex items-center gap-2">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(item.createdAt)}</span>
                                        {item.location && (
                                            <span className="flex items-center gap-1 text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                                <MapPin size={8} /> {item.location}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => onDelete(item.id)}
                                    className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
