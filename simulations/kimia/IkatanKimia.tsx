"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Info, 
  Settings2, 
  RotateCcw, 
  Zap, 
  Droplet, 
  Atom, 
  ArrowRightLeft,
  ChevronRight,
  Maximize2,
  MousePointer2,
  Lock,
  Unlock
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Types & Constants ---

type BondType = "ionic" | "covalent";

interface AtomData {
  symbol: string;
  name: string;
  valenceElectrons: number;
  shells: number[];
  color: string;
  size: number;
  electronegativity: number;
}

interface BondPair {
  id: string;
  type: BondType;
  atom1: AtomData;
  atom2: AtomData;
  description: string;
  bondEnergy: number;
  bondLength: number; // optimal distance in px for the sim
}

const ATOMS: Record<string, AtomData> = {
  H: { symbol: "H", name: "Hidrogen", valenceElectrons: 1, shells: [1], color: "#e2e8f0", size: 40, electronegativity: 2.20 },
  Li: { symbol: "Li", name: "Litium", valenceElectrons: 1, shells: [2, 1], color: "#c084fc", size: 60, electronegativity: 0.98 },
  Na: { symbol: "Na", name: "Natrium", valenceElectrons: 1, shells: [2, 8, 1], color: "#818cf8", size: 70, electronegativity: 0.93 },
  Mg: { symbol: "Mg", name: "Magnesium", valenceElectrons: 2, shells: [2, 8, 2], color: "#60a5fa", size: 75, electronegativity: 1.31 },
  F: { symbol: "F", name: "Fluor", valenceElectrons: 7, shells: [2, 7], color: "#fbbf24", size: 55, electronegativity: 3.98 },
  Cl: { symbol: "Cl", name: "Klorin", valenceElectrons: 7, shells: [2, 8, 7], color: "#4ade80", size: 65, electronegativity: 3.16 },
  O: { symbol: "O", name: "Oksigen", valenceElectrons: 6, shells: [2, 6], color: "#f87171", size: 55, electronegativity: 3.44 },
  N: { symbol: "N", name: "Nitrogen", valenceElectrons: 5, shells: [2, 5], color: "#38bdf8", size: 55, electronegativity: 3.04 },
};

const BOND_PAIRS: BondPair[] = [
  {
    id: "nacl",
    type: "ionic",
    atom1: ATOMS.Na,
    atom2: ATOMS.Cl,
    bondLength: 120,
    bondEnergy: 411,
    description: "Natrium memberikan 1 elektron ke Klorin. Terbentuk ion Na+ dan Cl- yang saling tarik-menarik."
  },
  {
    id: "lif",
    type: "ionic",
    atom1: ATOMS.Li,
    atom2: ATOMS.F,
    bondLength: 100,
    bondEnergy: 577,
    description: "Litium memberikan 1 elektron valensinya ke Fluor. Ikatan ini sangat kuat karena perbedaan elektronegativitas yang besar."
  },
  {
    id: "mgo",
    type: "ionic",
    atom1: ATOMS.Mg,
    atom2: ATOMS.O,
    bondLength: 110,
    bondEnergy: 601,
    description: "Magnesium memberikan 2 elektron ke Oksigen. Terbentuk ion Mg2+ dan O2-."
  },
  {
    id: "h2",
    type: "covalent",
    atom1: ATOMS.H,
    atom2: ATOMS.H,
    bondLength: 80,
    bondEnergy: 436,
    description: "Dua atom Hidrogen berbagi sepasang elektron untuk mencapai kestabilan (duplet)."
  },
  {
    id: "o2",
    type: "covalent",
    atom1: ATOMS.O,
    atom2: ATOMS.O,
    bondLength: 90,
    bondEnergy: 498,
    description: "Dua atom Oksigen berbagi dua pasang elektron (ikatan rangkap dua) untuk mencapai oktet."
  },
  {
    id: "hcl",
    type: "covalent",
    atom1: ATOMS.H,
    atom2: ATOMS.Cl,
    bondLength: 110,
    bondEnergy: 431,
    description: "Ikatan kovalen polar antara Hidrogen dan Klorin. Elektron lebih sering berada di dekat Klorin."
  }
];

// --- Sub-Components ---

const Electron = ({ angle, radius, color, isShared, isTransferred, progress }: { 
  angle: number; 
  radius: number; 
  color: string; 
  isShared?: boolean;
  isTransferred?: boolean;
  progress?: number;
}) => {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20"
      style={{ backgroundColor: color, x, y }}
      animate={isShared ? {
        x: [x, x + 20, x, x - 20, x],
        y: [y, y - 10, y, y + 10, y],
      } : {}}
      transition={isShared ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined}
    />
  );
};

const AtomComponent = ({ 
  data, 
  isBonded, 
  showShells, 
  charge,
  sharedCount = 0
}: { 
  data: AtomData; 
  isBonded: boolean; 
  showShells: boolean;
  charge: number;
  sharedCount?: number;
}) => {
  // Determine how many electrons to show in the outer shell
  let outerElectrons = data.valenceElectrons;
  if (isBonded) {
    if (charge > 0) outerElectrons -= charge;
    if (charge < 0) outerElectrons += Math.abs(charge);
    outerElectrons -= sharedCount;
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Nucleus */}
      <motion.div 
        className="relative z-10 flex items-center justify-center font-bold text-white shadow-xl"
        style={{ 
          width: data.size, 
          height: data.size, 
          borderRadius: "50%",
          backgroundColor: data.color,
          fontSize: data.size * 0.4
        }}
        animate={{ scale: isBonded ? 1.05 : 1 }}
      >
        {data.symbol}
        
        {/* Charge indicator */}
        <AnimatePresence>
          {charge !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2 bg-white text-zinc-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 font-black"
            >
              {charge > 0 ? `+${charge}` : charge}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shells */}
      {showShells && data.shells.map((count, i) => {
        const radius = data.size * 0.8 + (i * 25);
        const isOuter = i === data.shells.length - 1;
        
        return (
          <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="border border-white/10 rounded-full"
              style={{ width: radius * 2, height: radius * 2 }}
            />
            {/* Electrons on this shell */}
            {Array.from({ length: isOuter ? outerElectrons : count }).map((_, j) => {
              const angle = (j / (isOuter ? outerElectrons : count)) * Math.PI * 2;
              return <Electron key={j} angle={angle} radius={radius} color="#fff" />;
            })}
          </div>
        );
      })}
    </div>
  );
};

// --- Main Simulation ---

export default function IkatanKimia() {
  const [selectedPairId, setSelectedPairId] = useState(BOND_PAIRS[0].id);
  const [distance, setDistance] = useState(250);
  const [showShells, setShowShells] = useState(true);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const pair = useMemo(() => BOND_PAIRS.find(p => p.id === selectedPairId)!, [selectedPairId]);
  
  const isBonded = distance <= pair.bondLength + 10;
  const isRepelling = distance < pair.bondLength - 20;

  // Auto-move logic (simple attraction simulation)
  useEffect(() => {
    if (!isAutoMoving) return;
    
    const interval = setInterval(() => {
      setDistance(prev => {
        if (Math.abs(prev - pair.bondLength) < 2) {
          setIsAutoMoving(false);
          return pair.bondLength;
        }
        const force = (prev - pair.bondLength) * 0.05;
        return prev - force;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isAutoMoving, pair.bondLength]);

  // Derived states for visuals
  const charge1 = useMemo(() => {
    if (!isBonded || pair.type !== "ionic") return 0;
    // For ionic: atom1 usually gives away (Na, Li, Mg)
    return pair.atom1.valenceElectrons <= 3 ? pair.atom1.valenceElectrons : - (8 - pair.atom1.valenceElectrons);
  }, [isBonded, pair]);

  const charge2 = useMemo(() => {
    if (!isBonded || pair.type !== "ionic") return 0;
    return -charge1;
  }, [isBonded, pair, charge1]);

  const sharedCount = useMemo(() => {
    if (!isBonded || pair.type !== "covalent") return 0;
    // Simplified logic: enough to reach octet/duplet
    const needed1 = pair.atom1.symbol === "H" ? 2 : 8;
    return needed1 - pair.atom1.valenceElectrons;
  }, [isBonded, pair]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-zinc-950 text-zinc-200">
      
      {/* --- Main Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden border-r border-white/5">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* Dynamic Status Badges */}
        <div className="absolute top-8 flex gap-4 z-30">
          <motion.div 
            animate={{ 
              backgroundColor: isBonded ? "rgba(34, 197, 94, 0.2)" : "rgba(161, 161, 170, 0.1)",
              borderColor: isBonded ? "rgba(34, 197, 94, 0.5)" : "rgba(161, 161, 170, 0.2)"
            }}
            className="px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2"
          >
            <Zap className={cn("w-4 h-4", isBonded ? "text-green-400" : "text-zinc-500")} />
            <span className="text-sm font-medium uppercase tracking-wider">
              {isBonded ? "Ikatan Terbentuk" : "Atom Bebas"}
            </span>
          </motion.div>

          <motion.div 
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
          >
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">
              Jarak: {Math.round(distance / 2)} pm
            </span>
          </motion.div>
        </div>

        {/* The Atoms Canvas */}
        <div className="relative w-full h-96 flex items-center justify-center">
          
          {/* Energy Potential Curve Line (Stylized) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <svg width="100%" height="100%" viewBox="0 0 800 400" className="overflow-visible">
                <path 
                  d="M 100 50 Q 200 350 400 350 T 700 300" 
                  stroke="currentColor" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                />
             </svg>
          </div>

          <div className="relative flex items-center justify-center w-full max-w-2xl">
            
            {/* Atom 1 */}
            <motion.div 
              style={{ x: -distance / 2 }}
              animate={{ y: isBonded ? [0, -5, 0] : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="z-20 cursor-grab active:cursor-grabbing"
            >
              <AtomComponent 
                data={pair.atom1} 
                isBonded={isBonded} 
                showShells={showShells} 
                charge={charge1}
                sharedCount={pair.type === "covalent" ? sharedCount : 0}
              />
            </motion.div>

            {/* Bonding Interactions Visuals */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <AnimatePresence>
                {isBonded && pair.type === "covalent" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex gap-2"
                  >
                    {/* Shared Electrons Container */}
                    {Array.from({ length: sharedCount * 2 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#fff]"
                        animate={{ 
                          y: [0, -20, 0, 20, 0],
                          x: [0, i % 2 === 0 ? 5 : -5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {isBonded && pair.type === "ionic" && (
                   <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute w-full flex justify-center"
                   >
                     {/* Attraction Lines */}
                     <svg className="w-full h-20 overflow-visible opacity-30">
                       <line 
                         x1="50%" y1="50%" x2="50%" y2="50%" 
                         stroke="white" strokeWidth="2" strokeDasharray="5 5"
                         className="animate-[pulse_2s_infinite]"
                       />
                     </svg>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Atom 2 */}
            <motion.div 
              style={{ x: distance / 2 }}
              animate={{ y: isBonded ? [0, 5, 0] : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="z-20 cursor-grab active:cursor-grabbing"
            >
              <AtomComponent 
                data={pair.atom2} 
                isBonded={isBonded} 
                showShells={showShells} 
                charge={charge2}
                sharedCount={pair.type === "covalent" ? sharedCount : 0}
              />
            </motion.div>

            {/* Attraction / Repulsion Force Arrows */}
            <AnimatePresence>
               {!isBonded && distance < 400 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   className="absolute flex items-center justify-between w-full px-20 pointer-events-none"
                 >
                   <ArrowRightLeft className="w-8 h-8 text-white/20 animate-pulse" />
                 </motion.div>
               )}
            </AnimatePresence>

          </div>
        </div>

        {/* Interactive Slider */}
        <div className="w-full max-w-md mt-12 space-y-6 z-30">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
            <span>Tolak Menolak</span>
            <span className={cn(isBonded && "text-green-400 transition-colors")}>Kesetimbangan</span>
            <span>Tarik Menarik</span>
          </div>
          <div className="relative group">
            <input 
              type="range" 
              min="60" 
              max="500" 
              value={distance} 
              onChange={(e) => {
                setDistance(parseInt(e.target.value));
                setIsAutoMoving(false);
              }}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white/20 pointer-events-none rounded-full"
              style={{ left: `${((pair.bondLength - 60) / 440) * 100}%` }}
            />
          </div>
          <div className="flex justify-center gap-4">
             <button 
              onClick={() => setIsAutoMoving(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all font-semibold text-sm shadow-lg shadow-indigo-900/20 active:scale-95"
             >
               {isAutoMoving ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
               Automasi Ikatan
             </button>
             <button 
              onClick={() => {
                setDistance(500);
                setIsAutoMoving(false);
              }}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors border border-white/5"
             >
               <RotateCcw className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Dynamic Explanation Panel */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-8 left-8 right-8 max-w-3xl mx-auto glass-card p-6 border border-white/10 rounded-2xl z-40 backdrop-blur-xl bg-zinc-900/60"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">
                    {pair.atom1.name} + {pair.atom2.name} ({pair.id.toUpperCase()})
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {pair.description} 
                    {isBonded && (
                      <span className="text-green-400 ml-1 font-medium">
                        Sistem kini berada pada energi potensial terendah.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] border-l border-white/5 bg-zinc-900/50 backdrop-blur-sm flex flex-col z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Settings2 className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Simulasi Ikatan</h2>
          </div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Arshaka Edu • Kimia</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Pair Selection */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
              <Atom className="w-4 h-4" /> Pilih Pasangan Atom
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {BOND_PAIRS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPairId(p.id);
                    setDistance(400);
                  }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                    selectedPairId === p.id 
                      ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                      : "bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-zinc-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-zinc-900" style={{ backgroundColor: p.atom1.color }} />
                      <div className="w-8 h-8 rounded-full border-2 border-zinc-900" style={{ backgroundColor: p.atom2.color }} />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {p.atom1.symbol} + {p.atom2.symbol}
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          p.type === "ionic" ? "border-orange-500/30 text-orange-400 bg-orange-500/10" : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                        )}>
                          {p.type === "ionic" ? "Ionik" : "Kovalen"}
                        </span>
                      </div>
                      <div className="text-xs opacity-60">{p.id.toUpperCase()}</div>
                    </div>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 transition-transform", selectedPairId === p.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100")} />
                </button>
              ))}
            </div>
          </section>

          {/* Visualization Toggles */}
          <section className="space-y-4">
             <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
              <Maximize2 className="w-4 h-4" /> Pengaturan Visual
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-white/5 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                <span className="text-sm font-medium text-zinc-300">Tampilkan Kulit Elektron</span>
                <input 
                  type="checkbox" 
                  checked={showShells} 
                  onChange={(e) => setShowShells(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-white/5 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                <span className="text-sm font-medium text-zinc-300">Tampilkan Penjelasan</span>
                <input 
                  type="checkbox" 
                  checked={showExplanation} 
                  onChange={(e) => setShowExplanation(e.target.checked)}
                  className="w-5 h-5 accent-indigo-500"
                />
              </label>
            </div>
          </section>

          {/* Properties Card */}
          <section className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Properti Ikatan</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">Energi Ikatan</p>
                <p className="text-lg font-bold text-white">{pair.bondEnergy} <span className="text-xs font-normal opacity-60">kJ/mol</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">Jarak Ikatan</p>
                <p className="text-lg font-bold text-white">{pair.bondLength * 2} <span className="text-xs font-normal opacity-60">pm</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500">Δ Elektronegativitas</p>
                <p className="text-lg font-bold text-white">
                  {Math.abs(pair.atom1.electronegativity - pair.atom2.electronegativity).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <div className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5">
                   <Zap className={cn("w-5 h-5", isBonded ? "text-yellow-400" : "text-zinc-700")} />
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
            <MousePointer2 className="w-3 h-3 text-indigo-500" />
            Gunakan slider untuk mengatur jarak
          </div>
        </div>

      </div>

      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #6366f1;
          border: 4px solid #fff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
          transition: all 0.2s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #4f46e5;
        }
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}
