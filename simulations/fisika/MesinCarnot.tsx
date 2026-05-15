"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings } from "lucide-react";
import Link from "next/link";

export default function MesinCarnot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Reservoir Temperatures (Kelvin)
  const [Th, setTh] = useState(600); 
  const [Tc, setTc] = useState(300);

  // Simulation State (0 to 4 cycle phases)
  const [progress, setProgress] = useState(0); 
  const animationRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const step = () => {
        setProgress(p => (p + 0.01) % 4);
        animationRef.current = requestAnimationFrame(step);
      };
      animationRef.current = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning]);

  // Derived Values
  const efficiency = 1 - (Tc / Th);
  const phase = Math.floor(progress); // 0, 1, 2, 3
  const tPhase = progress % 1; // 0 to 1

  // P-V Calculation for Visualization
  // Stage 1 (Iso-Exp): V: 20 -> 50, P: 100 -> 40 (T = Th)
  // Stage 2 (Adia-Exp): V: 50 -> 80, P: 40 -> 15 (T -> Tc)
  // Stage 3 (Iso-Comp): V: 80 -> 32, P: 15 -> 37.5 (T = Tc)
  // Stage 4 (Adia-Comp): V: 32 -> 20, P: 37.5 -> 100 (T -> Th)
  
  let P = 0;
  let V = 0;
  
  if (phase === 0) { // Isothermal Expansion
    V = 20 + tPhase * 30;
    P = (Th * 10) / V;
  } else if (phase === 1) { // Adiabatic Expansion
    V = 50 + tPhase * 30;
    P = (Th * 10) / Math.pow(V, 1.4) * Math.pow(50, 0.4); 
  } else if (phase === 2) { // Isothermal Compression
    V = 80 - tPhase * 48;
    P = (Tc * 10) / V;
  } else { // Adiabatic Compression
    V = 32 - tPhase * 12;
    P = (Tc * 10) / Math.pow(V, 1.4) * Math.pow(32, 0.4);
  }

  // Animation Refs
  const reset = () => {
    setTh(600);
    setTc(300);
    setProgress(0);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Mesin Carnot</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Siklus Termodinamika • Efisiensi</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-black/20 overflow-hidden">
         
         {/* P-V Diagram Card */}
         <div className="absolute top-24 left-8 w-64 glass-card p-4 rounded-2xl border border-white/10 bg-black/40 z-10 hidden md:block animate-in slide-in-from-left duration-700">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Diagram P-V</span>
               <Activity className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="relative aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/5 p-2">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="10" y1="0" x2="10" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  {/* Ideal Cycle Path (Representative) */}
                  <path 
                    d="M 20 20 Q 35 40 50 60 Q 65 80 80 85 Q 50 85 32 75 Q 25 45 20 20" 
                    fill="rgba(56, 189, 248, 0.05)" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1" 
                    strokeDasharray="2"
                  />
                  
                  {/* Dynamic Tracer Dot */}
                  <circle 
                    cx={V} 
                    cy={100 - P} 
                    r="4" 
                    fill="#10b981" 
                    className="transition-all duration-100"
                    style={{ 
                       filter: 'drop-shadow(0 0 5px #10b981)'
                    }}
                  />
               </svg>
               <div className="absolute bottom-1 right-2 text-[8px] text-zinc-500 uppercase">Volume (V)</div>
               <div className="absolute top-2 left-1 text-[8px] text-zinc-500 uppercase transform -rotate-90 origin-bottom-left">Tekanan (P)</div>
            </div>
         </div>

         {/* Engine Visual */}
         <div className="relative flex flex-col items-center animate-in zoom-in duration-700">
            {/* Cylinder & Piston */}
            <div className="relative w-64 h-80 bg-zinc-900 border-x-8 border-b-8 border-zinc-800 rounded-b-[40px] overflow-hidden shadow-2xl">
               {/* Gas Fill */}
               <div 
                 className="absolute bottom-0 w-full transition-all duration-100"
                 style={{ 
                    height: `${V}%`,
                    backgroundColor: phase === 0 ? 'hsla(0, 100%, 50%, 0.15)' : phase === 2 ? 'hsla(220, 100%, 50%, 0.15)' : 'rgba(255,255,255,0.05)'
                 }}
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:15px_15px] opacity-10" />
               </div>

               {/* Insulation Shields (Adiabatic Stages) */}
               <div className={`absolute inset-0 border-[16px] border-zinc-700/50 transition-opacity duration-500 ${(phase === 1 || phase === 3) ? 'opacity-100' : 'opacity-0'}`} />

               {/* Piston */}
               <div 
                 className="absolute w-full h-10 bg-gradient-to-b from-zinc-600 to-zinc-800 border-b-4 border-zinc-900 transition-all duration-100 z-20 flex items-center justify-center shadow-xl"
                 style={{ bottom: `${V}%` }}
               >
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                  {/* Piston Rod */}
                  <div className="absolute bottom-full w-6 h-[400px] bg-zinc-700 border-x-4 border-zinc-900 flex justify-center">
                     <div className="w-1 h-full bg-white/5" />
                  </div>
               </div>
            </div>

            {/* Reservoir Indicators */}
            <div className="mt-12 flex items-center gap-16">
               <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${phase === 0 ? 'scale-110 opacity-100' : 'opacity-30'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
                     <Flame className="w-6 h-6 text-rose-500" />
                  </div>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Q_h (Input)</span>
               </div>
               <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${phase === 2 ? 'scale-110 opacity-100' : 'opacity-30'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center">
                     <Droplets className="w-6 h-6 text-sky-500" />
                  </div>
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Q_c (Output)</span>
               </div>
            </div>
         </div>

      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Efficiency Card */}
           <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">Efisiensi Siklus (η)</div>
              <div className="text-5xl font-black text-white">
                {(efficiency * 100).toFixed(1)}<span className="text-xl text-zinc-500">%</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${efficiency * 100}%` }} />
              </div>
           </div>

           {/* Current Process Card */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tahapan Siklus</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { id: 0, title: "Ekspansi Isotermal", color: "border-rose-500 text-rose-500" },
                   { id: 1, title: "Ekspansi Adiabatik", color: "border-zinc-500 text-zinc-500" },
                   { id: 2, title: "Kompresi Isotermal", color: "border-sky-500 text-sky-500" },
                   { id: 3, title: "Kompresi Adiabatik", color: "border-zinc-500 text-zinc-500" }
                 ].map(s => (
                   <div key={s.id} className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${phase === s.id ? `${s.color} bg-white/5` : 'border-white/5 text-zinc-600 opacity-50'}`}>
                      {s.id + 1}. {s.title}
                   </div>
                 ))}
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Thermometer className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Termal</span>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Reservoir Panas (Th): {Th} K</label>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                   min="400" max="1000" step="50" value={Th} 
                   onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (v > Tc) setTh(v);
                   }} 
                 />
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Reservoir Dingin (Tc): {Tc} K</label>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" 
                   min="100" max="400" step="50" value={Tc} 
                   onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (v < Th) setTc(v);
                   }} 
                 />
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Mesin Carnot adalah siklus termodinamika teoritis paling efisien, terdiri dari proses ekspansi/kompresi isotermal dan adiabatik reversibel."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Jeda Siklus' : 'Mulai Siklus'}
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
