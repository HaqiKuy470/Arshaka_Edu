"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Sun,
  Thermometer,
  Zap,
  ArrowRight,
  TrendingUp,
  Globe,
  Info,
  Droplets,
  Sparkles,
  MousePointer2,
  Telescope,
  Radio,
  Flame,
  Snowflake
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type StarType = "katai-merah" | "matahari" | "raksasa-biru";

type StarInfo = {
  id: StarType;
  name: string;
  color: string;
  glow: string;
  temp: string;
  hzRange: { min: number; max: number }; // Percentage distance
};

// --- Data ---
const STARS: Record<StarType, StarInfo> = {
  "katai-merah": {
    id: "katai-merah",
    name: "Katai Merah (M-Dwarf)",
    color: "bg-red-600",
    glow: "shadow-red-600/50",
    temp: "3,500 K",
    hzRange: { min: 10, max: 25 }
  },
  "matahari": {
    id: "matahari",
    name: "Tipe-G (Matahari)",
    color: "bg-yellow-400",
    glow: "shadow-yellow-400/50",
    temp: "5,778 K",
    hzRange: { min: 40, max: 60 }
  },
  "raksasa-biru": {
    id: "raksasa-biru",
    name: "Raksasa Biru (Tipe-O)",
    color: "bg-cyan-400",
    glow: "shadow-cyan-400/50",
    temp: "30,000 K",
    hzRange: { min: 75, max: 95 }
  }
};

export default function HabitableAurora() {
  const [distance, setDistance] = useState(50);
  const [starType, setStarType] = useState<StarType>("matahari");
  const [atmosphere, setAtmosphere] = useState(50); // 0-100

  const activeStar = STARS[starType];
  const isTooHot = distance < activeStar.hzRange.min;
  const isTooCold = distance > activeStar.hzRange.max;
  const isHabitable = !isTooHot && !isTooCold;

  // Temperature Estimation
  const baseTemp = useMemo(() => {
    const starTemp = parseInt(activeStar.temp.replace(',', ''));
    const distFactor = (100 - distance) / 100;
    const atmoFactor = atmosphere / 200;
    return Math.floor((starTemp * distFactor * 0.1) + (atmoFactor * 100) - 273);
  }, [distance, starType, atmosphere]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Astrobiology Lab --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Zona Layak Huni</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Eksoplanet</p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Klasifikasi Bintang</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   {(Object.keys(STARS) as StarType[]).map((key) => (
                     <button
                       key={key}
                       onClick={() => setStarType(key)}
                       className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${starType === key ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 opacity-50 hover:opacity-100'}`}
                     >
                       <span className="text-[10px] font-black uppercase tracking-widest">{STARS[key].name}</span>
                       <div className={`w-3 h-3 rounded-full ${STARS[key].color}`} />
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Radio className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Jarak Orbit (AU)</span>
                   </div>
                   <span className="text-lg font-black text-white">{distance / 10} AU</span>
                </div>
                <input 
                  type="range" min="5" max="95" step="1" 
                  value={distance} onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Kerapatan Atmosfer</span>
                   </div>
                   <span className="text-lg font-black text-white">{atmosphere}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={atmosphere} onChange={(e) => setAtmosphere(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
             </div>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             <motion.div 
               key={`${starType}-${distance}`}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
                <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estimasi Suhu</span>
                      <div className="flex items-center gap-2">
                        <Thermometer className={`w-4 h-4 ${baseTemp > 50 ? 'text-red-400' : baseTemp < 0 ? 'text-cyan-400' : 'text-emerald-400'}`} />
                        <span className="text-xl font-black text-white tracking-tighter">{baseTemp}°C</span>
                      </div>
                   </div>
                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Wujud Air:</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isHabitable ? 'text-emerald-400' : isTooHot ? 'text-red-400' : 'text-cyan-400'}`}>
                        {isHabitable ? "CAIR (CAIRAN)" : isTooHot ? "UAP (GAS)" : "ES (PADAT)"}
                      </span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-indigo-400 px-2">
                      <Telescope className="w-4 h-4" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Analisis Potensi:</h3>
                   </div>
                   <div className={`p-4 rounded-2xl border ${isHabitable ? 'bg-emerald-500/5 border-emerald-500/10' : isTooHot ? 'bg-red-500/5 border-red-500/10' : 'bg-cyan-500/5 border-cyan-500/10'}`}>
                      <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                        {isHabitable 
                          ? "Planet berada di 'Zona Goldilocks'. Suhu yang pas memungkinkan air tetap cair di permukaan—syarat utama kehidupan." 
                          : isTooHot 
                            ? "Terlalu panas. Radiasi bintang yang ekstrem akan memecah molekul air dan menguapkan lautan menjadi awan gas beracun."
                            : "Terlalu dingin. Tanpa energi panas yang cukup, molekul air akan terkunci dalam bentuk kristal es abadi."}
                      </p>
                   </div>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Global Insight */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tipe Bintang</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Suhu permukaan bintang: {activeStar.temp}. Hal ini menentukan di mana zona layak huni berada.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#020202] overflow-hidden">
        
        {/* Stellar Radiance Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={starType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-r ${activeStar.color.replace('bg-', 'from-')}/10 to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* System Container */}
        <div className="relative w-full max-w-5xl h-full flex items-center">
           
           {/* Star (Sun) */}
           <div className="absolute left-[-20%] top-1/2 -translate-y-1/2 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`w-[400px] h-[400px] rounded-full ${activeStar.color} blur-[2px] shadow-2xl ${activeStar.glow}`}
              />
              {/* Solar Flares / Corona */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-[-40px] border-[2px] border-dashed rounded-full ${activeStar.color.replace('bg-', 'border-')}/20`}
              />
           </div>

           {/* Habitability Zone Bands (SVG Background) */}
           <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <rect x="0" y="0" width="100%" height="100%" fill="none" />
              <rect 
                x={`${activeStar.hzRange.min}%`} 
                y="0" 
                width={`${activeStar.hzRange.max - activeStar.hzRange.min}%`} 
                height="100%" 
                className="fill-emerald-500/30" 
              />
           </svg>

           {/* Zone Labels */}
           <div className="absolute inset-0 flex items-center justify-between px-20 pointer-events-none">
              <span className="text-[10px] font-black text-red-500/40 uppercase tracking-[0.5em] rotate-90">Terlalu Panas</span>
              <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.5em] rotate-90">Habitable Zone</span>
              <span className="text-[10px] font-black text-cyan-500/40 uppercase tracking-[0.5em] rotate-90">Terlalu Dingin</span>
           </div>

           {/* The Planet Container */}
           <motion.div 
             className="absolute top-1/2 -translate-y-1/2 z-30 cursor-pointer"
             animate={{ left: `${distance}%` }}
             transition={{ type: "spring", stiffness: 50 }}
           >
              {/* Planet Graphics */}
              <div className="relative">
                 <motion.div 
                    className={`w-24 h-24 rounded-full border-2 transition-all duration-700 overflow-hidden shadow-2xl
                      ${isHabitable ? 'bg-blue-600 border-emerald-400' : isTooHot ? 'bg-orange-800 border-red-600' : 'bg-cyan-100 border-white'}
                    `}
                 >
                    {/* Surface Details */}
                    {isHabitable && (
                      <div className="absolute inset-0 opacity-60">
                         <div className="absolute top-2 left-4 w-12 h-8 bg-emerald-500 rounded-full blur-sm" />
                         <div className="absolute bottom-4 right-2 w-10 h-10 bg-emerald-600 rounded-full blur-sm" />
                         {/* Clouds */}
                         <motion.div 
                           animate={{ x: [0, 20, 0] }}
                           transition={{ duration: 10, repeat: Infinity }}
                           className="absolute top-8 left-0 w-full h-4 bg-white/40 blur-sm"
                         />
                      </div>
                    )}
                    {isTooHot && (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.4),transparent)] animate-pulse" />
                    )}
                    {isTooCold && (
                      <div className="absolute inset-0 opacity-40">
                         <div className="absolute inset-2 border-4 border-white/20 rounded-full" />
                      </div>
                    )}
                    {/* Shading */}
                    <div className="absolute inset-0 shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.8)]" />
                 </motion.div>

                 {/* Atmosphere Halo */}
                 <motion.div 
                   animate={{ scale: 1 + (atmosphere / 500) }}
                   className={`absolute -inset-4 rounded-full blur-xl opacity-30
                     ${isHabitable ? 'bg-blue-400' : isTooHot ? 'bg-red-400' : 'bg-white'}
                   `}
                 />

                 {/* Temperature Label */}
                 <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{isHabitable ? 'Exoplanet' : isTooHot ? 'Lava Planet' : 'Ice World'}</span>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mt-2">
                       {isTooHot ? <Flame className="w-3 h-3 text-red-400" /> : isTooCold ? <Snowflake className="w-3 h-3 text-cyan-400" /> : <Droplets className="w-3 h-3 text-blue-400" />}
                       <span className="text-[10px] font-bold text-white">{baseTemp}°C</span>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Dashboard Header Overlay */}
        <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl">
           <div className={`w-3 h-3 rounded-full ${isHabitable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`} />
           <div>
              <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Astrobiology Monitor Active</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{isHabitable ? 'Objek Layak Huni' : 'Kondisi Ekstrem'}</h3>
           </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sesuaikan Jarak Orbit & Tipe Bintang untuk Analisis Goldilocks</span>
        </div>
      </div>

    </div>
  );
}
