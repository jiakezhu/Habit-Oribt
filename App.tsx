
import React, { useState, useEffect } from 'react';
import { 
  Task, 
  UserState, 
  TaskType, 
  TaskCategory, 
  Achievement,
  Priority,
  PlanetType,
  ActiveSession,
  Inspiration
} from './types';
import { INITIAL_STATE, CATEGORY_ICONS, PRIORITY_COLORS, PLANET_TIERS } from './constants';
import { PomodoroTimer } from './components/PomodoroTimer';
import { UniverseDisplay } from './components/UniverseDisplay';
import { Journal } from './components/Journal';
import { FocusStats } from './components/FocusStats';
import { TaskFormModal } from './components/TaskFormModal';
import { NotebookView } from './components/NotebookView';
import { InspirationModal } from './components/InspirationModal';
import { generateAchievementArt, generateDailyQuote } from './services/geminiService';
import { 
  Check,
  Plus, 
  Trash2, 
  Edit2,
  BookOpen, 
  Mic,
  Calendar,
  BarChart3,
  Layers,
  Sparkles,
  Trophy
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem('habitOrbitState');
    const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
    return { ...INITIAL_STATE, ...parsed, inspirations: parsed.inspirations || [] };
  });

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  
  // Modal States
  const [showJournal, setShowJournal] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  
  // Navigation States
  const [currentView, setCurrentView] = useState<'tasks' | 'trophies' | 'stats'>('tasks');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- Effects ---
  useEffect(() => { localStorage.setItem('habitOrbitState', JSON.stringify(state)); }, [state]);

  useEffect(() => {
    const checkPlanetUnlocks = () => {
      const totalTasks = state.tasks.filter(t => t.isCompleted || (t.type === TaskType.FIXED && t.streak > 0)).length; 
      const totalFocus = state.focusHistory.reduce((sum, s) => sum + s.durationMinutes, 0);
      const nextTier = PLANET_TIERS.find(t => !state.unlockedPlanets.includes(t.type) && totalTasks >= t.reqTasks && totalFocus >= t.reqFocus);
      if (nextTier) {
        setState(prev => ({ ...prev, unlockedPlanets: [...prev.unlockedPlanets, nextTier.type], currentPlanet: nextTier.type }));
      }
    };
    checkPlanetUnlocks();
  }, [state.tasks, state.focusHistory]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const updateDaily = async () => {
        let newState = { ...state };
        let hasChanges = false;
        if (state.lastLoginDate !== today) {
            newState.lastLoginDate = today;
            newState.tasks = state.tasks.map(t => t.type === TaskType.FIXED ? { ...t, isCompleted: false } : t);
            hasChanges = true;
        }
        if (!state.dailyQuote || state.dailyQuote.date !== today) {
            try {
                const quoteData = await generateDailyQuote();
                newState.dailyQuote = { text: quoteData.text, author: quoteData.author, date: today };
                hasChanges = true;
            } catch (e) {}
        }
        if (hasChanges) setState(newState);
    };
    updateDaily();
  }, [state.lastLoginDate]); 

  // --- Logic Handlers ---
  const handleStartSession = (taskId: string | null, mode: 'COUNTDOWN' | 'STOPWATCH', duration: number) => {
      setActiveSession({ startTime: Date.now(), taskId, mode, initialDurationMinutes: duration });
  };
  const handleStopSession = () => {
      if (!activeSession) return;
      const now = Date.now();
      const elapsedMinutes = Math.ceil(((now - activeSession.startTime) / 1000) / 60);
      if (elapsedMinutes >= 1) {
          setState(prev => {
             const newHistory = [...prev.focusHistory, { date: new Date().toISOString(), durationMinutes: elapsedMinutes, taskId: activeSession.taskId || undefined }];
             let newTasks = prev.tasks;
             if (activeSession.taskId) {
                 newTasks = prev.tasks.map(t => t.id === activeSession.taskId ? { ...t, pomodoroSessions: t.pomodoroSessions + 1, totalTimeSpent: t.totalTimeSpent + elapsedMinutes } : t);
             }
             return { ...prev, focusHistory: newHistory, tasks: newTasks };
          });
      }
      setActiveSession(null);
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Edit existing
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t)
      }));
    } else {
      // Create new
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title || 'New Task',
        type: taskData.type || TaskType.FIXED,
        category: taskData.category || TaskCategory.OTHER,
        priority: taskData.priority || Priority.MEDIUM,
        dueDate: taskData.dueDate,
        isCompleted: false,
        createdAt: Date.now(),
        streak: 0,
        pomodoroSessions: 0,
        totalTimeSpent: 0
      };
      setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    }
  };

  const handleDeleteTask = (taskId: string) => { 
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) })); 
  };

  const handleSaveInspiration = (text: string, location: string) => {
    const newInspiration: Inspiration = {
      id: crypto.randomUUID(),
      content: text,
      createdAt: new Date().toISOString(),
      location: location
    };
    setState(prev => ({ ...prev, inspirations: [newInspiration, ...prev.inspirations] }));
  };

  const handleDeleteInspiration = (id: string) => {
    setState(prev => ({ ...prev, inspirations: prev.inspirations.filter(i => i.id !== id) }));
  };

  const handleDeleteJournal = (id: string) => {
    setState(prev => ({ ...prev, journalEntries: prev.journalEntries.filter(j => j.id !== id) }));
  };

  const checkAchievements = async (task: Task) => {
    if (task.type === TaskType.FIXED && task.streak > 0 && task.streak % 7 === 0) {
      const art = await generateAchievementArt(task.title, task.streak, false);
      if (art) setState(prev => ({ ...prev, achievements: [{ id: crypto.randomUUID(), title: `${task.streak} Days`, description: `Consistent ${task.title}`, imageUrl: art, dateEarned: new Date().toISOString(), type: 'CARD', rarity: 'RARE' }, ...prev.achievements] }));
    }
  };
  
  const toggleTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    const willBeCompleted = !task.isCompleted;
    setState(prev => {
      const updatedTasks = prev.tasks.map(t => t.id !== taskId ? t : { ...t, isCompleted: willBeCompleted, streak: t.type === TaskType.FIXED ? (willBeCompleted ? t.streak + 1 : Math.max(0, t.streak - 1)) : t.streak });
      const updatedResources = { ...prev.planetResources };
      if (willBeCompleted) updatedResources[task.category] = (updatedResources[task.category] || 0) + 1;
      return { ...prev, tasks: updatedTasks, planetResources: updatedResources };
    });
    if (willBeCompleted) checkAchievements({ ...task, streak: task.streak + 1 });
  };

  const fixedTasks = state.tasks.filter(t => t.type === TaskType.FIXED);
  const flexibleTasks = state.tasks.filter(t => t.type === TaskType.FLEXIBLE);
  const completedFixedCount = fixedTasks.filter(t => t.isCompleted).length;

  // Next unlock helper
  const totalTasks = state.tasks.filter(t => t.isCompleted || (t.type === TaskType.FIXED && t.streak > 0)).length;
  const totalFocus = state.focusHistory.reduce((sum, s) => sum + s.durationMinutes, 0);
  const nextTier = PLANET_TIERS.find(t => !state.unlockedPlanets.includes(t.type));
  const nextUnlockData = nextTier ? { type: nextTier.type, reqTasks: nextTier.reqTasks, reqFocus: nextTier.reqFocus, currentTasks: totalTasks, currentFocus: totalFocus } : undefined;

  const todayDate = new Date();

  return (
    <div className="flex flex-col h-screen w-full bg-paper text-stone-700 overflow-hidden font-sans">
      
      {/* --- High End Editorial Header --- */}
      <header className="flex flex-col items-center pt-8 pb-4 px-6 relative z-30 bg-paper/90 backdrop-blur-sm border-b border-stone-200/50 transition-all duration-300">
         
         {/* Top Row: Date & Actions */}
         <div className="w-full max-w-7xl flex justify-between items-start absolute top-6 px-6 sm:px-12 pointer-events-none">
            <div className="pointer-events-auto">
                {/* Big Artistic Date */}
                <div className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-display font-medium text-stone-300 leading-none tracking-tighter">
                        {todayDate.getDate()}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 pl-1 mt-1">
                        {todayDate.toLocaleString('default', { month: 'long' })}
                    </span>
                </div>
            </div>
            
            <div className="pointer-events-auto flex items-center gap-4">
                 <button 
                    onClick={() => setShowInspiration(true)}
                    className="group relative px-5 py-2.5 rounded-full bg-stone-900 text-banana transition-all hover:bg-stone-800 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-95 flex items-center gap-2 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Sparkles size={14} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Spark</span>
                </button>
            </div>
         </div>

         {/* Center: Title & Quote */}
         <div className="flex flex-col items-center text-center mt-2 mb-6 max-w-2xl px-4">
            <h1 className="text-2xl md:text-3xl font-display font-light text-stone-900 tracking-wide mb-3">
                Jiake <span className="text-stone-300 font-light mx-2">/</span> Orbit
            </h1>
            {state.dailyQuote && (
                <div className="flex flex-col items-center animate-in fade-in duration-700">
                    <p className="text-sm md:text-base font-serif italic text-stone-500 leading-relaxed text-center">
                        "{state.dailyQuote.text}"
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 mt-1.5 opacity-60">
                         {state.dailyQuote.author}
                    </span>
                </div>
            )}
         </div>

         {/* Bottom: Centered Navigation */}
         <nav className="flex items-center gap-2 bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200/50 shadow-sm backdrop-blur-md">
            <button 
                onClick={() => setCurrentView('tasks')} 
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${currentView === 'tasks' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}
            >
                <Layers size={14} strokeWidth={2.5} /> Dashboard
            </button>
            <div className="w-px h-4 bg-stone-200"></div>
            <button 
                onClick={() => setCurrentView('stats')} 
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${currentView === 'stats' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}
            >
                <BarChart3 size={14} strokeWidth={2.5} /> Analytics
            </button>
            <div className="w-px h-4 bg-stone-200"></div>
            <button 
                onClick={() => setCurrentView('trophies')} 
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${currentView === 'trophies' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-white/50'}`}
            >
                <Trophy size={14} strokeWidth={2.5} /> Gallery
            </button>
         </nav>

      </header>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {currentView === 'stats' ? (
          <FocusStats 
            history={state.focusHistory} 
            tasks={state.tasks} 
            journalEntries={state.journalEntries}
            onClose={() => setCurrentView('tasks')} 
          />
        ) : currentView === 'trophies' ? (
          <NotebookView 
            achievements={state.achievements}
          />
        ) : (
          /* DASHBOARD VIEW */
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 md:px-12 pb-24 custom-scrollbar pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                  
                  {/* Left: Tasks */}
                  <div className="lg:col-span-7 space-y-12">
                    
                    {/* Visual Planet */}
                    <UniverseDisplay 
                        currentPlanet={state.currentPlanet}
                        unlockedPlanets={state.unlockedPlanets}
                        resources={state.planetResources}
                        onNavigate={(dir) => { 
                            const idx = state.unlockedPlanets.indexOf(state.currentPlanet);
                            const newIdx = dir === 'next' ? idx + 1 : idx - 1;
                            if (state.unlockedPlanets[newIdx]) setState({...state, currentPlanet: state.unlockedPlanets[newIdx]})
                        }}
                        nextUnlock={nextUnlockData}
                    />

                    {/* Fixed Habits */}
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 border-b border-stone-200 pb-2 flex justify-between">
                            <span>Daily Rituals</span>
                            <span>{completedFixedCount}/{fixedTasks.length}</span>
                        </h2>
                        <div className="space-y-0">
                            {fixedTasks.map(task => (
                                <div key={task.id} className="group py-4 border-b border-stone-100 flex items-center gap-6 hover:bg-white transition-colors px-4 -mx-4 rounded-lg relative">
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        className={`relative w-6 h-6 rounded-full border transition-all duration-500 flex items-center justify-center overflow-hidden flex-shrink-0 ${task.isCompleted ? 'border-banana' : 'border-stone-300 hover:border-banana'}`}
                                    >
                                        <div className={`absolute inset-0 bg-banana transition-transform duration-500 ease-out origin-bottom ${task.isCompleted ? 'scale-y-100' : 'scale-y-0'}`}></div>
                                        <Check size={14} strokeWidth={3} className={`relative z-10 text-stone-800 transform transition-all duration-300 ${task.isCompleted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                                    </button>
                                    <div className="flex-1">
                                        <span className={`text-lg font-medium transition-all duration-500 ${task.isCompleted ? 'text-stone-300 line-through decoration-stone-200' : 'text-stone-700'}`}>
                                            {task.title}
                                        </span>
                                        <div className="flex gap-3 mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${PRIORITY_COLORS[task.priority]} bg-opacity-30`}>{task.priority}</span>
                                            <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">{CATEGORY_ICONS[task.category]} streak: {task.streak}</span>
                                            {task.dueDate && <span className="text-[10px] text-stone-400 flex items-center gap-1"><Calendar size={10} /> {task.dueDate}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEditModal(task)} className="p-2 text-stone-300 hover:text-stone-600 transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-stone-300 hover:text-rose-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {fixedTasks.length === 0 && <p className="text-stone-400 italic text-sm py-4">No rituals established.</p>}
                        </div>
                    </div>

                    {/* Missions */}
                    <div>
                        <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">Missions</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {flexibleTasks.map(task => (
                                <div key={task.id} className={`p-5 border rounded-xl transition-all duration-500 group ${task.isCompleted ? 'bg-stone-50 border-stone-100 opacity-60' : 'bg-white border-stone-100 hover:border-stone-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'}`}>
                                    <div className="flex items-start gap-4">
                                        <button 
                                            onClick={() => toggleTask(task.id)} 
                                            className={`mt-1 w-5 h-5 rounded-full border transition-all flex-shrink-0 ${task.isCompleted ? 'bg-stone-300 border-stone-300' : 'border-stone-300 hover:border-stone-400'}`}
                                        ></button>
                                        <div className="flex-1">
                                            <p className={`font-medium transition-colors ${task.isCompleted ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{task.title}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${PRIORITY_COLORS[task.priority]} bg-opacity-30`}>{task.priority}</span>
                                                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded flex items-center gap-1">{CATEGORY_ICONS[task.category]} {task.category}</span>
                                                {task.dueDate && <span className="text-[10px] text-stone-400 flex items-center gap-1"><Calendar size={10} /> {task.dueDate}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenEditModal(task)} className="p-2 text-stone-300 hover:text-stone-600 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-stone-300 hover:text-rose-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleOpenAddModal}
                            className="w-full mt-6 py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-bold text-sm uppercase tracking-wider hover:border-banana hover:text-banana-dark hover:bg-banana/5 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Plus size={18} className="group-hover:scale-110 transition-transform" /> New Entry
                        </button>
                    </div>

                  </div>

                  {/* Right: Tools */}
                  <div className="lg:col-span-5 space-y-8">
                    <PomodoroTimer 
                        tasks={[...fixedTasks, ...flexibleTasks]}
                        activeSession={activeSession}
                        onStart={handleStartSession}
                        onStop={handleStopSession}
                    />

                    <button
                        onClick={() => setShowJournal(true)}
                        className="w-full bg-[#1e293b] text-[#FEF3C7] p-8 rounded-[2rem] text-left hover:scale-[1.02] transition-transform shadow-xl shadow-slate-200 group relative overflow-hidden border border-slate-700"
                    >
                        <div className="relative z-10">
                            <BookOpen size={32} strokeWidth={1} className="mb-4 text-banana" />
                            <h3 className="font-serif text-2xl italic">Evening Reflection</h3>
                            <p className="text-slate-400 text-sm mt-2 font-light">Capture the day's essence.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Mic size={120} strokeWidth={0.5} />
                        </div>
                    </button>
                  </div>

                </div>
            </div>
        )}

        {/* Modals */}
        {showJournal && (
          <Journal 
            completedTasks={fixedTasks.filter(t => t.isCompleted)} 
            fixedTasksTotal={fixedTasks.length} 
            onSaveEntry={(entry) => setState(prev => ({...prev, journalEntries: [ {id: crypto.randomUUID(), ...entry}, ...prev.journalEntries ]}))} 
            onClose={() => setShowJournal(false)}
            history={state.journalEntries}
            onDeleteEntry={handleDeleteJournal}
          />
        )}
        <TaskFormModal 
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleSaveTask}
            initialData={editingTask}
        />
        
        <InspirationModal 
            isOpen={showInspiration}
            onClose={() => setShowInspiration(false)}
            onSave={handleSaveInspiration}
            history={state.inspirations}
            onDelete={handleDeleteInspiration}
        />

      </main>
    </div>
  );
};

export default App;
