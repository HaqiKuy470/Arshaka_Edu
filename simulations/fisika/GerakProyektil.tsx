"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Move, Activity, Settings, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Point { x: number; y: number; vx: number; vy: number; t: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

export default function GerakProyektil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Parameters
  const [v0, setV0] = useState(40);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
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
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const arenaW = canvas.width;
      const arenaH = canvas.height;
      const groundY = arenaH - 80;
      const startX = 60;
      const scale = Math.min(5, arenaW / 150); 

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
            for(let i=0; i<20; i++) {
               particlesRef.current.push({
                  x: x, y: groundY,
                  vx: (Math.random()-0.5)*8, vy: -Math.random()*8,
                  life: 1.0, color: "#f59e0b"
               });
            }
         } else {
            pathRef.current.push({ x, y, vx, vy, t });
         }
      }

      // Ground
      ctx.fillStyle = "#111113";
      ctx.fillRect(0, groundY, arenaW, 80);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(arenaW, groundY); ctx.stroke();

      // Path
      if (pathRef.current.length > 1) {
         ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
         ctx.setLineDash([4, 4]);
         ctx.beginPath();
         ctx.moveTo(pathRef.current[0].x, pathRef.current[0].y);
         pathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
         ctx.stroke();
         ctx.setLineDash([]);
      }

      // Particles
      particlesRef.current = particlesRef.current.filter(p => {
         p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.life -= 0.03;
         ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
         ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
         return p.life > 0;
      });
      ctx.globalAlpha = 1.0;

      // Projectile
      const last = pathRef.current[pathRef.current.length - 1];
      if (last) {
         ctx.save();
         ctx.translate(last.x, last.y);
         ctx.shadowBlur = 15; ctx.shadowColor = "#6366f1";
         ctx.fillStyle = "white";
         ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
         if (showVectors) {
            ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(last.vx * 1.5, 0); ctx.stroke();
            ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -last.vy * 1.5); ctx.stroke();
         }
         ctx.restore();
      }

      // Cannon
      ctx.save();
      ctx.translate(startX, groundY);
      ctx.rotate(-(angle * Math.PI) / 180);
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, -10, 45, 20);
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, v0, angle, gravity, showVectors]);

  const stats = {
    height: Math.max(0, ...pathRef.current.map(p => (600 - p.y) / 5)).toFixed(1),
    range: pathRef.current.length > 0 ? ((pathRef.current[pathRef.current.length-1].x - 60) / 5).toFixed(1) : "0.0",
    time: timeRef.current.toFixed(2)
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#050505] relative overflow-hidden text-white">
      <div className="flex-1 relative order-2 lg:order-1">
        <canvas ref={canvasRef} className="w-full h-full" />
        <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden absolute bottom-6 right-6 z-40 p-4 bg-indigo-600 rounded-full shadow-2xl text-white"><Settings className="w-6 h-6" /></button>
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 lg:relative lg:inset-auto lg:w-80 z-30 flex flex-col bg-zinc-950/90 backdrop-blur-3xl border-l border-white/5 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
               <div className="flex lg:hidden justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Parameter</span>
                  <button onClick={() => setShowSidebar(false)} className="p-2"><X className="w-5 h-5" /></button>
               </div>

               <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-sky-400" /><span className="text-[10px] font-black uppercase tracking-widest">Telemetri</span></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col"><span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Tinggi</span><span className="text-sm font-black text-white">{stats.height} m</span></div>
                     <div className="flex flex-col text-right"><span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Jarak</span><span className="text-sm font-black text-emerald-400">{stats.range} m</span></div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kecepatan (v₀)</label><span className="text-xs font-black text-sky-400">{v0} m/s</span></div>
                     <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="0" max="100" value={v0} onChange={(e) => {setV0(parseInt(e.target.value)); reset();}} />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sudut (θ)</label><span className="text-xs font-black text-rose-400">{angle}°</span></div>
                     <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="0" max="90" value={angle} onChange={(e) => {setAngle(parseInt(e.target.value)); reset();}} />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center"><label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Gravitasi</label><span className="text-xs font-black text-emerald-400">{gravity.toFixed(1)}</span></div>
                     <div className="grid grid-cols-2 gap-2"><button onClick={() => setGravity(9.8)} className="py-2 bg-white/5 rounded-lg text-[8px] font-bold uppercase">Bumi</button><button onClick={() => setGravity(1.6)} className="py-2 bg-white/5 rounded-lg text-[8px] font-bold uppercase">Bulan</button></div>
                  </div>
               </div>

               <div className="pt-8 flex gap-3">
                  <button onClick={fire} className="flex-1 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"><Zap className="w-4 h-4 fill-current" /> TEMBAK</button>
                  <button onClick={reset} className="p-4 bg-zinc-800 text-white rounded-2xl"><RotateCcw className="w-4 h-4" /></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
