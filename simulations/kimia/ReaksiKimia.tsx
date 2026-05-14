"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";

export default function ReaksiKimia() {
  const [stage, setStage] = useState(0); // 0: empty, 1: reactant A, 2: Reactant B (reacting)

  const handleAddA = () => {
    if (stage === 0) setStage(1);
  };

  const handleAddB = () => {
    if (stage === 1) setStage(2);
  };

  const reset = () => setStage(0);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-zinc-950">
      <div className="flex-1 relative flex flex-col items-center justify-center p-8">
        
        <div className="relative w-64 h-80 border-4 border-t-0 border-white/30 rounded-b-3xl flex items-end justify-center overflow-hidden glass">
          
          {/* Reactant A */}
          <div className={`absolute bottom-0 w-full bg-sky-500/40 transition-all duration-1000 ${stage >= 1 ? 'h-1/2' : 'h-0'}`}>
            {stage === 1 && <div className="absolute inset-0 flex items-center justify-center text-sky-200 font-bold tracking-widest opacity-50">ZAT A</div>}
          </div>

          {/* Reactant B & Reaction */}
          <div className={`absolute bottom-0 w-full transition-all duration-1000 
            ${stage === 2 ? 'h-3/4 bg-purple-500/60' : 'h-0 bg-transparent'}
          `}>
            {stage === 2 && (
              <>
                {/* Reaction Bubbles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-white/40 rounded-full animate-float"
                    style={{
                      width: Math.random() * 15 + 5 + 'px',
                      height: Math.random() * 15 + 5 + 'px',
                      left: Math.random() * 100 + '%',
                      bottom: Math.random() * 100 + '%',
                      animationDuration: (Math.random() * 2 + 1) + 's',
                      animationDelay: Math.random() * 1 + 's'
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center text-purple-200 font-bold tracking-widest opacity-50">HASIL REAKSI</div>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Reaksi Kimia Dasar</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <p className="text-sm text-zinc-400">Tambahkan reaktan secara berurutan untuk melihat perubahan kimia yang terjadi secara visual.</p>
          
          <button 
            onClick={handleAddA}
            disabled={stage !== 0}
            className="w-full py-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:hover:bg-sky-600 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <FlaskConical className="w-5 h-5" /> 1. Tuangkan Zat A
          </button>

          <button 
            onClick={handleAddB}
            disabled={stage !== 1}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <FlaskConical className="w-5 h-5" /> 2. Tuangkan Zat B
          </button>

        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={reset} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200">Bersihkan Tabung</button>
        </div>
      </div>
    </div>
  );
}
