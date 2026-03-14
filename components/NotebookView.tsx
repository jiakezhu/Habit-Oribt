
import React from 'react';
import { Achievement } from '../types';
import { Trophy } from 'lucide-react';

interface NotebookViewProps {
  achievements: Achievement[];
}

export const NotebookView: React.FC<NotebookViewProps> = ({ 
  achievements, 
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-paper animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-paper/90 backdrop-blur-md border-b border-stone-200 px-8 py-6 text-center">
         <h1 className="text-3xl font-display font-light text-stone-900 flex items-center justify-center gap-3">
            <Trophy className="text-banana" size={24} />
            Achievement Gallery
         </h1>
         <p className="text-stone-400 text-xs uppercase tracking-widest mt-2">
            Honoring consistency & discipline
         </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {achievements.map(ach => (
                    <div key={ach.id} className="bg-white p-4 pb-6 border border-stone-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 group rounded-xl">
                        <div className="aspect-[3/4] overflow-hidden bg-stone-50 mb-4 rounded-lg filter grayscale group-hover:grayscale-0 transition-all duration-700 relative">
                            <img src={ach.imageUrl} className="w-full h-full object-cover" alt={ach.title} />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-lg"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-display font-bold text-lg text-stone-800">{ach.title}</h3>
                            <p className="font-serif text-xs italic text-stone-400 mt-1 line-clamp-2">{ach.description}</p>
                            <span className="inline-block mt-3 text-[9px] uppercase tracking-widest border border-stone-100 bg-stone-50 px-3 py-1 rounded-full text-stone-400 group-hover:bg-banana/20 group-hover:text-stone-600 transition-colors">
                                {ach.rarity}
                            </span>
                        </div>
                    </div>
                ))}
                {achievements.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-50">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                            <Trophy size={40} className="text-stone-300" strokeWidth={1} />
                        </div>
                        <p className="text-stone-500 font-serif text-xl italic">The gallery is waiting for your triumphs.</p>
                        <p className="text-stone-400 text-sm mt-2">Complete habit streaks to unlock art.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
