
import React from 'react';
import { PlanetType, TaskCategory } from '../types';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

interface UniverseDisplayProps {
  currentPlanet: PlanetType;
  unlockedPlanets: PlanetType[];
  resources: { [key in TaskCategory]: number };
  onNavigate: (direction: 'prev' | 'next') => void;
  nextUnlock?: { type: PlanetType; reqTasks: number; reqFocus: number; currentTasks: number; currentFocus: number };
}

// Low Poly Color Themes (Hard-edged faceted gradients)
const POLY_THEMES: Record<PlanetType, string> = {
  [PlanetType.PROTO_EARTH]: 'conic-gradient(from 0deg, #60a5fa 0deg 45deg, #3b82f6 45deg 90deg, #2563eb 90deg 135deg, #1d4ed8 135deg 180deg, #1e40af 180deg 225deg, #1e3a8a 225deg 270deg, #172554 270deg 315deg, #93c5fd 315deg 360deg)',
  [PlanetType.GREEN_GAIA]: 'conic-gradient(from 15deg, #34d399 0deg 60deg, #10b981 60deg 120deg, #059669 120deg 180deg, #047857 180deg 240deg, #065f46 240deg 300deg, #022c22 300deg 360deg)',
  [PlanetType.AQUA_PRIME]: 'conic-gradient(from 45deg, #22d3ee 0deg 60deg, #06b6d4 60deg 120deg, #0891b2 120deg 180deg, #155e75 180deg 240deg, #164e63 240deg 300deg, #083344 300deg 360deg)',
  [PlanetType.CRIMSON_MARS]: 'conic-gradient(from 0deg, #f87171 0deg 60deg, #ef4444 60deg 120deg, #dc2626 120deg 180deg, #b91c1c 180deg 240deg, #7f1d1d 240deg 300deg, #450a0a 300deg 360deg)',
  [PlanetType.GOLDEN_CORE]: 'conic-gradient(from 30deg, #fbbf24 0deg 60deg, #f59e0b 60deg 120deg, #d97706 120deg 180deg, #b45309 180deg 240deg, #92400e 240deg 300deg, #451a03 300deg 360deg)',
  [PlanetType.CYBER_TRON]: 'conic-gradient(from 90deg, #a78bfa 0deg 60deg, #8b5cf6 60deg 120deg, #7c3aed 120deg 180deg, #6d28d9 180deg 240deg, #5b21b6 240deg 300deg, #2e1065 300deg 360deg)',
};

export const UniverseDisplay: React.FC<UniverseDisplayProps> = ({ 
  currentPlanet, 
  unlockedPlanets, 
  resources,
  onNavigate,
  nextUnlock 
}) => {
  const currentIndex = unlockedPlanets.indexOf(currentPlanet);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === unlockedPlanets.length - 1;
  const gradient = POLY_THEMES[currentPlanet];

  // Calculate "Prosperity" based on total resources for dynamic glow
  const totalResources = (Object.values(resources) as number[]).reduce((a, b) => a + b, 0);
  const glowIntensity = Math.min(100, 20 + totalResources * 2); // Cap at 100
  const glowColor = currentPlanet === PlanetType.GREEN_GAIA ? 'rgba(16, 185, 129,' : 'rgba(255, 255, 255,';

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden bg-[#1C1917] rounded-[2rem] shadow-2xl group border border-stone-800">
      
      {/* Background - Minimalist dark void with subtle particles */}
      <div className="absolute inset-0">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#57534E 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
        <button 
          onClick={() => onNavigate('prev')} 
          disabled={isFirst}
          className={`p-3 rounded-full text-stone-400 border border-stone-700 pointer-events-auto transition-all hover:border-stone-500 hover:text-stone-200 active:scale-95 ${isFirst ? 'opacity-0' : 'opacity-100'}`}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => onNavigate('next')} 
          disabled={isLast}
          className={`p-3 rounded-full text-stone-400 border border-stone-700 pointer-events-auto transition-all hover:border-stone-500 hover:text-stone-200 active:scale-95 ${isLast ? 'opacity-0' : 'opacity-100'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Low Poly Planet */}
      <div className="relative z-10 w-48 h-48 animate-float">
        
        {/* Dynamic Glow - based on resources */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
          style={{ backgroundColor: `${glowColor} ${glowIntensity / 200})`, transform: `scale(${1 + glowIntensity/200})` }}
        ></div>

        {/* The Faceted Hexagon Shape (CSS Poly) */}
        <div 
            className="w-full h-full planet-poly transition-all duration-1000 rotate-12 hover:rotate-45 relative shadow-[inset_-10px_-10px_40px_rgba(0,0,0,0.5)]"
            style={{ background: gradient }}
        >
             {/* Overlay for sharp facets feel */}
             <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)' }}></div>
             <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply" style={{ clipPath: 'polygon(50% 50%, 0% 100%, 100% 100%)' }}></div>
        </div>

        {/* Orbital Particle Ring - Dashed low poly vibe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] border border-dashed border-stone-700/50 rounded-full animate-[spin_60s_linear_infinite]">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-stone-500 rounded-sm rotate-45"></div>
            {totalResources > 5 && <div className="absolute bottom-0 right-1/2 w-2 h-2 bg-stone-600 rounded-sm rotate-12"></div>}
        </div>
      </div>

      {/* Planet Label */}
      <div className="absolute bottom-6 text-center z-20">
        <h3 className="text-xl font-bold text-stone-200 tracking-widest uppercase font-display">{currentPlanet}</h3>
        <p className="text-stone-500 text-[10px] mt-1 font-mono uppercase tracking-[0.2em]">
            System unlocked • Bio-level: {totalResources}
        </p>
      </div>

      {/* Next Unlock Progress - Minimalist */}
      {isLast && nextUnlock && (
         <div className="absolute top-6 right-6 bg-stone-900/80 backdrop-blur border border-stone-800 rounded-xl p-3 w-40 z-30">
            <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold mb-2 uppercase tracking-wider">
                <Lock size={10} /> Next: {nextUnlock.type}
            </div>
            <div className="space-y-2">
                <div className="w-full bg-stone-800 rounded-full h-1">
                    <div className="bg-stone-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (nextUnlock.currentTasks/nextUnlock.reqTasks)*100)}%` }}></div>
                </div>
                <div className="w-full bg-stone-800 rounded-full h-1">
                    <div className="bg-banana h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (nextUnlock.currentFocus/nextUnlock.reqFocus)*100)}%` }}></div>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};
