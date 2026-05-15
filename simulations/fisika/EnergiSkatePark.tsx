"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, BarChart3, Wind, Flame } from "lucide-react";
import Link from "next/link";

export default function EnergiSkatePark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Settings
  const [mass, setMass] = useState(60); // kg
  const [friction, setFriction] = useState(0.01); // friction coefficient
  const [gravity, setGravity] = useState(9.8); // m/s^2

  // Simulation State
  const [theta, setTheta] = useState(-Math.PI / 4); // position angle
  const [omega, setOmega] = useState(0); // angular velocity
  const [thermalEnergy, setThermalEnergy] = useState(0); // Energy lost to friction
  
  const radius = 200; // Visual radius
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Constants
  const meterScale = 50; // pixels per meter
  const rMeters = radius / meterScale;

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = timestamp;

        // Physics: a = -(g/R) * sin(theta) - friction * omega
        const alpha = -(gravity / rMeters) * Math.sin(theta);
        
        setOmega(w => {
           // Apply friction (dissipates velocity)
           const frictionLoss = w * friction * dt * 5;
           const nextW = w + alpha * dt - frictionLoss;
           
           // Track energy lost to thermal
           const currentKE = 0.5 * mass * Math.pow(w * rMeters, 2);
           const nextKE = 0.5 * mass * Math.pow(nextW * rMeters, 2);
           if (currentKE > nextKE && isRunning) {
             setThermalEnergy(te => te + Math.max(0, currentKE - nextKE));
           }
           
           return nextW;
        });

        setTheta(t => t + omega * dt);

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, theta, omega, gravity, rMeters, friction, mass]);

  // Derived Energies
  const height = rMeters * (1 - Math.cos(theta));
  const PE = mass * gravity * height;
  const v = Math.abs(omega * rMeters);
  const KE = 0.5 * mass * v * v;
  const totalMechanical = PE + KE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 100;

      // --- Draw Track Depth/Shadow ---
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 15, 0, Math.PI, false);
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 15;
      ctx.stroke();

      // --- Draw Main Track ---
      const trackGrad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      trackGrad.addColorStop(0, "#334155");
      trackGrad.addColorStop(0.5, "#64748b");
      trackGrad.addColorStop(1, "#334155");
      
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI, false);
      ctx.strokeStyle = trackGrad;
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.stroke();

      // Track Highlight
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 2, 0, Math.PI, false);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Draw Skater (Ball) ---
      const drawAngle = Math.PI / 2 + theta;
      const bx = cx + Math.cos(drawAngle) * radius;
      const by = cy + Math.sin(drawAngle) * radius;

      // Rolling rotation
      const rotation = (theta * radius) / 20;

      ctx.save();
      ctx.translate(bx, by - 16);
      ctx.rotate(rotation);
      const ballGrad = ctx.createRadialGradient(-5, -5, 0, 0, 0, 16);
      ballGrad.addColorStop(0, "#38bdf8");
      ballGrad.addColorStop(1, "#075985");
      ctx.fillStyle = ballGrad;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
      // Stripe
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.stroke();
      ctx.restore();

      // Skateboard
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(theta);
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.roundRect(-20, -4, 40, 6, 2); ctx.fill();
      ctx.restore();

    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [theta, radius]);

  const reset = () => {
    setTheta(-Math.PI / 3);
    setOmega(0);
    setThermalEnergy(0);
    lastTimeRef.current = 0;
  };

  const maxTotal = mass * gravity * (rMeters * 2); // reference for chart height

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Energi Skate Park</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Kekekalan Energi • Fisika</span>
          </div>
        </div>
      </div>

      {/* TOP ANALISIS CARDS */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Energi Kinetik</div>
              <div className="text-xl font-black text-blue-400 font-mono">{KE.toFixed(0)}<span className="text-[10px] ml-1 text-zinc-500">Joule</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Move className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Energi Potensial</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{PE.toFixed(0)}<span className="text-[10px] ml-1 text-zinc-500">Joule</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Energi Termal (Panas)</div>
              <div className="text-xl font-black text-amber-400 font-mono">{thermalEnergy.toFixed(0)}<span className="text-[10px] ml-1 text-zinc-500">Joule</span></div>
            </div>
          </div>
      </div>

      {/* ENERGY BAR CHART (Left Overlay) */}
      <div className="absolute left-8 bottom-32 z-10 hidden md:flex flex-col gap-4">
         <div className="glass-card p-6 pb-12 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl flex items-end gap-5 h-64">
            {/* KE Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
               <div className="w-8 bg-blue-500 rounded-t-lg transition-all duration-75" style={{ height: `${Math.min(100, (KE / 4000) * 100)}%` }} />
               <div className="relative h-0 w-full flex justify-center">
                  <span className="absolute top-2 left-0 text-[8px] font-bold text-zinc-500 uppercase rotate-45 origin-top-left whitespace-nowrap">Kinetik</span>
               </div>
            </div>
            {/* PE Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
               <div className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-75" style={{ height: `${Math.min(100, (PE / 4000) * 100)}%` }} />
               <div className="relative h-0 w-full flex justify-center">
                  <span className="absolute top-2 left-0 text-[8px] font-bold text-zinc-500 uppercase rotate-45 origin-top-left whitespace-nowrap">Potensial</span>
               </div>
            </div>
            {/* Thermal Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
               <div className="w-8 bg-amber-500 rounded-t-lg transition-all duration-75" style={{ height: `${Math.min(100, (thermalEnergy / 4000) * 100)}%` }} />
               <div className="relative h-0 w-full flex justify-center">
                  <span className="absolute top-2 left-0 text-[8px] font-bold text-zinc-500 uppercase rotate-45 origin-top-left whitespace-nowrap">Termal</span>
               </div>
            </div>
            {/* Total Bar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end border-l border-white/5 pl-5">
               <div className="w-8 bg-zinc-400 rounded-t-lg transition-all duration-75" style={{ height: `${Math.min(100, ((PE+KE+thermalEnergy) / 4000) * 100)}%` }} />
               <div className="relative h-0 w-full flex justify-center">
                  <span className="absolute top-2 left-0 text-[8px] font-bold text-zinc-500 uppercase rotate-45 origin-top-left whitespace-nowrap">Total</span>
               </div>
            </div>
         </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-20">
        <div className="glass-card p-5 rounded-[28px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-5">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Mass */}
            <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Massa Skater</span>
                  <span className="text-[10px] font-mono text-white">{mass}kg</span>
               </div>
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="20" max="150" step="5" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
            </div>

            {/* Friction */}
            <div className="space-y-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Gesekan (Friction)</span>
                  <span className="text-[10px] font-mono text-amber-400">{(friction * 100).toFixed(0)}%</span>
               </div>
               <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="0" max="0.1" step="0.01" value={friction} onChange={(e) => setFriction(parseFloat(e.target.value))} />
            </div>

            {/* Gravity */}
            <div className="space-y-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Gravitasi</span>
                  <span className="text-[10px] font-mono text-indigo-400">{gravity.toFixed(1)}m/s²</span>
               </div>
               <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0" max="25" step="0.5" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-3 w-full justify-center border-t border-white/5 pt-4">
            <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 max-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}>
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4 fill-current"/>}
              {isRunning ? 'Pause' : 'Mulai'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all active:scale-95">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
