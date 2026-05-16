"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Atom, 
  Info, 
  Zap, 
  Scale, 
  Settings2, 
  Plus, 
  Minus, 
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Database,
  Search
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Types & Elements ---

interface ElementBase {
  p: number;
  sym: string;
  name: string;
  color: string;
}

const ELEMENTS: Record<number, ElementBase> = {
  1: { p: 1, sym: "H", name: "Hidrogen", color: "#e2e8f0" },
  2: { p: 2, sym: "He", name: "Helium", color: "#f87171" },
  3: { p: 3, sym: "Li", name: "Litium", color: "#c084fc" },
  4: { p: 4, sym: "Be", name: "Berilium", color: "#818cf8" },
  5: { p: 5, sym: "B", name: "Boron", color: "#fbbf24" },
  6: { p: 6, sym: "C", name: "Karbon", color: "#4ade80" },
  7: { p: 7, sym: "N", name: "Nitrogen", color: "#38bdf8" },
  8: { p: 8, sym: "O", name: "Oksigen", color: "#f87171" },
  9: { p: 9, sym: "F", name: "Fluor", color: "#fbbf24" },
  10: { p: 10, sym: "Ne", name: "Neon", color: "#c084fc" },
};

// Common Isotopes & Stability Data
const ISOTOPE_STABILITY: Record<string, { name?: string; stable: boolean; desc: string }> = {
  "1-0": { name: "Protium", stable: true, desc: "Bentuk hidrogen paling umum." },
  "1-1": { name: "Deuterium", stable: true, desc: "Digunakan dalam moderator nuklir." },
  "1-2": { name: "Tritium", stable: false, desc: "Radioaktif, digunakan dalam cat bercahaya." },
  "6-6": { name: "Karbon-12", stable: true, desc: "Standar massa atom dunia." },
  "6-7": { name: "Karbon-13", stable: true, desc: "Digunakan dalam riset biologi." },
  "6-8": { name: "Karbon-14", stable: false, desc: "Digunakan untuk penanggalan karbon." },
  "2-1": { name: "Helium-3", stable: true, desc: "Langka, potensi bahan bakar fusi." },
  "2-2": { name: "Helium-4", stable: true, desc: "Produk fusi matahari yang stabil." },
};

// --- Components ---

const Particle = ({ type, x, y, delay = 0 }: { type: 'p' | 'n' | 'e'; x: number; y: number; delay?: number }) => {
  const colors = {
    p: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]",
    n: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.4)]",
    e: "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x, y }}
      transition={{ type: "spring", damping: 15, stiffness: 100, delay }}
      className={cn(
        "absolute rounded-full flex items-center justify-center",
        type === 'e' ? "w-2.5 h-2.5" : "w-4 h-4 border border-black/20",
        colors[type]
      )}
    >
      <span className="text-[8px] font-black text-white pointer-events-none select-none">
        {type === 'p' ? '+' : type === 'e' ? '-' : ''}
      </span>
    </motion.div>
  );
};

// --- Main Simulation ---

export default function IonIsotop() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const [showShells, setShowShells] = useState(true);

  const element = useMemo(() => ELEMENTS[protons] || { p: protons, sym: "?", name: "Unsur Misterius", color: "#fff" }, [protons]);
  const charge = protons - electrons;
  const massNumber = protons + neutrons;
  
  const isotopeKey = `${protons}-${neutrons}`;
  const isotopeInfo = ISOTOPE_STABILITY[isotopeKey];
  
  // Nucleus Packing Logic (Simplified Fermat's Spiral)
  const nucleusParticles = useMemo(() => {
    const particles: { id: string; type: 'p' | 'n'; x: number; y: number; delay: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    const total = protons + neutrons;
    
    // Interleave protons and neutrons for visual balance
    for (let i = 0; i < total; i++) {
      const r = Math.sqrt(i) * 7;
      const theta = i * phi;
      const particleType = (i % 2 === 0 && particles.filter(p => p.type === 'p').length < protons) || 
                   (particles.filter(p => p.type === 'n').length >= neutrons) ? 'p' : 'n';
      
      particles.push({
        id: `nucleus-${i}`,
        type: particleType,
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r,
        delay: i * 0.02
      });
    }
    return particles;
  }, [protons, neutrons]);

  // Electron Shell Logic
  const electronShells = useMemo(() => {
    const shells = [];
    const capacity = [2, 8, 18, 32];
    let remaining = electrons;
    
    for (let i = 0; i < capacity.length && remaining > 0; i++) {
      const count = Math.min(remaining, capacity[i]);
      shells.push({ radius: 60 + i * 40, count });
      remaining -= count;
    }
    return shells;
  }, [electrons]);

  const reset = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-[#050505] text-zinc-200">
      
      {/* --- Visual Simulation Canvas --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30">
          <div className="flex gap-3">
             <motion.div 
              key={charge}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2",
                charge === 0 ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400" :
                charge > 0 ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : 
                "bg-blue-500/10 border-blue-500/30 text-blue-400"
              )}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">
                {charge === 0 ? "Atom Netral" : charge > 0 ? `Kation (${charge}+)` : `Anion (${Math.abs(charge)}-)`}
              </span>
            </motion.div>

            <motion.div 
              key={isotopeKey}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2",
                isotopeInfo?.stable ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-orange-500/10 border-orange-500/30 text-orange-400"
              )}
            >
              {isotopeInfo?.stable ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span className="text-sm font-bold uppercase tracking-wider">
                {isotopeInfo?.stable ? "Isotop Stabil" : "Isotop Radioaktif"}
              </span>
            </motion.div>
          </div>

          <div className="flex flex-col items-end gap-1">
             <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Notasi Atom</div>
             <div className="relative text-white font-mono text-5xl flex items-center">
                <div className="flex flex-col items-end mr-1 text-[16px] text-zinc-500 font-bold leading-none py-1">
                  <span>{massNumber}</span>
                  <span>{protons}</span>
                </div>
                <motion.span 
                  key={element.sym}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ color: element.color }}
                >
                  {element.sym}
                </motion.span>
                {charge !== 0 && (
                  <span className="absolute -right-6 top-0 text-xl font-black text-indigo-400">
                    {Math.abs(charge) > 1 ? Math.abs(charge) : ""}{charge > 0 ? "+" : "-"}
                  </span>
                )}
             </div>
          </div>
        </div>

        {/* Atom Assembly Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Electron Orbits */}
          <AnimatePresence>
            {showShells && electronShells.map((shell, i) => (
              <motion.div
                key={`shell-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute border border-white/5 rounded-full pointer-events-none"
                style={{ width: shell.radius * 2, height: shell.radius * 2 }}
              />
            ))}
          </AnimatePresence>

          {/* Electrons */}
          {electronShells.map((shell, sIdx) => 
            Array.from({ length: shell.count }).map((_, eIdx) => {
              const angle = (eIdx / shell.count) * Math.PI * 2;
              return (
                <motion.div
                  key={`electron-${sIdx}-${eIdx}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + sIdx * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute"
                  style={{ width: shell.radius * 2, height: shell.radius * 2 }}
                >
                   <Particle 
                    type="e" 
                    x={Math.cos(angle) * shell.radius} 
                    y={Math.sin(angle) * shell.radius} 
                    delay={sIdx * 0.1 + eIdx * 0.05}
                  />
                </motion.div>
              );
            })
          )}

          {/* Nucleus Container */}
          <motion.div 
            className="relative z-10"
            animate={{ 
              rotate: [0, 0.5, 0, -0.5, 0],
              scale: isotopeInfo?.stable ? 1 : [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {nucleusParticles.map((p) => (
              <Particle key={p.id} type={p.type} x={p.x} y={p.y} delay={p.delay} />
            ))}
            
            {/* Nucleus Glow (Unstable) */}
            {!isotopeInfo?.stable && (
              <div className="absolute inset-0 bg-orange-500/20 blur-xl animate-pulse rounded-full" />
            )}
          </motion.div>
        </div>

        {/* Legend / Tip */}
        <div className="absolute bottom-8 flex gap-8 px-8 py-4 glass-card rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proton</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400 shadow-[0_0_5px_#94a3b8]" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Neutron</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Elektron</span>
          </div>
        </div>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 relative z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-zinc-900/80 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Atom className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Atom Explorer</h2>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Simulasi Ion & Isotop</p>
            <button 
              onClick={reset}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all active:rotate-180"
              title="Reset Simulasi"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Main Controllers */}
          <section className="space-y-6">
            
            {/* Protons Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-rose-500 uppercase tracking-widest">Proton (Nomor Atom)</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setProtons(p => Math.max(1, p - 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-rose-500/50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-2xl font-bold text-white w-8 text-center">{protons}</span>
                  <button 
                    onClick={() => setProtons(p => Math.min(10, p + 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-rose-500/50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input 
                type="range" min="1" max="10" value={protons} 
                onChange={(e) => setProtons(parseInt(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">Mengubah proton akan mengubah identitas unsur.</p>
            </div>

            {/* Neutrons Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Neutron (Isotop)</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setNeutrons(n => Math.max(0, n - 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-slate-500/50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-2xl font-bold text-white w-8 text-center">{neutrons}</span>
                  <button 
                    onClick={() => setNeutrons(n => Math.min(12, n + 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-slate-500/50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input 
                type="range" min="0" max="12" value={neutrons} 
                onChange={(e) => setNeutrons(parseInt(e.target.value))}
                className="w-full accent-slate-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">Neutron menentukan massa dan stabilitas atom.</p>
            </div>

            {/* Electrons Control */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Elektron (Muatan)</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setElectrons(e => Math.max(0, e - 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-blue-500/50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-2xl font-bold text-white w-8 text-center">{electrons}</span>
                  <button 
                    onClick={() => setElectrons(e => Math.min(12, e + 1))}
                    className="p-1 rounded-lg bg-zinc-800 border border-white/5 hover:border-blue-500/50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <input 
                type="range" min="0" max="12" value={electrons} 
                onChange={(e) => setElectrons(parseInt(e.target.value))}
                className="w-full accent-blue-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">Kehilangan atau mendapatkan elektron membentuk Ion.</p>
            </div>
          </section>

          {/* Properties Dashboard */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
               <Database className="w-3.5 h-3.5" /> Dashboard Properti
             </h3>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-zinc-500 uppercase">Nama Unsur</p>
                   <p className="font-bold text-white">{element.name}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-zinc-500 uppercase">Massa Atom</p>
                   <p className="font-bold text-white">{massNumber} <span className="text-[10px] opacity-40">u</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-zinc-500 uppercase">Jenis Partikel</p>
                   <p className={cn(
                     "font-bold",
                     charge === 0 ? "text-white" : charge > 0 ? "text-rose-400" : "text-blue-400"
                   )}>
                     {charge === 0 ? "Netral" : charge > 0 ? "Kation" : "Anion"}
                   </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                   <p className="text-[9px] font-bold text-zinc-500 uppercase">Nama Isotop</p>
                   <p className="font-bold text-white truncate">{isotopeInfo?.name || "Isotop Buatan"}</p>
                </div>
             </div>

             {/* Detailed Insight Card */}
             <AnimatePresence mode="wait">
               <motion.div 
                key={isotopeKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden group"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Info className="w-12 h-12 text-indigo-400" />
                 </div>
                 <div className="relative z-10 space-y-2">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Wawasan Atom</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                      "{isotopeInfo?.desc || `Unsur ini memiliki ${protons} proton. Dengan ${neutrons} neutron, ia memiliki nomor massa ${massNumber}.`}"
                    </p>
                 </div>
               </motion.div>
             </AnimatePresence>
          </section>

          {/* Visual Settings */}
          <section className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-white/5">
                <div className="flex items-center gap-3">
                   <Settings2 className="w-4 h-4 text-zinc-500" />
                   <span className="text-xs font-bold text-zinc-400">Tampilkan Lintasan Orbit</span>
                </div>
                <button 
                  onClick={() => setShowShells(!showShells)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    showShells ? "bg-indigo-600" : "bg-zinc-700"
                  )}
                >
                  <motion.div 
                    animate={{ x: showShells ? 20 : 2 }}
                    className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg" 
                  />
                </button>
             </div>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                <Scale className="w-5 h-5 text-zinc-400" />
             </div>
             <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Keseimbangan Muatan</p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-32 bg-zinc-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-rose-500" style={{ width: `${(protons / (protons + electrons || 1)) * 100}%` }} />
                      <div className="h-full bg-blue-500" style={{ width: `${(electrons / (protons + electrons || 1)) * 100}%` }} />
                   </div>
                   <span className="text-[10px] font-mono text-zinc-400">
                     {protons}:{electrons}
                   </span>
                </div>
             </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #fff;
          border: 3px solid currentColor;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transition: all 0.2s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}
