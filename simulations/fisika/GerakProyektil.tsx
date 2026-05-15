"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Rocket } from "lucide-react";
import Link from "next/link";

interface Point { x: number; y: number; vx: number; vy: number; t: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

export default function GerakProyektil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Parameters
  const [v0, setV0] = useState(40);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(1);
  const [showVectors, setShowVectors] = useState(true);

  const animationRef = useRef(0);
  const timeRef = useRef(0);
  const pathRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastUpdateRef = useRef(Date.now());

  const reset = () => {
    setIsRunning(false);
    timeRef.current = 0;
    pathRef.current = [];
    particlesRef.current = [];
  };

  const fire = () => {
    reset();
    setIsRunning(true);
  };

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
      
      const groundY = arenaH - 100;
      const startX = 100;
      const scale = 5; // 1 meter = 5 pixels

      const now = Date.now();
      const dt = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      if (isRunning) {
         timeRef.current += dt;
         const t = timeRef.current;
         const rad = (angle * Math.PI) / 180;
         
         const vx = v0 * Math.cos(rad);
         const vy = v0 * Math.sin(rad) - gravity * t;
         
         const x = startX + (v0 * Math.cos(rad) * t) * scale;
         const y = groundY - (v0 * Math.sin(rad) * t - 0.5 * gravity * t * t) * scale;

         if (y > groundY) {
            setIsRunning(false);
            // Create impact particles
            for(let i=0; i<30; i++) {
               particlesRef.current.push({
                  x: x, y: groundY,
                  vx: (Math.random()-0.5)*10,
                  vy: -Math.random()*10,
                  life: 1.0, color: "#f59e0b"
               });
            }
         } else {
            pathRef.current.push({ x, y, vx, vy, t });
         }
      }

      // Draw Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < arenaW; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, arenaH); ctx.stroke(); }
      for (let i = 0; i < arenaH; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(arenaW, i); ctx.stroke(); }

      // Ground
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, groundY, arenaW, 100);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(arenaW, groundY); ctx.stroke();

      // Path
      if (pathRef.current.length > 1) {
         ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
         ctx.setLineDash([5, 5]);
         ctx.beginPath();
         ctx.moveTo(pathRef.current[0].x, pathRef.current[0].y);
         pathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
         ctx.stroke();
         ctx.setLineDash([]);
      }

      // Particles
      particlesRef.current = particlesRef.current.filter(p => {
         p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.life -= 0.02;
         ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
         ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
         return p.life > 0;
      });
      ctx.globalAlpha = 1.0;

      // Projectile
      const last = pathRef.current[pathRef.current.length - 1];
      if (last) {
         ctx.save();
         ctx.translate(last.x, last.y);
         ctx.shadowBlur = 15; ctx.shadowColor = "#8b5cf6";
         ctx.fillStyle = "white";
         ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
         
         if (showVectors) {
            // VX Vector
            ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(last.vx * 2, 0); ctx.stroke();
            // VY Vector
            ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -last.vy * 2); ctx.stroke();
         }
         ctx.restore();
      }

      // Cannon
      ctx.save();
      ctx.translate(startX, groundY);
      ctx.rotate(-(angle * Math.PI) / 180);
      ctx.fillStyle = "#3f3f46";
      ctx.shadowBlur = 10; ctx.shadowColor = "black";
      ctx.fillRect(0, -15, 60, 30);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.strokeRect(0, -15, 60, 30);
      ctx.restore();
      
      ctx.fillStyle = "#27272a";
      ctx.beginPath(); ctx.arc(startX, groundY, 25, 0, Math.PI * 2); ctx.fill();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, v0, angle, gravity, showVectors]);

  const stats = {
    height: Math.max(0, ...pathRef.current.map(p => (window.innerHeight - 100 - p.y) / 5)).toFixed(1),
    range: pathRef.current.length > 0 ? ((pathRef.current[pathRef.current.length-1].x - 100) / 5).toFixed(1) : "0.0",
    time: timeRef.current.toFixed(2)
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gerak Proyektil</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Parabola • Kinematika • Vektor Kecepatan</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Telemetry HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Telemetri Real-time</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Tinggi Maks</span>
                    <span className="text-sm font-black text-white">{stats.height} m</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Jarak (Range)</span>
                    <span className="text-sm font-black text-emerald-400">{stats.range} m</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Waktu Udara</span>
                    <span className="text-sm font-black text-amber-400">{stats.time} s</span>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Launcher Parameters</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kecepatan Awal (v₀)</label>
                       <span className="text-xs font-black text-sky-400">{v0} m/s</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="0" max="100" step="1" value={v0} onChange={(e) => {setV0(parseInt(e.target.value)); reset();}} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sudut (θ)</label>
                       <span className="text-xs font-black text-rose-400">{angle}°</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="0" max="90" step="1" value={angle} onChange={(e) => {setAngle(parseInt(e.target.value)); reset();}} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Gravitasi (g)</label>
                       <span className="text-xs font-black text-emerald-400">{gravity.toFixed(1)} m/s²</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       <button onClick={() => setGravity(9.8)} className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${gravity === 9.8 ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>Bumi</button>
                       <button onClick={() => setGravity(1.6)} className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${gravity === 1.6 ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>Bulan</button>
                       <button onClick={() => setGravity(3.7)} className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${gravity === 3.7 ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>Mars</button>
                       <button onClick={() => setGravity(24.8)} className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${gravity === 24.8 ? 'bg-white/20 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>Jupiter</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Toggle Vectors */}
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Tampilkan Vektor</span>
              </div>
              <button onClick={() => setShowVectors(!showVectors)} className={`w-10 h-5 rounded-full relative transition-all ${showVectors ? 'bg-sky-500' : 'bg-zinc-700'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showVectors ? 'right-1' : 'left-1'}`} />
              </button>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Gerak parabola adalah perpaduan gerak lurus beraturan secara horizontal dan gerak jatuh bebas akibat gravitasi secara vertikal."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={fire} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 <Zap className="w-4 h-4" /> FIRE
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
