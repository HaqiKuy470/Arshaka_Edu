"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Info, 
  CloudRain, 
  Sun, 
  Skull, 
  ChevronLeft,
  ArrowUpRight,
  TrendingUp,
  Wind
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type HistoryPoint = {
  time: number;
  grass: number;
  rabbits: number;
  wolves: number;
};

// --- Constants ---
const MAX_HISTORY = 100;
const TICK_MS = 100;

export default function Ekosistem() {
  const [isRunning, setIsRunning] = useState(false);
  const [populations, setPopulations] = useState({
    grass: 100,
    rabbits: 20,
    wolves: 5
  });
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [weather, setWeather] = useState<"normal" | "rain" | "drought">("normal");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Logic: Population Dynamics (Lotka-Volterra Inspired) ---
  const tick = () => {
    setPopulations(prev => {
      const { grass, rabbits, wolves } = prev;

      // Weather multipliers
      const grassGrowthRate = weather === "rain" ? 3.0 : weather === "drought" ? 0.5 : 1.5;
      const consumptionRate = 0.08;
      const rabbitBirthRate = 0.06;
      const wolfEfficiency = 0.04;
      const wolfDeathRate = 0.05;

      // 1. Grass Growth (Logistic-like)
      const newGrass = Math.max(0, Math.min(250, grass + grassGrowthRate - (rabbits * 0.15)));
      
      // 2. Rabbit Population
      // Growth depends on grass, death depends on wolves
      const rabbitDeath = wolves * consumptionRate;
      const rabbitGrowth = grass > 20 ? rabbits * rabbitBirthRate : -rabbits * 0.1;
      const newRabbits = Math.max(0, rabbits + rabbitGrowth - rabbitDeath);

      // 3. Wolf Population
      // Growth depends on rabbits, death is natural
      const wolfGrowth = rabbits > 5 ? wolves * (rabbits * 0.005) : -wolves * wolfDeathRate;
      const newWolves = Math.max(0, wolves + wolfGrowth);

      return {
        grass: newGrass,
        rabbits: newRabbits,
        wolves: newWolves
      };
    });
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(tick, TICK_MS);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, weather]);

  // Update History
  useEffect(() => {
    if (!isRunning) return;
    setHistory(prev => {
      const newPoint = { 
        time: Date.now(), 
        ...populations 
      };
      const newHistory = [...prev, newPoint];
      return newHistory.length > MAX_HISTORY ? newHistory.slice(1) : newHistory;
    });
  }, [populations, isRunning]);

  const reset = () => {
    setIsRunning(false);
    setPopulations({ grass: 100, rabbits: 20, wolves: 5 });
    setHistory([]);
    setWeather("normal");
  };

  // --- Chart Rendering (SVG) ---
  const chartPath = useMemo(() => {
    if (history.length < 2) return { g: "", r: "", w: "" };
    
    const width = 800;
    const height = 200;
    const padding = 10;
    
    const getX = (idx: number) => (idx / (MAX_HISTORY - 1)) * (width - padding * 2) + padding;
    const getY = (val: number, max: number) => height - (val / max) * (height - padding * 2) - padding;

    let g = `M ${getX(0)} ${getY(history[0].grass, 250)}`;
    let r = `M ${getX(0)} ${getY(history[0].rabbits, 100)}`;
    let w = `M ${getX(0)} ${getY(history[0].wolves, 50)}`;

    history.forEach((p, i) => {
      if (i === 0) return;
      g += ` L ${getX(i)} ${getY(p.grass, 250)}`;
      r += ` L ${getX(i)} ${getY(p.rabbits, 100)}`;
      w += ` L ${getX(i)} ${getY(p.wolves, 50)}`;
    });

    return { g, r, w };
  }, [history]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Info & Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Dinamika Ekosistem</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Model Populasi Pemangsa-Mangsa</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isRunning ? "bg-rose-500 text-white shadow-lg" : "bg-emerald-500 text-white shadow-lg"}`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Hentikan" : "Mulai"}
            </button>
            <button 
              onClick={reset}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Population Stats */}
        <div className="p-8 space-y-6">
           <div className="space-y-4">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Komponen Biotik</h2>
              
              {/* Grass Card */}
              <div className="p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-center justify-between group transition-all hover:bg-emerald-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">🌿</div>
                  <div>
                    <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">Produsen</span>
                    <span className="text-sm font-bold text-white">Rumput</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-black text-emerald-400">{Math.round(populations.grass)}</div>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Satuan Energi</div>
                </div>
              </div>

              {/* Rabbit Card */}
              <div className="p-5 bg-sky-500/5 rounded-3xl border border-sky-500/10 flex items-center justify-between group transition-all hover:bg-sky-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">🐇</div>
                  <div>
                    <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">Konsumen I</span>
                    <span className="text-sm font-bold text-white">Kelinci</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-black text-sky-400">{Math.round(populations.rabbits)}</div>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Populasi</div>
                </div>
              </div>

              {/* Wolf Card */}
              <div className="p-5 bg-rose-500/5 rounded-3xl border border-rose-500/10 flex items-center justify-between group transition-all hover:bg-rose-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">🐺</div>
                  <div>
                    <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">Konsumen II</span>
                    <span className="text-sm font-bold text-white">Serigala</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-black text-rose-400">{Math.round(populations.wolves)}</div>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Populasi</div>
                </div>
              </div>
           </div>

           {/* Environment Control */}
           <div className="space-y-4">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Faktor Abiotik (Cuaca)</h2>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {[
                  { id: "rain", icon: <CloudRain className="w-4 h-4" />, label: "Hujan" },
                  { id: "normal", icon: <Wind className="w-4 h-4" />, label: "Normal" },
                  { id: "drought", icon: <Sun className="w-4 h-4" />, label: "Kemarau" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWeather(item.id as any)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${weather === item.id ? "bg-white/10 text-white border border-white/10" : "text-zinc-500 hover:bg-white/5"}`}
                  >
                    {item.icon}
                    <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Insight Card */}
        <div className="mt-auto p-8 border-t border-white/5">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <Info className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Wawasan Ekologi</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                "{populations.rabbits === 0 ? "Kelinci punah, serigala akan segera menyusul." : populations.wolves === 0 ? "Serigala punah, kelinci akan meledak jumlahnya dan menghabiskan rumput." : "Siklus ini menunjukkan keseimbangan alami pemangsa dan mangsa."}"
              </p>
           </div>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Ambience */}
        <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${weather === 'rain' ? 'bg-blue-900/10' : weather === 'drought' ? 'bg-orange-900/10' : ''}`} />
        
        {/* Animated Field */}
        <div className="relative w-full max-w-4xl h-64 bg-zinc-900/50 rounded-[40px] border border-white/5 overflow-hidden group mb-12 shadow-2xl">
           {/* Grass Background */}
           <div 
             className="absolute inset-0 bg-emerald-500/10 transition-all duration-1000"
             style={{ opacity: populations.grass / 250 }}
           />
           
           {/* Dynamic Particles (Rabbits & Wolves) */}
           <div className="absolute inset-0 p-8 flex flex-wrap gap-4 items-center justify-center opacity-60">
              <AnimatePresence>
                {Array.from({ length: Math.min(20, Math.ceil(populations.rabbits / 5)) }).map((_, i) => (
                  <motion.div
                    key={`r-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: [0, Math.random() * 20 - 10, 0], y: [0, Math.random() * 20 - 10, 0] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    🐇
                  </motion.div>
                ))}
                {Array.from({ length: Math.min(10, Math.ceil(populations.wolves / 5)) }).map((_, i) => (
                  <motion.div
                    key={`w-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: [0, Math.random() * 40 - 20, 0], y: [0, Math.random() * 40 - 20, 0] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🐺
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>

           {/* Field Overlay */}
           <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
              <div>
                <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Field Observation</span>
                <h3 className="text-lg font-bold text-white">Visualisasi Padang Rumput</h3>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <Sun className={`w-4 h-4 ${weather === 'drought' ? 'text-orange-400' : 'text-zinc-700'}`} />
                    <CloudRain className={`w-4 h-4 ${weather === 'rain' ? 'text-blue-400' : 'text-zinc-700'}`} />
                 </div>
              </div>
           </div>
        </div>

        {/* Professional Line Chart */}
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl rounded-[32px] border border-white/5 p-8 relative">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                 <div>
                    <h4 className="text-sm font-bold text-white">Analisis Grafik Populasi</h4>
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Data Real-Time</span>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-emerald-500" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Rumput</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-sky-500" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Kelinci</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-rose-500" />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Serigala</span>
                 </div>
              </div>
           </div>

           <div className="relative w-full h-[200px]">
              <svg viewBox="0 0 800 200" className="w-full h-full preserve-3d overflow-visible">
                 <motion.path d={chartPath.g} stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: 1 }} />
                 <motion.path d={chartPath.r} stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                 <motion.path d={chartPath.w} stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-5 border-b border-white" />
           </div>
        </div>

        {/* Legend / Status Hint */}
        <div className="absolute top-10 flex gap-4 p-4 px-8 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full z-30">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Simulasi Berjalan</span>
           </div>
        </div>
      </div>

    </div>
  );
}
