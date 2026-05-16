"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Info, 
  Settings2, 
  Layers, 
  Maximize2, 
  Atom, 
  Link as LinkIcon,
  FlaskConical,
  Activity,
  Waves,
  Droplets,
  Pointer,
  Sparkles,
  Pause
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---

type PolymerType = "addition" | "condensation";

interface PolymerPreset {
  id: string;
  type: PolymerType;
  name: string;
  monomerA: string;
  monomerB?: string;
  byproduct?: string;
  description: string;
  colorA: string;
  colorB?: string;
}

const PRESETS: PolymerPreset[] = [
  {
    id: "pe",
    type: "addition",
    name: "Polietilena (PE)",
    monomerA: "Etena",
    description: "Plastik paling umum. Terbentuk dari ribuan monomer etena yang membuka ikatan rangkapnya.",
    colorA: "#3b82f6"
  },
  {
    id: "nylon",
    type: "condensation",
    name: "Nilon-6,6",
    monomerA: "Asam Adipat",
    monomerB: "Heksametilendiamina",
    byproduct: "H₂O",
    description: "Serat sintetis kuat. Terbentuk dari reaksi gugus karboksil dan amina, melepaskan air.",
    colorA: "#ec4899",
    colorB: "#10b981"
  }
];

class Monomer {
  id: number;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  type: 1 | 2;
  links: number[] = []; // IDs of linked monomers
  isReactive: boolean = true;

  constructor(id: number, type: 1 | 2, w: number, h: number) {
    this.id = id;
    this.type = type;
    this.x = 100 + Math.random() * (w - 200);
    this.y = 100 + Math.random() * (h - 200);
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }

  update(w: number, h: number, isRunning: boolean) {
    if (!isRunning) return;

    // Soft bounds
    const margin = 50;
    if (this.x < margin) this.vx += 0.2;
    if (this.x > w - margin) this.vx -= 0.2;
    if (this.y < margin) this.vy += 0.2;
    if (this.y > h - margin) this.vy -= 0.2;

    // Drag
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;
  }
}

// --- Main Simulation ---

export default function Polimer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [crossLinkMode, setCrossLinkMode] = useState(false);
  const [stats, setStats] = useState({ chains: 0, avgLength: 0, byproducts: 0 });

  const preset = useMemo(() => PRESETS.find(p => p.id === selectedPresetId)!, [selectedPresetId]);
  const monomersRef = useRef<Monomer[]>([]);
  const byproductsRef = useRef<{x:number, y:number, opacity:number, life:number}[]>([]);

  const initSimulation = () => {
    setIsRunning(false);
    const w = canvasRef.current?.width || 800;
    const h = canvasRef.current?.height || 600;
    monomersRef.current = Array.from({ length: 24 }).map((_, i) => 
      new Monomer(i, preset.type === "addition" ? 1 : (i % 2 === 0 ? 1 : 2), w, h)
    );
    byproductsRef.current = [];
    setStats({ chains: 0, avgLength: 0, byproducts: 0 });
  };

  useEffect(() => {
    initSimulation();
  }, [selectedPresetId]);

  // Simulation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);

      const mons = monomersRef.current;

      if (isRunning) {
        // Inter-monomer forces
        for (let i = 0; i < mons.length; i++) {
          const m1 = mons[i];
          
          for (let j = i + 1; j < mons.length; j++) {
            const m2 = mons[j];
            const dx = m2.x - m1.x;
            const dy = m2.y - m1.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // 1. Check for Polymerization
            if (m1.links.length < 2 && m2.links.length < 2) {
              const canBond = preset.type === "addition" ? true : (m1.type !== m2.type);
              
              if (canBond && dist < 50) {
                 // Avoid small cycles
                 const isSameChain = false; // Simplified for performance
                 if (!m1.links.includes(m2.id)) {
                    m1.links.push(m2.id);
                    m2.links.push(m1.id);
                    if (preset.byproduct) {
                      byproductsRef.current.push({ x: (m1.x + m2.x)/2, y: (m1.y + m2.y)/2, opacity: 1, life: 100 });
                      setStats(s => ({ ...s, byproducts: s.byproducts + 1 }));
                    }
                 }
              }
            }

            // 2. Attraction/Repulsion Forces
            if (dist < 150 && dist > 5) {
               const isLinked = m1.links.includes(m2.id);
               const force = isLinked ? (dist - 35) * 0.1 : (dist < 60 ? -1 : 0.05);
               const fx = (dx / dist) * force;
               const fy = (dy / dist) * force;
               m1.vx += fx; m1.vy += fy;
               m2.vx -= fx; m2.vy -= fy;
            }
          }
          m1.update(w, h, isRunning);
        }
      }

      // Draw Bonds
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      mons.forEach(m1 => {
        m1.links.forEach(id => {
          if (id > m1.id) {
             const m2 = mons.find(m => m.id === id)!;
             const grad = ctx.createLinearGradient(m1.x, m1.y, m2.x, m2.y);
             grad.addColorStop(0, m1.type === 1 ? preset.colorA : (preset.colorB || "white"));
             grad.addColorStop(1, m2.type === 1 ? preset.colorA : (preset.colorB || "white"));
             ctx.strokeStyle = grad;
             ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke();
             // Inner link highlight
             ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
             ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke();
             ctx.lineWidth = 6;
          }
        });
      });

      // Draw Monomers
      mons.forEach(m => {
        const color = m.type === 1 ? preset.colorA : (preset.colorB || "white");
        ctx.shadowBlur = 15;
        ctx.shadowColor = color + "66";
        
        ctx.fillStyle = color;
        ctx.beginPath();
        if (preset.type === "addition") {
           // Pill shape for Addition
           ctx.roundRect(m.x - 12, m.y - 8, 24, 16, 8);
        } else {
           // Circles for Condensation
           ctx.arc(m.x, m.y, 12, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Functional Group Indicators
        if (m.links.length === 0) {
           ctx.fillStyle = "white"; ctx.font = "bold 8px font-mono"; ctx.textAlign="center";
           if (preset.type === "addition") {
             ctx.fillRect(m.x - 6, m.y - 2, 12, 1); ctx.fillRect(m.x - 6, m.y + 1, 12, 1);
           } else {
             ctx.fillText(m.type === 1 ? "-COOH" : "-NH₂", m.x, m.y + 3);
           }
        }
      });

      // Draw Byproducts
      byproductsRef.current = byproductsRef.current.filter(b => b.life > 0);
      byproductsRef.current.forEach(b => {
        b.y -= 1; b.opacity -= 0.01; b.life--;
        ctx.fillStyle = `rgba(186, 230, 253, ${b.opacity})`;
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(`+ ${preset.byproduct}`, b.x, b.y);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, preset]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-[#050505] text-zinc-200">
      
      {/* --- Main Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-4 z-30">
          <motion.div 
            key={preset.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider">{preset.name}</span>
          </motion.div>

          <div className="flex gap-3">
             <div className="p-4 rounded-[24px] bg-white/5 border border-white/5 space-y-1">
               <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tipe Reaksi</div>
               <div className="text-xs font-bold text-white uppercase tracking-wider">
                 {preset.type === "addition" ? "Adisi" : "Kondensasi"}
               </div>
             </div>
             {preset.byproduct && (
                <div className="p-4 rounded-[24px] bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Hasil Samping</div>
                  <div className="text-xs font-bold text-sky-400 font-mono">
                    {stats.byproducts} x {preset.byproduct}
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Reaction Canvas */}
        <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center">
           <canvas ref={canvasRef} className="w-full h-full" />
           
           <AnimatePresence>
             {!isRunning && stats.byproducts === 0 && (
               <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
               >
                  <div className="w-32 h-32 rounded-full border border-white/5 bg-white/5 flex items-center justify-center animate-pulse">
                     <Sparkles className="w-12 h-12 text-zinc-600" />
                  </div>
                  <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Siap Untuk Polimerisasi</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 flex gap-8 z-30">
           <div className="flex items-center gap-3">
             <div className="w-6 h-4 rounded-full border border-white/10" style={{ backgroundColor: preset.colorA }} />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monomer {preset.monomerA}</span>
           </div>
           {preset.monomerB && (
             <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: preset.colorB }} />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monomer {preset.monomerB}</span>
             </div>
           )}
        </div>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 relative z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <LinkIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Polimerisasi</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Rantai Makromolekul</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Preset Selection */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <FlaskConical className="w-3.5 h-3.5" /> Pilih Model Polimer
             </h3>
             <div className="grid grid-cols-1 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPresetId(p.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                      selectedPresetId === p.id 
                        ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                        : "bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-zinc-800/50"
                    )}
                  >
                    <div>
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-[9px] opacity-60 uppercase tracking-widest">Tipe: {p.type === "addition" ? "Adisi" : "Kondensasi"}</div>
                    </div>
                    <div className="flex gap-1">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colorA }} />
                       {p.colorB && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colorB }} />}
                    </div>
                  </button>
                ))}
             </div>
          </section>

          {/* Action Buttons */}
          <section className="space-y-3">
             <button 
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3",
                isRunning ? "bg-zinc-800 text-white border border-white/10" : "bg-indigo-600 text-white hover:bg-indigo-500"
              )}
             >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? "Hentikan Reaksi" : "Mulai Reaksi"}
             </button>
             <button 
              onClick={initSimulation}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
             >
                <RotateCcw className="w-4 h-4" /> Reset Monomer
             </button>
          </section>

          {/* Logic Toggle */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Settings2 className="w-3.5 h-3.5" /> Konsep Reaksi
             </h3>
             <div className="p-5 rounded-3xl bg-zinc-800/50 border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                   <div className={cn("w-10 h-6 rounded-full relative transition-colors", preset.type === "addition" ? "bg-blue-500" : "bg-pink-500")}>
                      <div className="absolute inset-1 w-4 h-4 bg-white rounded-full" />
                   </div>
                   <span className="text-xs font-bold text-white">
                      {preset.type === "addition" ? "Pemutusan Ikatan Rangkap" : "Pelepasan Molekul Air"}
                   </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  {preset.description}
                </p>
             </div>
          </section>

          {/* Info Card */}
          <section className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Karakteristik Polimer</h4>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               Kekuatan polimer ditentukan oleh **panjang rantai** dan adanya **ikatan silang** (cross-linking). Semakin banyak ikatan, material semakin kaku dan tahan panas.
             </p>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
            <Pointer className="w-3 h-3 text-indigo-500" />
            Amati bagaimana rantai terbentuk
          </div>
        </div>

      </div>

      <style jsx global>{`
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
