"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Layers, 
  Info, 
  ArrowRight, 
  Zap,
  Waves,
  FlaskConical,
  Settings2,
  TrendingDown,
  TrendingUp,
  Maximize2,
  CircleDot,
  Dna,
  Beaker
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---

interface Solvent {
  id: string;
  name: string;
  symbol: string;
  kb: number;
  kf: number;
  pureBp: number;
  pureFp: number;
  color: string;
}

const SOLVENTS: Solvent[] = [
  { id: "water", name: "Air", symbol: "H₂O", kb: 0.52, kf: 1.86, pureBp: 100, pureFp: 0, color: "#3b82f6" },
  { id: "ethanol", name: "Etanol", symbol: "C₂H₅OH", kb: 1.22, kf: 1.99, pureBp: 78.4, pureFp: -114.1, color: "#93c5fd" },
  { id: "benzene", name: "Benzena", symbol: "C₆H₆", kb: 2.53, kf: 5.12, pureBp: 80.1, pureFp: 5.5, color: "#cbd5e1" }
];

const SOLUTES = [
  { id: "sugar", name: "Gula (Non-Elektrolit)", i: 1, color: "#f87171" },
  { id: "nacl", name: "Garam (NaCl)", i: 2, color: "#ef4444" },
  { id: "cacl2", name: "Kalsium Klorida (CaCl₂)", i: 3, color: "#dc2626" }
];

// --- Particle System Logic ---

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'solvent' | 'solute';
  isVaporized: boolean = false;

  constructor(type: 'solvent' | 'solute', w: number, h: number) {
    this.type = type;
    this.x = Math.random() * w;
    this.y = h * 0.3 + Math.random() * (h * 0.7);
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }

  update(w: number, h: number, temp: number, surfaceY: number, boilingPt: number, freezingPt: number) {
    const isBoiling = temp >= boilingPt;
    const isFreezing = temp <= freezingPt;
    
    // Thermal speed scaling
    const speedScale = Math.max(0.1, (temp + 120) / 100);
    
    if (isFreezing) {
      // Vibrate in place
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
    } else {
      this.x += this.vx * speedScale;
      this.y += this.vy * speedScale;
      
      // Random walk
      this.vx += (Math.random() - 0.5) * 0.4;
      this.vy += (Math.random() - 0.5) * 0.4;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    // Phase boundary logic
    if (this.type === 'solvent') {
      if (isBoiling && this.y < surfaceY + 20 && Math.random() < 0.02) {
        this.isVaporized = true;
      }
      
      if (this.isVaporized) {
        if (this.y > surfaceY) this.vy -= 0.2; // escape buoyancy
        if (this.y < 0) this.y = h; // cycle
      } else {
        if (this.y < surfaceY) {
          this.y = surfaceY;
          this.vy *= -1;
        }
      }
    } else {
      // Solutes stay in liquid
      if (this.y < surfaceY) {
        this.y = surfaceY;
        this.vy *= -1;
      }
    }

    // Box bounds
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y > h) this.vy *= -1;
    this.x = Math.max(0, Math.min(w, this.x));
    this.y = Math.max(0, Math.min(h, this.y));
  }

  draw(ctx: CanvasRenderingContext2D, solventColor: string, soluteColor: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.type === 'solvent' ? 4 : 7, 0, Math.PI * 2);
    ctx.fillStyle = this.type === 'solvent' ? solventColor : soluteColor;
    if (this.type === 'solute') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = soluteColor;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// --- Main Simulation ---

export default function SifatKoligatif() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [solventId, setSolventId] = useState(SOLVENTS[0].id);
  const [soluteId, setSoluteId] = useState(SOLUTES[0].id);
  const [molality, setMolality] = useState(0); // 0 - 5 m
  const [temp, setTemp] = useState(25);
  const [showDiagram, setShowDiagram] = useState(true);

  const solvent = useMemo(() => SOLVENTS.find(s => s.id === solventId)!, [solventId]);
  const solute = useMemo(() => SOLUTES.find(s => s.id === soluteId)!, [soluteId]);

  // Calculations
  const dTf = molality * solvent.kf * solute.i;
  const dTb = molality * solvent.kb * solute.i;
  const currentFp = solvent.pureFp - dTf;
  const currentBp = solvent.pureBp + dTb;
  
  // Raoult's Law (Vapor Pressure lowering)
  // Simplified: P = P0 * Xsolvent. 
  // Let's visualize it as "Probability of evaporation"
  const vaporPresRatio = 1 - (molality / (molality + 55.5)); // Approx mole fraction

  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const surfaceY = canvas.clientHeight * 0.35;

    const syncParticles = () => {
      const targetSolvent = 120;
      const targetSolute = Math.floor(molality * 15);
      
      const currentSolvent = particlesRef.current.filter(p => p.type === 'solvent').length;
      const currentSolute = particlesRef.current.filter(p => p.type === 'solute').length;

      if (currentSolvent < targetSolvent) particlesRef.current.push(new Particle('solvent', canvas.width, canvas.height));
      if (currentSolute < targetSolute) particlesRef.current.push(new Particle('solute', canvas.width, canvas.height));
      if (currentSolute > targetSolute) {
        const idx = particlesRef.current.findIndex(p => p.type === 'solute');
        if (idx !== -1) particlesRef.current.splice(idx, 1);
      }
    };

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Liquid Background
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, surfaceY, canvas.width, canvas.height - surfaceY);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath(); ctx.moveTo(0, surfaceY); ctx.lineTo(canvas.width, surfaceY); ctx.stroke();

      syncParticles();

      particlesRef.current.forEach(p => {
        p.update(canvas.width, canvas.height, temp, surfaceY, currentBp, currentFp);
        p.draw(ctx, solvent.color, solute.color);
      });

      // Atmospheric Pressure visual
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.font = "bold 10px font-mono";
      ctx.textAlign = "center";
      ctx.fillText("TEKANAN ATMOSFER (1 atm)", canvas.width/2, 20);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [molality, temp, currentBp, currentFp, solvent, solute]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-[#050505] text-zinc-200">
      
      {/* --- Visual Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-4 z-30">
          <motion.div 
            key={solvent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider">{solvent.name}</span>
          </motion.div>

          <div className="flex gap-3">
             <div className="p-4 rounded-[24px] bg-white/5 border border-white/5 space-y-1">
               <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Titik Beku</div>
               <div className={cn("text-lg font-bold font-mono", temp <= currentFp ? "text-blue-400 animate-pulse" : "text-white")}>
                 {currentFp.toFixed(2)} °C
               </div>
             </div>
             <div className="p-4 rounded-[24px] bg-white/5 border border-white/5 space-y-1">
               <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Titik Didih</div>
               <div className={cn("text-lg font-bold font-mono", temp >= currentBp ? "text-rose-400 animate-pulse" : "text-white")}>
                 {currentBp.toFixed(2)} °C
               </div>
             </div>
          </div>
        </div>

        {/* Phase Diagram HUD */}
        <AnimatePresence>
          {showDiagram && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-8 right-8 w-64 h-64 glass-card rounded-[32px] border border-white/10 bg-zinc-900/40 p-6 z-30 overflow-hidden"
            >
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Diagram Fasa P-T</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
               </div>
               
               <div className="relative w-full h-32 border-l border-b border-white/10 mt-4">
                  <span className="absolute -left-4 top-0 text-[8px] rotate-[-90deg] text-zinc-500">TEKANAN</span>
                  <span className="absolute left-1/2 -bottom-4 text-[8px] -translate-x-1/2 text-zinc-500">SUHU</span>
                  
                  {/* Pure Solvent Curve */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {/* Freezing curve */}
                    <path d="M 0,20 Q 20,40 40,80" stroke="rgba(255,255,255,0.2)" fill="none" strokeDasharray="4 4" />
                    {/* Boiling curve */}
                    <path d="M 40,80 Q 70,70 100,50" stroke="rgba(255,255,255,0.2)" fill="none" strokeDasharray="4 4" />
                    
                    {/* Solution Curves (Shifted) */}
                    <motion.path 
                      animate={{ d: `M 0,${20 + dTf * 2} Q 20,${40 + dTf} ${40 - dTb * 0.5},${80 + dTf * 0.5}` }}
                      stroke="#4f46e5" fill="none" strokeWidth="2"
                    />
                    <motion.path 
                      animate={{ d: `M ${40 - dTb * 0.5},${80 + dTf * 0.5} Q 70,${70 + dTb * 0.2} ${100 + dTb * 0.5},${50 + dTb * 0.1}` }}
                      stroke="#4f46e5" fill="none" strokeWidth="2"
                    />

                    {/* Current Temp Point */}
                    <motion.circle 
                      animate={{ cx: (temp + 20) * 0.8, cy: 60 }}
                      r="4" fill="#fbbf24" className="shadow-lg"
                    />
                  </svg>
               </div>
               <p className="mt-8 text-[9px] text-zinc-500 leading-tight">
                 Garis biru menunjukkan pergeseran fasa akibat zat terlarut (Penurunan Titik Beku & Kenaikan Titik Didih).
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Canvas */}
        <div className="relative w-full max-w-3xl h-[500px] flex items-center justify-center">
           <canvas ref={canvasRef} className="w-full h-full" />
           
           {/* Visual Indicators for Phase Change */}
           <AnimatePresence>
              {temp >= currentBp && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                   <Wind className="w-16 h-16 text-rose-500/20 animate-bounce" />
                   <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Evaporasi (Mendidih)</span>
                </motion.div>
              )}
              {temp <= currentFp && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                   <Maximize2 className="w-16 h-16 text-blue-500/20 animate-pulse" />
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Kristalisasi (Membeku)</span>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 flex gap-8 z-30">
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: solvent.color }} />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pelarut ({solvent.symbol || "H₂O"})</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: solute.color }} />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Zat Terlarut ({solute.name})</span>
           </div>
        </div>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 relative z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Beaker className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Sifat Koligatif</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Konsentrasi & Perubahan Fasa</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Solvent Selection */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Droplets className="w-3.5 h-3.5" /> Pilih Pelarut
             </h3>
             <div className="grid grid-cols-1 gap-2">
                {SOLVENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSolventId(s.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                      solventId === s.id 
                        ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                        : "bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-zinc-800/50"
                    )}
                  >
                    <div>
                      <div className="font-bold text-sm">{s.name}</div>
                      <div className="text-[9px] opacity-60">Kb: {s.kb} | Kf: {s.kf}</div>
                    </div>
                    {solventId === s.id && <CircleDot className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
             </div>
          </section>

          {/* Solute & Concentration */}
          <section className="space-y-6">
             <div className="space-y-4">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5" /> Zat Terlarut
               </h3>
               <select 
                value={soluteId}
                onChange={(e) => setSoluteId(e.target.value)}
                className="w-full p-4 bg-zinc-800 border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
               >
                 {SOLUTES.map(s => <option key={s.id} value={s.id}>{s.name} (i={s.i})</option>)}
               </select>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Konsentrasi (Molalitas)</span>
                   <span className="font-mono text-xl font-bold text-white">{molality.toFixed(1)} m</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" value={molality} 
                  onChange={(e) => setMolality(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Suhu Lingkungan</span>
                   <span className="font-mono text-xl font-bold text-white">{temp} °C</span>
                </div>
                <input 
                  type="range" min="-120" max="150" step="1" value={temp} 
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
             </div>
          </section>

          {/* Summary Cards */}
          <section className="grid grid-cols-2 gap-3">
             <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                <TrendingDown className="w-4 h-4 text-blue-400 mb-2" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Depresi Titik Beku</span>
                <span className="text-xs font-bold text-white mt-1">ΔTf: {dTf.toFixed(2)} °C</span>
             </div>
             <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                <TrendingUp className="w-4 h-4 text-rose-400 mb-2" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Elevasi Titik Didih</span>
                <span className="text-xs font-bold text-white mt-1">ΔTb: {dTb.toFixed(2)} °C</span>
             </div>
          </section>

          {/* Educational Insight Card */}
          <section className="p-5 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 space-y-3 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Dna className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wawasan Molekuler</h4>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               Zat terlarut menurunkan tekanan uap karena partikelnya "menghalangi" molekul pelarut di permukaan untuk lepas menjadi gas. Sebaliknya, saat membeku, zat terlarut mengganggu pembentukan struktur kristal padat yang teratur.
             </p>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex flex-col gap-3">
           <button 
            onClick={() => setShowDiagram(!showDiagram)}
            className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-zinc-700 transition-all active:scale-95"
           >
             {showDiagram ? "Sembunyikan Diagram" : "Lihat Diagram Fasa"}
           </button>
        </div>

      </div>

      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #fff;
          border: 3px solid currentColor;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transition: all 0.2s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}
