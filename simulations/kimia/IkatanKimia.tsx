"use client";

import { useState } from "react";

export default function IkatanKimia() {
  const [distance, setDistance] = useState(100);

  const isBonded = distance < 30;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-zinc-950">
      <div className="flex-1 relative flex items-center justify-center p-8">
        
        <div className="relative w-full max-w-md h-64 flex items-center justify-center">
          
          {/* Atom 1 (Na) */}
          <div 
            className="absolute flex items-center justify-center transition-all duration-300 z-10"
            style={{ transform: `translateX(-${distance}px)` }}
          >
            <div className={`w-24 h-24 rounded-full border-2 ${isBonded ? 'border-green-500 bg-green-500/20' : 'border-zinc-500 bg-zinc-800'} flex items-center justify-center shadow-lg transition-colors`}>
              <span className="font-bold text-xl">Na</span>
              {!isBonded && <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] animate-pulse" />}
            </div>
          </div>

          {/* Atom 2 (Cl) */}
          <div 
            className="absolute flex items-center justify-center transition-all duration-300"
            style={{ transform: `translateX(${distance}px)` }}
          >
            <div className={`w-32 h-32 rounded-full border-2 ${isBonded ? 'border-green-500 bg-green-500/20' : 'border-zinc-500 bg-zinc-800'} flex items-center justify-center shadow-lg transition-colors`}>
              <span className="font-bold text-2xl">Cl</span>
              {/* Chlorine has 7 valence electrons, we just show a few for illustration */}
              <div className="absolute top-2 left-4 w-4 h-4 bg-yellow-400 rounded-full" />
              <div className="absolute bottom-2 left-4 w-4 h-4 bg-yellow-400 rounded-full" />
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-yellow-400 rounded-full" />
              
              {isBonded && <div className="absolute top-1/2 -left-2 w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15] scale-125 transition-all" title="Shared/Transferred Electron" />}
            </div>
          </div>

          {isBonded && (
            <div className="absolute top-12 text-green-400 font-bold bg-green-900/40 px-4 py-1 rounded-full border border-green-500/30 animate-pulse">
              Ikatan Ionik Terbentuk! (NaCl)
            </div>
          )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Ikatan Kimia</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <p className="text-sm text-zinc-400">Dekatkan kedua atom untuk melihat bagaimana elektron valensi berinteraksi dan membentuk ikatan ionik.</p>
          
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jarak Antar Atom</label></div>
            <input 
              type="range" 
              className="w-full accent-indigo-500" 
              min="0" max="150" 
              value={distance} 
              onChange={(e) => setDistance(parseInt(e.target.value))} 
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Dekat</span><span>Jauh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
