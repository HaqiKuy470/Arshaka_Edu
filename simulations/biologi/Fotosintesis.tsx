"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Wind, 
  Droplets, 
  Activity, 
  ChevronLeft,
  Info,
  Leaf,
  FlaskConical,
  Zap
} from "lucide-react";
import Link from "next/link";

// --- Components ---

const Particle = ({ type, delay }: { type: "o2" | "co2", delay: number }) => {
  const isO2 = type === "o2";
  return (
    <motion.div
      initial={{ 
        x: isO2 ? 0 : (Math.random() - 0.5) * 400, 
        y: isO2 ? 0 : -200, 
        opacity: 0,
        scale: 0.5
      }}
      animate={{ 
        x: isO2 ? (Math.random() - 0.5) * 400 : 0, 
        y: isO2 ? -300 : 0, 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear"
      }}
      className={`absolute w-3 h-3 rounded-full blur-[1px] border shadow-lg ${
        isO2 ? "bg-sky-400/60 border-sky-300/50" : "bg-rose-400/40 border-rose-300/30"
      }`}
    />
  );
};

export default function Fotosintesis() {
  const [light, setLight] = useState(50);
  const [co2, setCo2] = useState(50);
  const [water, setWater] = useState(70);

  // Rate calculation (Limiting Factor Principle)
  const rate = useMemo(() => {
    // Photosynthesis rate is limited by the scarcest resource
    // We use a smoothed minimum to make it feel more organic
    return Math.min(light, co2, water);
  }, [light, co2, water]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Controls & Info --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Fotosintesis</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Produksi Energi Tumbuhan</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl border border-emerald-500/20 space-y-4">
             <div className="flex items-center gap-3 text-emerald-400">
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Reaksi Kimia</span>
             </div>
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-emerald-200/80 text-center">
                6CO₂ + 6H₂O + Energi → C₆H₁₂O₆ + 6O₂
             </div>
             <p className="text-[11px] text-zinc-500 leading-relaxed italic">
               "Proses pembentukan glukosa dan oksigen dari karbon dioksida dan air menggunakan energi cahaya."
             </p>
          </div>
        </div>

        {/* Sliders Area */}
        <div className="p-8 space-y-10">
          
          {/* Light Intensity */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-yellow-400">
                <Sun className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Intensitas Cahaya</span>
              </div>
              <span className="text-xs font-mono font-bold text-yellow-500">{light}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={light}
              onChange={(e) => setLight(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          {/* CO2 Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-rose-400">
                <Wind className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Kadar CO₂</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-500">{co2}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={co2}
              onChange={(e) => setCo2(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Water Availability */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sky-400">
                <Droplets className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Ketersediaan Air</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-500">{water}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={(e) => setWater(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-auto p-8 border-t border-white/5">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
             <div className="flex items-center gap-3 text-amber-500">
                <Info className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Hukum Liebig</span>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed">
               Laju fotosintesis dibatasi oleh faktor yang paling sedikit tersedia. Jika cahaya melimpah namun CO₂ sangat sedikit, maka laju produksi glukosa tetap akan rendah.
             </p>
          </div>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Sun Glow */}
        <div 
          className="absolute inset-0 transition-all duration-1000 pointer-events-none"
          style={{ backgroundColor: `rgba(253, 224, 71, ${light / 2000})` }}
        />
        
        {/* Sun Aura */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full"
        />

        {/* The Plant System */}
        <div className="relative w-full max-w-2xl flex flex-col items-center">
           
           {/* Particles System */}
           <div className="absolute inset-0 z-10 pointer-events-none">
              {/* CO2 Particles entering leaf */}
              {Array.from({ length: Math.floor(rate / 5) }).map((_, i) => (
                <Particle key={`co2-${i}`} type="co2" delay={i * 0.5} />
              ))}
              {/* O2 Particles leaving leaf */}
              {Array.from({ length: Math.floor(rate / 5) }).map((_, i) => (
                <Particle key={`o2-${i}`} type="o2" delay={i * 0.5} />
              ))}
           </div>

           {/* The Leaf (Centerpiece) */}
           <div className="relative z-20 flex items-center justify-center">
              {/* Leaf SVG */}
              <motion.svg 
                viewBox="0 0 200 200" 
                className="w-80 h-80 drop-shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <defs>
                  <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22c55e' }} />
                    <stop offset="100%" style={{ stopColor: '#15803d' }} />
                  </linearGradient>
                </defs>
                <path 
                  d="M100 20 C 100 20, 160 80, 160 120 C 160 160, 100 180, 100 180 C 100 180, 40 160, 40 120 C 40 80, 100 20, 100 20" 
                  fill="url(#leafGrad)"
                />
                {/* Veins */}
                <path d="M100 20 L 100 180" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <path d="M100 60 L 140 100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <path d="M100 100 L 150 140" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <path d="M100 60 L 60 100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <path d="M100 100 L 50 140" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              </motion.svg>

              {/* Photosynthesis Progress Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center bg-black/40 backdrop-blur-xl">
                    <div className="text-center">
                       <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Rate</span>
                       <span className="text-2xl font-black text-emerald-400 font-mono">{rate}%</span>
                    </div>
                 </div>
                 
                 {/* Glow based on rate */}
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute w-32 h-32 bg-emerald-500/20 blur-[30px] rounded-full"
                   style={{ opacity: rate / 100 }}
                 />
              </div>
           </div>

           {/* Labels */}
           <div className="absolute top-0 w-full flex justify-between px-20">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                 <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    CO₂
                 </div>
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Masuk</span>
              </motion.div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="flex flex-col items-center gap-2"
              >
                 <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    O₂
                 </div>
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Keluar</span>
              </motion.div>
           </div>
        </div>

        {/* Reaction Stats */}
        <div className="absolute bottom-12 flex gap-6 z-30">
           <div className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                 <FlaskConical className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Produksi Glukosa</span>
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Maksimal</span>
              </div>
           </div>
           <div className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                 <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Efisiensi Energi</span>
                 <span className="text-xs font-bold text-white uppercase tracking-wider">{Math.round(rate * 0.9)}%</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
