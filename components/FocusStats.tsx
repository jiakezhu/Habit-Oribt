
import React, { useMemo } from 'react';
import { FocusSession, Task, JournalEntry, TaskCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { X, Clock, CheckCircle2, Flame, TrendingUp, CalendarDays, PieChart, Activity } from 'lucide-react';

interface FocusStatsProps {
  history: FocusSession[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  onClose: () => void;
}

export const FocusStats: React.FC<FocusStatsProps> = ({ history, tasks, journalEntries, onClose }) => {
  
  const stats = useMemo(() => {
    // 1. Total Focus
    const totalMinutes = history.reduce((sum, h) => sum + h.durationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // 2. Task Completion Rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 3. Category Breakdown
    const categoryMins: Record<string, number> = {};
    history.forEach(h => {
        let cat = 'Other';
        if (h.taskId) {
            const t = tasks.find(task => task.id === h.taskId);
            if (t) cat = t.category;
        }
        categoryMins[cat] = (categoryMins[cat] || 0) + h.durationMinutes;
    });

    // 4. Weekly Trend (Last 7 Days)
    const days = 7;
    const now = new Date();
    const trendData = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (days - 1 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const val = history
            .filter(h => h.date.startsWith(dateStr))
            .reduce((s, x) => s + x.durationMinutes, 0);
        return { date: dateStr, name: dayName, val };
    });

    // 5. Heatmap Data (Last 90 Days)
    const heatmapDays = 90; // Approx 3 months
    const heatmapData = Array.from({ length: heatmapDays }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (heatmapDays - 1 - i));
        const dateStr = d.toISOString().split('T')[0];
        const minutes = history
            .filter(h => h.date.startsWith(dateStr))
            .reduce((s, x) => s + x.durationMinutes, 0);
        
        let intensity = 0;
        if (minutes > 0) intensity = 1;
        if (minutes > 30) intensity = 2;
        if (minutes > 60) intensity = 3;
        if (minutes > 120) intensity = 4;

        return { date: dateStr, intensity, minutes };
    });

    // 6. Mood Stats
    const moodCounts: Record<string, number> = {};
    journalEntries.forEach(j => {
        moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
    });

    // 7. Longest Session
    const maxSession = Math.max(...history.map(h => h.durationMinutes), 0);

    return { 
        totalMinutes, 
        totalHours, 
        categoryMins, 
        trendData, 
        completionRate, 
        completedTasks, 
        totalTasks,
        heatmapData,
        moodCounts,
        maxSession
    };
  }, [history, tasks, journalEntries]);

  // Max value for chart scaling
  const maxTrendVal = Math.max(...stats.trendData.map(d => d.val), 60);

  return (
    <div className="flex flex-col h-full w-full bg-paper overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-paper/90 backdrop-blur-md border-b border-stone-200 px-8 py-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-display font-bold text-stone-900">Analytics Hub</h1>
            <p className="text-stone-400 text-sm uppercase tracking-widest mt-1">Productivity & Wellness Report</p>
        </div>
        <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors"
        >
            <X size={24} />
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
        
        {/* Top Row: Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Focus */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={80} className="text-banana-dark" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Focus</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-light text-stone-800 font-sans">{stats.totalHours}</span>
                        <span className="text-sm font-bold text-stone-400">hours</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-4 font-mono">
                        Best Session: {stats.maxSession}m
                    </p>
                </div>
            </div>

            {/* Task Completion */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 size={80} className="text-emerald-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Completion Rate</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-light text-stone-800 font-sans">{stats.completionRate}</span>
                        <span className="text-sm font-bold text-stone-400">%</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-4 font-mono">
                        {stats.completedTasks} / {stats.totalTasks} Tasks Done
                    </p>
                </div>
            </div>

             {/* Focus Count */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame size={80} className="text-rose-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Sessions</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-light text-stone-800 font-sans">{history.length}</span>
                        <span className="text-sm font-bold text-stone-400">total</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-4 font-mono">
                       Deep work intervals
                    </p>
                </div>
            </div>

            {/* Journal Entries */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={80} className="text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Reflections</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-light text-stone-800 font-sans">{journalEntries.length}</span>
                        <span className="text-sm font-bold text-stone-400">entries</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-4 font-mono">
                       Mindfulness log
                    </p>
                </div>
            </div>
        </div>

        {/* Second Row: Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Weekly Trend Bar Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800">
                        <TrendingUp size={20} className="text-banana-dark" /> Focus Velocity
                    </h3>
                    <span className="text-xs font-mono text-stone-400 uppercase">Last 7 Days</span>
                </div>
                
                <div className="h-64 w-full flex items-end justify-between gap-4">
                    {stats.trendData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-help relative">
                            {/* Tooltip */}
                            <div className="absolute -top-8 bg-stone-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.val} mins
                            </div>
                            
                            <div className="w-full relative rounded-t-xl bg-stone-100 overflow-hidden hover:bg-stone-200 transition-colors" style={{ height: '100%' }}>
                                <div 
                                    className="absolute bottom-0 w-full bg-banana hover:bg-banana-light transition-all duration-700 ease-out rounded-t-xl"
                                    style={{ height: `${(d.val / maxTrendVal) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-stone-400 mt-3">{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Allocation */}
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                 <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800 mb-6">
                    <PieChart size={20} className="text-banana-dark" /> Allocation
                </h3>
                <div className="space-y-5">
                    {(Object.entries(stats.categoryMins) as [string, number][])
                        .sort((a,b) => b[1] - a[1])
                        .map(([cat, mins]) => (
                            <div key={cat} className="group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-stone-600 flex items-center gap-2">
                                        {CATEGORY_ICONS[cat as TaskCategory] || '✨'} {cat}
                                    </span>
                                    <span className="text-stone-400 font-mono">{Math.round((mins/stats.totalMinutes)*100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-stone-800 group-hover:bg-banana transition-colors duration-300 rounded-full"
                                        style={{ width: `${(mins/stats.totalMinutes)*100}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-stone-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {mins} minutes spent
                                </div>
                            </div>
                    ))}
                    {Object.keys(stats.categoryMins).length === 0 && (
                        <p className="text-stone-400 italic text-sm">No focus data yet.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Third Row: Heatmap & Mood */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 90 Day Heatmap */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800">
                        <CalendarDays size={20} className="text-banana-dark" /> Consistency Map
                    </h3>
                    <div className="flex gap-2 text-[10px] text-stone-400 items-center">
                        <span>Less</span>
                        <div className="w-3 h-3 bg-stone-100 rounded-sm"></div>
                        <div className="w-3 h-3 bg-banana-light rounded-sm"></div>
                        <div className="w-3 h-3 bg-banana rounded-sm"></div>
                        <div className="w-3 h-3 bg-banana-dark rounded-sm"></div>
                        <span>More</span>
                    </div>
                </div>
                
                {/* Heatmap Grid */}
                <div className="flex flex-wrap gap-1.5 justify-start">
                    {stats.heatmapData.map((d, i) => (
                        <div 
                            key={i}
                            title={`${d.date}: ${d.minutes} mins`}
                            className={`w-4 h-4 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-help
                                ${d.intensity === 0 ? 'bg-stone-100' : ''}
                                ${d.intensity === 1 ? 'bg-banana-light/50' : ''}
                                ${d.intensity === 2 ? 'bg-banana-light' : ''}
                                ${d.intensity === 3 ? 'bg-banana' : ''}
                                ${d.intensity === 4 ? 'bg-banana-dark' : ''}
                            `}
                        ></div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-stone-400 font-serif italic text-right">Last 90 days activity</p>
            </div>

            {/* Mood Distribution */}
             <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                 <h3 className="flex items-center gap-2 text-lg font-bold text-stone-800 mb-6">
                    <Activity size={20} className="text-banana-dark" /> Mood Pulse
                </h3>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(stats.moodCounts).length > 0 ? (
                        Object.entries(stats.moodCounts).map(([mood, count]) => (
                            <div key={mood} className="px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between gap-3 flex-1 min-w-[40%]">
                                <span className="font-medium text-stone-700">{mood}</span>
                                <span className="bg-white px-2 py-1 rounded-md text-xs font-bold text-stone-400 shadow-sm">{count}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-stone-400 italic text-sm">No journal entries yet.</p>
                    )}
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};
