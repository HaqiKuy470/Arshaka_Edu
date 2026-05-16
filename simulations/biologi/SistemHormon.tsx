"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Activity, 
  ChevronLeft,
  Info,
  Droplet,
  FlaskConical,
  Wind,
  Flame,
  MousePointer2,
  Share2,
  ShieldCheck,
  Brain
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type GlandType = "pituitari" | "tiroid" | "adrenal" | "pankreas";

type GlandInfo = {
  id: GlandType;
  name: string;
  nick: string;
  desc: string;
  hormones: string[];
  icon: React.ReactNode;
  color: string;
  pos: { top: string; left: string };
  interactiveLabel: string;
  simulationRange: [number, number];
  unit: string;
};

// --- Data ---
const GLANDS: GlandInfo[] = [
  {
    id: "pituitari",
    name: "Kelenjar Pituitari",
    nick: "Master Gland",
    desc: "Kelenjar induk yang mengontrol fungsi kelenjar endokrin lainnya melalui sinyal hormonal.",
    hormones: ["GH (Pertumbuhan)", "TSH", "Oksitosin"],
    icon: <Brain className="w-5 h-5" />,
    color: "bg-purple-500",
    pos: { top: "12%", left: "50%" },
    interactiveLabel: "Laju Pertumbuhan",
    simulationRange: [0, 100],
    unit: "%"
  },
  {
    id: "tiroid",
    name: "Kelenjar Tiroid",
    nick: "Pusat Metabolisme",
    desc: "Mengatur seberapa cepat tubuh membakar energi dan tingkat sensitivitas terhadap hormon lain.",
    hormones: ["Tiroksin (T4)", "Triiodotironin (T3)"],
    icon: <Flame className="w-5 h-5" />,
    color: "bg-emerald-500",
    pos: { top: "22%", left: "50%" },
    interactiveLabel: "Tingkat Metabolisme",
    simulationRange: [0, 100],
    unit: "kcal/h"
  },
  {
    id: "adrenal",
    name: "Kelenjar Adrenal",
    nick: "Pusat Respon Stress",
    desc: "Memicu respon 'Fight or Flight' dalam situasi darurat dengan meningkatkan detak jantung.",
    hormones: ["Adrenalin", "Kortisol"],
    icon: <Zap className="w-5 h-5" />,
    color: "bg-amber-500",
    pos: { top: "45%", left: "50%" },
    interactiveLabel: "Detak Jantung (BPM)",
    simulationRange: [60, 180],
    unit: "bpm"
  },
  {
    id: "pankreas",
    name: "Pankreas",
    nick: "Regulator Glukosa",
    desc: "Menjaga keseimbangan kadar gula darah agar sel-sel tubuh mendapatkan energi yang cukup.",
    hormones: ["Insulin", "Glukagon"],
    icon: <Droplet className="w-5 h-5" />,
    color: "bg-rose-500",
    pos: { top: "52%", left: "50%" },
    interactiveLabel: "Gula Darah (mg/dL)",
    simulationRange: [40, 240],
    unit: "mg/dL"
  }
];

export default function SistemHormon() {
  const [selectedId, setSelectedId] = useState<GlandType>("pankreas");
  const [simValue, setSimValue] = useState(100);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const currentGland = useMemo(() => 
    GLANDS.find(g => g.id === selectedId) || GLANDS[3]
  , [selectedId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Gland Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Sistem Hormon</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Endokrinologi</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl border border-indigo-500/20 space-y-4">
             <div className="flex items-center gap-3 text-indigo-400">
                <FlaskConical className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status Homeostasis</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{currentGland.interactiveLabel}</span>
                <span className={`text-lg font-black font-mono ${simValue > 140 ? 'text-rose-500' : simValue < 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                   {simValue} {currentGland.unit}
                </span>
             </div>
             <input 
               type="range"
               min={currentGland.simulationRange[0]}
               max={currentGland.simulationRange[1]}
               value={simValue}
               onChange={(e) => setSimValue(parseInt(e.target.value))}
               className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/5 accent-${currentGland.color.split('-')[1]}-500`}
             />
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentGland.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${currentGland.color} border border-white/20 text-white`}>
                    {currentGland.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">{currentGland.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{currentGland.nick}</span>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    {currentGland.desc}
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Daftar Hormon:</h3>
                  <div className="grid grid-cols-2 gap-2">
                     {currentGland.hormones.map((h, i) => (
                       <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                          <Droplet className="w-3 h-3 text-zinc-500" />
                          <span className="text-[10px] font-bold text-zinc-300">{h}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Homeostasis FeedBack */}
               <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${simValue > 140 ? 'bg-rose-500/10 border-rose-500/30' : simValue < 70 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <Activity className={`w-5 h-5 ${simValue > 140 || simValue < 70 ? 'animate-pulse' : ''}`} />
                  <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                     {simValue > 140 ? "Kadar Berlebih: Menyeimbangkan..." : simValue < 70 ? "Kadar Kurang: Melepaskan Hormon..." : "Kondisi Seimbang (Homeostasis)"}
                  </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Aliran Pesan Kimiawi</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Hormon mengalir melalui darah untuk mencari organ target spesifik.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={currentGland.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${currentGland.color.replace('bg-', 'from-')}/5 to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Human Silhouette Visualization */}
        <div className="relative w-[360px] h-[700px] flex items-center justify-center">
           
           {/* Base Silhouette (Refined) */}
           <div className="absolute inset-0 border-2 border-white/10 rounded-[140px] bg-zinc-900/10 backdrop-blur-sm" />
           <div className="absolute -top-12 w-32 h-32 border-2 border-white/10 rounded-full bg-zinc-900/10 backdrop-blur-sm" />

           {/* Interactive Gland Markers */}
           <div className="relative w-full h-full">
              {GLANDS.map((g) => (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredId(g.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => { setSelectedId(g.id); setSimValue(g.id === 'adrenal' ? 70 : 100); }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-500 group z-20
                    ${selectedId === g.id ? `${g.color} w-10 h-10 shadow-[0_0_30px_rgba(255,255,255,0.4)] ring-4 ring-white/20` : `bg-white/5 border border-white/20 w-8 h-8 hover:bg-white/10 hover:border-white/40`}
                  `}
                  style={{ top: g.pos.top, left: g.pos.left }}
                >
                   {/* Icon or Pulse */}
                   {selectedId === g.id ? (
                     <div className="text-white scale-75">{g.icon}</div>
                   ) : (
                     <div className={`w-2 h-2 rounded-full ${g.color} animate-pulse`} />
                   )}

                   {/* Tooltip on Hover */}
                   <AnimatePresence>
                     {hoveredId === g.id && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="absolute -top-12 bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl z-30"
                       >
                         {g.name}
                       </motion.div>
                     )}
                   </AnimatePresence>
                </motion.button>
              ))}

              {/* Hormone Flow Visualization (Active only when sim changes) */}
              <AnimatePresence>
                 {(simValue > 140 || simValue < 70) && (
                   <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ top: currentGland.pos.top, left: currentGland.pos.left, opacity: 0, scale: 0 }}
                          animate={{ 
                            top: `${Math.random() * 80 + 10}%`, 
                            left: `${Math.random() * 60 + 20}%`, 
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.5]
                          }}
                          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                          className={`absolute w-1.5 h-1.5 rounded-full ${currentGland.color} blur-[1px]`}
                        />
                      ))}
                   </div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Global Feedback Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Interaksi Marker Kelenjar untuk Analisis Detail</span>
        </div>
      </div>

    </div>
  );
}
