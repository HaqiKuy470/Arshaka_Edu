"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, FlaskConical, Beaker, Flame, Snowflake, Sun, Coffee, Wind, Radio } from "lucide-react";
import Link from "next/link";

export default function PerpindahanPanas() {
  const [method, setMethod] = useState<"conduction" | "convection" | "radiation">("conduction");
  const [sourceTemp, setSourceTemp] = useState(100); // °C
  const [isRunning, setIsRunning] = useState(true);
  
  // Animation state
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setOffset(prev => (prev + 1) % 360), 30);
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setSourceTemp(100);
    setIsRunning(true);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Perpindahan Panas</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Konduksi • Konveksi • Radiasi</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-black/20">
         
         {/* CONDUCTION SCENE */}
         {method === "conduction" && (
           <div className="relative w-full max-w-2xl flex items-center justify-center animate-in zoom-in duration-700">
              {/* Bunsen Burner */}
              <div className="absolute -left-20 bottom-0 flex flex-col items-center">
                 <div className="w-8 h-20 bg-zinc-800 rounded-t-lg border border-white/10" />
                 <div className="w-4 h-12 bg-zinc-700" />
                 <div className="absolute -top-16">
                    <Flame className="w-12 h-12 text-rose-500 animate-pulse" />
                    <div className="absolute top-0 w-12 h-12 bg-rose-500/20 blur-xl animate-pulse rounded-full" />
                 </div>
              </div>

              {/* Metal Rod */}
              <div className="relative w-[400px] h-12 bg-zinc-800 rounded-full border-4 border-white/5 overflow-hidden shadow-2xl">
                 <div 
                   className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-400 to-zinc-800 opacity-80"
                   style={{ width: `${(sourceTemp / 250) * 100}%` }}
                 />
                 {/* Internal Particles Visualization */}
                 <div className="absolute inset-0 flex items-center justify-around px-4">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-2 rounded-full bg-white/40 animate-ping" 
                        style={{ 
                          animationDuration: `${0.5 + (12-i)*0.1}s`,
                          opacity: (12-i)/12
                        }} 
                      />
                    ))}
                 </div>
              </div>

              <div className="absolute -right-20 flex flex-col items-center gap-2">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ujung Dingin</span>
                 <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                    <Snowflake className="w-5 h-5 text-sky-400" />
                 </div>
              </div>
           </div>
         )}

         {/* CONVECTION SCENE */}
         {method === "convection" && (
           <div className="relative flex flex-col items-center animate-in slide-in-from-bottom duration-700">
              <div className="w-64 h-56 border-x-4 border-b-4 border-white/10 rounded-b-[40px] relative overflow-hidden bg-white/5">
                 {/* Convection Currents */}
                 <div className="absolute inset-0 flex justify-around p-8">
                    <div className="relative w-12 h-full flex flex-col items-center">
                       <div className="w-full h-full border-4 border-rose-500/30 rounded-full border-r-0 animate-[spin_3s_linear_infinite]" />
                       <div className="absolute top-1/2 -translate-y-1/2"><Zap className="w-6 h-6 text-rose-400 animate-pulse" /></div>
                    </div>
                    <div className="relative w-12 h-full flex flex-col items-center">
                       <div className="w-full h-full border-4 border-sky-500/30 rounded-full border-l-0 animate-[spin_3s_linear_infinite_reverse]" />
                       <div className="absolute top-1/2 -translate-y-1/2"><Droplets className="w-6 h-6 text-sky-400 animate-pulse" /></div>
                    </div>
                 </div>
                 {/* Bubbles */}
                 {[...Array(10)].map((_, i) => (
                   <div 
                     key={i} 
                     className="absolute bottom-0 w-2 h-2 rounded-full bg-white/20 animate-[bounce_2s_infinite]" 
                     style={{ 
                       left: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 2}s`
                     }} 
                   />
                 ))}
                 <div className="absolute top-0 w-full h-2 bg-sky-400/20 blur-md" />
              </div>
              {/* Heater */}
              <div className="mt-4 flex gap-4">
                 <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
                 <Flame className="w-8 h-8 text-rose-500 animate-pulse delay-75" />
                 <Flame className="w-8 h-8 text-rose-500 animate-pulse delay-150" />
              </div>
           </div>
         )}

         {/* RADIATION SCENE */}
         {method === "radiation" && (
           <div className="relative w-full max-w-3xl flex items-center justify-between animate-in fade-in duration-1000">
              {/* Energy Source */}
              <div className="relative flex items-center justify-center">
                 <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-600 to-rose-600 animate-pulse border-8 border-white/5" />
                 <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse" />
                 <Sun className="absolute w-12 h-12 text-white/50" />
              </div>

              {/* Radiant Waves */}
              <div className="flex-1 px-12 flex flex-col gap-8">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent w-40 animate-[slide-right_1.5s_infinite]" 
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                   </div>
                 ))}
              </div>

              {/* Target Object */}
              <div className="relative p-8 rounded-3xl bg-zinc-900 border border-white/10 group overflow-hidden">
                 <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex flex-col items-center gap-4">
                    <Thermometer className="w-12 h-12 text-zinc-400" />
                    <div className="h-24 w-4 bg-zinc-800 rounded-full relative overflow-hidden border border-white/5">
                       <div className="absolute bottom-0 w-full bg-rose-500 transition-all duration-1000" style={{ height: '60%' }} />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Objek Penerima</span>
                 </div>
              </div>
           </div>
         )}

      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Navigation Buttons */}
           <div className="grid grid-cols-1 gap-2">
              {[
                { id: "conduction", icon: Coffee, title: "Konduksi", desc: "Zat Padat", color: "text-rose-400" },
                { id: "convection", icon: Waves, title: "Konveksi", desc: "Fluida", color: "text-sky-400" },
                { id: "radiation", icon: Radio, title: "Radiasi", desc: "Tanpa Medium", color: "text-amber-400" }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${method === m.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                >
                   <div className={`p-2 rounded-xl bg-black/20 ${m.color}`}><m.icon className="w-5 h-5" /></div>
                   <div className="flex flex-col text-left">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.title}</span>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase">{m.desc}</span>
                   </div>
                </button>
              ))}
           </div>

           {/* Analysis Card */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Termal</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Laju Kalor (H)</span>
                       <span className="text-xl font-black text-rose-400">{(sourceTemp * 1.5).toFixed(0)} <span className="text-[10px] text-zinc-500">J/s</span></span>
                    </div>
                    <Gauge className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Gradien Suhu</span>
                       <span className="text-xl font-black text-sky-400">{sourceTemp - 20}°C</span>
                    </div>
                    <Timer className="w-5 h-5 text-sky-500/50" />
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Thermometer className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Variabel Sumber</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Suhu Sumber: {sourceTemp}°C</label>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                   min="30" max="250" step="10" value={sourceTemp} 
                   onChange={(e) => setSourceTemp(parseInt(e.target.value))} 
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
                 "Kalor berpindah dari suhu tinggi ke rendah melalui medium kontak (Konduksi), aliran fluida (Konveksi), atau radiasi gelombang elektromagnetik (Radiasi)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] text-zinc-500 leading-relaxed text-center italic">
                    {method === 'conduction' && "Konduksi: Perpindahan panas melalui zat perantara tanpa disertai perpindahan partikel zat tersebut."}
                    {method === 'convection' && "Konveksi: Perpindahan panas melalui zat perantara yang disertai perpindahan partikel zat tersebut."}
                    {method === 'radiation' && "Radiasi: Perpindahan panas tanpa memerlukan zat perantara (melalui gelombang elektromagnetik)."}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
