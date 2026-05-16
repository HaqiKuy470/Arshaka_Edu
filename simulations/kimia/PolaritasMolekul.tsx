"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Info, 
  Settings2, 
  ArrowRightLeft, 
  Maximize2, 
  RefreshCcw,
  ZapOff,
  MoveUp,
  Atom,
  CircleDot,
  Pointer,
  RotateCcw,
Plus,Minus
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Types & Presets ---

interface MoleculePreset {
  id: string;
  name: string;
  formula: string;
  geometry: string;
  atoms: { id: string; symbol: string; en: number; x: number; y: number }[];
  description: string;
}

const PRESETS: MoleculePreset[] = [
  {
    id: "h2o",
    name: "Air",
    formula: "H₂O",
    geometry: "Bentuk V (Bent)",
    atoms: [
      { id: "o", symbol: "O", en: 3.44, x: 0, y: -20 },
      { id: "h1", symbol: "H", en: 2.20, x: -60, y: 40 },
      { id: "h2", symbol: "H", en: 2.20, x: 60, y: 40 },
    ],
    description: "Sangat polar. Geometri bengkok mencegah dipol ikatan saling meniadakan."
  },
  {
    id: "co2",
    name: "Karbon Dioksida",
    formula: "CO₂",
    geometry: "Linear",
    atoms: [
      { id: "c", symbol: "C", en: 2.55, x: 0, y: 0 },
      { id: "o1", symbol: "O", en: 3.44, x: -80, y: 0 },
      { id: "o2", symbol: "O", en: 3.44, x: 80, y: 0 },
    ],
    description: "Non-polar. Meskipun ikatan C=O polar, orientasi linear membuatnya saling meniadakan."
  },
  {
    id: "nh3",
    name: "Amonia",
    formula: "NH₃",
    geometry: "Trigonal Piramida",
    atoms: [
      { id: "n", symbol: "N", en: 3.04, x: 0, y: -20 },
      { id: "h1", symbol: "H", en: 2.20, x: -70, y: 40 },
      { id: "h2", symbol: "H", en: 2.20, x: 35, y: 20 },
      { id: "h3", symbol: "H", en: 2.20, x: 35, y: 60 },
    ],
    description: "Polar. Geometri piramida menghasilkan resultan dipol ke arah Nitrogen."
  },
  {
    id: "bf3",
    name: "Boron Trifluorida",
    formula: "BF₃",
    geometry: "Trigonal Planar",
    atoms: [
      { id: "b", symbol: "B", en: 2.04, x: 0, y: 0 },
      { id: "f1", symbol: "F", en: 3.98, x: 0, y: -80 },
      { id: "f2", symbol: "F", en: 3.98, x: -70, y: 40 },
      { id: "f3", symbol: "F", en: 3.98, x: 70, y: 40 },
    ],
    description: "Non-polar. Tiga dipol ikatan identik tersebar simetris 120°."
  }
];

// --- Sub-Components ---

const DipoleArrow = ({ from, to, strength, isTotal = false }: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number }; 
  strength: number;
  isTotal?: boolean;
}) => {
  if (strength < 0.1) return null;

  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)) * strength;
  
  return (
    <motion.div 
      className="absolute pointer-events-none origin-left flex items-center"
      style={{ 
        left: from.x, 
        top: from.y, 
        width: length,
        rotate: `${angle * (180 / Math.PI)}deg`,
        zIndex: isTotal ? 40 : 10
      }}
    >
      <div className={cn(
        "h-1 relative flex items-center justify-end",
        isTotal ? "bg-yellow-400 shadow-[0_0_10px_#facc15]" : "bg-white/40"
      )}>
        {/* Head */}
        <div className={cn(
          "absolute right-0 w-3 h-3 rotate-45 border-t-2 border-r-2",
          isTotal ? "border-yellow-400" : "border-white/40"
        )} />
        {/* Tail Plus */}
        <div className={cn(
          "absolute left-2 w-0.5 h-4 -translate-y-1/2 top-1/2",
          isTotal ? "bg-yellow-400" : "bg-white/40"
        )} />
      </div>
      {isTotal && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-yellow-400 uppercase tracking-widest">Dipol Molekul</span>
      )}
    </motion.div>
  );
};

// --- Main Simulation ---

export default function PolaritasMolekul() {
  const [mode, setMode] = useState<"diatomic" | "preset">("diatomic");
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [enA, setEnA] = useState(2.1);
  const [enB, setEnB] = useState(3.0);
  const [showField, setShowField] = useState(false);
  const [rotation, setRotation] = useState(0);

  const preset = useMemo(() => PRESETS.find(p => p.id === selectedPresetId)!, [selectedPresetId]);

  const diff = Math.abs(enA - enB);
  const bondType = useMemo(() => {
    if (diff < 0.5) return { label: "Non-Polar", color: "text-zinc-400", bg: "bg-zinc-500/10" };
    if (diff < 1.7) return { label: "Kovalen Polar", color: "text-indigo-400", bg: "bg-indigo-500/10" };
    return { label: "Ikatan Ionik", color: "text-rose-400", bg: "bg-rose-500/10" };
  }, [diff]);

  // Handle Rotation in Electric Field
  useEffect(() => {
    if (!showField) {
      setRotation(0);
      return;
    }

    let targetRotation = 0;
    if (mode === "diatomic") {
      // Align more negative atom to positive plate (let's say positive plate is top)
      targetRotation = enA > enB ? 90 : -90;
    } else {
      // Presets alignment (simplified logic)
      if (preset.id === "h2o") targetRotation = 180;
      if (preset.id === "nh3") targetRotation = 180;
      if (preset.id === "co2" || preset.id === "bf3") targetRotation = 0; // Non polar don't rotate
    }

    const timer = setTimeout(() => setRotation(targetRotation), 100);
    return () => clearTimeout(timer);
  }, [showField, mode, enA, enB, preset]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-zinc-950 text-zinc-200">
      
      {/* --- Main Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Electric Field Plates */}
        <AnimatePresence>
          {showField && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center gap-8">
                 {Array.from({ length: 10 }).map((_, i) => <Plus key={i} className="w-2 h-2 text-rose-500" />)}
                 <span className="absolute -top-6 text-[10px] font-black text-rose-500 tracking-widest uppercase">Pelat Positif</span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center gap-8">
                 {Array.from({ length: 10 }).map((_, i) => <Minus key={i} className="w-2 h-2 text-blue-500" />)}
                 <span className="absolute -bottom-6 text-[10px] font-black text-blue-500 tracking-widest uppercase">Pelat Negatif</span>
              </div>
              {/* Field Lines */}
              <div className="absolute inset-0 flex items-center justify-center gap-16 opacity-5">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="h-full w-px bg-white flex flex-col items-center py-20 gap-20">
                      <MoveUp className="w-4 h-4 rotate-180" />
                      <MoveUp className="w-4 h-4 rotate-180" />
                   </div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 flex gap-4 z-30">
          <motion.div 
            key={mode + selectedPresetId}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2",
              mode === "diatomic" ? bondType.bg : (preset.id === "co2" || preset.id === "bf3" ? "bg-zinc-500/10 border-zinc-500/20" : "bg-indigo-500/10 border-indigo-500/20")
            )}
          >
            <Zap className={cn("w-4 h-4", mode === "diatomic" ? bondType.color : "text-indigo-400")} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {mode === "diatomic" ? bondType.label : (preset.id === "co2" || preset.id === "bf3" ? "Molekul Non-Polar" : "Molekul Polar")}
            </span>
          </motion.div>
        </div>

        {/* Molecule Canvas */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ type: "spring", damping: 20, stiffness: 50 }}
          className="relative w-full max-w-2xl h-96 flex items-center justify-center"
        >
          
          {mode === "diatomic" ? (
            <div className="relative flex items-center justify-center w-full">
              {/* Electron Cloud Diatomic */}
              <motion.div 
                animate={{ 
                  scaleX: 1 + Math.abs(enA - enB) * 0.1,
                  x: (enB - enA) * 20
                }}
                className="absolute w-48 h-32 blur-3xl opacity-20 rounded-full"
                style={{ 
                  background: `linear-gradient(to right, ${enA > enB ? '#f87171' : '#60a5fa'}, ${enB > enA ? '#f87171' : '#60a5fa'})` 
                }}
              />

              {/* Atom A */}
              <div className="relative z-20 -translate-x-16">
                 <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center text-xl font-bold">A</div>
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-zinc-500">EN: {enA.toFixed(1)}</span>
                 <AnimatePresence>
                    {diff > 0.4 && (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={cn("absolute -bottom-8 left-1/2 -translate-x-1/2 font-serif text-lg", enA > enB ? "text-rose-400" : "text-blue-400")}
                      >
                        {enA > enB ? "δ-" : "δ+"}
                      </motion.span>
                    )}
                 </AnimatePresence>
              </div>

              {/* Bond Line */}
              <div className="w-32 h-1 bg-white/10 absolute" />

              {/* Atom B */}
              <div className="relative z-20 translate-x-16">
                 <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center text-xl font-bold">B</div>
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-zinc-500">EN: {enB.toFixed(1)}</span>
                 <AnimatePresence>
                    {diff > 0.4 && (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={cn("absolute -bottom-8 left-1/2 -translate-x-1/2 font-serif text-lg", enB > enA ? "text-rose-400" : "text-blue-400")}
                      >
                        {enB > enA ? "δ-" : "δ+"}
                      </motion.span>
                    )}
                 </AnimatePresence>
              </div>

              {/* Dipole Arrow Diatomic */}
              <DipoleArrow 
                from={{ x: enA < enB ? -64 : 64, y: 0 }} 
                to={{ x: enA < enB ? 64 : -64, y: 0 }} 
                strength={Math.min(1, diff / 2)} 
                isTotal
              />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full">
              {/* Presets Visualization */}
              {preset.atoms.map((atom) => {
                const isCenter = atom.id === "o" || atom.id === "c" || atom.id === "n" || atom.id === "b";
                return (
                  <motion.div
                    key={atom.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, x: atom.x, y: atom.y }}
                    className="absolute z-20"
                  >
                    <div className={cn(
                      "rounded-full border-2 border-white/10 flex items-center justify-center font-bold shadow-lg",
                      isCenter ? "w-16 h-16 bg-zinc-800 text-xl" : "w-10 h-10 bg-zinc-900 text-sm"
                    )}>
                      {atom.symbol}
                    </div>
                    {/* Partial Charges for Preset */}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-serif opacity-60">
                      {atom.id === "o" || atom.id === "n" || (atom.id.startsWith("f") && preset.id !== "bf3") ? "δ-" : (atom.symbol === "H" ? "δ+" : "")}
                    </span>
                  </motion.div>
                );
              })}
              
              {/* Bond Lines for Presets */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 {preset.atoms.map((atom) => {
                   if (atom.x === 0 && atom.y === 0) return null;
                   // Find the center atom (usually at 0,0 or specifically identified)
                   const center = preset.atoms.find(a => a.x === 0 && (a.y === 0 || a.id === "o" || a.id === "n")) || preset.atoms[0];
                   return (
                     <line 
                        key={`bond-${atom.id}`}
                        x1={`calc(50% + ${center.x}px)`} y1={`calc(50% + ${center.y}px)`}
                        x2={`calc(50% + ${atom.x}px)`} y2={`calc(50% + ${atom.y}px)`}
                        stroke="rgba(255,255,255,0.1)" strokeWidth="2"
                     />
                   );
                 })}
              </svg>

              {/* Dipole Resultant for Presets */}
              {(preset.id === "h2o" || preset.id === "nh3") && (
                <DipoleArrow from={{ x: 0, y: 0 }} to={{ x: 0, y: -60 }} strength={0.8} isTotal />
              )}
            </div>
          )}

        </motion.div>

        {/* Legend / Info */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-30">
           <div className="glass-card p-4 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md max-w-sm">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info className="w-3 h-3" /> Info Geometri
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {mode === "diatomic" ? "Molekul diatomik sederhana. Polaritas ditentukan hanya oleh perbedaan elektronegativitas." : preset.description}
              </p>
           </div>

           <div className="flex flex-col gap-2">
             <button 
              onClick={() => setShowField(!showField)}
              className={cn(
                "px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg active:scale-95",
                showField ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 border border-white/5 hover:border-white/20"
              )}
             >
               {showField ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
               Medan Listrik: {showField ? "ON" : "OFF"}
             </button>
           </div>
        </div>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 relative z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-zinc-900/80 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Maximize2 className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Polaritas</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Eksplorasi Dipol & Geometri</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Mode Switcher */}
          <section className="space-y-4">
             <div className="flex p-1 bg-zinc-800 rounded-xl border border-white/5">
                <button 
                  onClick={() => setMode("diatomic")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                    mode === "diatomic" ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                  )}
                >
                  Diatomik
                </button>
                <button 
                  onClick={() => setMode("preset")}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                    mode === "preset" ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                  )}
                >
                  Molekul Riil
                </button>
             </div>
          </section>

          {mode === "diatomic" ? (
            /* Diatomic Controls */
            <section className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Atom A (Kiri)</label>
                  <span className="font-mono text-xl font-bold text-white">{enA.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.7" max="4.0" step="0.1" value={enA} 
                  onChange={(e) => setEnA(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Atom B (Kanan)</label>
                  <span className="font-mono text-xl font-bold text-white">{enB.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.7" max="4.0" step="0.1" value={enB} 
                  onChange={(e) => setEnB(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest">Selisih (ΔEN)</span>
                    <span className="text-white font-bold">{diff.toFixed(1)}</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${(diff / 3.3) * 100}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-rose-500"
                    />
                 </div>
              </div>
            </section>
          ) : (
            /* Preset Controls */
            <section className="space-y-4">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Atom className="w-3.5 h-3.5" /> Pilih Molekul
               </h3>
               <div className="grid grid-cols-1 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPresetId(p.id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        selectedPresetId === p.id 
                          ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                          : "bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-zinc-800/50"
                      )}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {p.name}
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5">{p.formula}</span>
                        </div>
                        <div className="text-[10px] opacity-60 uppercase tracking-widest">{p.geometry}</div>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        p.id === "co2" || p.id === "bf3" ? "bg-zinc-600" : "bg-indigo-500 shadow-[0_0_8px_#6366f1]"
                      )} />
                    </button>
                  ))}
               </div>
            </section>
          )}

          {/* Properties Table */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
               <Settings2 className="w-3.5 h-3.5" /> Parameter Ikatan
             </h3>
             <div className="space-y-2">
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="text-xs text-zinc-400">Elektronegativitas Tertinggi</span>
                   <span className="text-xs font-bold text-white">4.0 (F)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="text-xs text-zinc-400">Ambang Polaritas</span>
                   <span className="text-xs font-bold text-white">0.5 - 1.7</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="text-xs text-zinc-400">Resultan Vektor Dipol</span>
                   <span className="text-xs font-bold text-yellow-400">
                     {mode === "diatomic" ? (diff > 0.4 ? "Ada" : "Nol") : (preset.id === "h2o" || preset.id === "nh3" ? "Ada" : "Nol")}
                   </span>
                </div>
             </div>
          </section>

          {/* Info Card */}
          <section className="p-5 rounded-3xl bg-zinc-800/50 border border-white/5 space-y-3 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CircleDot className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Konsep Kunci</h4>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               Kepolaran molekul bergantung pada **perbedaan EN** dan **geometri molekul**. Molekul simetris dapat memiliki ikatan polar namun bersifat non-polar secara keseluruhan.
             </p>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
            <Pointer className="w-3 h-3 text-indigo-500" />
            Geser slider atau pilih molekul
          </div>
        </div>

      </div>

      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
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
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
