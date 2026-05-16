"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Zap,
  Flame,
  ArrowRight,
  TrendingUp,
  CircleDot,
  Orbit,
  Radiation,
  Waves,
  MousePointer2,
  Trophy,
  History,
  Activity
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type RockStatus = "meteoroid" | "meteor" | "meteorit" | "burned";

type Rock = {
  id: number;
  x: number;
  y: number;
  mass: number;
  speed: number;
  status: RockStatus;
  opacity: number;
  craterSize: number;
};

// --- Data ---
const TERMINOLOGY = {
  meteoroid: {
    title: "Meteoroid",
    desc: "Batuan luar angkasa yang masih melayang di ruang hampa.",
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20"
  },
  meteor: {
    title: "Meteor",
    desc: "Batuan yang terbakar karena gesekan atmosfer bumi.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20"
  },
  meteorit: {
    title: "Meteorit",
    desc: "Sisa batuan yang berhasil mendarat di permukaan bumi.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  }
};

export default function AsteroidMeteor() {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [activeMass, setActiveMass] = useState(50);
  const [activeSpeed, setActiveSpeed] = useState(15);
  const [impactCount, setImpactCount] = useState(0);

  const spawnRock = useCallback(() => {
    const newRock: Rock = {
      id: Date.now(),
      x: 15 + Math.random() * 70,
      y: -10,
      mass: activeMass,
      speed: activeSpeed,
      status: "meteoroid",
      opacity: 1,
      craterSize: 0
    };
    setRocks(prev => [...prev, newRock]);
  }, [activeMass, activeSpeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRocks(prev => prev.map(rock => {
        if (rock.status === "burned" || rock.status === "meteorit") return rock;

        let newY = rock.y + (rock.speed / 10);
        let newStatus: RockStatus = rock.status;
        let newOpacity = rock.opacity;
        let newCraterSize = rock.craterSize;

        // Transition: Meteoroid -> Meteor (Atmosphere entry)
        if (newY >= 30 && newY < 85) {
          newStatus = "meteor";
        }

        // Transition: Meteor -> Meteorit or Burned
        if (newY >= 85) {
          if (rock.mass > 40) {
            newStatus = "meteorit";
            newY = 85; // Land on surface
            newCraterSize = rock.mass / 4;
            setImpactCount(c => c + 1);
          } else {
            newStatus = "burned";
            newOpacity = 0;
          }
        }

        return { ...rock, y: newY, status: newStatus, opacity: newOpacity, craterSize: newCraterSize };
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Astronomy Lab --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Asteroid & Meteor</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Impak Celestial</p>
            </div>
          </div>

          {/* Launch Controls */}
          <div className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Radiation className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Massa Batuan</span>
                   </div>
                   <span className="text-lg font-black text-white">{activeMass}T</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5" 
                  value={activeMass} onChange={(e) => setActiveMass(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">
                  {activeMass < 45 ? "Sangat mungkin habis terbakar" : "Berpotensi menjadi Meteorit"}
                </p>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Zap className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Kecepatan Entri</span>
                   </div>
                   <span className="text-lg font-black text-white">{activeSpeed} km/s</span>
                </div>
                <input 
                  type="range" min="10" max="40" step="1" 
                  value={activeSpeed} onChange={(e) => setActiveSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
             </div>

             <button
               onClick={spawnRock}
               className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
               <Flame className="w-4 h-4" />
               Luncurkan Batuan
             </button>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="flex-1 p-8 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-orange-400 mb-2">
                 <History className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Glosarium Terminologi</span>
              </div>
              <div className="space-y-3">
                 {(Object.keys(TERMINOLOGY) as Array<keyof typeof TERMINOLOGY>).map((key) => (
                   <div key={key} className={`p-4 rounded-2xl border ${TERMINOLOGY[key].border} ${TERMINOLOGY[key].bg} transition-all`}>
                      <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${TERMINOLOGY[key].color}`}>
                        {TERMINOLOGY[key].title}
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                        {TERMINOLOGY[key].desc}
                      </p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 flex items-center justify-between">
              <div>
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Impak</span>
                 <h3 className="text-2xl font-black text-white">{impactCount}</h3>
              </div>
              <Trophy className="w-8 h-8 text-amber-400 opacity-20" />
           </div>
        </div>

        {/* Global Insight */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Orbit className="w-4 h-4 text-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Fakta Antariksa</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Setiap hari, sekitar 100 ton material antariksa masuk ke atmosfer bumi, namun hampir semuanya habis menjadi debu.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#020202] overflow-hidden">
        
        {/* Space Background (Stars) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Environment Layers (Atmosphere) */}
        <div className="absolute inset-0 flex flex-col">
           <div className="h-[30%] bg-black" /> {/* Deep Space */}
           <div className="h-[55%] bg-gradient-to-b from-black via-blue-900/30 to-sky-400/20 border-b border-sky-400/30 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.1),transparent_70%)]" />
           </div> {/* Atmosphere */}
           <div className="h-[15%] bg-[#0a1a0a] border-t-2 border-emerald-900 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
           </div> {/* Surface */}
        </div>

        {/* Simulation Container */}
        <div className="relative w-full max-w-4xl h-full overflow-hidden">
           
           {/* Section Labels */}
           <div className="absolute top-[5%] left-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Exosphere (Vakum)</div>
           <div className="absolute top-[40%] left-4 text-[9px] font-black text-sky-400/50 uppercase tracking-widest">Mesosphere (Atmosfer)</div>
           <div className="absolute bottom-[5%] left-4 text-[9px] font-black text-emerald-600 uppercase tracking-widest">Lithosphere (Permukaan)</div>

           {/* Craters */}
           <AnimatePresence>
              {rocks.filter(r => r.status === "meteorit").map(rock => (
                <motion.div 
                  key={`crater-${rock.id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-[10%] bg-black/60 border border-emerald-900 rounded-full blur-[2px]"
                  style={{ 
                    left: `${rock.x}%`, 
                    width: rock.craterSize * 2, 
                    height: rock.craterSize / 2, 
                    transform: "translateX(-50%)" 
                  }}
                />
              ))}
           </AnimatePresence>

           {/* Rocks */}
           {rocks.map(rock => (
             <motion.div
               key={rock.id}
               className="absolute z-30"
               style={{ left: `${rock.x}%`, top: `${rock.y}%`, transform: "translate(-50%, -50%)" }}
               animate={{ opacity: rock.opacity }}
             >
                {/* Plasma Tail (Meteor) */}
                {rock.status === "meteor" && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <motion.div 
                        animate={{ height: [40, 80, 40], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                        className="w-1.5 bg-gradient-to-t from-orange-500 via-orange-500/40 to-transparent blur-[2px] rounded-full" 
                        style={{ height: rock.speed * 2 }}
                      />
                   </div>
                )}

                {/* Rock Body */}
                <div className={`relative ${rock.status === 'meteorit' ? 'grayscale opacity-50' : ''}`}>
                   <div 
                     className={`rounded-xl rotate-45 border border-white/10 ${rock.status === 'meteor' ? 'bg-orange-500 shadow-[0_0_20px_orange]' : 'bg-zinc-700 shadow-xl'}`}
                     style={{ width: rock.mass / 3, height: rock.mass / 3 }}
                   />
                   
                   {/* Heat Glow */}
                   {rock.status === "meteor" && (
                     <div className="absolute inset-0 bg-orange-400 rounded-full blur-md scale-150 mix-blend-screen opacity-60" />
                   )}
                </div>

                {/* Impact Flash */}
                {rock.status === "meteorit" && rock.y >= 85 && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-white rounded-full blur-xl"
                  />
                )}

                {/* Status Indicator Floating */}
                <div className="absolute left-full ml-4 whitespace-nowrap">
                   <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${TERMINOLOGY[rock.status === 'burned' ? 'meteor' : (rock.status as keyof typeof TERMINOLOGY)]?.color}`}>
                     {rock.status === 'burned' ? 'Terbakar Habis' : rock.status}
                   </span>
                </div>
             </motion.div>
           ))}

           {/* Analysis Header Overlay */}
           <div className="absolute top-10 right-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-[24px] shadow-2xl">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_orange]" />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Impact Tracker Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">Status: {rocks.some(r => r.y < 85 && r.y > -10) ? 'ENTRI TERDETEKSI' : 'STANDBY'}</h3>
              </div>
           </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sesuaikan Massa & Kecepatan untuk Simulasi Impak</span>
        </div>
      </div>

    </div>
  );
}
