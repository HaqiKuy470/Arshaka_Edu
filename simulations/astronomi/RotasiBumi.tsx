"use client";

import { useState } from "react";

export default function RotasiBumi() {
  const [view, setView] = useState<"rotasi"|"revolusi">("rotasi");
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Rotasi & Revolusi Bumi</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Membedakan perputaran Bumi pada sumbunya vs mengelilingi Matahari.
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[450px] flex items-center justify-center overflow-hidden">
           
           {/* Toggle Controls inside canvas */}
           <div className="absolute top-6 flex bg-black/50 p-1 rounded-lg border border-white/10 z-30">
              <button 
                 onClick={() => setView("rotasi")}
                 className={`px-4 py-1 text-sm font-bold rounded ${view === 'rotasi' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
              >
                 Rotasi (Siang & Malam)
              </button>
              <button 
                 onClick={() => setView("revolusi")}
                 className={`px-4 py-1 text-sm font-bold rounded ${view === 'revolusi' ? 'bg-amber-600 text-white' : 'text-zinc-400'}`}
              >
                 Revolusi (Musim)
              </button>
           </div>

           {view === "rotasi" && (
              <div className="relative w-full h-full flex items-center justify-center">
                 {/* Light Source Right */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-yellow-500/20 to-transparent pointer-events-none" />
                 
                 {/* The Earth */}
                 <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-zinc-700 shadow-[0_0_30px_rgba(59,130,246,0.3)]`}>
                    
                    {/* Earth Texture / Map moving to simulate rotation */}
                    <div className={`absolute inset-0 bg-blue-500 w-[200%] ${isPlaying ? 'animate-[slide-left_10s_linear_infinite]' : ''}`} style={{
                       backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 30 Q40 10 60 40 T90 20 L90 60 Q70 80 50 60 T10 80 Z\' fill=\'%2310b981\' opacity=\'0.8\'/%3E%3C/svg%3E")',
                       backgroundSize: '150px 150px'
                    }} />

                    {/* Day / Night Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent w-[55%]" />
                    
                 </div>

                 {/* Axial Tilt Line */}
                 <div className="absolute w-[2px] h-80 bg-red-500/50 rotate-[23.5deg] z-20 pointer-events-none" />
                 <div className="absolute top-10 left-[60%] text-red-400 font-bold text-xs rotate-[23.5deg]">Kemiringan 23.5°</div>

                 {/* Labels */}
                 <div className="absolute left-8 text-zinc-400 font-bold uppercase tracking-widest text-sm">Malam</div>
                 <div className="absolute right-8 text-yellow-400 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_10px_yellow]">Siang</div>
              </div>
           )}

           {view === "revolusi" && (
              <div className="relative w-full h-full flex items-center justify-center mt-8">
                 
                 {/* The Sun */}
                 <div className="absolute w-16 h-16 bg-yellow-500 rounded-full shadow-[0_0_50px_yellow] z-20" />

                 {/* Orbit Path */}
                 <div className="absolute w-[80%] h-[60%] border-2 border-white/10 rounded-full border-dashed z-0" />

                 {/* Earth Revolve Container */}
                 <div className={`absolute w-[80%] h-[60%] z-10 ${isPlaying ? 'animate-[spin_15s_linear_infinite]' : ''}`}>
                    {/* Earth */}
                    <div className="absolute top-0 left-1/2 w-8 h-8 bg-blue-500 rounded-full border border-blue-300 shadow-[0_0_10px_blue] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                       {/* Earth Axial Tilt (Always points to one side, e.g., North star) - We counter-spin the content to keep tilt direction absolute */}
                       <div className={`w-[2px] h-12 bg-red-500 absolute rotate-[23.5deg] ${isPlaying ? 'animate-[spin_15s_linear_infinite_reverse]' : ''}`} />
                    </div>
                 </div>

              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
           <h3 className="font-semibold text-white">Informasi Fisika</h3>
           <button onClick={()=>setIsPlaying(!isPlaying)} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {view === "rotasi" && (
             <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-500/30">
                   <h4 className="font-bold text-blue-400 mb-2">Rotasi Bumi</h4>
                   <p className="text-xs text-zinc-300 leading-relaxed mb-2">Perputaran Bumi pada sumbunya (porosnya) dari Barat ke Timur.</p>
                   <ul className="list-disc pl-4 text-[10px] text-zinc-400 space-y-1">
                      <li><strong>Waktu:</strong> 23 jam 56 menit (1 Hari)</li>
                      <li><strong>Efek 1:</strong> Terjadinya Siang dan Malam.</li>
                      <li><strong>Efek 2:</strong> Gerak semu harian matahari (seolah terbit di Timur, tenggelam di Barat).</li>
                      <li><strong>Efek 3:</strong> Perbedaan waktu antar wilayah di Bumi.</li>
                   </ul>
                </div>
             </div>
          )}

          {view === "revolusi" && (
             <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-500/30">
                   <h4 className="font-bold text-amber-400 mb-2">Revolusi Bumi</h4>
                   <p className="text-xs text-zinc-300 leading-relaxed mb-2">Pergerakan Bumi mengelilingi Matahari pada orbit elipsnya.</p>
                   <ul className="list-disc pl-4 text-[10px] text-zinc-400 space-y-1">
                      <li><strong>Waktu:</strong> 365,25 hari (1 Tahun / Tahun Kabisat)</li>
                      <li><strong>Efek 1:</strong> Pergantian Musim. Karena Bumi miring 23.5°, bagian utara dan selatan bergantian mendapat sinar dominan.</li>
                      <li><strong>Efek 2:</strong> Perbedaan lamanya siang dan malam di negara lintang tinggi (seperti Eropa).</li>
                      <li><strong>Efek 3:</strong> Rasi bintang yang tampak berbeda setiap bulannya.</li>
                   </ul>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
