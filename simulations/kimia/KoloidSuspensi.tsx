"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Info, 
  Settings2, 
  Maximize2, 
  RefreshCcw,
  Waves,
  FlaskConical,
  Flashlight,
  Pointer,
  Droplets,
  Cloud,
  Layers,
  ArrowDownToLine,
  Search,
  Activity
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Presets ---

type MixtureType = "solution" | "colloid" | "suspension";

interface MixtureData {
  id: MixtureType;
  name: string;
  example: string;
  sizeRange: string;
  optical: string;
  stability: string;
  description: string;
  color: string;
  particleColor: string;
}

const MIXTURES: MixtureData[] = [
  {
    id: "solution",
    name: "Larutan Sejati",
    example: "Garam dalam Air",
    sizeRange: "< 1 nm",
    optical: "Tembus Cahaya",
    stability: "Sangat Stabil",
    description: "Zat terdispersi menyatu sempurna dengan pelarut. Partikel terlalu kecil untuk menghamburkan cahaya atau mengendap.",
    color: "rgba(56, 189, 248, 0.1)",
    particleColor: "rgba(56, 189, 248, 0.4)"
  },
  {
    id: "colloid",
    name: "Koloid",
    example: "Susu atau Santan",
    sizeRange: "1 - 100 nm",
    optical: "Efek Tyndall",
    stability: "Cukup Stabil",
    description: "Partikel berukuran menengah yang tersebar merata. Tidak mengendap karena Gerak Brown, namun cukup besar untuk menghamburkan cahaya.",
    color: "rgba(234, 179, 8, 0.1)",
    particleColor: "rgba(234, 179, 8, 0.8)"
  },
  {
    id: "suspension",
    name: "Suspensi",
    example: "Air Pasir / Lumpur",
    sizeRange: "> 100 nm",
    optical: "Tidak Tembus",
    stability: "Tidak Stabil",
    description: "Campuran heterogen dengan partikel besar. Partikel akan mengendap jika didiamkan (sedimentasi) dan dapat dipisahkan dengan filtrasi.",
    color: "rgba(120, 53, 15, 0.15)",
    particleColor: "rgba(120, 53, 15, 1)"
  }
];

class Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  originalY: number;
  jitter: number;

  constructor(type: MixtureType, w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.originalY = this.y;
    
    if (type === "solution") {
      this.r = 1 + Math.random();
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.jitter = 1;
    } else if (type === "colloid") {
      this.r = 3 + Math.random() * 3;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.jitter = 2;
    } else {
      this.r = 8 + Math.random() * 8;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = Math.random() * 2 + 1;
      this.jitter = 0.5;
    }
  }

  update(w: number, h: number, type: MixtureType, isStirring: boolean) {
    if (type === "suspension") {
      if (isStirring) {
        this.vx += (Math.random() - 0.5) * 5;
        this.vy += (Math.random() - 0.5) * 5;
        this.vx *= 0.95;
        this.vy *= 0.95;
      } else {
        this.vy += 0.05; // Gravity
        this.vx += (Math.random() - 0.5) * 0.2;
      }
    } else {
      // Brownian Motion
      this.vx += (Math.random() - 0.5) * this.jitter;
      this.vy += (Math.random() - 0.5) * this.jitter;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bounds
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0) this.vy *= -1;
    
    if (this.y > h) {
      if (type === "suspension") {
        this.y = h;
        this.vy = 0;
        this.vx *= 0.5;
      } else {
        this.vy *= -1;
      }
    }

    this.x = Math.max(0, Math.min(w, this.x));
    this.y = Math.max(0, Math.min(h, this.y));
  }

  draw(ctx: CanvasRenderingContext2D, color: string, lightX: number, lightY: number, lightOn: boolean, type: MixtureType) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    
    // Light Scattering logic
    let finalColor = color;
    let glow = 0;

    if (lightOn) {
      const distToLightLine = Math.abs(this.y - lightY);
      if (distToLightLine < 40 && this.x > lightX) {
        if (type === "colloid") {
          glow = (40 - distToLightLine) / 40;
          finalColor = `rgba(255, 200, 200, ${0.4 + glow * 0.6})`;
          ctx.shadowBlur = glow * 15;
          ctx.shadowColor = "#f87171";
        } else if (type === "suspension") {
          // Suspensions block light
          finalColor = `rgba(255, 100, 100, 0.9)`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = "#ef4444";
        }
      }
    }

    ctx.fillStyle = finalColor;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// --- Main Simulation ---

export default function KoloidSuspensi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<MixtureType>("colloid");
  const [lightOn, setLightOn] = useState(true);
  const [isStirring, setIsStirring] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 0, y: 0 });

  const mixture = useMemo(() => MIXTURES.find(m => m.id === type)!, [type]);
  const particlesRef = useRef<Particle[]>([]);

  // Init Particles
  useEffect(() => {
    const w = 800;
    const h = 600;
    const count = type === "solution" ? 200 : type === "colloid" ? 120 : 60;
    particlesRef.current = Array.from({ length: count }).map(() => new Particle(type, w, h));
  }, [type]);

  // Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const lightY = h / 2;
      const lightX = 80;

      // Draw Beaker Background
      ctx.fillStyle = mixture.color;
      ctx.beginPath();
      ctx.roundRect(100, 80, w - 200, h - 100, [0, 0, 40, 40]);
      ctx.fill();

      // Tyndall Effect Beam
      if (lightOn) {
        const beamGrad = ctx.createLinearGradient(100, 0, w - 100, 0);
        if (type === "solution") {
          beamGrad.addColorStop(0, "rgba(239, 68, 68, 0.05)");
          beamGrad.addColorStop(1, "rgba(239, 68, 68, 0.02)");
        } else if (type === "colloid") {
          beamGrad.addColorStop(0, "rgba(239, 68, 68, 0.4)");
          beamGrad.addColorStop(1, "rgba(239, 68, 68, 0.1)");
        } else {
          beamGrad.addColorStop(0, "rgba(239, 68, 68, 0.6)");
          beamGrad.addColorStop(0.4, "rgba(239, 68, 68, 0.1)");
          beamGrad.addColorStop(1, "transparent");
        }

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        if (type === "colloid") {
           ctx.moveTo(100, lightY - 10);
           ctx.lineTo(w - 100, lightY - 30);
           ctx.lineTo(w - 100, lightY + 30);
           ctx.lineTo(100, lightY + 10);
        } else {
           ctx.fillRect(100, lightY - 10, w - 200, 20);
        }
        ctx.fill();
      }

      // Draw Beaker Glass
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(100, 50);
      ctx.lineTo(100, h - 40);
      ctx.quadraticCurveTo(100, h, 140, h);
      ctx.lineTo(w - 140, h);
      ctx.quadraticCurveTo(w - 100, h, w - 100, h - 40);
      ctx.lineTo(w - 100, 50);
      ctx.stroke();

      // Particles
      particlesRef.current.forEach(p => {
        p.update(w, h, type, isStirring);
        p.draw(ctx, mixture.particleColor, lightX, lightY, lightOn, type);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [type, lightOn, isStirring, mixture]);

  const stir = () => {
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-[#050505] text-zinc-200">
      
      {/* --- Main Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
        
        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 flex gap-4 z-30">
          <motion.div 
            key={type}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold uppercase tracking-wider">{mixture.name}</span>
          </motion.div>

          <div className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
             <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Partikel</span>
                <span className="text-xs font-bold text-white">{mixture.sizeRange}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Optik</span>
                <span className="text-xs font-bold text-white">{mixture.optical}</span>
             </div>
          </div>
        </div>

        {/* Beaker & Light Tool */}
        <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center">
           <canvas ref={canvasRef} className="w-full h-full" />
           
           {/* Flashlight Pointer */}
           <motion.div 
            animate={{ x: lightOn ? 0 : -20, opacity: lightOn ? 1 : 0.5 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40"
           >
              <div className="relative flex items-center">
                 <div className="w-20 h-10 bg-zinc-800 rounded-lg border border-white/10 shadow-2xl flex items-center justify-center">
                    <div className="w-4 h-6 bg-zinc-900 rounded border border-white/5" />
                 </div>
                 <div className="w-4 h-8 bg-zinc-700 rounded-r-lg" />
                 {lightOn && (
                   <div className="absolute left-20 w-8 h-12 bg-red-500/20 blur-xl animate-pulse rounded-full" />
                 )}
              </div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-500 uppercase tracking-widest">Laser</span>
           </motion.div>

           {/* Info Callouts */}
           <AnimatePresence>
             {type === "colloid" && lightOn && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md border border-red-500/30 p-4 rounded-2xl flex items-center gap-3"
                >
                   <Search className="w-5 h-5 text-red-400" />
                   <div>
                     <div className="text-xs font-bold text-white">Efek Tyndall</div>
                     <div className="text-[10px] text-zinc-400">Cahaya terhambur oleh partikel koloid</div>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Stir Interaction */}
        {type === "suspension" && (
          <motion.button 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            onClick={stir}
            disabled={isStirring}
            className="absolute bottom-12 px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-xl hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-3"
          >
            <RefreshCcw className={cn("w-4 h-4", isStirring && "animate-spin")} />
            {isStirring ? "Mengaduk..." : "Aduk Suspensi"}
          </motion.button>
        )}
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 relative z-50">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-br from-zinc-900/80 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <FlaskConical className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Sistem Koloid</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Klasifikasi Campuran Materi</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Mixture Type Selection */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Layers className="w-3.5 h-3.5" /> Pilih Jenis Campuran
             </h3>
             <div className="grid grid-cols-1 gap-2">
                {MIXTURES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setType(m.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                      type === m.id 
                        ? "bg-indigo-500/10 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10" 
                        : "bg-zinc-800/30 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-zinc-800/50"
                    )}
                  >
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {m.name}
                        {type === m.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />}
                      </div>
                      <div className="text-[10px] opacity-60 font-medium">Contoh: {m.example}</div>
                    </div>
                    <Maximize2 className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                ))}
             </div>
          </section>

          {/* Tools & Interaction */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Settings2 className="w-3.5 h-3.5" /> Kontrol & Alat
             </h3>
             <button 
              onClick={() => setLightOn(!lightOn)}
              className={cn(
                "w-full p-4 rounded-2xl border flex items-center justify-between transition-all group active:scale-95",
                lightOn ? "bg-red-500/10 border-red-500/30 text-white" : "bg-zinc-800 border-white/5 text-zinc-500"
              )}
             >
                <div className="flex items-center gap-3">
                  <Flashlight className={cn("w-5 h-5", lightOn ? "text-red-400" : "text-zinc-600")} />
                  <span className="text-xs font-bold">Laser / Senter</span>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full relative transition-colors",
                  lightOn ? "bg-red-500" : "bg-zinc-700"
                )}>
                   <motion.div 
                    animate={{ x: lightOn ? 22 : 2 }}
                    className="absolute top-1 w-3 h-3 rounded-full bg-white" 
                   />
                </div>
             </button>
          </section>

          {/* Comparison Table */}
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <Info className="w-3.5 h-3.5" /> Parameter Campuran
             </h3>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest">Stabilitas</span>
                   <span className="text-white font-bold">{mixture.stability}</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-zinc-500 font-bold uppercase tracking-widest">Gerak Partikel</span>
                   <span className="text-white font-bold">{type === "solution" ? "Difusi" : type === "colloid" ? "Gerak Brown" : "Sedimentasi"}</span>
                </div>
             </div>
          </section>

          {/* Educational Insight Card */}
          <section className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Cloud className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wawasan Kimia</h4>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">
               {mixture.description}
             </p>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
            <Pointer className="w-3 h-3 text-indigo-500" />
            Pilih jenis untuk melihat bedanya
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
