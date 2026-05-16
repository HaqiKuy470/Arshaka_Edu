"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudRain, 
  ChevronLeft,
  Info,
  Wind,
  Sun,
  Waves,
  TreeDeciduous,
  Factory,
  Database,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Zap,
  Activity,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type CycleType = "karbon" | "nitrogen" | "air";

type ProcessInfo = {
  id: string;
  name: string;
  desc: string;
  pos: { x: number; y: number };
  icon: React.ReactNode;
};

// --- Data ---
const CYCLE_DATA: Record<CycleType, {
  name: string;
  formula: string;
  color: string;
  theme: string;
  summary: string;
  processes: ProcessInfo[];
}> = {
  air: {
    name: "Siklus Air",
    formula: "H₂O",
    color: "text-sky-400",
    theme: "sky",
    summary: "Sirkulasi air tanpa henti antara atmosfer, daratan, dan lautan melalui perubahan wujud.",
    processes: [
      { id: "evaporasi", name: "Evaporasi", desc: "Penguapan air laut oleh panas matahari.", pos: { x: 80, y: 70 }, icon: <Sun className="w-4 h-4" /> },
      { id: "kondensasi", name: "Kondensasi", desc: "Uap air mendingin dan membentuk awan.", pos: { x: 50, y: 20 }, icon: <Wind className="w-4 h-4" /> },
      { id: "presipitasi", name: "Presipitasi", desc: "Hujan atau salju jatuh ke permukaan bumi.", pos: { x: 20, y: 40 }, icon: <CloudRain className="w-4 h-4" /> },
      { id: "run-off", name: "Infiltrasi", desc: "Air meresap ke dalam tanah dan mengalir kembali ke laut.", pos: { x: 50, y: 85 }, icon: <Waves className="w-4 h-4" /> }
    ]
  },
  karbon: {
    name: "Siklus Karbon",
    formula: "CO₂",
    color: "text-amber-400",
    theme: "amber",
    summary: "Pergerakan karbon antara biosfer, atmosfer, dan geosfer, krusial bagi kehidupan dan iklim.",
    processes: [
      { id: "fotosintesis", name: "Fotosintesis", desc: "Tumbuhan menyerap CO₂ dari udara untuk membuat makanan.", pos: { x: 20, y: 70 }, icon: <TreeDeciduous className="w-4 h-4" /> },
      { id: "respirasi", name: "Respirasi", desc: "Makhluk hidup melepaskan CO₂ kembali ke atmosfer.", pos: { x: 50, y: 75 }, icon: <Activity className="w-4 h-4" /> },
      { id: "emisi", name: "Emisi Fosilis", desc: "Pembakaran bahan bakar fosil oleh industri meningkatkan kadar CO₂.", pos: { x: 80, y: 65 }, icon: <Factory className="w-4 h-4" /> },
      { id: "dekomposisi", name: "Dekomposisi", desc: "Penguraian sisa makhluk hidup menyimpan karbon di dalam tanah.", pos: { x: 50, y: 90 }, icon: <Database className="w-4 h-4" /> }
    ]
  },
  nitrogen: {
    name: "Siklus Nitrogen",
    formula: "N₂",
    color: "text-emerald-400",
    theme: "emerald",
    summary: "Proses pengubahan nitrogen atmosfer menjadi bentuk yang dapat digunakan oleh makhluk hidup.",
    processes: [
      { id: "fiksasi", name: "Fiksasi", desc: "Bakteri mengubah N₂ atmosfer menjadi amonia di akar tanaman.", pos: { x: 30, y: 85 }, icon: <Zap className="w-4 h-4" /> },
      { id: "asimilasi", name: "Asimilasi", desc: "Tanaman menyerap senyawa nitrogen untuk membentuk protein.", pos: { x: 30, y: 65 }, icon: <TreeDeciduous className="w-4 h-4" /> },
      { id: "nitrifikasi", name: "Nitrifikasi", desc: "Pengubahan amonia menjadi nitrat oleh bakteri tanah.", pos: { x: 60, y: 90 }, icon: <FlaskConical className="w-4 h-4" /> },
      { id: "denitrifikasi", name: "Denitrifikasi", desc: "Pengembalian nitrogen ke atmosfer oleh bakteri khusus.", pos: { x: 80, y: 50 }, icon: <Wind className="w-4 h-4" /> }
    ]
  }
};



export default function SiklusBiogeokimia() {
  const [activeCycle, setActiveCycle] = useState<CycleType>("air");
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const current = CYCLE_DATA[activeCycle];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Cycle Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Siklus Bumi</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Biogeokimia</p>
            </div>
          </div>

          {/* Cycle Selection */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
             {(Object.keys(CYCLE_DATA) as CycleType[]).map((key) => (
               <button
                 key={key}
                 onClick={() => { setActiveCycle(key); setSelectedProcess(null); }}
                 className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCycle === key ? `bg-${CYCLE_DATA[key].theme}-500/10 border border-${CYCLE_DATA[key].theme}-500/30 text-${CYCLE_DATA[key].theme}-400` : "text-zinc-500 hover:bg-white/5"}`}
               >
                 {key}
               </button>
             ))}
          </div>
        </div>

        {/* Process Detail Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {selectedProcess ? (
               <motion.div 
                 key={selectedProcess}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl ${current.color} bg-white/5 border border-white/10`}>
                      {current.processes.find(p => p.id === selectedProcess)?.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">{current.processes.find(p => p.id === selectedProcess)?.name}</h2>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${current.color}`}>Detail Mekanisme</span>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {current.processes.find(p => p.id === selectedProcess)?.desc}
                    </p>
                 </div>
                 <button 
                   onClick={() => setSelectedProcess(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                 >
                   Kembali ke Ringkasan <ArrowRight className="w-3 h-3 rotate-180" />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key={activeCycle}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${current.color} mb-2`}>
                       <TrendingUp className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Ringkasan {current.name}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="text-2xl font-black text-white">{current.formula}</div>
                       <div className="h-8 w-px bg-white/10" />
                       <p className="text-[11px] text-zinc-500 leading-relaxed italic">{current.summary}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Proses Utama:</h3>
                    <div className="grid grid-cols-1 gap-2">
                       {current.processes.map(p => (
                         <button 
                           key={p.id} 
                           onClick={() => setSelectedProcess(p.id)}
                           className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:bg-white/10 transition-all group"
                         >
                           <div className="flex items-center gap-4">
                              <div className="text-zinc-500 group-hover:text-white transition-colors">{p.icon}</div>
                              <span className="text-xs font-bold text-zinc-400 group-hover:text-white">{p.name}</span>
                           </div>
                           <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-all" />
                         </button>
                       ))}
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Stats */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Kandungan Global</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             {activeCycle === 'air' ? "Total air bumi: 1,386 miliar km³, 97% berada di lautan." : activeCycle === 'karbon' ? "Lautan menyerap sekitar 25% dari seluruh emisi karbon antropogenik." : "78% atmosfer bumi terdiri dari gas nitrogen, namun butuh fiksasi biologis untuk digunakan."}
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activeCycle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${activeCycle === 'air' ? 'from-sky-500/10' : activeCycle === 'karbon' ? 'from-amber-500/10' : 'from-emerald-500/10'} to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Layered Ecosystem Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/50 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
           
           {/* Dynamic Environment SVG */}
           <svg viewBox="0 0 1000 600" className="w-full h-full">
              {/* Sky */}
              <rect width="1000" height="600" fill={activeCycle === 'air' ? "#0f172a" : "#020617"} />
              
              {/* Mountains & Terrain */}
              <motion.path 
                d="M0 600 L0 500 Q200 400 400 500 L600 500 Q800 600 1000 500 L1000 600 Z" 
                className="fill-zinc-800 transition-colors duration-1000" 
              />
              <motion.path 
                d="M400 600 L400 450 Q700 350 1000 450 L1000 600 Z" 
                className="fill-zinc-900 transition-colors duration-1000" 
              />

              {/* Water Body */}
              <motion.path 
                animate={{ d: ["M600 600 L600 520 Q800 500 1000 520 L1000 600 Z", "M600 600 L600 530 Q800 510 1000 530 L1000 600 Z", "M600 600 L600 520 Q800 500 1000 520 L1000 600 Z"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="fill-sky-900/60"
              />

              {/* Cycle Specific Elements */}
              <AnimatePresence mode="wait">
                 {activeCycle === 'air' && (
                   <motion.g key="air-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Clouds */}
                      <motion.g animate={{ x: [0, 50, 0] }} transition={{ duration: 10, repeat: Infinity }}>
                         <circle cx="200" cy="100" r="30" fill="rgba(255,255,255,0.1)" />
                         <circle cx="250" cy="100" r="40" fill="rgba(255,255,255,0.1)" />
                         <circle cx="300" cy="100" r="30" fill="rgba(255,255,255,0.1)" />
                      </motion.g>
                      {/* Rain */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.line 
                          key={i} 
                          x1={100 + i*15} y1="0" x2={90 + i*15} y2="10" 
                          stroke="rgba(56, 189, 248, 0.4)" 
                          strokeWidth="1"
                          animate={{ y: [100, 500], opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                        />
                      ))}
                   </motion.g>
                 )}

                 {activeCycle === 'karbon' && (
                   <motion.g key="karbon-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Factory */}
                      <rect x="750" y="400" width="100" height="100" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                      <rect x="800" y="340" width="20" height="60" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                      {/* Smoke */}
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.circle 
                          key={i} 
                          cx="810" cy="330" r="10" 
                          fill="rgba(255,255,255,0.1)"
                          animate={{ y: [0, -200], x: [0, 50], opacity: [0, 1, 0], scale: [1, 3] }}
                          transition={{ duration: 4, repeat: Infinity, delay: i }}
                        />
                      ))}
                      {/* Forest */}
                      <path d="M100 500 L150 350 L200 500 Z" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.2)" />
                      <path d="M200 500 L250 380 L300 500 Z" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.2)" />
                   </motion.g>
                 )}

                 {activeCycle === 'nitrogen' && (
                   <motion.g key="nitrogen-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Roots System */}
                      <g stroke="rgba(163, 230, 53, 0.2)" strokeWidth="2">
                         <path d="M300 500 Q280 550 250 580" fill="none" />
                         <path d="M300 500 Q320 560 350 590" fill="none" />
                      </g>
                      {/* N2 Particles in air */}
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.circle 
                          key={i} 
                          r="2" fill="rgba(16, 185, 129, 0.4)"
                          animate={{ x: [Math.random()*1000, Math.random()*1000], y: [Math.random()*300, Math.random()*300], opacity: [0.2, 0.8, 0.2] }}
                          transition={{ duration: 10, repeat: Infinity }}
                        />
                      ))}
                   </motion.g>
                 )}
              </AnimatePresence>
           </svg>

           {/* Interactive Process Markers */}
           <div className="absolute inset-0">
              {current.processes.map(p => (
                <motion.button
                  key={p.id}
                  onClick={() => setSelectedProcess(p.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute group z-30 transition-all duration-300
                    ${selectedProcess === p.id ? `bg-${current.theme}-500 shadow-[0_0_20px_rgba(255,255,255,0.4)]` : "bg-white/10 backdrop-blur-md border border-white/20"}
                    rounded-full p-3
                  `}
                  style={{ top: `${p.pos.y}%`, left: `${p.pos.x}%` }}
                >
                   <div className={selectedProcess === p.id ? "text-white" : "text-zinc-400 group-hover:text-white"}>
                      {p.icon}
                   </div>
                   
                   {/* Label on Hover */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-2xl">
                      {p.name}
                   </div>
                </motion.button>
              ))}
           </div>

           {/* Dashboard Header Overlay */}
           <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full">
              <div className={`w-3 h-3 rounded-full bg-${current.theme}-500 animate-pulse`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Analysis</span>
                 <h3 className="text-sm font-bold text-white uppercase tracking-tight">{current.name}</h3>
              </div>
           </div>
        </div>

        {/* Global Interaction Tip */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Interaksi Marker Lingkungan untuk Detail Proses</span>
        </div>
      </div>

    </div>
  );
}


