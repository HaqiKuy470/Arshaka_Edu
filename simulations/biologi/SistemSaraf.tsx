"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Activity, 
  ChevronLeft,
  Info,
  Layers,
  FlaskConical,
  Radio,
  Dna,
  Share2
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type TransmissionState = "idle" | "electrical" | "chemical" | "received";

// --- Components ---

const Neurotransmitter = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ x: 0, opacity: 0, scale: 0 }}
    animate={{ 
      x: 100, 
      y: (Math.random() - 0.5) * 60,
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5]
    }}
    transition={{ duration: 1.5, delay: delay, ease: "easeOut" }}
    className="absolute w-2 h-2 bg-rose-400 rounded-full blur-[1px] shadow-[0_0_8px_rgba(251,113,133,0.6)]"
  />
);

export default function SistemSaraf() {
  const [state, setState] = useState<TransmissionState>("idle");
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const triggerImpulse = () => {
    if (state !== "idle") return;
    
    setState("electrical");
    setTimeout(() => setState("chemical"), 1500);
    setTimeout(() => setState("received"), 3000);
    setTimeout(() => setState("idle"), 4500);
  };

  const neuronParts = [
    { id: "dendrite", name: "Dendrit", desc: "Ujung saraf yang berfungsi menerima rangsangan dari lingkungan atau sel saraf lainnya.", pos: "left-[-40px] top-1/2" },
    { id: "soma", name: "Badan Sel (Soma)", desc: "Pusat metabolisme sel saraf yang berisi nukleus dan mengatur kehidupan sel.", pos: "left-[40px] top-1/2" },
    { id: "axon", name: "Akson", desc: "Serabut panjang yang menghantarkan impuls listrik menjauhi badan sel menuju sel saraf lain.", pos: "left-[50%] top-[55%]" },
    { id: "myelin", name: "Selubung Mielin", desc: "Lapisan lemak isolator yang mempercepat hantaran impuls melalui mekanisme loncatan (Saltatory conduction).", pos: "left-[50%] top-[40%]" },
    { id: "synapse", name: "Sinapsis", desc: "Titik temu antara ujung akson dengan dendrit sel saraf lain, tempat terjadinya transmisi kimiawi.", pos: "right-[20px] top-1/2" }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Neuro-Diagnostics --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Sistem Saraf</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Mekanisme Impuls & Sinapsis</p>
            </div>
          </div>

          <button 
            onClick={triggerImpulse}
            disabled={state !== "idle"}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:grayscale
              ${state === 'idle' ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:bg-yellow-400' : 'bg-white/5 text-zinc-500 border border-white/10'}
            `}
          >
            <Zap className={`w-4 h-4 ${state === 'idle' ? 'animate-pulse' : ''}`} />
            {state === 'idle' ? 'Berikan Stimulus' : 'Mentransmisi...'}
          </button>
        </div>

        {/* Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {selectedPart ? (
               <motion.div 
                 key={selectedPart}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-lg">
                       <Info className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                         {neuronParts.find(p => p.id === selectedPart)?.name}
                       </h2>
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Anatomi Neuron</span>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      {neuronParts.find(p => p.id === selectedPart)?.desc}
                    </p>
                 </div>
                 <button 
                   onClick={() => setSelectedPart(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
                 >
                   Kembali ke Analisis <Share2 className="w-3 h-3 rotate-180" />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key="summary"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                       <Activity className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Status Transmisi</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className={`p-4 rounded-2xl border transition-all ${state === 'electrical' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                          <span className="block text-[8px] font-black uppercase tracking-widest mb-1">Elektrik</span>
                          <span className="text-xs font-bold">Potensial Akson</span>
                       </div>
                       <div className={`p-4 rounded-2xl border transition-all ${state === 'chemical' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                          <span className="block text-[8px] font-black uppercase tracking-widest mb-1">Kimia</span>
                          <span className="text-xs font-bold">Neurotransmiter</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400">
                       <Radio className="w-4 h-4" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest">Cara Kerja</h3>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                      "Rangsangan diterima dendrit, dikirim sebagai sinyal listrik di sepanjang akson, dan menyeberangi sinapsis melalui pelepasan zat kimia."
                    </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <Dna className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Pusat Informasi Saraf</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Kecepatan impuls dapat mencapai 120 meter per detik berkat selubung mielin.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${state === 'electrical' ? 'bg-yellow-500/5' : state === 'chemical' ? 'bg-rose-500/5' : 'bg-indigo-500/5'}`} />
        </div>

        {/* The Neuron System */}
        <div className="relative w-full max-w-4xl flex items-center justify-center">
           
           {/* Action Potential Wave (Electrical) */}
           <AnimatePresence>
              {state === 'electrical' && (
                <motion.div 
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 200, opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="absolute z-20 w-40 h-40 bg-yellow-400/20 blur-[50px] rounded-full"
                />
              )}
           </AnimatePresence>

           {/* Neuron Visualization */}
           <div className="relative flex items-center">
              
              {/* Dendrites (SVG) */}
              <div className="absolute left-[-100px] z-10">
                 <svg width="120" height="200" viewBox="0 0 120 200">
                    <g stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.6">
                       <path d="M120 100 L20 20" />
                       <path d="M120 100 L0 60" />
                       <path d="M120 100 L0 140" />
                       <path d="M120 100 L20 180" />
                    </g>
                 </svg>
              </div>

              {/* Soma (Cell Body) */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedPart("soma")}
                className="relative z-20 w-24 h-24 bg-indigo-600 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20 flex items-center justify-center group"
              >
                 <div className="w-8 h-8 bg-indigo-900 rounded-full border-2 border-indigo-400/50 animate-pulse" />
                 <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-white text-black text-[8px] font-black px-2 py-1 rounded uppercase">Soma</div>
              </motion.button>

              {/* Axon & Myelin Sheath */}
              <div className="relative flex items-center -ml-2">
                 {/* The Axon Core */}
                 <div className="w-[400px] h-3 bg-indigo-500/30 border-y border-indigo-400/20 relative">
                    <AnimatePresence>
                       {state === 'electrical' && (
                         <motion.div 
                           initial={{ left: "0%" }}
                           animate={{ left: "100%" }}
                           transition={{ duration: 1.5, ease: "linear" }}
                           className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                         />
                       )}
                    </AnimatePresence>
                 </div>

                 {/* Myelin Segments */}
                 <div className="absolute inset-0 flex justify-around items-center px-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1, y: -5 }}
                        onClick={() => setSelectedPart("myelin")}
                        className="w-14 h-8 bg-yellow-500/20 rounded-lg border border-yellow-500/30 backdrop-blur-sm z-30"
                      />
                    ))}
                 </div>
              </div>

              {/* Axon Terminal & Synapse */}
              <div className="relative flex items-center">
                 <div className="flex flex-col gap-10 -ml-4">
                    <div className="w-12 h-8 bg-indigo-600/60 rounded-full border border-indigo-400/30 rotate-[30deg]" />
                    <div className="w-12 h-8 bg-indigo-600/60 rounded-full border border-indigo-400/30 rotate-[-30deg]" />
                 </div>

                 {/* Synaptic Gap & Neurotransmitters */}
                 <div className="relative w-[150px] h-40 flex items-center justify-center">
                    <AnimatePresence>
                       {state === 'chemical' && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <Neurotransmitter key={i} delay={i * 0.1} />
                            ))}
                         </div>
                       )}
                    </AnimatePresence>
                 </div>

                 {/* Target Neuron (Dendrite) */}
                 <motion.div 
                   animate={state === 'received' ? { x: [0, 5, 0], filter: "brightness(1.5)" } : {}}
                   className={`w-16 h-32 rounded-l-[40px] border-l-4 transition-colors duration-500 ${state === 'received' ? 'border-rose-400 bg-rose-500/10' : 'border-zinc-800 bg-zinc-900/40'}`}
                 >
                    <div className="h-full flex flex-col justify-around py-4 pl-2">
                       <div className="w-4 h-2 bg-zinc-700 rounded-full" />
                       <div className="w-4 h-2 bg-zinc-700 rounded-full" />
                       <div className="w-4 h-2 bg-zinc-700 rounded-full" />
                    </div>
                 </motion.div>
              </div>
           </div>

           {/* Label Hotspots */}
           {neuronParts.map(part => (
             <button 
               key={part.id}
               onClick={() => setSelectedPart(part.id)}
               className={`absolute ${part.pos} -translate-x-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform group z-40`}
             >
                <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40 flex items-center justify-center group-hover:bg-white transition-colors">
                   <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                </div>
             </button>
           ))}
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-10 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500">
           <Layers className="w-4 h-4 text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Eksplorasi Bagian Neuron untuk Detail</span>
        </div>

        {/* Transmission Legend */}
        <div className="absolute top-10 flex gap-6 z-30">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sinyal Elektrik</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sinyal Kimia</span>
           </div>
        </div>
      </div>

    </div>
  );
}
