"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  Info, 
  ChevronLeft,
  Search,
  Activity,
  Zap,
  Layers,
  History,
  TrendingUp,
  Fingerprint
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type SpeciesNode = {
  id: string;
  name: string;
  icon: string;
  trait: string;
  desc: string;
  color: string;
  pos: { x: number; y: number };
  parentId?: string;
};

// --- Data ---
const SPECIES: SpeciesNode[] = [
  { id: "ancestor", name: "Leluhur Chordata", icon: "🧬", trait: "Notokord", desc: "Nenek moyang pertama yang memiliki struktur penyokong tubuh dasar.", color: "bg-zinc-600", pos: { x: 50, y: 360 } },
  { id: "sharks", name: "Hiu & Pari", icon: "🦈", trait: "Rahang Berengsel", desc: "Vertebrata awal dengan kerangka tulang rawan dan rahang yang kuat.", color: "bg-blue-500", pos: { x: 150, y: 280 }, parentId: "ancestor" },
  { id: "bony-fish", name: "Ikan Bertulang Sejati", icon: "🐟", trait: "Tulang Keras", desc: "Evolusi kerangka kalsium yang lebih kuat dan kantung renang.", color: "bg-sky-500", pos: { x: 250, y: 220 }, parentId: "sharks" },
  { id: "amphibians", name: "Amfibi", icon: "🐸", trait: "Empat Kaki (Tetrapoda)", desc: "Hewan pertama yang mampu berjalan di darat meskipun masih terikat air.", color: "bg-emerald-500", pos: { x: 350, y: 160 }, parentId: "bony-fish" },
  { id: "reptiles", name: "Reptil & Burung", icon: "🦎", trait: "Kulit Bersisik & Amnion", desc: "Mampu berkembang biak murni di darat dengan telur bercangkang.", color: "bg-rose-500", pos: { x: 450, y: 100 }, parentId: "amphibians" },
  { id: "mammals", name: "Mamalia", icon: "🐒", trait: "Rambut & Kelenjar Susu", desc: "Kelompok hewan yang merawat anak dengan susu dan memiliki suhu tubuh stabil.", color: "bg-amber-500", pos: { x: 450, y: 40 }, parentId: "amphibians" }
];

export default function PohonFilogenetik() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeNode = useMemo(() => 
    SPECIES.find(s => s.id === (selectedId || hoveredId))
  , [selectedId, hoveredId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Evolutionary Info --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Filogenetik</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Pohon Evolusi Vertebrata</p>
            </div>
          </div>

          <div className="p-5 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                <GitBranch className="w-5 h-5" />
             </div>
             <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Metode Analisis</span>
                <p className="text-xs font-bold text-white uppercase tracking-wider leading-none">Kladistik v3.0</p>
             </div>
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {activeNode ? (
               <motion.div 
                 key={activeNode.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl ${activeNode.color} border border-white/20`}>
                      {activeNode.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">{activeNode.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{activeNode.trait}</span>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {activeNode.desc}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status Evolusi</span>
                       <span className="text-xs font-bold text-white uppercase">Divergen</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Indikator DNA</span>
                       <span className="text-xs font-bold text-emerald-400 uppercase">Cocok</span>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <Fingerprint className="w-10 h-10 text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">Pilih Cabang</h3>
                  <p className="text-xs text-zinc-600 max-w-[200px] mt-2 font-medium">
                    Klik node atau garis keturunan untuk melihat tonggak sejarah evolusi.
                  </p>
               </div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Insight */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-amber-500 mb-4">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Garis Waktu Evolusi</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Perjalanan vertebrata dari air ke darat memakan waktu ratusan juta tahun melalui adaptasi bertahap.
           </p>
        </div>
      </div>

      {/* --- Center: Tree Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full" />
           {/* Grid Background */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        </div>

        {/* SVG Cladogram Container */}
        <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
           <svg viewBox="0 0 500 400" className="w-full h-full overflow-visible drop-shadow-2xl">
              
              {/* Branch Lines */}
              {SPECIES.map((s) => {
                if (!s.parentId) return null;
                const parent = SPECIES.find(p => p.id === s.parentId);
                if (!parent) return null;
                
                const isActive = selectedId === s.id || hoveredId === s.id;
                
                return (
                  <motion.g key={`branch-${s.id}`}>
                    {/* Vertical Segment */}
                    <motion.path 
                      d={`M ${parent.pos.x} ${parent.pos.y} L ${parent.pos.x} ${s.pos.y}`}
                      stroke={isActive ? "#fbbf24" : "rgba(255,255,255,0.1)"}
                      strokeWidth={isActive ? "4" : "2"}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                    {/* Horizontal Segment */}
                    <motion.path 
                      d={`M ${parent.pos.x} ${s.pos.y} L ${s.pos.x} ${s.pos.y}`}
                      stroke={isActive ? "#fbbf24" : "rgba(255,255,255,0.1)"}
                      strokeWidth={isActive ? "4" : "2"}
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    
                    {/* Trait Milestone Marker */}
                    <motion.circle 
                      cx={(parent.pos.x + s.pos.x) / 2} 
                      cy={s.pos.y} 
                      r="4" 
                      fill="#fbbf24" 
                      className={isActive ? "animate-pulse" : "opacity-40"}
                    />
                    {isActive && (
                      <motion.text 
                        x={(parent.pos.x + s.pos.x) / 2} 
                        y={s.pos.y - 12} 
                        textAnchor="middle" 
                        fill="#fbbf24" 
                        fontSize="10" 
                        fontWeight="900"
                        className="uppercase tracking-widest"
                      >
                        + {s.trait}
                      </motion.text>
                    )}
                  </motion.g>
                );
              })}

              {/* Species Nodes */}
              {SPECIES.map((s) => (
                <motion.g 
                  key={s.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedId(s.id)}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                   {/* Node Background */}
                   <rect 
                     x={s.pos.x - 20} y={s.pos.y - 20} 
                     width="40" height="40" 
                     rx="12" 
                     className={`transition-all duration-300 ${selectedId === s.id || hoveredId === s.id ? s.color : "fill-white/5 stroke-white/10"}`}
                     strokeWidth="2"
                   />
                   
                   {/* Icon */}
                   <text 
                     x={s.pos.x} y={s.pos.y + 6} 
                     textAnchor="middle" 
                     fontSize="20"
                   >
                     {s.icon}
                   </text>

                   {/* Label */}
                   <text 
                     x={s.pos.x + 25} y={s.pos.y + 5} 
                     textAnchor="start" 
                     fill="white" 
                     fontSize="10" 
                     fontWeight="900"
                     className="uppercase tracking-[0.1em] opacity-80"
                   >
                     {s.name}
                   </text>
                </motion.g>
              ))}

              {/* Time Axis */}
              <g opacity="0.3">
                 <line x1="20" y1="380" x2="480" y2="380" stroke="white" strokeWidth="1" strokeDasharray="4,4" />
                 <text x="480" y="395" textAnchor="end" fill="white" fontSize="8" fontWeight="bold" className="uppercase tracking-widest">Waktu ➔</text>
              </g>
           </svg>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-10 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500">
           <Activity className="w-4 h-4 animate-pulse text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Klik ikon spesies untuk melihat ciri derivasi</span>
        </div>

        {/* Bottom Legend */}
        <div className="absolute top-10 flex gap-6 z-30">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Titik Evolusi (Sina-pomorfi)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Common Ancestor</span>
           </div>
        </div>
      </div>

    </div>
  );
}
