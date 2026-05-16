"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  ChevronLeft,
  Info,
  Droplet,
  GlassWater,
  FlaskConical,
  Zap,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Trash2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type FiltrationStage = "filtration" | "reabsorption" | "augmentation" | "excretion";

export default function SistemEkskresi() {
  const [hydration, setHydration] = useState(70);
  const [toxins, setToxins] = useState(40);
  const [activeStage, setActiveStage] = useState<FiltrationStage>("filtration");
  const [isProcessing, setIsProcessing] = useState(false);

  // Logic: Process Blood
  const processBlood = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Simulate stages
    setActiveStage("filtration");
    setTimeout(() => setActiveStage("reabsorption"), 1000);
    setTimeout(() => setActiveStage("augmentation"), 2000);
    setTimeout(() => {
      setActiveStage("excretion");
      setToxins(prev => Math.max(5, prev - 15));
      setHydration(prev => Math.max(10, prev - 8)); // Losing water in urine
    }, 3000);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveStage("filtration");
    }, 4000);
  };

  const drinkWater = () => {
    setHydration(prev => Math.min(100, prev + 25));
    setToxins(prev => Math.max(5, prev - 2)); // Diluting
  };

  const urineColor = useMemo(() => {
    if (hydration > 80) return "bg-sky-200"; // Very clear
    if (hydration > 50) return "bg-yellow-300"; // Healthy
    if (hydration > 25) return "bg-amber-500"; // Dehydrated
    return "bg-orange-700"; // Severely dehydrated
  }, [hydration]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Renal Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Sistem Ekskresi</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Anatomi & Fisiologi Ginjal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <button 
               onClick={processBlood}
               disabled={isProcessing}
               className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-500/10 hover:bg-rose-400 transition-all disabled:opacity-50"
             >
               <Zap className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
               {isProcessing ? "Menyaring Darah..." : "Mulai Filtrasi"}
             </button>
             <button 
               onClick={drinkWater}
               className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
             >
               <GlassWater className="w-4 h-4 text-sky-400" />
               Minum Air (Hidrasi)
             </button>
          </div>
        </div>

        {/* Diagnostic Metrics */}
        <div className="flex-1 p-8 space-y-8">
           {/* HUD Bars */}
           <div className="space-y-6">
              <div className="space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Kadar Toksin (Urea)</span>
                    <span className={`text-xs font-bold ${toxins > 60 ? 'text-rose-500' : 'text-zinc-400'}`}>{toxins}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${toxins}%` }}
                      className={`h-full transition-colors ${toxins > 60 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`}
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tingkat Hidrasi</span>
                    <span className={`text-xs font-bold ${hydration < 30 ? 'text-amber-500' : 'text-zinc-400'}`}>{hydration}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${hydration}%` }}
                      className={`h-full transition-colors ${hydration < 30 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-sky-500'}`}
                    />
                 </div>
              </div>
           </div>

           {/* Stage Process Info */}
           <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <Microscope className="w-5 h-5 text-indigo-400" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Analisis Tahapan Nefron</h3>
              </div>
              
              <div className="space-y-4">
                 {[
                   { id: "filtration", name: "Filtrasi", desc: "Penyaringan darah di Glomerulus." },
                   { id: "reabsorption", name: "Reabsorpsi", desc: "Penyerapan kembali zat berguna di Tubulus." },
                   { id: "augmentation", name: "Augmentasi", desc: "Penambahan zat sisa yang tidak diperlukan." },
                   { id: "excretion", name: "Ekskresi", desc: "Pengeluaran sisa metabolisme (Urine)." }
                 ].map((s, i) => (
                   <div key={s.id} className={`flex items-start gap-4 transition-all duration-300 ${activeStage === s.id ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${activeStage === s.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-zinc-500'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <span className={`block text-[11px] font-bold ${activeStage === s.id ? 'text-white' : 'text-zinc-500'}`}>{s.name}</span>
                        <p className="text-[10px] text-zinc-500 leading-tight mt-1">{s.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer Insight */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Status Kesehatan Ginjal</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Warna urine yang jernih menandakan ginjal bekerja optimal dan tubuh terhidrasi dengan baik.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${isProcessing ? 'bg-rose-500/5' : 'bg-indigo-500/5'}`} />
        </div>

        {/* Kidney & Bladder Visualization System */}
        <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 h-fit max-h-full">
           
           {/* Blood Supply System */}
           <div className="hidden xl:flex flex-col gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-48 bg-rose-500/40 rounded-full relative overflow-hidden">
                    {isProcessing && <motion.div animate={{ top: ["0%", "100%"] }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-full h-12 bg-rose-400 blur-sm" />}
                 </div>
                 <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest [writing-mode:vertical-lr]">Arteri Renalis</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-48 bg-sky-500/40 rounded-full relative overflow-hidden">
                    {isProcessing && <motion.div animate={{ top: ["100%", "0%"] }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-full h-12 bg-sky-400 blur-sm" />}
                 </div>
                 <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest [writing-mode:vertical-lr]">Vena Renalis</span>
              </div>
           </div>

           {/* Central Kidney Model */}
           <div className="relative w-48 h-72 lg:w-64 lg:h-96 flex-shrink-0">
              {/* Kidney Silhouette SVG */}
              <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
                 <motion.path 
                   d="M50 5 Q95 5 95 75 Q95 145 50 145 Q20 145 20 75 Q20 5 50 5" 
                   className="fill-rose-950/80 stroke-rose-900/50" 
                   strokeWidth="2"
                   animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
                 />
                 {[0, 1, 2, 3].map((i) => (
                   <motion.path 
                     key={i}
                     d={`M40 ${30 + i*25} Q30 ${42 + i*25} 40 ${55 + i*25} Z`}
                     className={`${isProcessing && activeStage === 'reabsorption' ? 'fill-rose-400' : 'fill-rose-800'}`}
                     transition={{ duration: 0.5 }}
                   />
                 ))}
                 <path d="M25 75 Q10 75 10 100 L10 140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              </svg>

              {/* Ureter & Urine Flow */}
              <div className="absolute top-[80%] left-[0%] w-3 h-32 lg:h-48 bg-white/5 rounded-full overflow-hidden border border-white/5 rotate-[-5deg] origin-top">
                 <AnimatePresence>
                    {isProcessing && activeStage === 'excretion' && (
                      <motion.div 
                        initial={{ top: "-20%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className={`absolute w-full h-12 rounded-full blur-[2px] ${urineColor}`}
                      />
                    )}
                 </AnimatePresence>
              </div>

              {/* Labels */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                 <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Kortex</span>
              </div>
           </div>

           {/* Bladder Visualization */}
           <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex items-center justify-center mt-8 lg:mt-32">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full border-2 border-white/10 bg-zinc-900/40 overflow-hidden backdrop-blur-sm shadow-xl">
                 <motion.div 
                   animate={{ height: `${Math.max(20, 100 - hydration)}%` }}
                   className={`absolute bottom-0 w-full transition-colors duration-1000 ${urineColor} opacity-40`}
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                    <Droplet className={`w-5 h-5 lg:w-6 lg:h-6 mb-2 ${hydration < 30 ? 'text-amber-500' : 'text-sky-400'}`} />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Kandung Kemih</span>
                 </div>
              </div>
           </div>
        </div>


        {/* Global Dashboard Tip */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <Activity className="w-4 h-4 animate-pulse text-rose-500" />
           <span className="text-[10px] font-black uppercase tracking-widest">Klik 'Mulai Filtrasi' untuk mensimulasikan proses Nefron</span>
        </div>

        {/* Legend */}
        <div className="absolute top-10 flex gap-6 z-30">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Darah Kaya Limbah</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Darah Tersaring</span>
           </div>
        </div>
      </div>

    </div>
  );
}
