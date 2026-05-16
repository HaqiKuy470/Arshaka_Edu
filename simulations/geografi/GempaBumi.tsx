"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Activity,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  Waves,
  History,
  Info,
  Radio,
  Gauge,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type WaveType = {
  id: number;
  type: "P" | "S";
  radius: number;
  opacity: number;
  intensity: number;
};

export default function GempaBumi() {
  const [magnitude, setMagnitude] = useState(6.5);
  const [depth, setDepth] = useState(15);
  const [isQuaking, setIsQuaking] = useState(false);
  const [waves, setWaves] = useState<WaveType[]>([]);
  const [seismicLog, setSeismicLog] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"waves" | "effects">("waves");

  // Trigger Quake logic
  const triggerQuake = useCallback(() => {
    setIsQuaking(true);
    setWaves([]);
    setSeismicLog([]);
    
    // Wave generation loop
    let waveId = 0;
    const interval = setInterval(() => {
      if (waveId > 15) {
        clearInterval(interval);
        setTimeout(() => setIsQuaking(false), 3000);
        return;
      }

      setWaves(prev => [
        ...prev,
        { id: waveId++, type: "P", radius: 0, opacity: 1, intensity: magnitude },
        { id: waveId++, type: "S", radius: 0, opacity: 1, intensity: magnitude * 0.8 }
      ]);
    }, 200);
  }, [magnitude]);

  // Wave physics update
  useEffect(() => {
    if (!isQuaking) return;

    const frame = requestAnimationFrame(() => {
      setWaves(prev => prev.map(w => ({
        ...w,
        radius: w.radius + (w.type === "P" ? 6 : 3),
        opacity: w.opacity - 0.005
      })).filter(w => w.opacity > 0));

      // Update Seismograph Log
      if (waves.length > 0) {
        setSeismicLog(prev => [...prev.slice(-40), Math.random() * magnitude * (isQuaking ? 1 : 0.1)]);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [waves, isQuaking, magnitude]);

  const damageLevel = useMemo(() => {
    const score = (magnitude * magnitude) / (depth * 0.5);
    if (score > 15) return { label: "Ekstrem", color: "text-red-500", desc: "Kerusakan total pada bangunan." };
    if (score > 8) return { label: "Parah", color: "text-rose-400", desc: "Bangunan retak, banyak yang roboh." };
    if (score > 4) return { label: "Sedang", color: "text-amber-400", desc: "Goncangan kuat terasa di permukaan." };
    return { label: "Ringan", color: "text-emerald-400", desc: "Hanya getaran kecil yang dirasakan." };
  }, [magnitude, depth]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Seismology Lab --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Gempa Bumi</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Monitor Aktivitas Seismik</p>
            </div>
          </div>

          {/* Seismic Controls */}
          <div className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Gauge className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Magnitudo (SR)</span>
                   </div>
                   <span className="text-lg font-black text-white">{magnitude.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="1" max="9.5" step="0.1" 
                  value={magnitude} onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                  disabled={isQuaking}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-2 text-zinc-500">
                      <Radio className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Kedalaman (km)</span>
                   </div>
                   <span className="text-lg font-black text-white">{depth} km</span>
                </div>
                <input 
                  type="range" min="5" max="150" step="5" 
                  value={depth} onChange={(e) => setDepth(parseInt(e.target.value))}
                  disabled={isQuaking}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
             </div>

             <button
               onClick={triggerQuake}
               disabled={isQuaking}
               className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all flex items-center justify-center gap-3
                 ${isQuaking ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20'}
               `}
             >
               <Zap className={`w-4 h-4 ${isQuaking ? 'animate-pulse' : ''}`} />
               {isQuaking ? "Gempa Berlangsung" : "Picu Gempa Bumi"}
             </button>
          </div>
        </div>

        {/* Diagnostic Tabs */}
        <div className="flex-1 p-8 space-y-8">
           <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab("waves")}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'waves' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Tipe Gelombang
              </button>
              <button 
                onClick={() => setActiveTab("effects")}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'effects' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Efek & Kerusakan
              </button>
           </div>

           <AnimatePresence mode="wait">
             {activeTab === "waves" ? (
               <motion.div 
                 key="waves-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="space-y-6"
               >
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-2">
                     <div className="flex items-center gap-2 text-blue-400">
                        <Waves className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Gelombang P (Primer)</span>
                     </div>
                     <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                       Gelombang longitudinal cepat yang tiba lebih dulu. Bisa merambat melalui benda padat maupun cair.
                     </p>
                  </div>
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-2">
                     <div className="flex items-center gap-2 text-rose-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Gelombang S (Sekunder)</span>
                     </div>
                     <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                       Gelombang transversal yang lebih lambat namun sangat merusak. Hanya merambat di benda padat.
                     </p>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="effects-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="space-y-6"
               >
                  <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status Kerusakan</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${damageLevel.color}`}>{damageLevel.label}</span>
                     </div>
                     <p className="text-sm font-bold text-white tracking-tight">{damageLevel.desc}</p>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${(magnitude/10)*100}%` }} className={`h-full ${damageLevel.color.replace('text-', 'bg-')}`} />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-500">
                     <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                     <p className="text-[10px] font-bold leading-relaxed italic">
                       Hati-hati: Gempa dangkal ({depth}km) dengan magnitudo {magnitude} SR sangat berbahaya bagi area perkotaan.
                     </p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Seismograph Mini Display */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-zinc-500">
                 <Radio className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Seismograph</span>
              </div>
              <div className="flex gap-1">
                 <div className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isQuaking ? 'animate-ping' : ''}`} />
                 <span className="text-[8px] font-bold text-zinc-600">MONITOR</span>
              </div>
           </div>
           <div className="h-16 flex items-end gap-[2px] bg-black/40 rounded-xl p-2 border border-white/5">
              {seismicLog.map((val, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${val * 10}%` }}
                  className={`flex-1 rounded-full ${isQuaking ? 'bg-red-500/60' : 'bg-emerald-500/40'}`} 
                />
              ))}
              {seismicLog.length === 0 && (
                <div className="w-full flex items-center justify-center text-[8px] font-black text-zinc-700 tracking-[0.3em] uppercase">Ready</div>
              )}
           </div>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={isQuaking ? 'active' : 'idle'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${isQuaking ? 'from-red-500/10' : 'from-indigo-500/5'} to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Geological Cross-Section Container */}
        <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
           
           {/* SVG World Area */}
           <motion.svg 
             viewBox="0 0 1000 600" 
             className="w-full h-full"
             animate={isQuaking ? { 
               x: [0, (Math.random()-0.5)*magnitude*2, 0], 
               y: [0, (Math.random()-0.5)*magnitude*2, 0] 
             } : {}}
             transition={{ duration: 0.1, repeat: Infinity }}
           >
              {/* Sky Background */}
              <rect width="1000" height="250" className="fill-zinc-950" />
              
              {/* Ground Layers */}
              <rect x="0" y="250" width="1000" height="350" className="fill-zinc-900" />
              <rect x="0" y="270" width="1000" height="330" className="fill-stone-900" />
              
              {/* Fault Line Visual */}
              <path d="M450 250 L550 600" className="stroke-black/50" strokeWidth="8" strokeDasharray="10 5" />

              {/* Waves Visualization */}
              <g>
                 {waves.map(wave => (
                    <circle 
                      key={wave.id}
                      cx="500" 
                      cy={250 + (depth / 150) * 350} 
                      r={wave.radius} 
                      fill="none" 
                      stroke={wave.type === 'P' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(244, 63, 94, 0.6)'} 
                      strokeWidth={wave.type === 'P' ? 2 : 5}
                      opacity={wave.opacity}
                    />
                 ))}
              </g>

              {/* City Skyline on Surface */}
              <g transform="translate(300, 250)">
                 <motion.rect x="0" y="-100" width="40" height="100" className="fill-zinc-800" animate={isQuaking ? { rotate: [-1, 1, -1] } : {}} />
                 <motion.rect x="60" y="-160" width="50" height="160" className="fill-zinc-700" animate={isQuaking ? { skewX: [-2, 2, -2] } : {}} />
                 <motion.rect x="130" y="-80" width="40" height="80" className="fill-zinc-800" animate={isQuaking ? { y: [-5, 5, -5] } : {}} />
                 <motion.rect x="250" y="-120" width="45" height="120" className="fill-zinc-700" animate={isQuaking ? { scaleY: [1, 1.02, 1] } : {}} />
              </g>

              {/* Epicenter & Hypocenter Indicators */}
              <g>
                 {/* Hypocenter (Focus) */}
                 <motion.circle 
                   cx="500" cy={250 + (depth / 150) * 350} r="10" 
                   className="fill-red-500 shadow-[0_0_20px_red]"
                   animate={isQuaking ? { scale: [1, 2, 1] } : {}}
                 />
                 {/* Epicenter (Surface) */}
                 <circle cx="500" cy="250" r="6" className="fill-amber-500" />
                 
                 {/* Connector Line */}
                 <line x1="500" y1="250" x2="500" y2={250 + (depth / 150) * 350} className="stroke-white/10" strokeDasharray="4 4" />
              </g>
           </motion.svg>

           {/* Interactive Focus Labels Overlay */}
           <div className="absolute top-[250px] right-[10%] -translate-y-1/2">
              <div className="flex flex-col items-start gap-1 p-3 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Surface Target</span>
                 <h4 className="text-xs font-bold text-white uppercase tracking-tight">Episentrum</h4>
              </div>
           </div>

           {/* Dashboard Header */}
           <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl">
              <div className={`w-3 h-3 rounded-full ${isQuaking ? 'bg-red-500 animate-ping' : 'bg-emerald-500'} shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Seismic Monitor Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">{isQuaking ? 'Gempa Terdeteksi' : 'Status Stabil'}</h3>
              </div>
           </div>
        </div>

        {/* Global Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sesuaikan Parameter Seismik untuk Analisis Dampak</span>
        </div>
      </div>

    </div>
  );
}

const useMemo = (fn: () => any, deps: any[]) => {
  return React.useMemo(fn, deps);
};
