"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function TekananGas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Settings
  const [volume, setVolume] = useState(80); // % of container height
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [n, setN] = useState(50); // Number of particles

  // Physics Logic (Ideal Gas Law P = nRT/V)
  // Constant R = 8.314, but we use scaled values for simulation
  const pressure = (n * 0.1 * temperature) / (volume / 100);
  const rmsSpeed = Math.sqrt(temperature / 10); // v ~ sqrt(T)

  // Animation State
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  // Initialize Particles
  useEffect(() => {
    const p: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      p.push({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        vx: Math.cos(angle),
        vy: Math.sin(angle)
      });
    }
    particles.current = p;
  }, []);

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
      const cx = (canvas.width - sidebarWidth) / 2;
      const cy = canvas.height / 2;

      // Chamber Dimensions
      const chamberSize = 350;
      const currentH = (volume / 100) * chamberSize;
      const bx = cx - chamberSize / 2;
      const by = cy + chamberSize / 2 - currentH;

      // Update Particles
      if (isRunning) {
        const halfW = chamberSize / 2;
        const halfH = currentH / 2;
        const centerX = cx;
        const centerY = by + currentH / 2;

        particles.current.slice(0, n).forEach(p => {
          p.x += p.vx * rmsSpeed;
          p.y += p.vy * rmsSpeed;

          // Bounce off walls (relative to center of active chamber)
          if (p.x > halfW - 4) { p.x = halfW - 4; p.vx *= -1; }
          if (p.x < -halfW + 4) { p.x = -halfW + 4; p.vx *= -1; }
          if (p.y > halfH - 4) { p.y = halfH - 4; p.vy *= -1; }
          if (p.y < -halfH + 4) { p.y = -halfH + 4; p.vy *= -1; }
        });
      }

      // --- Draw Chamber Background Glow ---
      const tempHue = 220 - (temperature / 1000) * 220; // 220 (Blue) to 0 (Red)
      const chamberGrad = ctx.createRadialGradient(cx, by + currentH/2, 0, cx, by + currentH/2, chamberSize);
      chamberGrad.addColorStop(0, `hsla(${tempHue}, 70%, 50%, 0.1)`);
      chamberGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = chamberGrad;
      ctx.fillRect(bx - 50, by - 50, chamberSize + 100, currentH + 100);

      // --- Draw Chamber Walls ---
      ctx.strokeStyle = `hsla(${tempHue}, 80%, 60%, 0.4)`;
      ctx.lineWidth = 4;
      ctx.strokeRect(bx, by, chamberSize, currentH);
      
      // Glass effect
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(bx, by, chamberSize, currentH);

      // --- Draw Piston (Top Wall) ---
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(bx - 10, by - 15, chamberSize + 20, 15);
      // Piston Rod
      ctx.fillStyle = "#27272a";
      ctx.fillRect(cx - 10, by - 100, 20, 85);

      // --- Draw Particles ---
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${tempHue}, 100%, 70%, 0.8)`;
      ctx.fillStyle = "white";
      particles.current.slice(0, n).forEach(p => {
        const px = cx + p.x;
        const py = by + currentH/2 + p.y;
        
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = `hsla(${tempHue}, 100%, 70%, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - p.vx * 10, py - p.vy * 10);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // --- Annotations ---
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`VOLUME: ${volume}%`, cx, by + currentH + 20);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [volume, temperature, n, isRunning, rmsSpeed]);

  const reset = () => {
    setVolume(80);
    setTemperature(300);
    setN(50);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Teori Kinetik Gas</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Gas Ideal • Fisika</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Kinetik</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Tekanan (P)</span>
                       <span className="text-xl font-black text-white">{pressure.toFixed(1)} <span className="text-xs text-zinc-500">atm</span></span>
                    </div>
                    <Gauge className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Laju Partikel (v_rms)</span>
                       <span className="text-xl font-black text-sky-400">{rmsSpeed.toFixed(1)} <span className="text-xs text-zinc-500">m/s</span></span>
                    </div>
                    <Zap className="w-5 h-5 text-sky-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Jumlah Partikel (n)</span>
                       <span className="text-xl font-black text-amber-400">{n} <span className="text-xs text-zinc-500">mol</span></span>
                    </div>
                    <Box className="w-5 h-5 text-amber-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Thermometer className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Termodinamika</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Suhu (T): {temperature} K</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-yellow-500" min="50" max="1000" step="50" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Volume (V): {volume}%</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="30" max="100" step="5" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Jumlah Molekul (n): {n}</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="10" max="150" step="10" value={n} onChange={(e) => setN(parseInt(e.target.value))} />
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Jeda Simulasi' : 'Mulai Simulasi'}
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
