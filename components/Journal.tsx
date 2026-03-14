
import React, { useState, useEffect } from 'react';
import { Task, JournalEntry } from '../types';
import { MOODS } from '../constants';
import { generateJournalPrompt, analyzeSentimentAndFeedback } from '../services/geminiService';
import { getLocationName } from '../services/locationService';
import { Sparkles, Send, Mic, X, MapPin, Book, Calendar, ChevronLeft, Trash2 } from 'lucide-react';

interface JournalProps {
  completedTasks: Task[];
  fixedTasksTotal: number;
  onSaveEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onClose: () => void;
  history: JournalEntry[];
  onDeleteEntry: (id: string) => void;
}

type ViewMode = 'WRITE' | 'HISTORY';

export const Journal: React.FC<JournalProps> = ({ 
    completedTasks, 
    fixedTasksTotal, 
    onSaveEntry, 
    onClose,
    history,
    onDeleteEntry
}) => {
  const [view, setView] = useState<ViewMode>('WRITE');
  const [mood, setMood] = useState<string>('');
  const [content, setContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('Locating...');

  const completedCount = completedTasks.length;

  useEffect(() => {
    getLocationName().then(loc => setLocation(loc));
  }, []);

  const handleGetPrompt = async () => {
    if (!mood) return alert("Please select a mood first to guide the AI.");
    setIsLoadingPrompt(true);
    const prompt = await generateJournalPrompt(completedTasks, mood);
    setAiPrompt(prompt);
    setIsLoadingPrompt(false);
  };

  const handleUsePrompt = () => {
    setContent(prev => (prev ? prev + "\n\n" + aiPrompt : aiPrompt));
  };

  const handleSubmit = async () => {
    if (!content || !mood) return;
    setIsSubmitting(true);
    const insight = await analyzeSentimentAndFeedback(content);
    
    onSaveEntry({
      date: new Date().toISOString(),
      mood,
      content,
      generatedInsight: insight,
      completedTaskCount: completedCount,
      totalFixedTasks: fixedTasksTotal,
      location: location
    });
    setIsSubmitting(false);
    onClose();
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Immersive Dark Card */}
      <div className="w-full max-w-3xl bg-[#1e293b] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-700/50 relative">
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start z-10 shrink-0">
          <div>
            <h2 className="text-3xl font-serif text-[#FEF3C7] mb-1">
                {view === 'WRITE' ? 'Evening Reflection' : 'Past Reflections'}
            </h2>
            <div className="flex gap-4 items-center flex-wrap">
                 {view === 'WRITE' && (
                    <p className="text-slate-400 text-sm font-light">
                        Today you completed <span className="text-banana">{completedCount}</span> rituals.
                    </p>
                 )}
                 <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1 max-w-[200px]">
                    <MapPin size={8} className="flex-shrink-0" /> <span className="truncate">{location}</span>
                 </span>
            </div>
          </div>
          <div className="flex gap-3">
            {view === 'WRITE' ? (
                <button 
                    onClick={() => setView('HISTORY')}
                    className="text-slate-400 hover:text-banana transition-colors px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                    <Book size={14} /> History
                </button>
            ) : (
                <button 
                    onClick={() => setView('WRITE')}
                    className="text-slate-400 hover:text-banana transition-colors px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                    <ChevronLeft size={14} /> Write
                </button>
            )}
            
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-800">
                <X size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto z-10 custom-scrollbar relative">
            
            {view === 'WRITE' ? (
                <div className="px-8 py-4 space-y-8">
                     {/* Mood Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Current State of Mind</label>
                        <div className="flex gap-3 flex-wrap">
                        {MOODS.map((m) => (
                            <button
                            key={m.label}
                            onClick={() => setMood(m.label)}
                            className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${mood === m.label ? 'bg-slate-700 border-banana text-banana' : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'}`}
                            >
                            <span className="mr-2">{m.emoji}</span>
                            {m.label}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* AI Prompt */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Sparkles size={12} className="text-banana" /> AI Prompt
                            </label>
                            {!aiPrompt && (
                                <button onClick={handleGetPrompt} className="text-[10px] uppercase font-bold text-slate-400 hover:text-banana transition-colors">Generate</button>
                            )}
                        </div>
                        
                        <div className="min-h-[60px] flex items-center">
                            {isLoadingPrompt ? (
                            <span className="text-slate-500 text-sm animate-pulse font-serif italic">Listening to the stars...</span>
                            ) : aiPrompt ? (
                            <div className="w-full group cursor-pointer" onClick={handleUsePrompt}>
                                <p className="text-slate-300 font-serif text-lg leading-relaxed italic border-l-2 border-slate-700 pl-4 hover:border-banana transition-colors">
                                    "{aiPrompt}"
                                </p>
                                <span className="text-[10px] text-slate-600 mt-1 block group-hover:text-banana opacity-0 group-hover:opacity-100 transition-all">Click to insert</span>
                            </div>
                            ) : (
                            <p className="text-slate-600 text-sm font-serif italic">Select a mood to receive a guiding question.</p>
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="relative group pb-20">
                        <textarea
                        className="w-full h-64 bg-transparent border-none text-[#FEF3C7] text-lg font-serif leading-loose resize-none focus:ring-0 placeholder-slate-700 p-0"
                        placeholder="The page is yours..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                        ></textarea>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-800 group-focus-within:bg-slate-600 transition-colors"></div>
                        <button className="absolute bottom-4 right-0 text-slate-700 hover:text-slate-400 transition-colors" title="Voice Input">
                            <Mic size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="px-8 py-4 space-y-6">
                    {history.length === 0 ? (
                         <div className="text-center py-20 opacity-50">
                            <Book size={48} className="mx-auto mb-4 text-slate-600" strokeWidth={1} />
                            <p className="text-slate-500 font-serif italic">Your story begins with a single entry...</p>
                        </div>
                    ) : (
                        history.map((entry) => (
                            <div key={entry.id} className="group relative border-l border-slate-700 pl-6 py-2 hover:border-banana transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[#FEF3C7] font-display text-lg">{new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                        <span className="text-slate-500 text-[10px] font-mono flex items-center gap-2">
                                            {formatTime(entry.date)} • {entry.location || 'Unknown'} • {entry.mood}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => onDeleteEntry(entry.id)}
                                        className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className="text-slate-300 font-serif leading-relaxed text-sm whitespace-pre-wrap">{entry.content}</p>
                                {entry.generatedInsight && (
                                    <div className="mt-3 flex gap-2 items-start">
                                        <Sparkles size={12} className="text-banana/50 mt-1 flex-shrink-0" />
                                        <p className="text-xs text-slate-500 italic font-serif">"{entry.generatedInsight}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

        {/* Footer */}
        {view === 'WRITE' && (
            <div className="p-8 pt-4 flex justify-end bg-gradient-to-t from-[#1e293b] to-transparent z-10 shrink-0">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content || !mood}
                    className="flex items-center gap-3 text-slate-900 bg-[#FEF3C7] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(253,224,71,0.1)] hover:shadow-[0_0_25px_rgba(253,224,71,0.2)]"
                >
                    {isSubmitting ? 'Saving...' : <>Save Entry <Send size={16} /></>}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
