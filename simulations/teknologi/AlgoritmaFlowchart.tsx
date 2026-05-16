"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Play,
  RotateCcw,
  Cpu,
  Variable,
  CheckCircle2,
  Activity,
  MousePointer2,
  Code2,
  Database,
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type VariableState = {
  air: number;
  kopi: number;
  gula: number;
  status: string;
};

// Node ids: 0=Mulai, 1=Rebus, 2=Kopi, 3=Decision, 4=Gula, 5=Seduh, 6=Selesai
const PATH_SWEET = [0, 1, 2, 3, 4, 5, 6];
const PATH_NO_SWEET = [0, 1, 2, 3, 5, 6];

export default function AlgoritmaFlowchart() {
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likeSweet, setLikeSweet] = useState(true);
  const [pathStep, setPathStep] = useState(0);
  const [variables, setVariables] = useState<VariableState>({
    air: 0,
    kopi: 0,
    gula: 0,
    status: "Standby",
  });

  const executionPath = useMemo(
    () => (likeSweet ? PATH_SWEET : PATH_NO_SWEET),
    [likeSweet]
  );

  // Completed set — which node IDs have already been visited
  const completedNodes = useMemo(
    () => new Set(executionPath.slice(0, pathStep)),
    [executionPath, pathStep]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && pathStep < executionPath.length) {
      timer = setTimeout(() => {
        const nodeId = executionPath[pathStep];
        setActiveIdx(nodeId);
        setVariables((prev) => {
          const next = { ...prev };
          switch (nodeId) {
            case 0: next.status = "Inisialisasi..."; break;
            case 1: next.air = 100; next.status = "Memanaskan..."; break;
            case 2: next.kopi = 1; next.status = "Menambah Kopi"; break;
            case 3: next.status = "Mengecek IF/ELSE"; break;
            case 4: next.gula = 2; next.status = "Menambah Gula"; break;
            case 5: next.status = "Pencampuran..."; break;
            case 6: next.status = "☕ SELESAI!"; break;
          }
          return next;
        });
        setPathStep((s) => s + 1);
      }, 1200);
    } else if (pathStep >= executionPath.length && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, pathStep, executionPath]);

  const reset = () => {
    setIsPlaying(false);
    setPathStep(0);
    setActiveIdx(-1);
    setVariables({ air: 0, kopi: 0, gula: 0, status: "Standby" });
  };

  // SVG node styling helpers
  const nodeFill  = (id: number) => activeIdx === id ? "#6366f1" : "#27272a";
  const nodeStroke= (id: number) => activeIdx === id ? "#818cf8" : "#3f3f46";
  const textFill  = (id: number) => activeIdx === id ? "#fff" : "#a1a1aa";
  const showCheck = (id: number) => completedNodes.has(id);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">

      {/* ── Left Sidebar ── */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Algoritma & Flowchart</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Laboratorium Logika Digital</p>
            </div>
          </div>

          {/* Memory HUD */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 mb-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Variable className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Memori Sistem</span>
            </div>
            {[
              { label: "Air Temp", value: `${variables.air}°C` },
              { label: "Kopi",     value: `${variables.kopi} Sdk` },
              { label: "Gula",     value: `${variables.gula} Sdk` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{row.label}</span>
                <span className="text-xs font-black text-white">{row.value}</span>
              </div>
            ))}
            <div className="pt-2">
              <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status Eksekusi:</span>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-tight">{variables.status}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(true)}
              disabled={isPlaying || pathStep > 0}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              <Play className="w-4 h-4" /> Jalankan
            </button>
            <button
              onClick={reset}
              className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-white/10"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          {/* Sweet Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-400 mb-2">
              <Cpu className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Input Parameter</span>
            </div>
            <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gunakan Gula (IF)</span>
                <button
                  onClick={() => { if (!isPlaying && pathStep === 0) setLikeSweet(!likeSweet); }}
                  className={`w-12 h-6 rounded-full transition-all relative ${likeSweet ? "bg-indigo-500" : "bg-zinc-700"}`}
                >
                  <motion.div
                    animate={{ x: likeSweet ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                Input ini mengubah jalur (branch) algoritma saat mencapai node keputusan.
              </p>
            </div>
          </div>

          {/* Symbol glossary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-500 mb-2">
              <Code2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Glosarium Simbol</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { shape: "rounded-full w-4 h-4 bg-zinc-700", label: "Terminal" },
                { shape: "w-4 h-3 bg-zinc-700", label: "Proses" },
                { shape: "w-4 h-4 bg-zinc-700 rotate-45", label: "Decision" },
                { shape: "w-4 h-3 bg-zinc-700 -skew-x-12", label: "I/O" },
              ].map((s) => (
                <div key={s.label} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                  <div className={s.shape} />
                  <span className="text-[9px] font-bold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Algoritma Dunia Nyata</span>
          </div>
          <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
            Dari mesin pencari hingga rekomendasi musik, semua digerakkan oleh algoritma dengan ribuan percabangan keputusan.
          </p>
        </div>
      </div>

      {/* ── Center: Simulation Area ── */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-[#080808] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)]" />

        {/* Canvas wrapper */}
        <div className="relative w-full h-full max-w-3xl bg-zinc-900/20 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm flex items-center justify-center">

          {/* ── Pure-SVG Flowchart ── */}
          {/* Everything lives in one viewBox so positions are always consistent */}
          <svg
            viewBox="0 0 500 760"
            className="w-full h-full"
            style={{ maxHeight: "100%" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#52525b" />
              </marker>
              <marker id="arr-hi" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#6366f1" />
              </marker>
              <filter id="glow-f" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* ── CONNECTORS ── */}
            {/* 0 Mulai → 1 Rebus */}
            <line x1="250" y1="68" x2="250" y2="118" stroke="#52525b" strokeWidth="2" markerEnd="url(#arr)" />
            {/* 1 Rebus → 2 Kopi */}
            <line x1="250" y1="170" x2="250" y2="222" stroke="#52525b" strokeWidth="2" markerEnd="url(#arr)" />
            {/* 2 Kopi → 3 Decision */}
            <line x1="250" y1="272" x2="250" y2="324" stroke="#52525b" strokeWidth="2" markerEnd="url(#arr)" />
            {/* 3 Decision → 5 Seduh (TIDAK) */}
            <line x1="250" y1="400" x2="250" y2="490" stroke="#52525b" strokeWidth="2" markerEnd="url(#arr)" />
            {/* 5 Seduh → 6 Selesai */}
            <line x1="250" y1="542" x2="250" y2="608" stroke="#52525b" strokeWidth="2" markerEnd="url(#arr)" />

            {/* Decision → Gula branch (YA, right) */}
            <path
              d={`M 330 362 H 420 V 468`}
              fill="none"
              stroke={likeSweet ? "#6366f1" : "#52525b"}
              strokeWidth="2"
              markerEnd={likeSweet ? "url(#arr-hi)" : "url(#arr)"}
            />
            {/* Gula → rejoin before Seduh */}
            <path
              d={`M 420 520 V 516 H 250`}
              fill="none"
              stroke={likeSweet ? "#6366f1" : "#52525b"}
              strokeWidth="2"
            />

            {/* Branch labels */}
            <text x="346" y="354" fill={likeSweet ? "#818cf8" : "#52525b"} fontSize="14" fontFamily="monospace" fontWeight="bold">YA</text>
            <text x="256" y="430" fill="#52525b" fontSize="14" fontFamily="monospace" fontWeight="bold">TIDAK</text>

            {/* ── NODES ── */}

            {/* 0: Mulai — Terminal (pill) */}
            <g filter={activeIdx === 0 ? "url(#glow-f)" : ""}>
              <rect x="160" y="30" width="180" height="44" rx="22"
                fill={nodeFill(0)} stroke={nodeStroke(0)} strokeWidth="2" />
              <text x="250" y="57" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(0)} fontSize="14" fontFamily="sans-serif" fontWeight="800" letterSpacing="2">MULAI</text>
              {showCheck(0) && <><circle cx="342" cy="38" r="11" fill="#10b981" /><text x="342" y="43" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 1: Rebus Air — Process (rect) */}
            <g filter={activeIdx === 1 ? "url(#glow-f)" : ""}>
              <rect x="140" y="118" width="220" height="52" rx="8"
                fill={nodeFill(1)} stroke={nodeStroke(1)} strokeWidth="2" />
              <text x="250" y="144" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(1)} fontSize="13" fontFamily="sans-serif" fontWeight="800">REBUS AIR</text>
              <text x="250" y="162" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(1)} fontSize="11" fontFamily="sans-serif" fontWeight="600">(100°C)</text>
              {showCheck(1) && <><circle cx="362" cy="126" r="11" fill="#10b981" /><text x="362" y="131" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 2: Input Kopi — I/O (parallelogram) */}
            <g filter={activeIdx === 2 ? "url(#glow-f)" : ""}>
              <polygon points="120,222 370,222 390,272 100,272"
                fill={nodeFill(2)} stroke={nodeStroke(2)} strokeWidth="2" />
              <text x="250" y="247" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(2)} fontSize="13" fontFamily="sans-serif" fontWeight="800">INPUT: 1 SDK KOPI</text>
              {showCheck(2) && <><circle cx="392" cy="232" r="11" fill="#10b981" /><text x="392" y="237" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 3: Decision — Diamond */}
            <g filter={activeIdx === 3 ? "url(#glow-f)" : ""}>
              <polygon points="250,324 340,362 250,400 160,362"
                fill={nodeFill(3)} stroke={nodeStroke(3)} strokeWidth="2" />
              <text x="250" y="362" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(3)} fontSize="13" fontFamily="sans-serif" fontWeight="800">SUKA MANIS?</text>
              {showCheck(3) && <><circle cx="342" cy="332" r="11" fill="#10b981" /><text x="342" y="337" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 4: Input Gula — I/O (parallelogram), right branch */}
            <g filter={activeIdx === 4 ? "url(#glow-f)" : ""}>
              <polygon points="320,468 470,468 490,520 300,520"
                fill={nodeFill(4)} stroke={nodeStroke(4)} strokeWidth="2" />
              <text x="400" y="494" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(4)} fontSize="12" fontFamily="sans-serif" fontWeight="800">INPUT: 2 SDK GULA</text>
              {showCheck(4) && <><circle cx="492" cy="478" r="11" fill="#10b981" /><text x="492" y="483" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 5: Seduh & Aduk — Process */}
            <g filter={activeIdx === 5 ? "url(#glow-f)" : ""}>
              <rect x="140" y="490" width="220" height="52" rx="8"
                fill={nodeFill(5)} stroke={nodeStroke(5)} strokeWidth="2" />
              <text x="250" y="516" textAnchor="middle" dominantBaseline="middle"
                fill={textFill(5)} fontSize="13" fontFamily="sans-serif" fontWeight="800">SEDUH &amp; ADUK</text>
              {showCheck(5) && <><circle cx="362" cy="498" r="11" fill="#10b981" /><text x="362" y="503" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>

            {/* 6: Selesai — Terminal (pill), green when done */}
            <g filter={activeIdx === 6 ? "url(#glow-f)" : ""}>
              <rect x="155" y="608" width="190" height="48" rx="24"
                fill={activeIdx === 6 ? "#10b981" : "#27272a"}
                stroke={activeIdx === 6 ? "#34d399" : "#3f3f46"}
                strokeWidth="2" />
              <text x="250" y="632" textAnchor="middle" dominantBaseline="middle"
                fill={activeIdx === 6 ? "#fff" : "#a1a1aa"} fontSize="14" fontFamily="sans-serif" fontWeight="800">☕ KOPI SIAP!</text>
              {showCheck(6) && <><circle cx="347" cy="616" r="11" fill="#10b981" /><text x="347" y="621" textAnchor="middle" fill="#fff" fontSize="13">✓</text></>}
            </g>
          </svg>

          {/* Dashboard overlay */}
          <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-[24px] shadow-2xl">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? "bg-indigo-500 animate-pulse" : "bg-zinc-700"} shadow-[0_0_10px_currentColor]`} />
            <div>
              <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Execution Pipeline Active</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{isPlaying ? "SEDANG BERJALAN" : "SISTEM STANDBY"}</h3>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="absolute bottom-10 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
          <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Ubah Input (Gula) dan Tekan Jalankan untuk Simulasi Algoritma</span>
        </div>
      </div>

    </div>
  );
}
