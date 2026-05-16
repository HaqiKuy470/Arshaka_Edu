"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Waves,
  Wind,
  Thermometer,
  Zap,
  ArrowRight,
  TrendingUp,
  Globe,
  Info,
  Droplets,
  Share2,
  MousePointer2,
  Compass
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type CurrentType = "surface-warm" | "surface-cold" | "deep-conveyor";

type OceanCurrent = {
  id: string;
  name: string;
  type: CurrentType;
  temp: "Panas" | "Dingin" | "Dalam";
  desc: string;
  impact: string;
  path: string; // SVG path
  labelPos: { x: number; y: number };
};

// --- Data ---
const CURRENTS: OceanCurrent[] = [
  {
    id: "gulf-stream",
    name: "Arus Teluk (Gulf Stream)",
    type: "surface-warm",
    temp: "Panas",
    desc: "Membawa air hangat dari Teluk Meksiko melintasi Atlantik menuju Eropa Barat.",
    impact: "Menghangatkan iklim Eropa Barat, mencegah pembekuan pelabuhan di musim dingin.",
    path: "M 250 140 Q 300 100 350 80",
    labelPos: { x: 300, y: 110 }
  },
  {
    id: "humboldt",
    name: "Arus Peru (Humboldt)",
    type: "surface-cold",
    temp: "Dingin",
    desc: "Arus dingin yang mengalir ke utara di sepanjang pantai barat Amerika Selatan.",
    impact: "Memperkaya ekosistem laut dengan nutrisi, namun menyebabkan kekeringan di Gurun Atacama.",
    path: "M 240 195 Q 220 160 215 120",
    labelPos: { x: 210, y: 160 }
  },
  {
    id: "kuroshio",
    name: "Arus Kuroshio",
    type: "surface-warm",
    temp: "Panas",
    desc: "Setara dengan Gulf Stream di Pasifik, membawa air hangat ke pantai timur Jepang.",
    impact: "Mendukung keanekaragaman hayati terumbu karang dan mempengaruhi pola badai di Asia Timur.",
    path: "M 80 130 Q 100 100 120 70",
    labelPos: { x: 100, y: 100 }
  },
  {
    id: "conveyor-belt",
    name: "Sabuk Konveyor Termohalin",
    type: "deep-conveyor",
    temp: "Dalam",
    desc: "Sirkulasi global raksasa yang digerakkan oleh perbedaan suhu dan salinitas air.",
    impact: "Mengatur suhu bumi secara global; satu siklus penuh memakan waktu sekitar 1.000 tahun.",
    path: "M 20 180 Q 200 160 380 180 Q 200 220 20 180",
    labelPos: { x: 200, y: 185 }
  }
];

export default function ArusLaut() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConveyor, setShowConveyor] = useState(true);

  const activeCurrent = useMemo(() => 
    CURRENTS.find(c => c.id === selectedId) || null
  , [selectedId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Ocean Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Arus Laut Global</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Oseanografi</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-indigo-400">
                   <Droplets className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Sirkulasi Global</span>
                </div>
                <button 
                  onClick={() => setShowConveyor(!showConveyor)}
                  className={`text-[8px] font-black px-2 py-1 rounded border transition-all ${showConveyor ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                >
                  {showConveyor ? "CONVEYOR ON" : "CONVEYOR OFF"}
                </button>
             </div>
             <div className="flex gap-2">
                <div className="flex-1 p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                   <span className="block text-[8px] font-black text-red-400 uppercase mb-1">Arus Panas</span>
                   <span className="text-[10px] font-bold text-white">Equator → Kutub</span>
                </div>
                <div className="flex-1 p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-center">
                   <span className="block text-[8px] font-black text-sky-400 uppercase mb-1">Arus Dingin</span>
                   <span className="text-[10px] font-bold text-white">Kutub → Equator</span>
                </div>
             </div>
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {activeCurrent ? (
               <motion.div 
                 key={activeCurrent.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 text-white bg-white/5`}>
                      <Waves className={`w-6 h-6 ${activeCurrent.temp === 'Panas' ? 'text-red-400' : activeCurrent.temp === 'Dingin' ? 'text-sky-400' : 'text-indigo-400'}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight leading-none mb-1">{activeCurrent.name}</h2>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-3 h-3 text-zinc-500" />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeCurrent.temp === 'Panas' ? 'text-red-400' : activeCurrent.temp === 'Dingin' ? 'text-sky-400' : 'text-indigo-400'}`}>
                          Arus {activeCurrent.temp}
                        </span>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {activeCurrent.desc}
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400 px-2">
                       <Compass className="w-4 h-4" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest">Dampak Ekosistem:</h3>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                       <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                         "{activeCurrent.impact}"
                       </p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setSelectedId(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                 >
                   Kembali ke Peta Global <Globe className="w-3 h-3" />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                       <TrendingUp className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mekanisme Pendorong</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                          <Wind className="w-5 h-5 text-zinc-500" />
                          <div>
                             <span className="block text-[10px] font-bold text-white">Angin & Efek Coriolis</span>
                             <span className="text-[9px] text-zinc-500">Menggerakkan arus permukaan.</span>
                          </div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                          <Zap className="w-5 h-5 text-zinc-500" />
                          <div>
                             <span className="block text-[10px] font-bold text-white">Perbedaan Densitas</span>
                             <span className="text-[9px] text-zinc-500">Menciptakan sirkulasi air dalam.</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-zinc-900 to-transparent rounded-[32px] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <Info className="w-4 h-4 text-zinc-500" />
                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tahukah Kamu?</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                      Arus laut memindahkan energi panas dari ekuator ke kutub, bertindak sebagai sistem pendingin udara raksasa bagi planet kita.
                    </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Navigasi Interaktif</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Gunakan kursor untuk mengeksplorasi jalur arus laut pada peta navigasi global.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={selectedId || 'idle'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${activeCurrent?.temp === 'Panas' ? 'from-red-500/10' : activeCurrent?.temp === 'Dingin' ? 'from-sky-500/10' : 'from-indigo-500/10'} to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Global Navigation Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
           
           {/* Abstract World Map Visual */}
           <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
              {/* Americas */}
              <path d="M 230 40 Q 200 80 230 110 Q 250 150 240 190 L 260 190 Q 280 150 250 110 Q 280 70 260 40 Z" fill="#64748b" />
              {/* Eurasia / Africa */}
              <path d="M 280 30 Q 320 80 300 130 Q 320 180 350 180 Q 370 140 330 100 Q 380 50 350 30 Z" fill="#64748b" />
              {/* Asia / Australia */}
              <path d="M 0 40 Q 50 80 30 120 Q 80 140 50 180 Q 20 150 0 160 Z" fill="#64748b" />
           </svg>

           {/* Interactive Current Paths */}
           <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full">
              <defs>
                 <marker id="arrowhead-red" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                    <polygon points="0 0, 4 2, 0 4" fill="#f87171" />
                 </marker>
                 <marker id="arrowhead-blue" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                    <polygon points="0 0, 4 2, 0 4" fill="#38bdf8" />
                 </marker>
                 <marker id="arrowhead-purple" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                    <polygon points="0 0, 4 2, 0 4" fill="#818cf8" />
                 </marker>
              </defs>

              <AnimatePresence>
                 {showConveyor && (
                    <motion.path 
                      key="conveyor-path"
                      d={CURRENTS[3].path}
                      fill="none" 
                      stroke="#818cf8" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3, strokeDashoffset: [0, -100] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                 )}

                 {CURRENTS.filter(c => c.id !== 'conveyor-belt').map(curr => {
                    const isActive = selectedId === curr.id;
                    const color = curr.temp === 'Panas' ? '#f87171' : '#38bdf8';
                    return (
                      <g key={curr.id}>
                         <motion.path 
                           d={curr.path} 
                           fill="none" 
                           stroke={color} 
                           strokeWidth={isActive ? "4" : "2"} 
                           strokeDasharray={isActive ? "0" : "8 4"}
                           markerEnd={`url(#arrowhead-${curr.temp === 'Panas' ? 'red' : 'blue'})`}
                           animate={{ opacity: isActive ? 1 : 0.4, strokeDashoffset: isActive ? 0 : [0, -12] }}
                           transition={{ duration: 1, repeat: isActive ? 0 : Infinity, ease: "linear" }}
                           className="cursor-pointer pointer-events-auto"
                           onMouseEnter={() => setSelectedId(curr.id)}
                           onMouseLeave={() => setSelectedId(null)}
                         />
                         
                         {/* Particle Flow when Active */}
                         {isActive && Array.from({ length: 5 }).map((_, i) => (
                           <motion.circle
                             key={i}
                             r="2"
                             fill={color}
                             initial={{ offsetDistance: "0%" }}
                             animate={{ offsetDistance: "100%" }}
                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                             style={{ offsetPath: `path("${curr.path}")` }}
                           />
                         ))}
                      </g>
                    );
                 })}
              </AnimatePresence>
           </svg>

           {/* Interactive Feature Markers (Labels) */}
           <div className="absolute inset-0 pointer-events-none">
              {CURRENTS.map(curr => (
                <motion.button
                  key={curr.id}
                  onMouseEnter={() => setSelectedId(curr.id)}
                  onMouseLeave={() => setSelectedId(null)}
                  whileHover={{ scale: 1.2 }}
                  className={`absolute pointer-events-auto group z-30 transition-all duration-300
                    ${selectedId === curr.id ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : "bg-white/10 backdrop-blur-md border border-white/20"}
                    rounded-full p-2
                  `}
                  style={{ top: `${(curr.labelPos.y / 200) * 100}%`, left: `${(curr.labelPos.x / 400) * 100}%` }}
                >
                   <div className={selectedId === curr.id ? "text-black" : "text-zinc-500 group-hover:text-white"}>
                      <MousePointer2 className="w-3 h-3" />
                   </div>
                   
                   {/* Tooltip */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-2xl">
                      {curr.name}
                   </div>
                </motion.button>
              ))}
           </div>

           {/* Map Dashboard Header */}
           <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl">
              <div className={`w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Oceanographic Analysis</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">{selectedId ? activeCurrent?.name : 'Navigasi Arus Global'}</h3>
              </div>
           </div>
        </div>

        {/* Global Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <Compass className="w-4 h-4 animate-spin-slow text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Eksplorasi Jalur Navigasi untuk Detail Sirkulasi Laut</span>
        </div>
      </div>

    </div>
  );
}
