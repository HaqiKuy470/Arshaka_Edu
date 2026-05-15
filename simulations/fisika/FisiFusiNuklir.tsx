"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Radio } from "lucide-react";
import Link from "next/link";

interface Nucleon {
  x: number;
  y: number;
  type: "proton" | "neutron";
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  label?: string;
  color: string;
  radius: number;
  nucleons?: Nucleon[];
}

export default function FisiFusiNuklir() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [mode, setMode] = useState<"fisi" | "fusi">("fisi");
  const [stage, setStage] = useState<"idle" | "collision" | "result">("idle");
  
  const entitiesRef = useRef<Particle[]>([]);
  const effectsRef = useRef<{x: number, y: number, r: number, alpha: number}[]>([]);
  const animationRef = useRef(0);
  const timeRef = useRef(0);

  const createNucleus = (x: number, y: number, pCount: number, nCount: number, radius: number): Nucleon[] => {
     const nucleons: Nucleon[] = [];
     for (let i = 0; i < pCount + nCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        nucleons.push({
           x: Math.cos(ang) * r,
           y: Math.sin(ang) * r,
           type: i < pCount ? "proton" : "neutron",
           vx: (Math.random() - 0.5) * 0.5,
           vy: (Math.random() - 0.5) * 0.5
        });
     }
     return nucleons;
  };

  const initSimulation = () => {
    const cx = (window.innerWidth - (window.innerWidth >= 1024 ? 320 : 0)) / 2;
    const cy = window.innerHeight / 2;
    setStage("idle");
    entitiesRef.current = [];
    effectsRef.current = [];

    if (mode === "fisi") {
       // Target U-235
       entitiesRef.current.push({
          x: cx, y: cy, vx: 0, vy: 0, type: "target", label: "U-235", radius: 50, color: "#ef4444",
          nucleons: createNucleus(0, 0, 15, 20, 45) // Representative subset
       });
       // Incoming Neutron
       entitiesRef.current.push({
          x: cx - 400, y: cy, vx: 5, vy: 0, type: "neutron_in", label: "n", radius: 8, color: "#94a3b8"
       });
    } else {
       // Deuterium
       entitiesRef.current.push({
          x: cx - 200, y: cy, vx: 0, vy: 0, type: "deut", label: "D", radius: 25, color: "#38bdf8",
          nucleons: createNucleus(0, 0, 1, 1, 20)
       });
       // Tritium
       entitiesRef.current.push({
          x: cx + 200, y: cy, vx: 0, vy: 0, type: "trit", label: "T", radius: 30, color: "#06b6d4",
          nucleons: createNucleus(0, 0, 1, 2, 25)
       });
    }
  };

  useEffect(() => {
    initSimulation();
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      if (isRunning) timeRef.current += 0.02;
      const t = timeRef.current;

      // Update & Draw Effects
      effectsRef.current = effectsRef.current.filter(e => {
         e.r += 10;
         e.alpha -= 0.02;
         ctx.save();
         ctx.shadowBlur = 40; ctx.shadowColor = "white";
         ctx.strokeStyle = `rgba(255, 255, 255, ${e.alpha})`;
         ctx.lineWidth = 5;
         ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.stroke();
         ctx.restore();
         return e.alpha > 0;
      });

      // Update Entities
      entitiesRef.current.forEach(e => {
         e.x += e.vx;
         e.y += e.vy;

         // Collision Detection
         if (stage === "idle") {
            if (mode === "fisi" && e.type === "neutron_in") {
               const target = entitiesRef.current.find(ent => ent.type === "target");
               if (target && Math.abs(e.x - target.x) < target.radius) {
                  setStage("collision");
                  e.vx = 0; target.vx = 0;
                  // Start Split logic
                  setTimeout(() => {
                     setStage("result");
                     effectsRef.current.push({ x: target.x, y: target.y, r: 10, alpha: 1 });
                     entitiesRef.current = entitiesRef.current.filter(ent => ent.type !== "target" && ent.type !== "neutron_in");
                     // Fragment 1
                     entitiesRef.current.push({
                        x: target.x, y: target.y, vx: -3, vy: -2, type: "frag", label: "Ba", radius: 35, color: "#f59e0b",
                        nucleons: createNucleus(0, 0, 8, 10, 30)
                     });
                     // Fragment 2
                     entitiesRef.current.push({
                        x: target.x, y: target.y, vx: 3, vy: 2, type: "frag", label: "Kr", radius: 30, color: "#8b5cf6",
                        nucleons: createNucleus(0, 0, 7, 8, 25)
                     });
                     // Extra Neutrons
                     for (let i = 0; i < 3; i++) {
                        const ang = (Math.random() - 0.5) * Math.PI;
                        entitiesRef.current.push({
                           x: target.x, y: target.y, vx: Math.cos(ang) * 6, vy: Math.sin(ang) * 6, type: "neutron_out", radius: 5, color: "#94a3b8"
                        });
                     }
                  }, 1000);
               }
            }
            if (mode === "fusi" && (e.type === "deut" || e.type === "trit")) {
               // Only if moving
               const other = entitiesRef.current.find(ent => ent.type !== e.type && (ent.type === "deut" || ent.type === "trit"));
               if (other && Math.abs(e.x - other.x) < (e.radius + other.radius)) {
                  setStage("collision");
                  e.vx = 0; other.vx = 0;
                  setTimeout(() => {
                     setStage("result");
                     effectsRef.current.push({ x: cx, y: cy, r: 10, alpha: 1 });
                     entitiesRef.current = [];
                     // Helium
                     entitiesRef.current.push({
                        x: cx, y: cy, vx: 0, vy: 2, type: "helium", label: "He-4", radius: 35, color: "#22c55e",
                        nucleons: createNucleus(0, 0, 2, 2, 30)
                     });
                     // Neutron
                     entitiesRef.current.push({
                        x: cx, y: cy, vx: 0, vy: -8, type: "neutron_out", label: "n", radius: 8, color: "#94a3b8"
                     });
                  }, 1200);
               }
            }
         }

         // Draw Nucleus / Particle
         ctx.save();
         ctx.translate(e.x, e.y);
         
         // Wobble if in collision
         if (stage === "collision") {
            ctx.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
         }

         // Draw Nucleons
         if (e.nucleons) {
            e.nucleons.forEach(n => {
               n.x += n.vx; n.y += n.vy;
               // Bounce inside radius
               const dist = Math.sqrt(n.x*n.x + n.y*n.y);
               if (dist > e.radius - 8) { n.vx *= -1; n.vy *= -1; }

               ctx.fillStyle = n.type === "proton" ? "#ef4444" : "#71717a";
               ctx.shadowBlur = 5; ctx.shadowColor = ctx.fillStyle as string;
               ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fill();
            });
         } else {
            // Simple Particle
            ctx.fillStyle = e.color;
            ctx.shadowBlur = 10; ctx.shadowColor = e.color;
            ctx.beginPath(); ctx.arc(0, 0, e.radius, 0, Math.PI * 2); ctx.fill();
         }

         // Label
         if (e.label) {
            ctx.fillStyle = "white";
            ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
            ctx.fillText(e.label, 0, e.radius + 15);
         }
         ctx.restore();
      });

      // Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
      ctx.fillText(mode === "fisi" ? "PROSES PEMBELAHAN INTI (FISI)" : "PROSES PENGGABUNGAN INTI (FUSI)", cx, 100);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, mode, stage]);

  const triggerReaction = () => {
    if (stage !== "idle") return;
    if (mode === "fisi") {
       // Neutron move logic is already in update if vx > 0
    } else {
       const deut = entitiesRef.current.find(e => e.type === "deut");
       const trit = entitiesRef.current.find(e => e.type === "trit");
       if (deut && trit) {
          deut.vx = 2.5;
          trit.vx = -2.5;
       }
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Fisi & Fusi Nuklir</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Energi Nuklir • Reaksi Berantai • Bintang</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Mode Selection */}
           <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode("fisi")} className={`py-4 rounded-2xl text-[9px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${mode === "fisi" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 <Radio className={`w-4 h-4 ${mode === "fisi" ? 'text-rose-400' : 'text-zinc-600'}`} />
                 FISI NUKLIR
              </button>
              <button onClick={() => setMode("fusi")} className={`py-4 rounded-2xl text-[9px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${mode === "fusi" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 <Sun className={`w-4 h-4 ${mode === "fusi" ? 'text-amber-400' : 'text-zinc-600'}`} />
                 FUSI NUKLIR
              </button>
           </div>

           {/* Reaction Info Card */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${mode === "fisi" ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
                    <Zap className={`w-4 h-4 ${mode === "fisi" ? 'text-rose-400' : 'text-amber-400'}`} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{mode === "fisi" ? "U-235 + n" : "Deuterium + Tritium"}</span>
                    <span className="text-xs font-black text-white">{mode === "fisi" ? "Reaksi Pembelahan" : "Reaksi Penggabungan"}</span>
                 </div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                 {mode === "fisi" ? "Energi dilepaskan saat inti berat terbelah menjadi fragmen yang lebih stabil." : "Energi dahsyat dilepaskan saat dua inti ringan bergabung menjadi Helium di suhu ekstrem."}
              </p>
           </div>

           {/* Action Button */}
           <div className="pt-4">
              <button 
                onClick={triggerReaction}
                disabled={stage !== "idle"}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-center gap-3 shadow-xl border border-white/10 ${stage === "idle" ? 'bg-white text-black active:scale-95' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                 {mode === "fisi" ? <Zap className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                 {mode === "fisi" ? "LUNCURKAN NEUTRON" : "MULAI KOMPRESI"}
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">E = mc²:</strong> Energi luar biasa yang dilepaskan berasal dari "massa yang hilang" (mass defect) selama reaksi terjadi.
                 </p>
                 <p>
                    <strong className="text-zinc-300">{mode === "fisi" ? "Reaksi Berantai:" : "Kondisi Ekstrem:"}</strong> {mode === "fisi" ? "Neutron sisa akan menabrak inti lain, menciptakan efek domino yang menghasilkan tenaga listrik." : "Fusi membutuhkan tekanan dan suhu jutaan derajat, seperti yang terjadi di pusat Matahari."}
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={initSimulation} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
