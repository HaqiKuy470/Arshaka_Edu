"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Info,
  Zap,
  Flame,
  ArrowRight,
  TrendingUp,
  Database,
  Layers,
  Sparkles,
  Thermometer,
  Wind,
  MousePointer2,
  Share2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type RockStage = "magma" | "beku" | "sedimen" | "metamorf";

type RockInfo = {
  id: RockStage;
  name: string;
  scientific: string;
  desc: string;
  examples: string[];
  icon: React.ReactNode;
  color: string;
  glow: string;
  pos: { top: string; left: string };
  processes: { target: RockStage; label: string; action: string }[];
};

// --- Data ---
const ROCKS: RockInfo[] = [
  {
    id: "magma",
    name: "Magma",
    scientific: "Molten Rock",
    desc: "Batuan cair yang sangat panas di bawah kerak bumi. Merupakan 'darah' penggerak geologis bumi.",
    examples: ["Lava", "Magma Granitik", "Magma Basaltik"],
    icon: <Flame className="w-6 h-6" />,
    color: "bg-rose-500",
    glow: "shadow-rose-500/50",
    pos: { top: "50%", left: "50%" },
    processes: [
      { target: "beku", label: "Pendinginan", action: "Kristalisasi & Pembekuan" }
    ]
  },
  {
    id: "beku",
    name: "Batuan Beku",
    scientific: "Igneous",
    desc: "Terbentuk dari magma yang mendingin dan mengeras, baik di bawah tanah maupun di permukaan.",
    examples: ["Granit", "Andesit", "Basalt", "Obsidian"],
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-slate-500",
    glow: "shadow-slate-500/50",
    pos: { top: "15%", left: "50%" },
    processes: [
      { target: "sedimen", label: "Pelapukan", action: "Erosi & Pengendapan" },
      { target: "metamorf", label: "Metamorfisme", action: "Tekanan & Panas Tinggi" }
    ]
  },
  {
    id: "sedimen",
    name: "Batuan Sedimen",
    scientific: "Sedimentary",
    desc: "Terbentuk dari akumulasi material organik atau pecahan batuan yang mengendap dan memadat.",
    examples: ["Batu Gamping", "Batu Bara", "Batu Pasir", "Konglomerat"],
    icon: <Layers className="w-6 h-6" />,
    color: "bg-amber-500",
    glow: "shadow-amber-500/50",
    pos: { top: "50%", left: "85%" },
    processes: [
      { target: "metamorf", label: "Metamorfisme", action: "Tekanan & Panas Tinggi" }
    ]
  },
  {
    id: "metamorf",
    name: "Batuan Metamorf",
    scientific: "Metamorphic",
    desc: "Batuan yang berubah bentuk secara kimia dan fisik akibat panas dan tekanan tanpa mencair.",
    examples: ["Marmer", "Kuarsit", "Sabak", "Gneis"],
    icon: <Database className="w-6 h-6" />,
    color: "bg-emerald-500",
    glow: "shadow-emerald-500/50",
    pos: { top: "85%", left: "50%" },
    processes: [
      { target: "magma", label: "Pelelehan", action: "Suhu Ekstrem Mantel" }
    ]
  }
];

export default function SiklusBatuan() {
  const [activeStage, setActiveStage] = useState<RockStage>("magma");
  const [hoveredProcess, setHoveredProcess] = useState<string | null>(null);

  const current = useMemo(() => ROCKS.find(r => r.id === activeStage)!, [activeStage]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Lithosphere Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Siklus Batuan</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Analisis Petrologi</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <Thermometer className="w-3 h-3 text-rose-400" />
                   <span className="text-[8px] font-black uppercase text-zinc-500">Internal Heat</span>
                </div>
                <div className="text-lg font-black text-white">1,200°C</div>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <Wind className="w-3 h-3 text-sky-400" />
                   <span className="text-[8px] font-black uppercase text-zinc-500">Weathering</span>
                </div>
                <div className="text-lg font-black text-white">Active</div>
             </div>
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             <motion.div 
               key={current.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shadow-xl ${current.color} border border-white/20 text-white shadow-lg ${current.glow}`}>
                    {current.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">{current.name}</h2>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${current.color.replace('bg-', 'text-')}`}>{current.scientific}</span>
                  </div>
               </div>

               <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                    "{current.desc}"
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Karakteristik & Contoh:</h3>
                  <div className="grid grid-cols-2 gap-2">
                     {current.examples.map((ex, i) => (
                       <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 group hover:bg-white/10 transition-all">
                          <Zap className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                          <span className="text-[10px] font-bold text-zinc-300">{ex}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-6 bg-gradient-to-br from-zinc-900 to-transparent rounded-[32px] border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                     <Share2 className="w-4 h-4 text-zinc-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tahap Selanjutnya:</span>
                  </div>
                  <div className="space-y-3">
                     {current.processes.map((p, i) => (
                       <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveStage(p.target)}>
                          <div>
                             <span className="block text-[10px] font-bold text-white">{p.label}</span>
                             <span className="text-[9px] text-zinc-500">{p.action}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                       </div>
                     ))}
                  </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Siklus Geologis</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Batuan bumi terus bertransformasi dalam siklus jutaan tahun melalui panas, tekanan, dan cuaca.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activeStage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${current.color.replace('bg-', 'from-')}/10 to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Circular Cycle Visualization */}
        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
           
           {/* Center Connection Circle */}
           <div className="absolute inset-0 border-2 border-white/5 rounded-full border-dashed animate-spin-slow opacity-20" />

           {/* SVG Path Connections */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
             <defs>
               <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                 <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                 <stop offset="100%" stopColor="rgba(255,255,255,0)" />
               </linearGradient>
             </defs>
             {/* Main Circular Path */}
             <circle cx="200" cy="200" r="140" fill="none" stroke="url(#line-grad)" strokeWidth="1" />
           </svg>

           {/* Rock Nodes */}
           {ROCKS.map((rock) => {
             const isActive = activeStage === rock.id;
             return (
               <motion.button
                 key={rock.id}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setActiveStage(rock.id)}
                 className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[28px] flex items-center justify-center transition-all duration-500 group z-30
                   ${isActive ? `${rock.color} w-20 h-20 shadow-[0_0_40px_rgba(255,255,255,0.2)] ring-4 ring-white/20` : `bg-white/5 border border-white/10 w-16 h-16 hover:bg-white/10 hover:border-white/40`}
                 `}
                 style={{ top: rock.pos.top, left: rock.pos.left }}
               >
                  <div className={isActive ? "text-white" : "text-zinc-500 group-hover:text-white transition-colors"}>
                    {rock.icon}
                  </div>

                  {/* Flow Animation (if hovered) */}
                  {isActive && (
                    <div className="absolute -inset-4 border border-white/20 rounded-[36px] animate-ping opacity-20" />
                  )}

                  {/* Label on Hub */}
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-2xl z-40">
                    {rock.name}
                  </div>
               </motion.button>
             );
           })}

           {/* Floating Process Markers (Interactive Labels in Center) */}
           <div className="absolute inset-0 pointer-events-none">
              {ROCKS.map(r => r.processes.map((p, i) => {
                 const target = ROCKS.find(tr => tr.id === p.target)!;
                 return (
                   <div 
                     key={`${r.id}-${p.target}`}
                     className="absolute"
                     style={{ 
                       top: `calc(${r.pos.top} + (${target.pos.top} - ${r.pos.top})/2)`,
                       left: `calc(${r.pos.left} + (${target.pos.left} - ${r.pos.left})/2)` 
                     }}
                   >
                     {activeStage === r.id && (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                       >
                          <div className={`w-1.5 h-1.5 rounded-full ${ROCKS.find(tr => tr.id === p.target)?.color}`} />
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">{p.label}</span>
                       </motion.div>
                     )}
                   </div>
                 );
              }))}
           </div>
        </div>

        {/* Global Dashboard Header */}
        <div className="absolute top-10 flex gap-4 p-4 px-8 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full z-30">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Lithospheric Monitor Active</span>
           </div>
           <div className="w-px h-4 bg-white/10" />
           <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Stage: {current.name.toUpperCase()}</span>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Klik Ikon Batuan untuk Menelusuri Jalur Transformasi</span>
        </div>
      </div>

    </div>
  );
}
