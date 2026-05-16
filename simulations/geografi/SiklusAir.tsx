"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  CloudRain,
  Sun,
  Wind,
  Waves,
  ArrowRight,
  TrendingUp,
  Thermometer,
  CloudLightning,
  Droplets,
  Mountain,
  Info,
  Zap,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type CyclePhase = "evaporasi" | "kondensasi" | "presipitasi" | "infiltrasi";

type PhaseInfo = {
  id: CyclePhase;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  pos: { x: number; y: number };
};

// --- Data ---
const PHASES: PhaseInfo[] = [
  {
    id: "evaporasi",
    name: "Evaporasi",
    desc: "Proses penguapan air dari permukaan laut, sungai, dan danau akibat paparan panas matahari.",
    icon: <Sun className="w-5 h-5" />,
    color: "text-amber-400",
    pos: { x: 80, y: 65 }
  },
  {
    id: "kondensasi",
    name: "Kondensasi",
    desc: "Uap air mendingin di atmosfer yang tinggi dan berubah kembali menjadi titik-titik air membentuk awan.",
    icon: <Wind className="w-5 h-5" />,
    color: "text-blue-300",
    pos: { x: 50, y: 20 }
  },
  {
    id: "presipitasi",
    name: "Presipitasi",
    desc: "Jatuhnya air dari atmosfer ke permukaan bumi dalam bentuk hujan, salju, atau hujan es.",
    icon: <CloudRain className="w-5 h-5" />,
    color: "text-sky-400",
    pos: { x: 25, y: 50 }
  },
  {
    id: "infiltrasi",
    name: "Infiltrasi",
    desc: "Proses meresapnya air hujan ke dalam pori-pori tanah dan mengalir kembali menuju laut.",
    icon: <Droplets className="w-5 h-5" />,
    color: "text-emerald-400",
    pos: { x: 45, y: 85 }
  }
];

export default function SiklusAir() {
  const [temperature, setTemperature] = useState(32);
  const [windSpeed, setWindSpeed] = useState(15);
  const [activePhase, setActivePhase] = useState<CyclePhase | null>(null);
  const [isRaining, setIsRaining] = useState(true);

  const evaporationIntensity = useMemo(() => (temperature / 50) * 20, [temperature]);
  const cloudOffset = useMemo(() => (windSpeed / 100) * 100, [windSpeed]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Hydrology Lab --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Siklus Air</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Hidrometeorologi</p>
            </div>
          </div>

          {/* Environmental Controls */}
          <div className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Thermometer className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Suhu Global</span>
                   </div>
                   <span className="text-lg font-black text-white">{temperature}°C</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="1" 
                  value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Wind className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Kecepatan Angin</span>
                   </div>
                   <span className="text-lg font-black text-white">{windSpeed} km/h</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="1" 
                  value={windSpeed} onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
             </div>

             <button
               onClick={() => setIsRaining(!isRaining)}
               className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all flex items-center justify-center gap-3
                 ${isRaining ? 'bg-sky-600 text-white shadow-sky-500/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}
               `}
             >
               <CloudRain className={`w-4 h-4 ${isRaining ? 'animate-bounce' : ''}`} />
               {isRaining ? "Hujan Aktif" : "Mulai Presipitasi"}
             </button>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {activePhase ? (
               <motion.div 
                 key={activePhase}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl ${PHASES.find(p => p.id === activePhase)?.color.replace('text-', 'bg-')}/20 border border-white/10 text-white`}>
                      {PHASES.find(p => p.id === activePhase)?.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight leading-none mb-1">{PHASES.find(p => p.id === activePhase)?.name}</h2>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${PHASES.find(p => p.id === activePhase)?.color}`}>Fase Hidrologi</span>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                      "{PHASES.find(p => p.id === activePhase)?.desc}"
                    </p>
                 </div>
                 <button 
                   onClick={() => setActivePhase(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                 >
                   Tutup Analisis <Zap className="w-3 h-3" />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sky-400 mb-2">
                       <TrendingUp className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Status Atmosfer</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Laju Penguapan</span>
                          <span className="text-xs font-bold text-white">{temperature > 30 ? 'Tinggi' : temperature > 15 ? 'Sedang' : 'Rendah'}</span>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Kelembapan Awan</span>
                          <span className="text-xs font-bold text-white">{isRaining ? '100% (Saturasi)' : '65%'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-zinc-900 to-transparent rounded-[32px] border border-white/5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Fakta Hidrologi</span>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                      "Jumlah air di Bumi selalu tetap! Air yang kamu minum hari ini mungkin adalah air yang sama yang diminum dinosaurus jutaan tahun lalu."
                    </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Insight */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Waves className="w-4 h-4 text-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Volume Air Bumi</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Lautan menutupi 71% permukaan Bumi dan mengandung 97% dari total air di planet kita.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activePhase || 'idle'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${activePhase === 'evaporasi' ? 'from-amber-500/10' : activePhase === 'kondensasi' ? 'from-sky-300/10' : 'from-indigo-500/5'} to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Layered Ecosystem Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
           
           {/* SVG Graphics Area */}
           <svg viewBox="0 0 1000 600" className="w-full h-full">
              {/* Sky */}
              <rect width="1000" height="600" fill="#020617" />
              
              {/* Sun Visual */}
              <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                 <circle cx="850" cy="100" r={40 + (temperature/50)*10} className="fill-amber-400 blur-[2px]" />
                 <circle cx="850" cy="100" r={60 + (temperature/50)*20} className="fill-amber-400/20 blur-[20px]" />
              </motion.g>

              {/* Mountains & Terrain */}
              <path d="M0 600 L0 450 Q200 300 400 450 L500 500 Q700 550 1000 550 L1000 600 Z" className="fill-zinc-800" />
              <path d="M0 600 L0 520 Q200 450 350 520 L500 550 L1000 550 L1000 600 Z" className="fill-zinc-900" />
              
              {/* Ocean Body */}
              <motion.path 
                animate={{ d: ["M600 600 L600 520 Q800 500 1000 520 L1000 600 Z", "M600 600 L600 530 Q800 510 1000 530 L1000 600 Z", "M600 600 L600 520 Q800 500 1000 520 L1000 600 Z"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="fill-sky-900/60"
              />

              {/* Evaporation Particles */}
              {Array.from({ length: Math.floor(evaporationIntensity) }).map((_, i) => (
                <motion.circle 
                  key={i} 
                  r="2" 
                  fill="rgba(255,255,255,0.4)"
                  initial={{ cx: 700 + Math.random()*200, cy: 520 }}
                  animate={{ 
                    cy: [520, 150], 
                    cx: [null, (700 + Math.random()*200) - cloudOffset],
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ duration: 3 + Math.random()*2, repeat: Infinity, delay: i*0.2 }}
                />
              ))}

              {/* Clouds (Kondensasi) */}
              <motion.g animate={{ x: -cloudOffset }} transition={{ duration: 0.5 }}>
                 <g transform="translate(400, 150)">
                    <circle cx="0" cy="0" r="35" className="fill-white/10" />
                    <circle cx="40" cy="-10" r="45" className="fill-white/10" />
                    <circle cx="85" cy="0" r="35" className="fill-white/10" />
                 </g>
              </motion.g>

              {/* Rain (Presipitasi) */}
              <AnimatePresence>
                 {isRaining && (
                   <g transform={`translate(${400 - cloudOffset}, 180)`}>
                      {Array.from({ length: 40 }).map((_, i) => (
                        <motion.line 
                          key={i} 
                          x1={Math.random()*120} y1="0" x2={Math.random()*120} y2="10" 
                          stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5"
                          animate={{ y: [0, 350], opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                        />
                      ))}
                   </g>
                 )}
              </AnimatePresence>

              {/* Surface Runoff (Infiltrasi) */}
              {isRaining && (
                <motion.path 
                  d="M100 500 Q250 520 600 530" 
                  fill="none" 
                  stroke="rgba(56, 189, 248, 0.2)" 
                  strokeWidth="4" 
                  strokeDasharray="10 10"
                  animate={{ strokeDashoffset: [0, -100] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
           </svg>

           {/* Interactive Process Markers */}
           <div className="absolute inset-0 pointer-events-none">
              {PHASES.map(phase => (
                <motion.button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute group pointer-events-auto z-30 transition-all duration-300
                    ${activePhase === phase.id ? `bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]` : "bg-white/10 backdrop-blur-md border border-white/20"}
                    rounded-full p-3
                  `}
                  style={{ top: `${phase.pos.y}%`, left: `${phase.pos.x}%` }}
                >
                   <div className={activePhase === phase.id ? "text-black" : "text-zinc-400 group-hover:text-white"}>
                      {phase.icon}
                   </div>
                   
                   {/* Label on Hover */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-2xl">
                      {phase.name}
                   </div>
                </motion.button>
              ))}
           </div>

           {/* Analysis Header */}
           <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl">
              <div className={`w-3 h-3 rounded-full bg-sky-500 animate-pulse shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Hydrological System Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">Status: {activePhase ? activePhase.toUpperCase() : 'MONITORING'}</h3>
              </div>
           </div>
        </div>

        {/* Global Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Eksplorasi Marker Siklus untuk Analisis Detail</span>
        </div>
      </div>

    </div>
  );
}
