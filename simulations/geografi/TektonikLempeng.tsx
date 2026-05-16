"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Info,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  Split,
  IterationCcw,
  Waves,
  Mountain,
  Flame,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type MovementType = "divergen" | "konvergen" | "transform";

type GeologicalFeature = {
  id: string;
  name: string;
  desc: string;
  pos: { x: number; y: number };
};

// --- Data ---
const MOVEMENT_DATA: Record<MovementType, {
  name: string;
  icon: React.ReactNode;
  color: string;
  theme: string;
  summary: string;
  example: string;
  consequences: string[];
  features: GeologicalFeature[];
}> = {
  divergen: {
    name: "Divergen",
    icon: <Split className="w-5 h-5" />,
    color: "text-blue-400",
    theme: "blue",
    summary: "Dua lempeng bergerak saling menjauh, menciptakan celah bagi magma untuk naik dan membentuk kerak bumi baru.",
    example: "Punggung Tengah Samudra Atlantik",
    consequences: ["Pembentukan Kerak Baru", "Lembah Retak (Rift Valley)", "Aktivitas Vulkanik Ringan"],
    features: [
      { id: "magma-rise", name: "Magma Naik", desc: "Magma dari mantel naik mengisi celah di antara lempeng.", pos: { x: 50, y: 70 } },
      { id: "new-crust", name: "Kerak Baru", desc: "Magma mendingin menjadi batuan basaltik baru di dasar laut.", pos: { x: 50, y: 35 } }
    ]
  },
  konvergen: {
    name: "Konvergen",
    icon: <IterationCcw className="w-5 h-5" />,
    color: "text-rose-400",
    theme: "rose",
    summary: "Dua lempeng bertabrakan. Lempeng samudra yang lebih berat menyusup ke bawah lempeng benua (Subduksi).",
    example: "Zona Subduksi Jawa & Sumatera",
    consequences: ["Pembentukan Gunung Api", "Palung Laut Dalam", "Pegunungan Lipatan"],
    features: [
      { id: "subduction", name: "Zona Subduksi", desc: "Lempeng samudra masuk ke mantel bumi dan meleleh.", pos: { x: 45, y: 75 } },
      { id: "volcano", name: "Busur Magma", desc: "Magma naik membentuk deretan gunung berapi di daratan.", pos: { x: 75, y: 30 } },
      { id: "trench", name: "Palung Laut", desc: "Lekukan dalam di dasar laut tempat subduksi dimulai.", pos: { x: 35, y: 45 } }
    ]
  },
  transform: {
    name: "Transform",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    color: "text-amber-400",
    theme: "amber",
    summary: "Dua lempeng bergesekan secara mendatar dalam arah yang berlawanan tanpa pembentukan atau perusakan kerak.",
    example: "Sesar San Andreas, California",
    consequences: ["Gempa Bumi Dangkal", "Patahan/Sesar", "Perubahan Aliran Sungai"],
    features: [
      { id: "fault", name: "Garis Sesar", desc: "Retakan besar di kerak bumi tempat lempeng bergesekan.", pos: { x: 50, y: 40 } },
      { id: "epicenter", name: "Pelepasan Energi", desc: "Titik akumulasi tekanan yang memicu gempa bumi besar.", pos: { x: 50, y: 60 } }
    ]
  }
};

export default function TektonikLempeng() {
  const [activeType, setActiveType] = useState<MovementType>("konvergen");
  const [selectedFeature, setSelectedFeature] = useState<GeologicalFeature | null>(null);

  const current = MOVEMENT_DATA[activeType];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Geophysics Panel --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Tektonik Lempeng</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Geodinamika</p>
            </div>
          </div>

          {/* Movement Selection Buttons */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
             {(Object.keys(MOVEMENT_DATA) as MovementType[]).map((key) => {
               const type = MOVEMENT_DATA[key];
               const isActive = activeType === key;
               return (
                 <button
                   key={key}
                   onClick={() => { setActiveType(key); setSelectedFeature(null); }}
                   className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-2 ${isActive ? `bg-${type.theme}-500/10 border border-${type.theme}-500/30 text-${type.theme}-400` : "text-zinc-500 hover:bg-white/5"}`}
                 >
                   {type.icon}
                   <span className="text-[8px] font-black uppercase tracking-widest">{type.name}</span>
                 </button>
               );
             })}
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {selectedFeature ? (
               <motion.div 
                 key={selectedFeature.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl ${current.color} bg-white/5 border border-white/10`}>
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight leading-none mb-1">{selectedFeature.name}</h2>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${current.color}`}>Fitur Geologis</span>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                      "{selectedFeature.desc}"
                    </p>
                 </div>
                 <button 
                   onClick={() => setSelectedFeature(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                 >
                   Kembali ke Analisis <Activity className="w-3 h-3" />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key={activeType}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${current.color} mb-2`}>
                       <TrendingUp className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Analisis Pergerakan</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                      "{current.summary}"
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Konsekuensi Geologis:</h3>
                    <div className="grid grid-cols-1 gap-2">
                       {current.consequences.map((c, i) => (
                         <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                            <div className={`w-1.5 h-1.5 rounded-full ${current.color} shadow-[0_0_10px_currentColor]`} />
                            <span className="text-xs font-bold text-zinc-400">{c}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[32px] border border-white/5 space-y-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Contoh Nyata</span>
                    <p className="text-xs font-black text-white uppercase tracking-wider">{current.example}</p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Monitor */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Arus Konveksi Astenosfer</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Pergerakan lempeng didorong oleh panas dari inti bumi yang menciptakan arus sirkulasi di dalam mantel.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activeType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${activeType === 'konvergen' ? 'from-rose-500/10' : activeType === 'divergen' ? 'from-blue-500/10' : 'from-amber-500/10'} to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Dynamic Geological Cross-Section Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
           
           {/* SVG Graphics Area */}
           <svg viewBox="0 0 1000 600" className="w-full h-full">
              {/* Lower Mantel (Asthenosphere) */}
              <rect x="0" y="400" width="1000" height="200" className="fill-orange-950/40" />
              
              {/* Animated Convection Currents */}
              <AnimatePresence mode="wait">
                 {activeType === 'divergen' && (
                   <motion.g key="currents-div" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.path 
                        d="M 500 550 Q 300 550 300 450 Q 300 400 450 400" 
                        fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="4" strokeDasharray="10 10"
                        animate={{ strokeDashoffset: [-100, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.path 
                        d="M 500 550 Q 700 550 700 450 Q 700 400 550 400" 
                        fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="4" strokeDasharray="10 10"
                        animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                   </motion.g>
                 )}
                 {activeType === 'konvergen' && (
                   <motion.g key="currents-conv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.path 
                        d="M 200 400 Q 400 400 450 500 Q 450 550 300 550" 
                        fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="4" strokeDasharray="10 10"
                        animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.path 
                        d="M 800 400 Q 600 400 550 500 Q 550 550 700 550" 
                        fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="4" strokeDasharray="10 10"
                        animate={{ strokeDashoffset: [-100, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />
                   </motion.g>
                 )}
              </AnimatePresence>

              {/* Tectonic Plates Visuals */}
              <AnimatePresence mode="wait">
                 {activeType === 'divergen' && (
                   <motion.g key="div-plates" initial={{ x: -20 }} animate={{ x: 0 }} exit={{ x: -20 }}>
                      <motion.rect x="0" y="300" width="480" height="100" rx="10" className="fill-zinc-800" animate={{ x: [-10, -30, -10] }} transition={{ duration: 10, repeat: Infinity }} />
                      <motion.rect x="520" y="300" width="480" height="100" rx="10" className="fill-zinc-700" animate={{ x: [10, 30, 10] }} transition={{ duration: 10, repeat: Infinity }} />
                      {/* Rising Magma */}
                      <motion.path d="M480 400 L500 320 L520 400 Z" className="fill-orange-600" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
                      {/* Ocean markers */}
                      <path d="M0 300 L1000 300" className="stroke-blue-900/30" strokeWidth="200" opacity="0.3" />
                   </motion.g>
                 )}

                 {activeType === 'konvergen' && (
                   <motion.g key="conv-plates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Oceanic Plate (Subducting) */}
                      <motion.path 
                        d="M0 300 L550 300 L750 500 L0 500 Z" 
                        className="fill-zinc-800"
                        animate={{ x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }}
                      />
                      {/* Continental Plate (Rising) */}
                      <motion.path 
                        d="M1000 300 L600 300 L600 450 L1000 450 Z" 
                        className="fill-zinc-700"
                      />
                      {/* Mountain range */}
                      <motion.path 
                        d="M600 300 L650 200 L720 300 L780 180 L850 300 Z" 
                        className="fill-zinc-600 stroke-zinc-500" 
                        strokeWidth="2"
                      />
                      {/* Magma plume */}
                      <motion.circle 
                        cx="720" cy="400" r="15" className="fill-rose-600"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
                      />
                   </motion.g>
                 )}

                 {activeType === 'transform' && (
                   <motion.g key="trans-plates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Top View Abstraction */}
                      <rect width="1000" height="600" fill="#020617" />
                      <motion.rect 
                        x="0" y="0" width="495" height="600" 
                        className="fill-zinc-800" 
                        animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }}
                      />
                      <motion.rect 
                        x="505" y="0" width="495" height="600" 
                        className="fill-zinc-700" 
                        animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }}
                      />
                      {/* Fault Line Energy */}
                      <line x1="500" y1="0" x2="500" y2="600" className="stroke-amber-500/20" strokeWidth="10" strokeDasharray="10 5" />
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.circle 
                          key={i} cx="500" cy={100 + i*60} r="8" className="fill-amber-500/40"
                          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        />
                      ))}
                   </motion.g>
                 )}
              </AnimatePresence>
           </svg>

           {/* Interactive Feature Markers */}
           <div className="absolute inset-0 pointer-events-none">
              {current.features.map(feat => (
                <motion.button
                  key={feat.id}
                  onClick={() => setSelectedFeature(feat)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute group pointer-events-auto z-30 transition-all duration-300
                    ${selectedFeature?.id === feat.id ? `bg-${current.theme}-500 shadow-[0_0_20px_rgba(255,255,255,0.4)]` : "bg-white/10 backdrop-blur-md border border-white/20"}
                    rounded-full p-3
                  `}
                  style={{ top: `${feat.pos.y}%`, left: `${feat.pos.x}%` }}
                >
                   <div className={selectedFeature?.id === feat.id ? "text-white" : "text-zinc-400 group-hover:text-white"}>
                      <MousePointer2 className="w-4 h-4" />
                   </div>
                   
                   {/* Label on Hover */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-2xl">
                      {feat.name}
                   </div>
                </motion.button>
              ))}
           </div>

           {/* Active Analysis Dashboard */}
           <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-[24px]">
              <div className={`w-3 h-3 rounded-full bg-${current.theme}-500 animate-pulse shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Geodynamic Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">{current.name}</h3>
              </div>
           </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <IterationCcw className="w-4 h-4 animate-spin-slow text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Eksplorasi marker fitur untuk analisis struktur bumi</span>
        </div>
      </div>

    </div>
  );
}
