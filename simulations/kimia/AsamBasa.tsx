"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Droplets, 
  RotateCcw, 
  ChevronLeft, 
  ShieldAlert, 
  Thermometer, 
  FlaskConical,
  Zap,
  Info,
  Waves,
  Gauge
} from "lucide-react";
import Link from "next/link";

interface Solution {
  name: string;
  ph: number;
  color: string;
  description: string;
}

const PREDEFINED_SOLUTIONS: Solution[] = [
  { name: "Asam Lambung", ph: 1.0, color: "rgba(239, 68, 68, 0.4)", description: "Cairan pencernaan yang sangat asam (HCl)." },
  { name: "Cuka", ph: 2.5, color: "rgba(248, 113, 113, 0.4)", description: "Asam asetat encer yang umum di dapur." },
  { name: "Kopi Hitam", ph: 5.0, color: "rgba(120, 53, 15, 0.4)", description: "Sedikit asam, mengandung asam klorogenat." },
  { name: "Air Murni", ph: 7.0, color: "rgba(56, 189, 248, 0.3)", description: "Netral sempurna pada suhu 25°C." },
  { name: "Darah", ph: 7.4, color: "rgba(220, 38, 38, 0.4)", description: "Sedikit basa, dipertahankan ketat oleh tubuh." },
  { name: "Sabun Cuci", ph: 10.0, color: "rgba(129, 140, 248, 0.4)", description: "Basa lemah yang efektif melarutkan lemak." },
  { name: "Pembersih Saluran", ph: 13.0, color: "rgba(79, 70, 229, 0.4)", description: "Basa kuat (NaOH), sangat korosif." },
];

export default function AsamBasa() {
  const [ph, setPh] = useState(7.0);
  const [liquidHeight, setLiquidHeight] = useState(50); // percentage
  const [activeSolution, setActiveSolution] = useState<Solution | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  // Smooth pH transition
  const [displayPh, setDisplayPh] = useState(7.0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.abs(displayPh - ph) > 0.01) {
        setDisplayPh(prev => prev + (ph - prev) * 0.1);
      } else {
        setDisplayPh(ph);
      }
    }, 16);
    return () => clearTimeout(timer);
  }, [ph, displayPh]);

  const addAcid = () => {
    setPh(prev => Math.max(0, prev - 0.5));
    setLiquidHeight(prev => Math.min(90, prev + 2));
    setActiveSolution(null);
  };

  const addBase = () => {
    setPh(prev => Math.min(14, prev + 0.5));
    setLiquidHeight(prev => Math.min(90, prev + 2));
    setActiveSolution(null);
  };

  const selectSolution = (s: Solution) => {
    setPh(s.ph);
    setLiquidHeight(60);
    setActiveSolution(s);
  };

  const reset = () => {
    setPh(7.0);
    setLiquidHeight(50);
    setActiveSolution(null);
  };

  // Get color based on pH
  const getPhColor = (val: number) => {
    if (val < 3) return "rgb(239, 68, 68)"; // Red
    if (val < 6) return "rgb(251, 146, 60)"; // Orange
    if (val < 8) return "rgb(34, 197, 94)"; // Green
    if (val < 11) return "rgb(59, 130, 246)"; // Blue
    return "rgb(126, 34, 206)"; // Purple
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full transition-colors duration-1000`} style={{ backgroundColor: getPhColor(displayPh) + '33' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-4">
            <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none">Asam, Basa & pH</h1>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Kesetimbangan Ion • Kimia</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getPhColor(displayPh) }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                {displayPh < 6.5 ? "Asam" : displayPh > 7.5 ? "Basa" : "Netral"}
              </span>
            </div>
          </div>
        </div>

        {/* pH Meter Display */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Indikator pH Digital</div>
          <div className="glass-card p-8 rounded-[40px] border border-white/10 shadow-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
            <div className="text-7xl md:text-8xl font-black font-mono tracking-tighter" style={{ color: getPhColor(displayPh) }}>
              {displayPh.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Beaker and Liquid */}
        <div className="relative w-64 h-80">
          {/* Beaker Glass */}
          <div className="absolute inset-0 border-4 border-t-0 border-white/20 rounded-b-[48px] glass shadow-2xl z-10 overflow-hidden">
            {/* Liquid */}
            <div 
              className="absolute bottom-0 w-full transition-all duration-1000 ease-in-out"
              style={{ 
                height: `${liquidHeight}%`, 
                backgroundColor: activeSolution ? activeSolution.color : getPhColor(displayPh) + '66',
                boxShadow: `inset 0 10px 30px -10px rgba(255,255,255,0.2)`
              }}
            >
              {/* Surface Wave */}
              <div className="absolute -top-3 left-0 right-0 h-6 bg-white/10 blur-sm rounded-full animate-pulse" />
              
              {/* Bubbles */}
              <div className="absolute inset-0 opacity-40">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white/40 rounded-full animate-float"
                    style={{
                      width: `${Math.random() * 8 + 4}px`,
                      height: `${Math.random() * 8 + 4}px`,
                      left: `${Math.random() * 90 + 5}%`,
                      bottom: `${Math.random() * 20}%`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Measurement Markings */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-8 px-2 opacity-30">
              {[500, 400, 300, 200, 100].map(val => (
                <div key={val} className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-white" />
                  <span className="text-[8px] font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Name Tag */}
          {activeSolution && (
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 glass-card p-4 rounded-2xl border border-white/10 animate-in slide-in-from-left duration-500 max-w-[150px]">
              <div className="text-[8px] text-zinc-500 font-bold uppercase mb-1">Sampel:</div>
              <div className="text-xs font-bold text-white">{activeSolution.name}</div>
            </div>
          )}
        </div>

        {/* pH Scale Slider Visualizer */}
        <div className="mt-16 w-full max-w-2xl px-6">
          <div className="relative h-6 w-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-green-500 via-blue-500 to-purple-700 p-1 border border-white/10 shadow-lg">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white rounded-full border-4 border-zinc-900 shadow-xl transition-all duration-700 ease-out z-20"
              style={{ left: `calc(${(displayPh / 14) * 100}% - 8px)` }}
            />
            <div className="absolute inset-0 flex justify-between px-4 items-center">
               {[0, 2, 4, 6, 7, 8, 10, 12, 14].map(v => (
                 <span key={v} className="text-[8px] font-black text-black/40">{v}</span>
               ))}
            </div>
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
            <span>Sangat Asam</span>
            <span>Netral</span>
            <span>Sangat Basa</span>
          </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-8 pt-24">
          
          {/* Add Reagents */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Kontrol Reaksi</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={addAcid}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all group active:scale-95"
              >
                <Droplets className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-red-300 uppercase">Asam (H⁺)</span>
              </button>
              <button 
                onClick={addBase}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl transition-all group active:scale-95"
              >
                <Droplets className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase">Basa (OH⁻)</span>
              </button>
            </div>
          </div>

          {/* Samples Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sampel Standar</span>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {PREDEFINED_SOLUTIONS.map(s => (
                <button
                  key={s.name}
                  onClick={() => selectSolution(s)}
                  className={`w-full p-3 rounded-xl border transition-all text-left flex items-center justify-between group ${activeSolution?.name === s.name ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-200">{s.name}</span>
                    <span className="text-[8px] text-zinc-500 line-clamp-1">{s.description}</span>
                  </div>
                  <div className="text-[10px] font-black font-mono px-2 py-1 bg-black/30 rounded-md" style={{ color: getPhColor(s.ph) }}>
                    {s.ph.toFixed(1)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 space-y-3">
             <button 
               onClick={reset}
               className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
             >
                <RotateCcw className="w-4 h-4" /> Kosongkan Wadah
             </button>
          </div>

          {/* Chemistry Insight */}
          <div className="p-6 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Wawasan Kimia</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Apa itu pH?</h4>
              <p className="text-[10px] text-emerald-200/60 leading-relaxed italic">
                "pH adalah ukuran konsentrasi ion hidrogen (H⁺). Skalanya bersifat logaritmik, artinya pH 4 sepuluh kali lebih asam daripada pH 5."
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <code className="text-[10px] text-orange-400 font-mono block text-center">
                  pH = -log[H⁺]
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
