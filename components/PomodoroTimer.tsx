
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, ChevronDown } from 'lucide-react';
import { Task, ActiveSession } from '../types';

interface PomodoroTimerProps {
  tasks: Task[];
  activeSession: ActiveSession | null;
  onStart: (taskId: string | null, mode: 'COUNTDOWN' | 'STOPWATCH', duration: number) => void;
  onStop: () => void;
  className?: string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  tasks, 
  activeSession, 
  onStart, 
  onStop,
  className
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [mode, setMode] = useState<'COUNTDOWN' | 'STOPWATCH'>('COUNTDOWN');
  const [duration, setDuration] = useState(25);
  const [displayTime, setDisplayTime] = useState(duration * 60);

  useEffect(() => {
    let interval: number;
    if (activeSession) {
      const update = () => {
        const now = Math.floor(Date.now() / 1000);
        const start = Math.floor(activeSession.startTime / 1000);
        const elapsed = now - start;
        
        if (activeSession.mode === 'COUNTDOWN') {
          const totalSeconds = activeSession.initialDurationMinutes * 60;
          const remaining = Math.max(0, totalSeconds - elapsed);
          setDisplayTime(remaining);
        } else {
          setDisplayTime(elapsed);
        }
      };
      update();
      interval = window.setInterval(update, 1000);
    } else {
      if (mode === 'COUNTDOWN') setDisplayTime(duration * 60);
      else setDisplayTime(0);
    }
    return () => window.clearInterval(interval);
  }, [activeSession, duration, mode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeTask = activeSession?.taskId 
    ? tasks.find(t => t.id === activeSession.taskId) 
    : null;

  return (
    // Fixed height obstruction by using h-auto, min-h, and proper gap management
    <div className={`bg-white rounded-[2rem] p-6 border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-visible flex flex-col h-auto min-h-[440px] ${className}`}>
      
      {/* Header */}
      <div className="relative z-10 mb-2">
        <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${activeSession ? 'bg-banana animate-pulse' : 'bg-stone-300'}`}></span>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans">
                {activeSession ? (activeSession.mode === 'COUNTDOWN' ? 'Focus Session' : 'Flow Mode') : 'Timer Widget'}
            </h3>
        </div>
        <h2 className="text-xl font-bold text-stone-800 leading-tight font-display tracking-tight truncate">
            {activeSession 
                ? (activeTask ? activeTask.title : "Freestyle Focus") 
                : "Deep Work"}
        </h2>
      </div>

      {/* Main Timer Display - Scaled down slightly to fit controls */}
      <div className="flex-grow flex items-center justify-center py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
             {/* Subtle Paper-like Ring */}
            <div className="absolute inset-0 rounded-full border-[1px] border-stone-100 bg-stone-50/30"></div>
            <div className="absolute inset-3 rounded-full border-[1px] border-white shadow-sm bg-white"></div>
            
            {/* Active Indicator Ring */}
            {activeSession && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-80">
                   <circle 
                      cx="96" cy="96" r="92" 
                      stroke="#EAD94C" strokeWidth="3" fill="none" 
                      strokeDasharray="4 8"
                      className="animate-spin-slow" 
                      style={{ animationDuration: '60s' }}
                   />
                </svg>
            )}

            <div className="text-center z-10 flex flex-col items-center">
                <div className={`text-5xl font-light tracking-tighter tabular-nums font-sans ${activeSession ? 'text-stone-800' : 'text-stone-300'}`}>
                    {formatTime(displayTime)}
                </div>
                {activeSession && (
                    <span className="text-[10px] text-stone-400 font-serif italic mt-1">focusing...</span>
                )}
            </div>
        </div>
      </div>

      {/* Controls Container - Added z-index and explicit spacing */}
      <div className="relative z-20 flex flex-col gap-3 mt-auto pt-2 bg-white">
        {!activeSession ? (
            <>
                <div className="space-y-3">
                    {/* Task Select */}
                    <div className="relative group">
                        <select 
                            className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-600 text-xs font-semibold rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-stone-300 focus:bg-white transition-colors cursor-pointer"
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                        >
                            <option value="">✨ Freestyle (No specific task)</option>
                            {tasks.filter(t => !t.isCompleted).map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover:text-stone-600" />
                    </div>

                    {/* Mode Toggle & Time Adjustment */}
                    <div className="flex gap-2">
                        <div className="flex bg-stone-50 border border-stone-200 rounded-xl p-1 flex-1">
                            <button onClick={() => setMode('COUNTDOWN')} className={`flex-1 rounded-lg text-[10px] font-bold transition-all py-2 ${mode === 'COUNTDOWN' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}>Timer</button>
                            <button onClick={() => setMode('STOPWATCH')} className={`flex-1 rounded-lg text-[10px] font-bold transition-all py-2 ${mode === 'STOPWATCH' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}>Stopwatch</button>
                        </div>
                        
                        {mode === 'COUNTDOWN' && (
                            <div className="flex items-center justify-between bg-stone-50 rounded-xl border border-stone-200 px-3 w-1/2">
                                <button onClick={() => setDuration(Math.max(5, duration - 5))} className="text-stone-400 hover:text-stone-600 font-bold">-</button>
                                <span className="text-xs font-bold text-stone-700 mx-1">{duration}m</span>
                                <button onClick={() => setDuration(Math.min(120, duration + 5))} className="text-stone-400 hover:text-stone-600 font-bold">+</button>
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => onStart(selectedTaskId || null, mode, duration)}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-paper py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-stone-200 transition-all active:scale-[0.98] mt-1"
                >
                    <Play size={16} fill="currentColor" /> <span className="text-sm">Start Session</span>
                </button>
            </>
        ) : (
            <button 
                onClick={onStop}
                className="w-full bg-white border border-stone-200 text-stone-500 hover:text-rose-500 hover:border-rose-200 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-1 shadow-sm"
            >
                <Square size={16} fill="currentColor" /> <span className="text-sm">Stop Session</span>
            </button>
        )}
      </div>
    </div>
  );
};
