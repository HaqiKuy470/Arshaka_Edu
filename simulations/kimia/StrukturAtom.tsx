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
  ShieldCheck,
  AlertTriangle,
  Settings,
  X
} from "lucide-react";

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

export default function StrukturAtom() {
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);
  const [activeTab, setActiveTab] = useState<"build" | "info">("build");
  const [showPanel, setShowPanel] = useState(true);

  const currentElement = useMemo(() => 
    ELEMENTS_DATA.find(e => e.n === protons) || { n: protons, sym: "?", name: "Unsur Berat", cat: "unknown" }
  , [protons]);

  const shells = useMemo(() => getShells(electrons), [electrons]);
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  const isStable = useMemo(() => {
    if (protons === 1 && neutrons === 0) return true;
    if (protons === 0) return false;
    const ratio = neutrons / protons;
    return ratio >= 0.8 && ratio <= 1.2;
  }, [protons, neutrons]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#050505] text-zinc-300 relative overflow-hidden">
      
      {/* --- Main Visualization Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 bg-[#080808] order-1">
        
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full" />
        </div>

        {/* Atom Container */}
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
          
          {/* Electron Shells */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {shells.map((count, shellIdx) => {
              if (count === 0 && shellIdx > 0 && shells[shellIdx-1] === 0) return null;
              const size = (shellIdx + 1) * 30 + "%";
              return (
                <div 
                  key={shellIdx}
                  className="absolute rounded-full border border-white/[0.03] transition-all duration-1000"
                  style={{ width: size, height: size }}
                >
                  {Array.from({ length: count }).map((_, i) => {
                    const angle = (i / count) * 360;
                    return (
                      <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 8 + shellIdx * 4, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="absolute inset-0"
                        style={{ rotate: angle }}
                      >
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] border border-sky-300" />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Nucleus */}
          <div className="relative z-10 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-125 animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
               <div className="flex flex-wrap items-center justify-center gap-0.5 p-1.5">
                 <AnimatePresence>
                   {Array.from({ length: Math.min(30, protons) }).map((_, i) => (
                     <motion.div key={`p-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-inner" />
                   ))}
                   {Array.from({ length: Math.min(30, neutrons) }).map((_, i) => (
                     <motion.div key={`n-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-inner" />
                   ))}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* Legend Overlay - Compact on Mobile */}
        <div className="absolute bottom-6 flex flex-wrap justify-center gap-4 md:gap-8 p-3 px-6 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl z-30">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-rose-500" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Proton</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-zinc-400" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Neutron</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-sky-400" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Elektron</span>
          </div>
        </div>

        {/* Toggle Panel (Mobile) */}
        <button 
          onClick={() => setShowPanel(!showPanel)}
          className="lg:hidden absolute top-6 right-6 z-40 p-3 bg-indigo-600 rounded-xl text-white shadow-xl"
        >
          {showPanel ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </div>

      {/* --- Control Panel (Responsive) --- */}
      <AnimatePresence>
        {showPanel && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 lg:relative lg:inset-auto lg:w-[380px] z-30 flex flex-col bg-zinc-950/90 backdrop-blur-3xl border-l border-white/5 overflow-y-auto no-scrollbar"
          >
            {/* Tabs for Mobile/Tablet */}
            <div className="flex border-b border-white/5 lg:hidden">
              <button 
                onClick={() => setActiveTab("build")}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === "build" ? "text-white border-b-2 border-indigo-500" : "text-zinc-500"}`}
              >
                Bangun
              </button>
              <button 
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === "info" ? "text-white border-b-2 border-indigo-500" : "text-zinc-500"}`}
              >
                Informasi
              </button>
            </div>

            {/* Build Section */}
            <div className={`p-6 md:p-8 space-y-8 ${activeTab !== "build" && "hidden lg:block"}`}>
              {/* Identity Card */}
              <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] border border-white/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Simbol</span>
                    <span className="text-4xl md:text-5xl font-black text-white">{currentElement.sym}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Massa</span>
                    <span className="text-2xl font-mono font-bold text-white">{massNumber}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{currentElement.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[currentElement.cat] }} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{currentElement.cat}</span>
                </div>
              </div>

              {/* HUD */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border ${isStable ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Stabilitas</span>
                  <span className={`text-xs font-bold ${isStable ? "text-emerald-400" : "text-rose-400"}`}>{isStable ? "Stabil" : "Tidak Stabil"}</span>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Muatan Net</span>
                  <span className="text-xs font-bold text-white">{netCharge > 0 ? `+${netCharge}` : netCharge}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-5">
                {[
                  { label: "Proton", value: protons, color: "bg-rose-500", setter: setProtons, max: 18 },
                  { label: "Neutron", value: neutrons, color: "bg-zinc-400", setter: setNeutrons, max: 22 },
                  { label: "Elektron", value: electrons, color: "bg-sky-400", setter: setElectrons, max: 18 }
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color} shadow-lg`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => item.setter(p => Math.max(0, p - 1))} className="p-2 bg-white/5 rounded-xl border border-white/5 active:scale-90 transition-all"><Minus className="w-4 h-4" /></button>
                      <span className="text-sm font-black w-6 text-center text-white">{item.value}</span>
                      <button onClick={() => item.setter(p => Math.min(item.max, p + 1))} className="p-2 bg-white/5 rounded-xl border border-white/5 active:scale-90 transition-all"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setProtons(1); setNeutrons(0); setElectrons(1); }} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                <RotateCcw className="w-4 h-4 text-zinc-500" /> Reset Atom
              </button>
            </div>

            {/* Info Section (Visible in Info Tab or on Desktop) */}
            <div className={`p-6 md:p-8 space-y-6 flex-1 border-t border-white/5 lg:border-t-0 ${activeTab !== "info" && "hidden lg:block"}`}>
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wawasan Atom</h2>
              <div className="space-y-4">
                <div className="p-5 bg-indigo-500/5 rounded-[24px] border border-indigo-500/10 space-y-3">
                   <div className="flex items-center gap-3 text-indigo-400">
                      <Info className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Informasi</span>
                   </div>
                   <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                     "Identitas atom ditentukan oleh jumlah proton. Tambahkan atau kurangi proton untuk mengubah unsur."
                   </p>
                </div>

                <div className="p-5 bg-white/5 rounded-[24px] border border-white/5 space-y-3">
                   <div className="flex items-center gap-3 text-sky-400">
                      <Activity className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Konfigurasi Kulit</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      {shells.map((count, i) => (
                        <div key={i} className="text-center p-2 rounded-xl bg-black/20 border border-white/5">
                           <div className="text-[8px] text-zinc-500 uppercase mb-1">Kulit {String.fromCharCode(75+i)}</div>
                           <div className="text-xs font-bold text-sky-400">{count}e</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
