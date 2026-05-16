"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Wind, 
  Utensils, 
  Brain, 
  Activity, 
  Info, 
  ChevronLeft,
  Search,
  MousePointer2,
  Dna
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type BodySystem = "digestive" | "respiratory" | "circulatory" | "nervous";

type Organ = {
  id: string;
  name: string;
  desc: string;
  path: string; // SVG Path
  color: string;
  glow: string;
};

// --- Data: Detailed SVG Paths for Organs ---
const SYSTEMS: Record<BodySystem, {
  name: string;
  icon: React.ReactNode;
  theme: string;
  color: string;
  summary: string;
  organs: Organ[];
}> = {
  nervous: {
    name: "Sistem Saraf",
    icon: <Brain className="w-5 h-5" />,
    theme: "indigo",
    color: "#818cf8",
    summary: "Pusat transmisi sinyal listrik yang mengatur seluruh fungsi tubuh, memori, dan emosi.",
    organs: [
      { id: "brain", name: "Otak", desc: "Pusat integrasi data yang sangat kompleks, mengendalikan pikiran dan fungsi motorik.", path: "M100 20 Q130 20 140 45 Q150 70 130 90 Q100 110 70 90 Q50 70 60 45 Q70 20 100 20", color: "fill-indigo-500", glow: "shadow-indigo-500/50" },
      { id: "spinal", name: "Sumsum Tulang Belakang", desc: "Jalur saraf utama yang menghubungkan otak ke seluruh tubuh.", path: "M95 100 L105 100 L105 380 L95 380 Z", color: "fill-indigo-400/60", glow: "shadow-indigo-400/30" }
    ]
  },
  circulatory: {
    name: "Peredaran Darah",
    icon: <Heart className="w-5 h-5" />,
    theme: "rose",
    color: "#fb7185",
    summary: "Jaringan pembuluh darah yang memompa oksigen dan nutrisi ke setiap sel.",
    organs: [
      { id: "heart", name: "Jantung", desc: "Pompa otot yang bekerja 24/7 untuk memastikan sirkulasi darah tetap berjalan.", path: "M100 130 Q115 110 130 130 Q140 150 100 180 Q60 150 70 130 Q85 110 100 130", color: "fill-rose-500", glow: "shadow-rose-500/50" },
      { id: "artery", name: "Pembuluh Darah Utama", desc: "Jaringan pipa yang mendistribusikan darah ke seluruh ekstremitas tubuh.", path: "M100 130 L100 380 M100 150 L50 170 M100 150 L150 170 M100 250 L60 300 M100 250 L140 300", color: "stroke-rose-400/40", glow: "shadow-rose-400/20" }
    ]
  },
  respiratory: {
    name: "Sistem Pernapasan",
    icon: <Wind className="w-5 h-5" />,
    theme: "sky",
    color: "#38bdf8",
    summary: "Proses pertukaran gas vital (Oksigen dan Karbon Dioksida) antara tubuh dan udara luar.",
    organs: [
      { id: "lungs", name: "Paru-Paru", desc: "Tempat utama pertukaran gas di mana darah mengambil oksigen.", path: "M95 120 Q60 120 50 170 Q50 220 90 220 L95 220 Z M105 120 Q140 120 150 170 Q150 220 110 220 L105 220 Z", color: "fill-sky-400/60", glow: "shadow-sky-400/40" },
      { id: "trachea", name: "Trakea", desc: "Saluran udara yang kokoh menuju paru-paru.", path: "M98 60 L102 60 L102 120 L98 120 Z", color: "fill-sky-300", glow: "shadow-sky-300/20" }
    ]
  },
  digestive: {
    name: "Sistem Pencernaan",
    icon: <Utensils className="w-5 h-5" />,
    theme: "amber",
    color: "#fbbf24",
    summary: "Mengubah asupan makanan menjadi molekul nutrisi yang siap diserap oleh darah.",
    organs: [
      { id: "stomach", name: "Lambung", desc: "Kantung berotot tempat makanan dicerna oleh asam dan enzim.", path: "M80 180 Q60 200 80 230 Q110 250 130 220 Q140 200 120 180 Z", color: "fill-amber-500", glow: "shadow-amber-500/40" },
      { id: "liver", name: "Hati", desc: "Organ detoksifikasi utama dan penghasil cairan empedu.", path: "M100 180 L140 180 Q155 210 130 215 L90 215 Z", color: "fill-amber-600/80", glow: "shadow-amber-600/30" },
      { id: "intestines", name: "Usus", desc: "Jaringan saluran panjang tempat nutrisi dan air diserap ke dalam tubuh.", path: "M80 235 Q100 225 120 235 Q130 250 120 270 Q100 280 80 270 Q70 250 80 235 Z M70 270 Q100 290 130 270 Q140 300 120 330 Q100 340 80 330 Q60 300 70 270", color: "fill-amber-700/60", glow: "shadow-amber-700/20" }
    ]
  }
};

export default function TubuhManusia() {
  const [activeSystem, setActiveSystem] = useState<BodySystem>("nervous");
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const current = SYSTEMS[activeSystem];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020202] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Sidebar: Medical Interface --- */}
      <div className="w-full lg:w-[450px] flex flex-col bg-zinc-950/80 border-r border-white/5 backdrop-blur-3xl z-20 shadow-2xl overflow-y-auto no-scrollbar">
        
        {/* Medical Header */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/simulasi" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95">
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Diagnostic Active</span>
            </div>
          </div>

          <div>
             <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">BIOMETRIC SCANNER</h1>
             <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">Arshaka Medical Lab v4.0</p>
          </div>

          {/* System Grid */}
          <div className="grid grid-cols-2 gap-3">
             {(Object.keys(SYSTEMS) as BodySystem[]).map((key) => {
               const sys = SYSTEMS[key];
               const isActive = activeSystem === key;
               return (
                 <button
                   key={key}
                   onClick={() => { setActiveSystem(key); setSelectedOrgan(null); }}
                   className={`group relative flex flex-col p-5 rounded-[24px] border transition-all duration-300 ${isActive ? `bg-gradient-to-br from-${sys.theme}-500/20 to-transparent border-${sys.theme}-500/50` : "bg-white/5 border-white/5 hover:border-white/10"}`}
                 >
                   <div className={`mb-3 p-2 w-fit rounded-xl transition-colors ${isActive ? `bg-${sys.theme}-500 text-white` : "bg-zinc-900 text-zinc-600 group-hover:text-zinc-400"}`}>
                     {sys.icon}
                   </div>
                   <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                     {sys.name}
                   </span>
                   {isActive && (
                     <motion.div layoutId="tab-indicator" className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-${sys.theme}-400 shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                   )}
                 </button>
               );
             })}
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="flex-1 px-8 pb-8 space-y-6">
           <AnimatePresence mode="wait">
             <motion.div 
               key={selectedOrgan?.id || activeSystem}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-6"
             >
                {selectedOrgan ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${current.theme === 'rose' ? 'text-rose-400' : current.theme === 'sky' ? 'text-sky-400' : current.theme === 'amber' ? 'text-amber-400' : 'text-indigo-400'}`}>
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white tracking-tight">{selectedOrgan.name}</h2>
                        <span className={`text-[9px] font-black uppercase tracking-widest opacity-60`}>{current.name}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">"{selectedOrgan.desc}"</p>
                    <button 
                      onClick={() => setSelectedOrgan(null)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all"
                    >
                      Reset Focus
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10`}>
                        {current.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white tracking-tight">{current.name}</h2>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">System Summary</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{current.summary}</p>
                    <div className="space-y-3">
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select to scan:</span>
                       <div className="flex flex-wrap gap-2">
                          {current.organs.map(org => (
                            <button 
                              key={org.id} 
                              onClick={() => setSelectedOrgan(org)}
                              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                            >
                              {org.name}
                            </button>
                          ))}
                       </div>
                    </div>
                  </>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Credits */}
        <div className="p-8 border-t border-white/5 bg-black/40 text-center">
           <div className="flex items-center justify-center gap-2 text-zinc-600 mb-2">
              <Dna className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Genetic Integrity Stable</span>
           </div>
        </div>
      </div>

      {/* --- Center: High-Tech Body Visualization --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#050505] overflow-hidden">
        
        {/* Radial Scanning Background */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/[0.02] to-transparent opacity-50" />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full"
           />
        </div>

        {/* Human Anatomy Container */}
        <div className="relative w-[400px] h-[750px]">
           
           {/* Anatomical Silhouette SVG */}
           <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl overflow-visible">
              {/* Main Body Glow (Dynamic) */}
              <motion.path 
                layoutId="body-glow"
                d="M100 20 C120 20 135 35 135 55 C135 65 130 75 120 80 L140 100 Q150 120 160 160 L165 240 L160 380 L140 380 L135 250 L100 250 L65 250 L60 380 L40 380 L35 240 L40 160 Q50 120 60 100 L80 80 C70 75 65 65 65 55 C65 35 80 20 100 20"
                className={`transition-all duration-1000 ${activeSystem === 'nervous' ? 'fill-indigo-500/5 stroke-indigo-500/20' : activeSystem === 'circulatory' ? 'fill-rose-500/5 stroke-rose-500/20' : activeSystem === 'respiratory' ? 'fill-sky-500/5 stroke-sky-500/20' : 'fill-amber-500/5 stroke-amber-500/20'}`}
                strokeWidth="1"
              />

              {/* Dynamic Organs Layer */}
              <AnimatePresence mode="wait">
                <motion.g 
                  key={activeSystem}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                >
                   {current.organs.map((org) => (
                     <motion.path
                       key={org.id}
                       d={org.path}
                       onMouseEnter={() => setHoveredId(org.id)}
                       onMouseLeave={() => setHoveredId(null)}
                       onClick={() => setSelectedOrgan(org)}
                       whileHover={{ scale: 1.05 }}
                       className={`transition-all duration-300 cursor-pointer pointer-events-auto
                         ${org.color} 
                         ${(selectedOrgan?.id === org.id || hoveredId === org.id) ? "opacity-100 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "opacity-40 hover:opacity-100"}
                         ${org.id === 'heart' ? 'animate-pulse' : ''}
                       `}
                       stroke={org.path.startsWith('M') && org.path.includes('L') && !org.path.includes('Z') ? "currentColor" : "none"}
                       strokeWidth={org.id === 'artery' || org.id === 'spinal' ? "2" : "0"}
                     />
                   ))}
                </motion.g>
              </AnimatePresence>

              {/* Interaction Markers */}
              {current.organs.map((org) => {
                // Approximate center from path (hardcoded for brevity in this mock)
                const centers: Record<string, {x:number, y:number}> = {
                  brain: {x: 100, y: 55},
                  heart: {x: 100, y: 155},
                  lungs: {x: 100, y: 170},
                  stomach: {x: 80, y: 200},
                  liver: {x: 120, y: 200},
                  intestines: {x: 100, y: 280}
                };
                const c = centers[org.id];
                if (!c) return null;

                return (
                  <motion.g key={`marker-${org.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <circle cx={c.x} cy={c.y} r="2" fill="white" className="pointer-events-none" />
                     <motion.circle 
                       cx={c.x} cy={c.y} r="6" 
                       stroke="white" strokeWidth="0.5" fill="none"
                       animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="pointer-events-none"
                     />
                  </motion.g>
                );
              })}
           </svg>

           {/* Floating HUD Elements */}
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-[-40px] flex flex-col items-end gap-2">
                 <div className="h-[2px] w-12 bg-white/10" />
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Cranial Probe</span>
              </div>
              <div className="absolute top-[150px] right-[-60px] flex flex-col items-start gap-2">
                 <div className="h-[2px] w-16 bg-white/10" />
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Thoracic Scan</span>
              </div>
              <div className="absolute bottom-[200px] left-[-60px] flex flex-col items-end gap-2">
                 <div className="h-[2px] w-20 bg-white/10" />
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Abdominal Map</span>
              </div>
           </div>
        </div>

        {/* Global Interaction Tip */}
        <div className="absolute bottom-12 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-4 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-emerald-400" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Interaksi langsung dengan organ untuk analisis detail</span>
        </div>
      </div>

    </div>
  );
}
