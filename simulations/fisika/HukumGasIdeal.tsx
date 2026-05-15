"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight,Flame } from "lucide-react";
import Link from "next/link";

export default function HukumGasIdeal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [law, setLaw] = useState<"boyle" | "charles" | "gay_lussac">("boyle");
  
  // Base State (0-100 scale for inputs)
  const [inputVal, setInputVal] = useState(50); 

  // Physics Variables
  // P * V = n * R * T. We'll simplify nR = 1.
  let P = 1;
  let V = 1;
  let T = 300;

  if (law === "boyle") {
    // T constant (300K). Input controls V (20 to 100)
    T = 300;
    V = 20 + inputVal * 0.8; 
    P = (T * 10) / V;
  } else if (law === "charles") {
    // P constant (10 atm). Input controls T (100 to 500K)
    P = 10;
    T = 100 + inputVal * 4;
    V = (T * 10) / P;
  } else if (law === "gay_lussac") {
    // V constant (50 L). Input controls T (100 to 500K)
    V = 50;
    T = 100 + inputVal * 4;
    P = (T * 10) / V;
  }

  // Animation Refs
  const pistonPosRef = useRef(V);
  useEffect(() => {
    pistonPosRef.current = V;
  }, [V]);

  const reset = () => {
    setInputVal(50);
  };

  // Graph Data
  const generateGraphPoints = () => {
    const points = [];
    if (law === "boyle") {
      // P vs V (Inverse)
      for (let v = 20; v <= 100; v += 2) {
        const p = (300 * 10) / v;
        points.push(`${v * 2},${140 - p * 0.8}`);
      }
    } else {
      // P vs T or V vs T (Linear)
      for (let t = 100; t <= 500; t += 10) {
        const val = law === "charles" ? (t * 10) / 10 : (t * 10) / 50;
        points.push(`${(t - 100) * 0.5},${140 - val * 0.8}`);
      }
    }
    return points.join(" ");
  };

  const currentPoint = {
    x: law === "boyle" ? V * 2 : (T - 100) * 0.5,
    y: law === "boyle" ? 140 - P * 0.8 : (law === "charles" ? 140 - V * 0.8 : 140 - P * 0.8)
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Hukum Gas Ideal</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Boyle • Charles • Gay-Lussac</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-black/20 overflow-hidden">
         
         {/* Floating Graph Card */}
         <div className="absolute top-24 left-8 w-64 glass-card p-4 rounded-2xl border border-white/10 bg-black/40 z-10 hidden md:block">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visualisasi Grafik</span>
               <Activity className="w-3 h-3 text-sky-500" />
            </div>
            <div className="relative aspect-video bg-black/20 rounded-xl overflow-hidden border border-white/5 p-2">
               <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
                  <polyline points="0,0 0,140 200,140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <polyline points={generateGraphPoints()} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" className="opacity-50" />
                  <circle cx={currentPoint.x} cy={currentPoint.y} r="5" fill="#ef4444" className="transition-all duration-300" />
                  <line x1={currentPoint.x} y1="140" x2={currentPoint.x} y2={currentPoint.y} stroke="rgba(239,68,68,0.3)" strokeDasharray="2" />
                  <line x1="0" y1={currentPoint.y} x2={currentPoint.x} y2={currentPoint.y} stroke="rgba(239,68,68,0.3)" strokeDasharray="2" />
               </svg>
               <div className="absolute bottom-1 right-2 text-[8px] text-zinc-500 uppercase">{law === 'boyle' ? 'Volume' : 'Suhu'}</div>
               <div className="absolute top-2 left-1 text-[8px] text-zinc-500 uppercase transform -rotate-90 origin-bottom-left">{law === 'charles' ? 'Volume' : 'Tekanan'}</div>
            </div>
         </div>

         {/* Gas Chamber Scene */}
         <div className="relative flex flex-col items-center animate-in zoom-in duration-700">
            {/* Pressure Gauge */}
            <div className="absolute -left-28 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-full bg-zinc-900 border-4 border-zinc-700 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent" />
                  <div 
                    className="w-1 h-8 bg-rose-500 origin-bottom transition-all duration-300 rounded-full"
                    style={{ transform: `rotate(${ -120 + (P / 150) * 240 }deg)` }}
                  />
                  <div className="absolute bottom-2 text-[8px] font-bold text-zinc-500">P (atm)</div>
               </div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gauge</span>
            </div>

            {/* Chamber */}
            <div className="relative w-56 h-80 border-x-8 border-b-8 border-zinc-800 rounded-b-3xl bg-zinc-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               {/* Gas Fill */}
               <div 
                 className="absolute bottom-0 w-full transition-all duration-300"
                 style={{ 
                    height: `${V}%`,
                    backgroundColor: `hsla(${200 - (T / 500) * 200}, 70%, 50%, ${0.1 + (P / 100)})` 
                 }}
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:10px_10px] opacity-20" />
               </div>

               {/* Piston */}
               <div 
                 className="absolute w-full h-8 bg-gradient-to-b from-zinc-600 to-zinc-800 border-b-4 border-zinc-900 transition-all duration-300 z-20 flex items-center justify-center"
                 style={{ bottom: `${V}%` }}
               >
                  <div className="w-1/2 h-1 bg-white/10 rounded-full" />
                  {/* Piston Rod */}
                  <div className="absolute bottom-full w-4 h-[300px] bg-zinc-700 border-x-2 border-zinc-800" />
               </div>
            </div>

            {/* Heat Source */}
            <div className="mt-8 flex flex-col items-center gap-2">
               <div className="flex gap-4">
                  <Flame className={`w-8 h-8 transition-all ${T > 300 ? 'text-rose-500 animate-pulse' : 'text-zinc-800'}`} />
                  <Flame className={`w-8 h-8 transition-all ${T > 350 ? 'text-orange-500 animate-pulse' : 'text-zinc-800'}`} />
               </div>
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Suhu (T): {T.toFixed(0)} K</span>
            </div>
         </div>

      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Navigation Buttons */}
           <div className="grid grid-cols-1 gap-2">
              {[
                { id: "boyle", title: "Hukum Boyle", desc: "Suhu Konstan (T)", color: "text-sky-400" },
                { id: "charles", title: "Hukum Charles", desc: "Tekanan Konstan (P)", color: "text-rose-400" },
                { id: "gay_lussac", title: "Hukum Gay-Lussac", desc: "Volume Konstan (V)", color: "text-amber-400" }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => {setLaw(m.id as any); setInputVal(50);}}
                  className={`flex flex-col gap-1 p-4 rounded-2xl border transition-all text-left ${law === m.id ? 'bg-white/10 border-white/20 shadow-xl' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                >
                   <span className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.title}</span>
                   <span className="text-[9px] text-zinc-500 font-bold uppercase">{m.desc}</span>
                </button>
              ))}
           </div>

           {/* Analysis Card */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status Gas Ideal</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Tekanan (P)</span>
                       <span className="text-xl font-black text-rose-400">{P.toFixed(2)} <span className="text-[10px] text-zinc-500">atm</span></span>
                    </div>
                    <Gauge className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Volume (V)</span>
                       <span className="text-xl font-black text-sky-400">{V.toFixed(1)} <span className="text-[10px] text-zinc-500">Liter</span></span>
                    </div>
                    <Box className="w-5 h-5 text-sky-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Suhu (T)</span>
                       <span className="text-xl font-black text-amber-400">{T.toFixed(0)} <span className="text-[10px] text-zinc-500">Kelvin</span></span>
                    </div>
                    <Thermometer className="w-5 h-5 text-amber-500/50" />
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Timer className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Variabel Kontrol</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                       {law === 'boyle' ? `Ubah Volume (V)` : `Ubah Suhu (T)`}
                    </label>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" 
                   min="0" max="100" step="1" value={inputVal} 
                   onChange={(e) => setInputVal(parseInt(e.target.value))} 
                 />
                 <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>{law === 'boyle' ? 'Kecil' : 'Dingin'}</span>
                    <span>{law === 'boyle' ? 'Besar' : 'Panas'}</span>
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-zinc-500 leading-relaxed text-center italic">
                 {law === 'boyle' && "Hukum Boyle: Tekanan berbanding terbalik dengan volume saat suhu dijaga tetap."}
                 {law === 'charles' && "Hukum Charles: Volume berbanding lurus dengan suhu saat tekanan dijaga tetap."}
                 {law === 'gay_lussac' && "Hukum Gay-Lussac: Tekanan berbanding lurus dengan suhu saat volume dijaga tetap."}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
