"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RefreshCcw, 
  Thermometer, 
  Wind, 
  Layers, 
  Zap, 
  Info, 
  ArrowRight, 
  ArrowLeft,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Settings2,
  TrendingUp,
  Pointer
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Types ---

interface ReactionData {
  id: string;
  name: string;
  equation: string;
  isExothermic: boolean;
  coeffs: { a: number; b: number };
  description: string;
}

const REACTIONS: ReactionData[] = [
  {
    id: "haber",
    name: "Sintesis Amonia (Haber)",
    equation: "N₂ + 3H₂ ⇌ 2NH₃",
    isExothermic: true,
    coeffs: { a: 4, b: 2 },
    description: "Reaksi pembentukan amonia. Karena jumlah mol gas berkurang ke kanan, tekanan tinggi menggeser kesetimbangan ke arah produk."
  },
  {
    id: "generic",
    name: "Reaksi Umum",
    equation: "A ⇌ B",
    isExothermic: false,
    coeffs: { a: 1, b: 1 },
    description: "Model sederhana untuk memahami bagaimana suhu dan konsentrasi mempengaruhi kesetimbangan tanpa pengaruh tekanan yang signifikan."
  }
];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'a' | 'b';

  constructor(type: 'a' | 'b', width: number, height: number) {
    this.type = type;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    const speed = 1 + Math.random() * 2;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(width: number, height: number, temp: number) {
    const speedMult = temp / 300;
    this.x += this.vx * speedMult;
    this.y += this.vy * speedMult;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    this.x = Math.max(0, Math.min(width, this.x));
    this.y = Math.max(0, Math.min(height, this.y));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.type === 'a' ? 3 : 4, 0, Math.PI * 2);
    ctx.fillStyle = this.type === 'a' ? "#3b82f6" : "#f43f5e";
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.type === 'a' ? "rgba(59, 130, 246, 0.5)" : "rgba(244, 63, 94, 0.5)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// --- Main Simulation ---

export default function KesetimbanganKimia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedReactionId, setSelectedReactionId] = useState(REACTIONS[0].id);
  const [isRunning, setIsRunning] = useState(true);
  const [temp, setTemp] = useState(300);
  const [pressure, setPressure] = useState(1);
  
  const [concA, setConcA] = useState(60);
  const [concB, setConcB] = useState(20);
  const concARef = useRef(60);
  const concBRef = useRef(20);
  
  const [history, setHistory] = useState<{ a: number, b: number }[]>([]);
  const [shift, setShift] = useState<"left" | "right" | "stable">("stable");

  const reaction = useMemo(() => REACTIONS.find(r => r.id === selectedReactionId)!, [selectedReactionId]);
  const particlesRef = useRef<Particle[]>([]);

  const Kc = useMemo(() => {
    const baseKc = reaction.id === "haber" ? 50 : 1;
    const factor = reaction.isExothermic ? -1 : 1;
    return baseKc * Math.exp(factor * 1500 * (1/300 - 1/temp));
  }, [temp, reaction]);

  // Handle Animation & Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = Date.now();

    const updateParticles = () => {
      const targetA = Math.floor(concARef.current);
      const targetB = Math.floor(concBRef.current);
      
      // Sync particle count
      const currentA = particlesRef.current.filter(p => p.type === 'a').length;
      const currentB = particlesRef.current.filter(p => p.type === 'b').length;

      if (currentA < targetA) particlesRef.current.push(new Particle('a', canvas.width, canvas.height));
      else if (currentA > targetA) {
        const idx = particlesRef.current.findIndex(p => p.type === 'a');
        if (idx !== -1) particlesRef.current.splice(idx, 1);
      }

      if (currentB < targetB) particlesRef.current.push(new Particle('b', canvas.width, canvas.height));
      else if (currentB > targetB) {
        const idx = particlesRef.current.findIndex(p => p.type === 'b');
        if (idx !== -1) particlesRef.current.splice(idx, 1);
      }
    };

    const render = () => {
      if (!isRunning) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Update Canvas Size
      const boxW = 400 / (pressure ** 0.3);
      const boxH = 350 / (pressure ** 0.3);
      canvas.width = boxW;
      canvas.height = boxH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reaction Physics
      const pFactor = Math.pow(pressure, reaction.coeffs.a - reaction.coeffs.b);
      const kf = 0.05 * Math.exp(-400/temp) * pFactor;
      const kr = 0.05 * Math.exp(-400/temp) / Kc;

      const rateF = kf * Math.pow(concARef.current, reaction.coeffs.a === 4 ? 1.2 : 1);
      const rateR = kr * Math.pow(concBRef.current, reaction.coeffs.b === 2 ? 1.2 : 1);

      const delta = (rateF - rateR) * 0.2;
      concARef.current = Math.max(1, concARef.current - delta);
      concBRef.current = Math.max(1, concBRef.current + delta);

      updateParticles();

      // Draw and move particles
      particlesRef.current.forEach(p => {
        p.update(canvas.width, canvas.height, temp);
        p.draw(ctx);
      });

      // Update UI state less frequently
      if (Math.random() < 0.1) {
        setConcA(concARef.current);
        setConcB(concBRef.current);
        setShift(Math.abs(delta) > 0.03 ? (delta > 0 ? "right" : "left") : "stable");
        setHistory(prev => [...prev.slice(-99), { a: concARef.current, b: concBRef.current }]);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, temp, pressure, Kc, reaction]);

  const reset = () => {
    concARef.current = 60;
    concBRef.current = 20;
    particlesRef.current = [];
    setHistory([]);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden bg-[#050505] text-zinc-200">
      
      {/* --- Main Simulation Area --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden border-r border-white/5">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* Dynamic Status Badges */}
        <div className="absolute top-8 left-8 flex gap-4 z-30">
          <motion.div 
            animate={{ 
              backgroundColor: shift === "stable" ? "rgba(34, 197, 94, 0.1)" : "rgba(99, 102, 241, 0.1)",
              borderColor: shift === "stable" ? "rgba(34, 197, 94, 0.3)" : "rgba(99, 102, 241, 0.3)"
            }}
            className="px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2"
          >
            <TrendingUp className={cn("w-4 h-4", shift === "stable" ? "text-green-400" : "text-indigo-400")} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {shift === "stable" ? "Kesetimbangan Tercapai" : `Bergeser ke ${shift === "right" ? "Kanan" : "Kiri"}`}
            </span>
          </motion.div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <Layers className="w-3 h-3 text-amber-400" /> Kc
            </div>
            <p className="text-lg font-bold text-white font-mono">{Kc.toFixed(2)}</p>
          </div>
        </div>

        {/* Piston Container with Canvas */}
        <div className="relative w-full max-w-2xl h-[450px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              width: 400 / (pressure ** 0.3),
              height: 350 / (pressure ** 0.3),
              borderColor: temp > 450 ? "rgba(248, 113, 113, 0.5)" : "rgba(255, 255, 255, 0.1)"
            }}
            className="relative border-2 border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm overflow-hidden flex items-center justify-center"
          >
             <canvas ref={canvasRef} className="w-full h-full" />
             
             {/* Shift Directional Arrows */}
             <AnimatePresence>
               {shift !== "stable" && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 flex items-center justify-center pointer-events-none"
                 >
                   {shift === "right" ? <ArrowRight className="w-24 h-24 text-indigo-500/20 animate-pulse" /> : <ArrowLeft className="w-24 h-24 text-rose-500/20 animate-pulse" />}
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>

          {/* Piston Visual */}
          <motion.div 
             animate={{ y: -175 / (pressure ** 0.3) - 10 }}
             className="absolute w-64 h-6 bg-zinc-800 border border-white/10 rounded-xl flex items-center justify-center z-20"
          />
        </div>

        {/* Real-time Concentration Graph */}
        <div className="w-full max-w-2xl h-32 mt-8 glass-card rounded-2xl border border-white/5 bg-zinc-900/40 p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path 
                d={`M ${history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 100},${100 - (h.a / 120) * 100}`).join(' L ')}`} 
                fill="none" stroke="#3b82f6" strokeWidth="1" 
             />
             <path 
                d={`M ${history.map((h, i) => `${(i / Math.max(1, history.length - 1)) * 100},${100 - (h.b / 120) * 100}`).join(' L ')}`} 
                fill="none" stroke="#f43f5e" strokeWidth="1" 
             />
          </svg>
        </div>
      </div>

      {/* --- Sidebar Controls --- */}
      <div className="w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 no-scrollbar overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20"><RefreshCcw className="w-5 h-5 text-indigo-400" /></div>
                <h2 className="text-xl font-black text-white tracking-tight">Le Chatelier</h2>
             </div>
             <button onClick={() => setIsRunning(!isRunning)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">{isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
          </div>
          
          <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 text-center">
             <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-widest">{reaction.name}</p>
             <h3 className="text-2xl font-mono font-bold text-white tracking-tighter">{reaction.equation}</h3>
             <div className={cn("mt-2 text-[10px] font-black uppercase", reaction.isExothermic ? "text-rose-400" : "text-blue-400")}>ΔH {reaction.isExothermic ? "< 0" : "> 0"}</div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Gangguan</h3>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => concARef.current += 40} className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-left"><Plus className="w-4 h-4 mb-2" /><div className="text-xs font-bold uppercase tracking-widest">Tambah [A]</div></button>
               <button onClick={() => concBRef.current += 40} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-left"><Plus className="w-4 h-4 mb-2" /><div className="text-xs font-bold uppercase tracking-widest">Tambah [B]</div></button>
            </div>
          </section>

          <section className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-amber-500" /><span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Suhu</span></div><span className="font-mono text-xl font-bold text-white">{temp} K</span></div>
                <input type="range" min="200" max="600" step="10" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-500" /><span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Tekanan</span></div><span className="font-mono text-xl font-bold text-white">{pressure.toFixed(1)} atm</span></div>
                <input type="range" min="0.5" max="4.0" step="0.1" value={pressure} onChange={(e) => setPressure(parseFloat(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
             </div>
          </section>

          <section className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Info className="w-24 h-24" /></div>
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wawasan Le Chatelier</h4>
             <p className="text-xs text-zinc-400 leading-relaxed font-medium">{reaction.description}</p>
          </section>
        </div>

        <div className="p-6 border-t border-white/5 bg-zinc-950/50"><button onClick={reset} className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">Reset Sistem</button></div>
      </div>

      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #fff; border: 3px solid currentColor; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.5); transition: all 0.2s ease; }
        input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-card { box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8); }
      `}</style>
    </div>
  );
}
