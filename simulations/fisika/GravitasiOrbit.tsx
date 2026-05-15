"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Globe, Orbit as OrbitIcon } from "lucide-react";
import Link from "next/link";

interface Point { x: number; y: number; }

export default function GravitasiOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [starMass, setStarMass] = useState(150);
  const [planetMass, setPlanetMass] = useState(10);
  const [initVelocity, setInitVelocity] = useState(3.5);
  const [showVectors, setShowVectors] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const animationRef = useRef(0);
  const stateRef = useRef({
    px: 200, py: 0, vx: 0, vy: 3.5,
    path: [] as Point[]
  });

  const reset = () => {
    stateRef.current = {
      px: 200, py: 0, vx: 0, vy: initVelocity,
      path: []
    };
  };

  useEffect(() => {
    reset();
  }, [initVelocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G = 5;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      // --- Physics ---
      const s = stateRef.current;
      if (isRunning) {
         const dx = -s.px;
         const dy = -s.py;
         const distSq = dx*dx + dy*dy;
         const dist = Math.sqrt(distSq);
         
         const force = (G * starMass * planetMass) / Math.max(distSq, 100);
         const ax = (force * dx / dist) / planetMass;
         const ay = (force * dy / dist) / planetMass;

         s.vx += ax;
         s.vy += ay;
         s.px += s.vx;
         s.py += s.vy;

         s.path.push({ x: s.px, y: s.py });
         if (s.path.length > 500) s.path.shift();
      }

      // --- Drawing ---
      // 1. Spacetime Grid Warp
      if (showGrid) {
         ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
         ctx.lineWidth = 1;
         const gridSize = 40;
         for (let x = 0; x < arenaW; x += gridSize) {
            ctx.beginPath();
            for (let y = 0; y < arenaH; y += 10) {
               const dx = x - cx;
               const dy = y - cy;
               const d = Math.sqrt(dx*dx + dy*dy);
               const warp = (starMass * 100) / (d + 50);
               const wx = x - (dx/d) * warp;
               const wy = y - (dy/d) * warp;
               if (y === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
            }
            ctx.stroke();
         }
         for (let y = 0; y < arenaH; y += gridSize) {
            ctx.beginPath();
            for (let x = 0; x < arenaW; x += 10) {
               const dx = x - cx;
               const dy = y - cy;
               const d = Math.sqrt(dx*dx + dy*dy);
               const warp = (starMass * 100) / (d + 50);
               const wx = x - (dx/d) * warp;
               const wy = y - (dy/d) * warp;
               if (x === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
            }
            ctx.stroke();
         }
      }

      // 2. Orbit Path
      if (s.path.length > 1) {
         ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(cx + s.path[0].x, cy + s.path[0].y);
         s.path.forEach(pt => ctx.lineTo(cx + pt.x, cy + pt.y));
         ctx.stroke();
      }

      // 3. Central Star
      ctx.save();
      ctx.translate(cx, cy);
      const starR = 20 + starMass / 10;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, starR * 2);
      grad.addColorStop(0, "#fbbf24");
      grad.addColorStop(0.5, "#f59e0b");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, starR * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fffbeb";
      ctx.beginPath(); ctx.arc(0, 0, starR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // 4. Orbiting Planet
      ctx.save();
      ctx.translate(cx + s.px, cy + s.py);
      const planetR = 8 + planetMass / 5;
      ctx.shadowBlur = 15; ctx.shadowColor = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(0, 0, planetR, 0, Math.PI * 2); ctx.fill();
      
      if (showVectors) {
         // Gravity Vector (towards center)
         ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 2;
         ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s.px * 0.1, -s.py * 0.1); ctx.stroke();
         // Velocity Vector (tangential)
         ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
         ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s.vx * 15, s.vy * 15); ctx.stroke();
      }
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, starMass, planetMass, showVectors, showGrid]);

  const velocityMag = Math.sqrt(stateRef.current.vx**2 + stateRef.current.vy**2).toFixed(2);
  const distance = Math.sqrt(stateRef.current.px**2 + stateRef.current.py**2).toFixed(0);

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gravitasi & Orbit</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Newton • Kelengkapan Ruang-Waktu • Kecepatan Orbit</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Physics HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Data Orbital</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Kecepatan</span>
                    <span className="text-sm font-black text-white">{velocityMag} v</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Jarak (r)</span>
                    <span className="text-sm font-black text-emerald-400">{distance} km</span>
                 </div>
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurasi Massa</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Massa Bintang</label>
                       <span className="text-xs font-black text-amber-400">{starMass} M₀</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-400" min="50" max="400" step="10" value={starMass} onChange={(e) => setStarMass(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kecepatan Awal</label>
                       <span className="text-xs font-black text-sky-400">{initVelocity} v</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="0.5" max="8.0" step="0.1" value={initVelocity} onChange={(e) => setInitVelocity(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Visualization Toggles */}
           <div className="space-y-2">
              <button onClick={() => setShowGrid(!showGrid)} className={`w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase transition-all border flex items-center justify-between ${showGrid ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Grid Ruang-Waktu
                 <Move className="w-3 h-3" />
              </button>
              <button onClick={() => setShowVectors(!showVectors)} className={`w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase transition-all border flex items-center justify-between ${showVectors ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Vektor Gaya & Kecepatan
                 <Zap className="w-3 h-3" />
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Globe className="w-4 h-4 text-emerald-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Orbital</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Curvature:</strong> Menurut Einstein, gravitasi bukanlah gaya tarik, melainkan kelengkungan ruang-waktu yang disebabkan oleh massa besar.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Kecepatan Lepas:</strong> Jika kecepatan awal terlalu tinggi, planet akan lepas dari gravitasi bintang dan bergerak dalam lintasan hiperbolik.
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "PAUSE" : "START"}
              </button>
              <button onClick={reset} className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl border border-white/5 transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
