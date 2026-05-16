"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, 
  RefreshCcw, 
  Info, 
  FlaskRound, 
  Flame, 
  Zap, 
  Droplets,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// --- Types & Data ---

type ReactionType = {
  id: string;
  name: string;
  equation: string;
  description: string;
  reactantA: { name: string; color: string; formula: string };
  reactantB: { name: string; color: string; formula: string };
  product: { name: string; color: string; formula: string; effect: "bubbles" | "precipitate" | "color-change" | "heat" };
  observation: string;
};

const REACTIONS: ReactionType[] = [
  {
    id: "neutralization",
    name: "Netralisasi Asam-Basa",
    equation: "HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l)",
    description: "Reaksi antara asam kuat dan basa kuat menghasilkan garam dan air. Disertai pelepasan kalor (eksoterm).",
    reactantA: { name: "Asam Klorida", color: "#60a5fa", formula: "HCl" },
    reactantB: { name: "Natrium Hidroksida", color: "#f472b6", formula: "NaOH" },
    product: { name: "Garam & Air", color: "#c084fc", formula: "NaCl + H₂O", effect: "color-change" },
    observation: "Larutan berubah warna menjadi merah muda (jika ada indikator Fenolftalein) dan suhu tabung sedikit meningkat."
  },
  {
    id: "precipitation",
    name: "Reaksi Pengendapan",
    equation: "AgNO₃ (aq) + NaCl (aq) → AgCl (s) ↓ + NaNO₃ (aq)",
    description: "Dua larutan jernih bercampur membentuk padatan tak larut (endapan).",
    reactantA: { name: "Perak Nitrat", color: "#94a3b8", formula: "AgNO₃" },
    reactantB: { name: "Natrium Klorida", color: "#cbd5e1", formula: "NaCl" },
    product: { name: "Endapan Perak Klorida", color: "#f8fafc", formula: "AgCl ↓", effect: "precipitate" },
    observation: "Terbentuk endapan putih AgCl yang perlahan mengendap di dasar tabung."
  },
  {
    id: "gas-evolution",
    name: "Pembentukan Gas",
    equation: "Mg (s) + 2HCl (aq) → MgCl₂ (aq) + H₂ (g) ↑",
    description: "Reaksi logam aktif dengan asam menghasilkan gas hidrogen.",
    reactantA: { name: "Asam Klorida", color: "#38bdf8", formula: "HCl" },
    reactantB: { name: "Logam Magnesium", color: "#94a3b8", formula: "Mg" },
    product: { name: "Magnesium Klorida & Gas H₂", color: "#7dd3fc", formula: "MgCl₂ + H₂", effect: "bubbles" },
    observation: "Terjadi gelembung gas yang cepat (efervesensi) saat logam bereaksi dengan asam."
  }
];

// --- Components ---

const Beaker = ({ 
  stage, 
  currentReaction, 
  intensity 
}: { 
  stage: number; 
  currentReaction: ReactionType;
  intensity: number;
}) => {
  return (
    <div className="relative w-48 h-64 md:w-64 md:h-80 group">
      {/* Beaker Glass Body */}
      <div className="absolute inset-0 border-4 border-white/20 border-t-0 rounded-b-[40px] rounded-t-lg bg-white/5 backdrop-blur-sm z-10">
        {/* Measurement Lines */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-4 h-0.5 bg-white/20 flex items-center">
              <span className="ml-6 text-[8px] font-mono text-white/30 uppercase tracking-widest">{i * 100}ml</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-x-1 bottom-1 top-4 rounded-b-[36px] overflow-hidden z-0">
        <AnimatePresence>
          {/* Reactant A Layer */}
          {stage >= 1 && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: stage === 1 ? "40%" : "30%" }}
              className="absolute bottom-0 w-full transition-all duration-1000 ease-in-out"
              style={{ backgroundColor: stage === 1 ? currentReaction.reactantA.color + "66" : currentReaction.product.color + "88" }}
            >
              {/* Product Effects */}
              {stage === 2 && (
                <>
                  {/* Bubbles Effect */}
                  {currentReaction.product.effect === "bubbles" && (
                    <div className="absolute inset-0">
                      {Array.from({ length: Math.floor(20 * intensity) }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ bottom: -20, left: `${Math.random() * 100}%`, opacity: 0 }}
                          animate={{ 
                            bottom: ["0%", "100%"], 
                            opacity: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 20]
                          }}
                          transition={{ 
                            duration: 1 / intensity + Math.random(), 
                            repeat: Infinity, 
                            delay: Math.random() * 2 
                          }}
                          className="absolute w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]"
                        />
                      ))}
                    </div>
                  )}

                  {/* Precipitate Effect */}
                  {currentReaction.product.effect === "precipitate" && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "20%" }}
                      className="absolute bottom-0 w-full bg-white/80 blur-[2px] rounded-b-[36px]"
                    />
                  )}

                  {/* Heat/Glow Effect */}
                  {currentReaction.product.effect === "color-change" && (
                    <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white blur-xl"
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reflection Effect */}
      <div className="absolute right-6 top-10 bottom-10 w-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full z-20" />
    </div>
  );
};

export default function ReaksiKimia() {
  const [selectedReaction, setSelectedReaction] = useState(REACTIONS[0]);
  const [stage, setStage] = useState(0); // 0: empty, 1: A, 2: Reacted
  const [intensity, setIntensity] = useState(1);
  const [isReacting, setIsReacting] = useState(false);

  const handleAction = () => {
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setIsReacting(true);
      setTimeout(() => {
        setStage(2);
        setIsReacting(false);
      }, 1500);
    }
  };

  const reset = () => {
    setStage(0);
    setIsReacting(false);
  };

  const changeReaction = (reaction: ReactionType) => {
    reset();
    setSelectedReaction(reaction);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Knowledge & Selection --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Reaksi Kimia</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Virtual</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Eksplorasi berbagai jenis reaksi kimia, amati perubahan visual, dan pelajari persamaan reaksinya.
            </p>
          </div>
        </div>

        {/* Reaction Selection */}
        <div className="p-6 space-y-4">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Pilih Percobaan</h2>
          <div className="space-y-2">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.id}
                onClick={() => changeReaction(reaction)}
                className={`w-full p-4 rounded-2xl border text-left transition-all group ${
                  selectedReaction.id === reaction.id 
                    ? "bg-white/10 border-white/20 shadow-xl" 
                    : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-sm font-bold ${selectedReaction.id === reaction.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                    {reaction.name}
                  </span>
                  {selectedReaction.id === reaction.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] font-mono py-0.5 px-2 bg-white/5 rounded border border-white/5 text-zinc-500 uppercase">
                    {reaction.product.effect}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chemical Insight Card */}
        <div className="mt-auto p-6">
          <motion.div 
            key={selectedReaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl border border-white/10 space-y-4"
          >
            <div className="flex items-center gap-3 text-indigo-400">
              <Info className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Persamaan Reaksi</span>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed text-indigo-200 shadow-inner">
              {selectedReaction.equation}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed italic">
              "{selectedReaction.description}"
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12 bg-[#080808]">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        </div>

        {/* The Laboratory Setup */}
        <div className="relative flex flex-col items-center gap-12 z-10">
          
          <Beaker 
            stage={stage} 
            currentReaction={selectedReaction} 
            intensity={intensity} 
          />

          {/* Interaction Controls */}
          <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            
            <div className="flex items-center gap-6">
              <AnimatePresence mode="wait">
                <motion.button
                  key={stage}
                  onClick={handleAction}
                  disabled={stage === 2 || isReacting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3 ${
                    stage === 0 
                      ? "bg-sky-500 text-white shadow-sky-500/20" 
                      : stage === 1 
                        ? "bg-rose-500 text-white shadow-rose-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {isReacting ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : stage === 0 ? (
                    <FlaskConical className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isReacting ? "Mereaksi..." : stage === 0 ? `Tuangkan ${selectedReaction.reactantA.formula}` : `Tambahkan ${selectedReaction.reactantB.formula}`}
                </motion.button>
              </AnimatePresence>

              <button 
                onClick={reset}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
              >
                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* Reaction Parameter */}
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Intensitas Reaksi</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{Math.round(intensity * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Observation Overlay */}
        <AnimatePresence>
          {stage === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-12 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl max-w-lg mx-auto flex gap-4 shadow-2xl z-30"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Hasil Pengamatan</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedReaction.observation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Right Details: Molecules/State --- */}
      <div className="w-full lg:w-[350px] flex flex-col border-l border-white/5 bg-zinc-950/50 backdrop-blur-xl p-8 space-y-10">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Detail Molekul</h2>

        <div className="space-y-8">
          {/* Reactant A */}
          <div className="relative p-6 bg-white/5 rounded-3xl border border-white/10 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FlaskRound className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Reaktan A</span>
              <h3 className="text-lg font-bold text-white mb-1">{selectedReaction.reactantA.name}</h3>
              <p className="text-xl font-mono font-black" style={{ color: selectedReaction.reactantA.color }}>
                {selectedReaction.reactantA.formula}
              </p>
            </div>
          </div>

          {/* Reactant B */}
          <div className="relative p-6 bg-white/5 rounded-3xl border border-white/10 overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Droplets className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Reaktan B / Logam</span>
              <h3 className="text-lg font-bold text-white mb-1">{selectedReaction.reactantB.name}</h3>
              <p className="text-xl font-mono font-black" style={{ color: selectedReaction.reactantB.color }}>
                {selectedReaction.reactantB.formula}
              </p>
            </div>
          </div>

          {/* Stage Progress */}
          <div className="space-y-4 pt-4">
             <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <span>Progress</span>
                <span>{stage}/2</span>
             </div>
             <div className="flex gap-2">
                {[0, 1].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${stage > i ? "bg-emerald-500" : "bg-white/10"}`} 
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-auto p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-200/60 leading-relaxed font-medium">
            <strong>Peringatan Keselamatan:</strong> Selalu gunakan jas lab, sarung tangan, dan pelindung mata saat menangani bahan kimia berbahaya seperti HCl dan NaOH.
          </p>
        </div>
      </div>
    </div>
  );
}
