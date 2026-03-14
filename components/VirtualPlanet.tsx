import React from 'react';
import { TaskCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface VirtualPlanetProps {
  resources: { [key in TaskCategory]: number };
}

export const VirtualPlanet: React.FC<VirtualPlanetProps> = ({ resources }) => {
  // Simple logic to determine if a building/feature exists on the planet based on resources
  const hasLibrary = resources[TaskCategory.LEARNING] >= 1;
  const hasGym = resources[TaskCategory.SPORTS] >= 1;
  const hasStudio = resources[TaskCategory.CREATIVE] >= 1;
  const hasGarden = resources[TaskCategory.MINDFULNESS] >= 1;
  const hasOffice = resources[TaskCategory.WORK] >= 1;

  return (
    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden bg-slate-900 rounded-3xl border border-slate-700/50 shadow-inner">
      {/* Stars Background */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* The Planet */}
      <div className="relative w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-800 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] z-10 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        {/* Atmosphere */}
        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl"></div>
        
        {/* Orbit Ring */}
        <div className="absolute w-72 h-72 border border-slate-600/30 rounded-full planet-orbit pointer-events-none">
            {/* Satellites or floating islands could go here */}
            {hasStudio && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-2xl planet-item">🎨</div>}
        </div>

        {/* Planet Surface Items (Fixed relative to planet but could animate) */}
        <div className="grid grid-cols-2 gap-4 text-3xl">
            {hasLibrary && <span className="animate-bounce delay-75" title={`Library (Lvl ${resources[TaskCategory.LEARNING]})`}>🏛️</span>}
            {hasGym && <span className="animate-bounce delay-150" title={`Sports Park (Lvl ${resources[TaskCategory.SPORTS]})`}>🏟️</span>}
            {hasGarden && <span className="animate-bounce delay-300" title={`Zen Garden (Lvl ${resources[TaskCategory.MINDFULNESS]})`}>⛲</span>}
            {hasOffice && <span className="animate-bounce delay-500" title={`Tech Hub (Lvl ${resources[TaskCategory.WORK]})`}>🏢</span>}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-xs text-slate-400">
        <p className="font-bold">Planet Status</p>
        <div className="flex gap-2 mt-1">
          {Object.entries(resources).map(([cat, val]) => (
            (val as number) > 0 && <span key={cat} title={cat}>{CATEGORY_ICONS[cat as TaskCategory]} {val}</span>
          ))}
        </div>
      </div>
    </div>
  );
};