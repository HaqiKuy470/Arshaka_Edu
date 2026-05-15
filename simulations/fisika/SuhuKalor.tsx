"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, FlaskConical, Beaker, Flame, Snowflake } from "lucide-react";
import Link from "next/link";

export default function SuhuKalor() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [m1, setM1] = useState(200); // g (Object 1)
  const [t1, setT1] = useState(90);  // °C (Object 1)
  const [m2, setM2] = useState(200); // g (Object 2)
  const [t2, setT2] = useState(20);  // °C (Object 2)
  const [material, setMaterial] = useState<"water" | "alcohol" | "oil">("water");

  // Specific Heat Data (J/g°C)
  const materials = {
    water: { c: 4.18, name: "Air", color: "text-sky-400" },
    alcohol: { c: 2.44, name: "Alkohol", color: "text-fuchsia-400" },
    oil: { c: 2.00, name: "Minyak", color: "text-amber-400" }
  };

  const { c } = materials[material];

  // Logic: m1 * c * (T1 - Tc) = m2 * c * (Tc - T2)
  // Tc = (m1*T1 + m2*T2) / (m1 + m2)
  const finalTc = (m1 * t1 + m2 * t2) / (m1 + m2);
  const qTransferred = m1 * c * (t1 - finalTc); // Joules

  // Animation State
  const [displayTc, setDisplayTc] = useState(t1);
  const [isMixing, setIsMixing] = useState(false);

  useEffect(() => {
    if (isMixing) {
      const step = (finalTc - displayTc) * 0.05;
      if (Math.abs(step) < 0.01) {
        setDisplayTc(finalTc);
        setIsMixing(false);
      } else {
        const timer = setTimeout(() => setDisplayTc(prev => prev + step), 16);
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayTc(finalTc);
    }
  }, [isMixing, finalTc, displayTc]);

  const reset = () => {
    setM1(200); setT1(90);
    setM2(200); setT2(20);
    setIsMixing(false);
    setDisplayTc(90);
  };

  const mix = () => {
    setDisplayTc(t1);
    setIsMixing(true);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Suhu & Kalor</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Asas Black • Fisika</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 gap-8 lg:gap-16">
         
         {/* Beaker 1 (Hot) */}
         <div className="relative group transition-all">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Objek 1</span>
               <span className="text-xl font-black text-white font-mono">{t1}°C</span>
            </div>
            <div className="w-24 h-40 border-b-4 border-x-4 border-white/10 rounded-b-3xl relative overflow-hidden bg-white/5">
               <div 
                 className="absolute bottom-0 w-full bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-500"
                 style={{ height: `${(m1 / 500) * 100}%` }}
               >
                  <div className="absolute top-0 w-full h-1 bg-white/30" />
                  {t1 > 60 && <div className="absolute top-0 left-0 right-0 animate-bounce flex justify-center opacity-40"><Flame className="w-4 h-4 text-white" /></div>}
               </div>
            </div>
            {/* Thermometer Visual */}
            <div className="absolute -left-6 top-0 h-full w-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
               <div className="absolute bottom-0 w-full bg-rose-500" style={{ height: `${t1}%` }} />
            </div>
         </div>

         <div className="text-4xl font-black text-zinc-800">+</div>

         {/* Beaker 2 (Cold) */}
         <div className="relative group transition-all">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
               <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Objek 2</span>
               <span className="text-xl font-black text-white font-mono">{t2}°C</span>
            </div>
            <div className="w-24 h-40 border-b-4 border-x-4 border-white/10 rounded-b-3xl relative overflow-hidden bg-white/5">
               <div 
                 className="absolute bottom-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-500"
                 style={{ height: `${(m2 / 500) * 100}%` }}
               >
                  <div className="absolute top-0 w-full h-1 bg-white/30" />
                  {t2 < 15 && <div className="absolute top-0 left-0 right-0 animate-pulse flex justify-center opacity-40"><Snowflake className="w-4 h-4 text-white" /></div>}
               </div>
            </div>
            <div className="absolute -right-6 top-0 h-full w-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
               <div className="absolute bottom-0 w-full bg-sky-500" style={{ height: `${t2}%` }} />
            </div>
         </div>

         <div className="text-4xl font-black text-zinc-800">=</div>

         {/* Mixture Result */}
         <div className="relative group transition-all">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Suhu Campuran (Tc)</span>
               <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-xl border border-white/10">
                  <span className="text-3xl font-black text-white font-mono">{displayTc.toFixed(1)}°C</span>
               </div>
            </div>
            <div className="w-36 h-48 border-b-8 border-x-8 border-white/20 rounded-b-[40px] relative overflow-hidden bg-white/5 shadow-2xl">
               <div 
                 className="absolute bottom-0 w-full transition-all duration-500"
                 style={{ 
                    height: `${((m1 + m2) / 1000) * 100}%`,
                    backgroundColor: `rgb(${Math.floor((displayTc / 100) * 255)}, 100, ${Math.floor((1 - displayTc / 100) * 255)})`
                 }}
               >
                  <div className="absolute top-0 w-full h-2 bg-white/20" />
                  {isMixing && <div className="absolute inset-0 flex items-center justify-center"><Waves className="w-8 h-8 text-white/20 animate-spin" /></div>}
               </div>
            </div>
         </div>

      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kesetimbangan Termal</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kalor Berpindah (Q)</span>
                       <span className="text-xl font-black text-rose-400">{qTransferred.toFixed(0)} <span className="text-[10px] text-zinc-500">J</span></span>
                    </div>
                    <Zap className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kapasitas Panas Total</span>
                       <span className="text-xl font-black text-sky-400">{((m1 + m2) * c).toFixed(0)} <span className="text-[10px] text-zinc-500">J/°C</span></span>
                    </div>
                    <Droplets className="w-5 h-5 text-sky-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Thermometer className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Material</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {Object.entries(materials).map(([key, m]) => (
                   <button key={key} onClick={() => {setMaterial(key as any); reset();}} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${material === key ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                      <FlaskConical className={`w-5 h-5 mb-1 ${m.color}`} />
                      <span className="text-[8px] font-black uppercase text-zinc-400">{m.name}</span>
                   </button>
                 ))}
              </div>

              {/* Object 1 Controls */}
              <div className="space-y-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                 <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Objek 1 (Panas)</span>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center"><label className="text-[9px] text-zinc-400 uppercase">Massa: {m1}g</label></div>
                    <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="50" max="500" step="10" value={m1} onChange={(e) => setM1(parseInt(e.target.value))} />
                    <div className="flex justify-between items-center"><label className="text-[9px] text-zinc-400 uppercase">Suhu: {t1}°C</label></div>
                    <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="50" max="100" step="1" value={t1} onChange={(e) => setT1(parseInt(e.target.value))} />
                 </div>
              </div>

              {/* Object 2 Controls */}
              <div className="space-y-4 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10">
                 <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Objek 2 (Dingin)</span>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center"><label className="text-[9px] text-zinc-400 uppercase">Massa: {m2}g</label></div>
                    <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="50" max="500" step="10" value={m2} onChange={(e) => setM2(parseInt(e.target.value))} />
                    <div className="flex justify-between items-center"><label className="text-[9px] text-zinc-400 uppercase">Suhu: {t2}°C</label></div>
                    <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="0" max="40" step="1" value={t2} onChange={(e) => setT2(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Berdasarkan Asas Black, jumlah kalor yang dilepas oleh zat yang lebih panas akan selalu sama persis dengan jumlah kalor yang diterima oleh zat dingin."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={mix} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
                <Play className="w-5 h-5 fill-current"/> Campurkan Objek
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] text-zinc-500 leading-relaxed text-center italic">
                    "Kalor yang dilepas oleh benda yang bersuhu lebih tinggi akan sama dengan kalor yang diserap oleh benda yang bersuhu lebih rendah."
                 </p>
                 <div className="mt-2 text-center text-[10px] font-black text-white uppercase tracking-widest">Q Lepas = Q Terima</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
