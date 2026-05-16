"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Info, 
  Zap, 
  Activity, 
  Atom as AtomIcon,
  ChevronLeft,
  Search,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

// --- Element Data ---
const ELEMENTS_DATA = [
  { n: 0, sym: "?", name: "Neutronium", cat: "unknown" },
  { n: 1, sym: "H", name: "Hidrogen", cat: "nonmetal" },
  { n: 2, sym: "He", name: "Helium", cat: "noble" },
  { n: 3, sym: "Li", name: "Litium", cat: "alkali" },
  { n: 4, sym: "Be", name: "Berilium", cat: "alkaline" },
  { n: 5, sym: "B", name: "Boron", cat: "metalloid" },
  { n: 6, sym: "C", name: "Karbon", cat: "nonmetal" },
  { n: 7, sym: "N", name: "Nitrogen", cat: "nonmetal" },
  { n: 8, sym: "O", name: "Oksigen", cat: "nonmetal" },
  { n: 9, sym: "F", name: "Fluor", cat: "halogen" },
  { n: 10, sym: "Ne", name: "Neon", cat: "noble" },
  { n: 11, sym: "Na", name: "Natrium", cat: "alkali" },
  { n: 12, sym: "Mg", name: "Magnesium", cat: "alkaline" },
  { n: 13, sym: "Al", name: "Aluminium", cat: "post-transition" },
  { n: 14, sym: "Si", name: "Silikon", cat: "metalloid" },
  { n: 15, sym: "P", name: "Fosfor", cat: "nonmetal" },
  { n: 16, sym: "S", name: "Belerang", cat: "nonmetal" },
  { n: 17, sym: "Cl", name: "Klorin", cat: "halogen" },
  { n: 18, sym: "Ar", name: "Argon", cat: "noble" }
];

const CAT_COLORS: Record<string, string> = {
  nonmetal: "#4ade80",
  noble: "#c084fc",
  alkali: "#f87171",
  alkaline: "#fb923c",
  metalloid: "#facc15",
  halogen: "#22d3ee",
  "post-transition": "#60a5fa",
  unknown: "#52525b"
};

// --- Helper for Electron Shells ---
const getShells = (count: number) => {
  const shells = [0, 0, 0];
  let remaining = count;
  
  shells[0] = Math.min(remaining, 2);
  remaining -= shells[0];
  
  shells[1] = Math.min(remaining, 8);
  remaining -= shells[1];
  
  shells[2] = Math.min(remaining, 8);
  
  return shells;
};

// --- UI Components ---

export default function StrukturAtom() {
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);

  const currentElement = useMemo(() => 
    ELEMENTS_DATA.find(e => e.n === protons) || { n: protons, sym: "?", name: "Unsur Berat", cat: "unknown" }
  , [protons]);

  const shells = useMemo(() => getShells(electrons), [electrons]);
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  // Stability logic (highly simplified N/Z ratio)
  const isStable = useMemo(() => {
    if (protons === 1 && neutrons === 0) return true;
    if (protons === 0) return false;
    const ratio = neutrons / protons;
    return ratio >= 0.8 && ratio <= 1.2;
  }, [protons, neutrons]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden">
      
      {/* --- Left Sidebar: Controls & Data --- */}
      <div className="w-full lg:w-[380px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Bangun Atom</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Simulator Struktur Atom</p>
            </div>
          </div>

          {/* Atomic Identity Display */}
          <div className="relative group p-6 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <AtomIcon className="w-24 h-24" />
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Simbol</span>
                <span className="text-5xl font-black text-white">{currentElement.sym}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nomor Massa</span>
                <span className="text-2xl font-mono font-bold text-white">{massNumber}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{currentElement.name}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[currentElement.cat] }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{currentElement.cat}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Build Controls */}
        <div className="p-8 space-y-8">
          
          {/* Stability & Charge Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border transition-all ${isStable ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
              <div className="flex items-center gap-2 mb-1">
                {isStable ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Stabilitas</span>
              </div>
              <span className={`text-xs font-bold ${isStable ? "text-emerald-400" : "text-rose-400"}`}>{isStable ? "Stabil" : "Tidak Stabil"}</span>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Muatan Net</span>
              </div>
              <span className="text-xs font-bold text-white">{netCharge > 0 ? `+${netCharge}` : netCharge}</span>
            </div>
          </div>

          {/* Subatomic Sliders/Inputs */}
          <div className="space-y-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Proton (Z)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProtons(p => Math.max(0, p - 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-black w-6 text-center text-white">{protons}</span>
                    <button onClick={() => setProtons(p => Math.min(18, p + 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Neutron (N)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setNeutrons(n => Math.max(0, n - 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-black w-6 text-center text-white">{neutrons}</span>
                    <button onClick={() => setNeutrons(n => Math.min(22, n + 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Elektron (e)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setElectrons(e => Math.max(0, e - 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-black w-6 text-center text-white">{electrons}</span>
                    <button onClick={() => setElectrons(e => Math.min(18, e + 1))} className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto p-8 border-t border-white/5 space-y-4">
           <button 
            onClick={() => { setProtons(1); setNeutrons(0); setElectrons(1); }}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all active:scale-95 group"
           >
              <RotateCcw className="w-4 h-4 text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Reset Atom</span>
           </button>
        </div>
      </div>

      {/* --- Center: 3D Atom Visualization --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808]">
        
        {/* Atmosphere / Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
        </div>

        {/* Atom Container */}
        <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
          
          {/* Electron Shells */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {shells.map((count, shellIdx) => {
              if (count === 0 && shellIdx > 0 && shells[shellIdx-1] === 0) return null;
              const size = 200 + shellIdx * 140;
              return (
                <div 
                  key={shellIdx}
                  className="absolute rounded-full border border-white/[0.03] transition-all duration-1000"
                  style={{ width: size, height: size }}
                >
                  {/* Electrons in Shell */}
                  {Array.from({ length: count }).map((_, i) => {
                    const angle = (i / count) * 360;
                    return (
                      <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 10 + shellIdx * 5, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="absolute inset-0"
                        style={{ rotate: angle }}
                      >
                        <div 
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] border border-sky-300"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Nucleus Area */}
          <div className="relative z-10 w-24 h-24 flex items-center justify-center">
            {/* Nucleus Glow */}
            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-150 animate-pulse" />
            
            {/* Nucleus Body */}
            <div className="relative w-full h-full rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="flex flex-wrap items-center justify-center gap-0.5 p-2">
                 <AnimatePresence>
                   {Array.from({ length: protons }).map((_, i) => (
                     <motion.div 
                       key={`p-${i}`}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0, opacity: 0 }}
                       className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)]" 
                     />
                   ))}
                   {Array.from({ length: neutrons }).map((_, i) => (
                     <motion.div 
                       key={`n-${i}`}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0, opacity: 0 }}
                       className="w-3 h-3 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)]" 
                     />
                   ))}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* Legend / Overlay */}
        <div className="absolute bottom-12 flex gap-8 p-4 px-8 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl z-30">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-rose-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Proton (+)</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-zinc-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Neutron (0)</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-sky-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Elektron (-)</span>
          </div>
        </div>
      </div>

      {/* --- Right Sidebar: Info & Properties --- */}
      <div className="w-full lg:w-[320px] flex flex-col border-l border-white/5 bg-zinc-950/50 backdrop-blur-xl p-8 space-y-10">
        
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wawasan Atom</h2>

        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
             <div className="flex items-center gap-3 text-indigo-400">
                <Info className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Informasi</span>
             </div>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               Atom adalah unit terkecil dari materi yang mempertahankan identitas kimia suatu unsur. Identitas atom ditentukan oleh jumlah proton di intinya.
             </p>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
             <div className="flex items-center gap-3 text-emerald-400">
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Shell Configuration</span>
             </div>
             <div className="space-y-3">
                {shells.map((count, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase tracking-widest">Kulit {String.fromCharCode(75 + i)}</span>
                    <span className={count > 0 ? "text-sky-400 font-bold" : "text-zinc-700"}>{count} e⁻</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Fact */}
        <div className="mt-auto p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex gap-4">
          <Zap className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-[10px] text-indigo-200/60 leading-relaxed font-medium">
            <strong>Tahukah Anda?</strong> Massa atom terkonsentrasi 99.9% di inti atom, meskipun volume inti atom sangatlah kecil dibandingkan atom secara keseluruhan.
          </p>
        </div>
      </div>
    </div>
  );
}
