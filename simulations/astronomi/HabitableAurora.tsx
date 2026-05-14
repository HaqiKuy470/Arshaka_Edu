"use client";

import { useState } from "react";

export default function HabitableAurora() {
  const [distance, setDistance] = useState(50); // 0 (Close) to 100 (Far)

  // Calculate conditions based on distance from star
  // Star habitable zone is roughly 40-60
  const isTooHot = distance < 35;
  const isTooCold = distance > 65;
  const isHabitable = !isTooHot && !isTooCold;

  const getPlanetColor = () => {
     if (isTooHot) return "bg-red-600 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8),0_0_20px_red]";
     if (isTooCold) return "bg-cyan-200 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.4),0_0_10px_white]";
     return "bg-blue-500 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)]"; // Earth like
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Zona Layak Huni (Goldilocks Zone)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Mencari planet "Bumi Kedua" di mana air berwujud cair. Tidak terlalu panas, tidak terlalu dingin.
        </p>

        <div className="w-full max-w-4xl bg-black border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex items-center overflow-hidden">
           
           {/* Star (Sun) */}
           <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full shadow-[0_0_100px_rgba(234,179,8,0.5)] z-10" />

           {/* Habitable Zone Band (Green area) */}
           <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-emerald-500/10 border-x border-emerald-500/30 flex justify-center py-4">
              <span className="text-emerald-500/50 font-bold tracking-widest text-xl uppercase writing-vertical-lr rotate-180">Habitable Zone</span>
           </div>

           {/* Too Hot Zone */}
           <div className="absolute left-0 right-[70%] top-0 bottom-0 flex justify-center py-4 z-0">
              <span className="text-red-500/30 font-bold tracking-widest text-xl uppercase writing-vertical-lr rotate-180">Terlalu Panas</span>
           </div>

           {/* Too Cold Zone */}
           <div className="absolute left-[70%] right-0 top-0 bottom-0 flex justify-center py-4 z-0">
              <span className="text-cyan-500/30 font-bold tracking-widest text-xl uppercase writing-vertical-lr rotate-180">Terlalu Dingin (Es)</span>
           </div>

           {/* The Planet */}
           <div 
             className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full transition-all duration-500 z-20 flex items-center justify-center overflow-hidden border-2 ${isTooHot ? 'border-red-400' : isTooCold ? 'border-white' : 'border-blue-300'} ${getPlanetColor()}`}
             style={{ left: `${10 + (distance * 0.8)}%` }} // Map 0-100 to 10%-90% layout
           >
              {isHabitable && (
                 <>
                    <div className="absolute top-2 left-2 w-6 h-4 bg-green-500 rounded-full opacity-80" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full opacity-80" />
                    {/* Clouds */}
                    <div className="absolute top-4 right-2 w-4 h-2 bg-white/70 rounded-full" />
                 </>
              )}
              {isTooHot && (
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNjYjIxMjgiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDIgMloiIHN0cm9rZT0iI2QxMzQzOCIvPjwvc3ZnPg==')] opacity-50" />
              )}
              {isTooCold && (
                 <div className="absolute top-2 right-2 w-8 h-2 bg-white/90 rounded-full blur-[1px]" />
              )}
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Jarak Orbit Planet</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pindahkan Planet (Jarak dari Bintang)</div>
             <input 
               type="range" min="0" max="100" step="1" 
               value={distance} 
               onChange={e=>setDistance(parseInt(e.target.value))} 
               className={`w-full ${isTooHot ? 'accent-red-500' : isTooCold ? 'accent-cyan-400' : 'accent-emerald-500'}`} 
             />
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4 text-sm text-zinc-300 leading-relaxed mt-8">
             
             {isHabitable && (
                <div className="animate-fade-in border-l-4 border-emerald-500 pl-3">
                   <h4 className="font-bold text-emerald-400 mb-1">Zona Emas (Bumi)</h4>
                   <p>Suhu pas! Air dapat berwujud <strong>cair</strong> (lautan, sungai). Kehidupan seperti yang kita kenal sangat mungkin berevolusi di sini.</p>
                </div>
             )}

             {isTooHot && (
                <div className="animate-fade-in border-l-4 border-red-500 pl-3">
                   <h4 className="font-bold text-red-400 mb-1">Neraka Mendidih (Venus)</h4>
                   <p>Terlalu dekat dengan bintang. Semua air akan <strong>menguap</strong> menjadi gas. Permukaan bisa melelehkan timah.</p>
                </div>
             )}

             {isTooCold && (
                <div className="animate-fade-in border-l-4 border-cyan-400 pl-3">
                   <h4 className="font-bold text-cyan-400 mb-1">Gurun Beku (Mars/Pluto)</h4>
                   <p>Terlalu jauh. Cahaya dan panas tidak cukup. Semua air <strong>membeku</strong> menjadi es batu raksasa selamanya.</p>
                </div>
             )}

          </div>

          <div className="text-xs text-zinc-500 p-2 text-center border border-zinc-800 rounded">
             *Bintang yang lebih kecil (Katai Merah) memiliki zona layak huni yang lebih dekat. Bintang raksasa biru memiliki zona layak huni yang jauh lebih luar.
          </div>

        </div>
      </div>
    </div>
  );
}
