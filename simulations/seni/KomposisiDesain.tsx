"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Scale,
  Contrast,
  Waves,
  Grid3x3,
  ArrowRight,
  TrendingUp,
  LayoutTemplate,
  Info,
  Maximize,
  MousePointer2,
  Palette
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type PrincipleType = "golden-ratio" | "keseimbangan" | "kontras" | "ritme";

type PrincipleInfo = {
  id: PrincipleType;
  name: string;
  desc: string;
  example: string;
  icon: React.ReactNode;
  color: string;
};

// --- Data ---
const PRINCIPLES: PrincipleInfo[] = [
  {
    id: "golden-ratio",
    name: "Golden Ratio",
    desc: "Proporsi matematis (1 : 1.618) yang secara alami sangat estetis bagi mata manusia, sering ditemukan di alam dan seni klasik.",
    example: "Lukisan Mona Lisa, Parthenon Yunani, Desain Logo Apple.",
    icon: <Grid3x3 className="w-5 h-5" />,
    color: "amber"
  },
  {
    id: "keseimbangan",
    name: "Keseimbangan Visual",
    desc: "Distribusi bobot visual yang merata dalam sebuah desain. Bisa bersifat Simetris (cermin) atau Asimetris (bobot yang diimbangi).",
    example: "Taj Mahal (Simetris), Lukisan Starry Night (Asimetris).",
    icon: <Scale className="w-5 h-5" />,
    color: "blue"
  },
  {
    id: "kontras",
    name: "Kontras",
    desc: "Perbedaan menyolok antar elemen (warna, ukuran, bentuk) untuk menciptakan 'Focal Point' atau titik fokus.",
    example: "Teks hitam tebal di atas latar putih bersih.",
    icon: <Contrast className="w-5 h-5" />,
    color: "rose"
  },
  {
    id: "ritme",
    name: "Ritme & Pengulangan",
    desc: "Pengulangan elemen visual secara teratur untuk menciptakan ilusi pergerakan dan konsistensi tema visual.",
    example: "Pilar-pilar kuil Romawi, Pola Batik berulang.",
    icon: <Waves className="w-5 h-5" />,
    color: "emerald"
  }
];

export default function KomposisiDesain() {
  const [activeId, setActiveId] = useState<PrincipleType>("golden-ratio");

  // Interaction States
  const [grDepth, setGrDepth] = useState(4);
  const [isBalanced, setIsBalanced] = useState(false);
  const [contrastLvl, setContrastLvl] = useState(50);
  const [rhythmSpeed, setRhythmSpeed] = useState(1);

  const current = useMemo(() => PRINCIPLES.find(p => p.id === activeId)!, [activeId]);

  // Golden Ratio Generator (Fibonacci)
  const renderGoldenRatio = (depth: number, currentDepth: number = 0, isHorizontal: boolean = true, reverse: boolean = false): React.ReactNode => {
    if (currentDepth >= depth) return null;
    
    const isLast = currentDepth === depth - 1;
    
    return (
      <div className={`relative flex w-full h-full border border-amber-500/30 ${isHorizontal ? (reverse ? 'flex-row-reverse' : 'flex-row') : (reverse ? 'flex-col-reverse' : 'flex-col')}`}>
        {/* The Square */}
        <div 
          className="relative flex items-center justify-center bg-amber-500/5 transition-all duration-500 overflow-hidden" 
          style={{ 
            flexBasis: isHorizontal ? '61.8%' : 'auto', 
            height: isHorizontal ? '100%' : '61.8%' 
          }}
        >
           <span className="absolute opacity-20 text-[10px] font-black font-mono">1.618</span>
           
           {/* Arc */}
           <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d={
                  isHorizontal && !reverse ? "M 100 100 A 100 100 0 0 0 0 0" :
                  isHorizontal && reverse ? "M 0 100 A 100 100 0 0 1 100 0" :
                  !isHorizontal && !reverse ? "M 100 0 A 100 100 0 0 0 0 100" :
                  "M 0 0 A 100 100 0 0 1 100 100"
                } 
                fill="none" stroke="#f59e0b" strokeWidth="2" 
              />
           </svg>
        </div>
        
        {/* The Remainder Rectangle (recursive) */}
        {!isLast && (
          <div 
            className="flex-1 relative" 
            style={{ 
              flexBasis: isHorizontal ? '38.2%' : 'auto',
              height: isHorizontal ? '100%' : '38.2%'
            }}
          >
            {renderGoldenRatio(depth, currentDepth + 1, !isHorizontal, !reverse)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Design Lab --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Komposisi Desain</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Estetika Visual</p>
            </div>
          </div>

          {/* Principle Selection */}
          <div className="grid grid-cols-2 gap-2">
             {PRINCIPLES.map((p) => (
               <button
                 key={p.id}
                 onClick={() => setActiveId(p.id)}
                 className={`flex flex-col gap-2 p-3 rounded-xl border transition-all text-left group
                   ${activeId === p.id ? `bg-${p.color}-500/10 border-${p.color}-500/30` : 'bg-white/5 border-white/5 hover:bg-white/10'}
                 `}
               >
                 <div className={`${activeId === p.id ? `text-${p.color}-400` : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                   {p.icon}
                 </div>
                 <span className={`text-[9px] font-black uppercase tracking-widest ${activeId === p.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                   {p.name}
                 </span>
               </button>
             ))}
          </div>
        </div>

        {/* Dynamic Controls based on Active Principle */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3 text-zinc-500 mb-6">
              <LayoutTemplate className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Parameter Interaksi</span>
           </div>

           {activeId === "golden-ratio" && (
             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Kedalaman Fraktal</span>
                 <span className="text-lg font-black text-amber-400">{grDepth}</span>
               </div>
               <input 
                 type="range" min="1" max="8" step="1" 
                 value={grDepth} onChange={(e) => setGrDepth(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
               />
               <p className="text-[9px] text-zinc-500 italic mt-2">Membagi ruang berdasarkan deret Fibonacci: 1, 1, 2, 3, 5, 8, 13...</p>
             </div>
           )}

           {activeId === "keseimbangan" && (
             <div className="space-y-4">
               <button 
                 onClick={() => setIsBalanced(!isBalanced)}
                 className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2
                   ${isBalanced ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/10 text-zinc-400 hover:bg-white/20'}
                 `}
               >
                 <Scale className="w-4 h-4" />
                 {isBalanced ? "Ubah Menjadi Asimetris" : "Terapkan Keseimbangan Visual"}
               </button>
               <p className="text-[9px] text-zinc-500 italic mt-2 text-center">Beban visual yang lebih besar (gelap/besar) harus diimbangi dengan banyak elemen kecil, atau jarak yang lebih jauh dari titik tumpu.</p>
             </div>
           )}

           {activeId === "kontras" && (
             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tingkat Kontras (Luminance)</span>
                 <span className={`text-lg font-black ${contrastLvl < 40 ? 'text-red-500' : 'text-emerald-400'}`}>{contrastLvl}%</span>
               </div>
               <input 
                 type="range" min="0" max="100" step="1" 
                 value={contrastLvl} onChange={(e) => setContrastLvl(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-rose-500"
               />
               <p className={`text-[9px] italic mt-2 ${contrastLvl < 40 ? 'text-red-500 font-bold' : 'text-zinc-500'}`}>
                 {contrastLvl < 40 ? "⚠️ Peringatan: Aksesibilitas Buruk. Sulit Dibaca." : "✅ Kontras Baik. Nyaman Dibaca."}
               </p>
             </div>
           )}

           {activeId === "ritme" && (
             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Kecepatan Irama</span>
                 <span className="text-lg font-black text-emerald-400">{rhythmSpeed}x</span>
               </div>
               <input 
                 type="range" min="0" max="3" step="0.5" 
                 value={rhythmSpeed} onChange={(e) => setRhythmSpeed(parseFloat(e.target.value))}
                 className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <p className="text-[9px] text-zinc-500 italic mt-2">Ritme visual menuntun pergerakan mata audiens melewati seluruh desain tanpa tersendat.</p>
             </div>
           )}

        </div>

        {/* Diagnostic Panel */}
        <div className="flex-1 p-8 space-y-6">
           <AnimatePresence mode="wait">
             <motion.div 
               key={current.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
               <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                  <h3 className={`text-lg font-black text-${current.color}-400 mb-2`}>{current.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    {current.desc}
                  </p>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-zinc-500 px-2">
                     <Palette className="w-4 h-4" />
                     <h3 className="text-[10px] font-black uppercase tracking-widest">Aplikasi di Dunia Nyata</h3>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-zinc-900 to-transparent rounded-2xl border border-white/5">
                     <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-wider">
                       {current.example}
                     </p>
                  </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#020202] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b from-${current.color}-500/10 to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Visual Lab Container */}
        <div className="relative w-full max-w-4xl aspect-[16/10] bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md flex items-center justify-center p-12">
           
           <AnimatePresence mode="wait">
              {/* --- 1. Golden Ratio Visualization --- */}
              {activeId === "golden-ratio" && (
                <motion.div 
                  key="golden-ratio"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="w-full aspect-[1.618/1] relative bg-black border border-white/10 rounded-lg overflow-hidden shadow-2xl"
                >
                   {renderGoldenRatio(grDepth)}
                   {/* Rule of thirds grid overlay faintly */}
                   <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-10">
                     <div className="border-r border-b border-white" />
                     <div className="border-r border-b border-white" />
                     <div className="border-b border-white" />
                     <div className="border-r border-b border-white" />
                     <div className="border-r border-b border-white" />
                     <div className="border-b border-white" />
                     <div className="border-r border-white" />
                     <div className="border-r border-white" />
                     <div className="" />
                   </div>
                </motion.div>
              )}

              {/* --- 2. Keseimbangan Visualization --- */}
              {activeId === "keseimbangan" && (
                <motion.div 
                  key="keseimbangan"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative w-full h-full flex flex-col items-center justify-center"
                >
                   {/* Seesaws Container */}
                   <div className="w-[600px] h-[300px] relative flex flex-col items-center justify-end pb-[80px]">
                      
                      {/* The Lever */}
                      <motion.div 
                        animate={{ rotate: isBalanced ? 0 : 15 }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                        className="w-full h-3 bg-zinc-800 rounded-full relative flex items-end justify-between px-12"
                      >
                         {/* Left Side: Heavy object close to fulcrum */}
                         <div className="relative bottom-0">
                           <div className="w-32 h-32 bg-blue-600 rounded-[32px] shadow-[0_0_40px_rgba(37,99,235,0.5)] border-2 border-white/20 -mb-1" />
                         </div>

                         {/* Right Side: Multiple small objects further from fulcrum */}
                         <div className="relative bottom-0 flex gap-4 -mb-1">
                            <motion.div 
                              animate={{ opacity: isBalanced ? 1 : 0, scale: isBalanced ? 1 : 0, x: isBalanced ? 0 : -50 }}
                              transition={{ duration: 0.5 }}
                              className="w-12 h-12 bg-sky-400 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)] border-2 border-white/20"
                            />
                            <motion.div 
                              animate={{ opacity: isBalanced ? 1 : 0, scale: isBalanced ? 1 : 0, x: isBalanced ? 0 : -50 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="w-12 h-12 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.5)] border-2 border-white/20"
                            />
                            <motion.div 
                              animate={{ opacity: isBalanced ? 1 : 0, scale: isBalanced ? 1 : 0, x: isBalanced ? 0 : -50 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="w-12 h-12 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] border-2 border-white/20"
                            />
                         </div>
                      </motion.div>

                      {/* Fulcrum Pivot */}
                      <div className="absolute bottom-0 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[80px] border-b-white/10" />
                      <div className="absolute bottom-10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Titik Tumpu Visual</div>
                   </div>
                   
                   <div className="absolute top-10 flex gap-12 text-center opacity-40">
                      <div>
                         <span className="block text-2xl font-black">100kg</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">Beban Visual</span>
                      </div>
                      <div>
                         <span className="block text-2xl font-black">33kg x 3</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">Beban Visual</span>
                      </div>
                   </div>
                </motion.div>
              )}

              {/* --- 3. Kontras Visualization --- */}
              {activeId === "kontras" && (
                <motion.div 
                  key="kontras"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative w-full h-full flex flex-col items-center justify-center p-12"
                >
                   <div 
                     className="w-full aspect-[2/1] rounded-[48px] flex flex-col items-center justify-center p-12 transition-all duration-300"
                     style={{ 
                       backgroundColor: `hsl(240, 5%, ${contrastLvl}%)`,
                       boxShadow: contrastLvl < 40 ? '0 0 50px rgba(239,68,68,0.2)' : '0 0 50px rgba(16,185,129,0.2)'
                     }}
                   >
                      <h1 
                        className="text-6xl font-black tracking-tighter text-center transition-all duration-300"
                        style={{ color: `hsl(240, 5%, ${100 - contrastLvl}%)` }}
                      >
                        READABILITY TEST
                      </h1>
                      <p 
                        className="mt-6 text-xl font-medium text-center transition-all duration-300 max-w-xl"
                        style={{ color: `hsl(240, 5%, ${Math.max(0, 100 - contrastLvl - 20)}%)` }}
                      >
                        Kontras sangat penting agar audiens dapat membaca informasi dengan jelas tanpa menyipitkan mata.
                      </p>
                   </div>
                </motion.div>
              )}

              {/* --- 4. Ritme Visualization --- */}
              {activeId === "ritme" && (
                <motion.div 
                  key="ritme"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                   <div className="flex gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={rhythmSpeed > 0 ? {
                            height: [50, 200, 50],
                            backgroundColor: ["#059669", "#34d399", "#059669"]
                          } : { height: 50, backgroundColor: "#064e3b" }}
                          transition={{
                            duration: 2 / Math.max(0.1, rhythmSpeed),
                            repeat: Infinity,
                            delay: i * (0.2 / Math.max(0.1, rhythmSpeed)),
                            ease: "easeInOut"
                          }}
                          className="w-12 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        />
                      ))}
                   </div>
                </motion.div>
              )}

           </AnimatePresence>

           {/* Canvas Header Overlay */}
           <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl z-40">
              <div className={`w-3 h-3 rounded-full bg-${current.color}-500 animate-pulse shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Canvas Render Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">{current.name}</h3>
              </div>
           </div>
        </div>

        {/* Global Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Ubah Parameter di Panel Kiri untuk Melihat Perubahan Visual</span>
        </div>
      </div>

    </div>
  );
}
