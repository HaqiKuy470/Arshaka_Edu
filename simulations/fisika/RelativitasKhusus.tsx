"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Rocket, Clock, Globe } from "lucide-react";
import Link from "next/link";

interface Star {
  x: number;
  y: number;
  z: number;
}

export default function RelativitasKhusus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [velocity, setVelocity] = useState(0.8); // 0 to 0.999c
  const [showStarfield, setShowStarfield] = useState(true);

  const animationRef = useRef(0);
  const timeRef = useRef(0);
  const starsRef = useRef<Star[]>([]);

  // Lorentz Calculations
  const gamma = 1 / Math.sqrt(1 - velocity * velocity);
  const lengthFactor = 1 / gamma;

  useEffect(() => {
    // Init stars
    const s: Star[] = [];
    for (let i = 0; i < 400; i++) {
       s.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 2000
       });
    }
    starsRef.current = s;
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
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      if (isRunning) timeRef.current += 0.02;
      const t = timeRef.current;

      // --- Draw Starfield (Stationary Observer perspective) ---
      if (showStarfield) {
         ctx.save();
         ctx.translate(cx, cy);
         const speedFactor = velocity * 40;
         starsRef.current.forEach(s => {
            s.z -= speedFactor;
            if (s.z <= 1) s.z = 2000;
            
            const px = s.x / (s.z / 1000);
            const py = s.y / (s.z / 1000);
            const size = (1 - s.z / 2000) * 3;
            const alpha = 1 - s.z / 2000;
            
            // Relativistic stretch
            const stretch = velocity * 50 * (1 - s.z / 2000);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(px, py, size + stretch, size, 0, 0, Math.PI * 2);
            ctx.fill();
         });
         ctx.restore();
      }

      // --- Draw Optical Bench / Reference Frames ---
      // Frame 1: Earth (Stationary)
      const frameHeight = 220;
      const earthY = cy - 150;
      const shipY = cy + 150;

      // Background Frames
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.roundRect(50, earthY - frameHeight/2, arenaW - 100, frameHeight, 20);
      ctx.roundRect(50, shipY - frameHeight/2, arenaW - 100, frameHeight, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"; ctx.stroke();

      // --- Draw Earth Observation (Stationary Frame) ---
      const earthClockX = 150;
      const earthClockT = t;
      drawHoloClock(ctx, earthClockX, earthY, earthClockT, "JAM BUMI (PROPER TIME)", "#10b981");

      // --- Draw Moving Spaceship (Observed from Earth) ---
      const shipProperL = 160;
      const shipObservedL = shipProperL * lengthFactor;
      const shipSpeed = velocity * 15;
      const shipX = (t * shipSpeed * 20) % (arenaW + 400) - 200;
      
      ctx.save();
      ctx.translate(shipX, earthY);
      drawSpaceship(ctx, shipObservedL, "#38bdf8", true);
      ctx.restore();

      // --- Draw Pilot Observation (Moving Frame) ---
      const pilotClockX = 150;
      const pilotClockT = t; // To the pilot, his own clock is normal
      drawHoloClock(ctx, pilotClockX, shipY, pilotClockT, "JAM PILOT (PROPER TIME)", "#38bdf8");

      // Ship stays stationary in its own frame
      ctx.save();
      ctx.translate(cx, shipY);
      drawSpaceship(ctx, shipProperL, "#38bdf8", false);
      ctx.restore();

      // --- Secondary Clock: Earth's view of Pilot Clock ---
      const earthViewOfPilotX = arenaW - 150;
      const dilutedT = t / gamma; // Time dilation: observed time is slower
      drawHoloClock(ctx, earthViewOfPilotX, earthY, dilutedT, "JAM PILOT (DILATASI)", "#f43f5e");

      // Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter"; ctx.textAlign = "left";
      ctx.fillText("PERSPEKTIF PENGAMAT DIAM (BUMI)", 70, earthY - 80);
      ctx.fillText("PERSPEKTIF PENGAMAT BERGERAK (PILOT)", 70, shipY - 80);
    };

    const drawHoloClock = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number, label: string, color: string) => {
       ctx.save();
       ctx.translate(x, y);
       ctx.strokeStyle = color;
       ctx.lineWidth = 2;
       ctx.shadowBlur = 10; ctx.shadowColor = color;
       
       // Outer ring
       ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI * 2); ctx.stroke();
       ctx.setLineDash([2, 5]);
       ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.stroke();
       ctx.setLineDash([]);

       // Hands
       ctx.beginPath(); ctx.moveTo(0, 0); 
       ctx.lineTo(Math.sin(time * 2) * 20, -Math.cos(time * 2) * 20);
       ctx.stroke();
       
       ctx.fillStyle = "white"; ctx.font = "bold 8px Inter"; ctx.textAlign = "center";
       ctx.fillText(label, 0, 60);
       ctx.restore();
    };

    const drawSpaceship = (ctx: CanvasRenderingContext2D, length: number, color: string, stretched: boolean) => {
       ctx.save();
       ctx.shadowBlur = 20; ctx.shadowColor = color;
       ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
       ctx.beginPath();
       ctx.moveTo(-length/2, -15);
       ctx.lineTo(length/2 - 20, -15);
       ctx.lineTo(length/2, 0);
       ctx.lineTo(length/2 - 20, 15);
       ctx.lineTo(-length/2, 15);
       ctx.closePath();
       ctx.fill();
       ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
       
       // Thruster glow
       const thrusterGrad = ctx.createLinearGradient(-length/2, 0, -length/2 - 40, 0);
       thrusterGrad.addColorStop(0, color);
       thrusterGrad.addColorStop(1, "transparent");
       ctx.fillStyle = thrusterGrad;
       ctx.fillRect(-length/2 - 40, -10, 40, 20);
       ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, velocity, showStarfield, gamma, lengthFactor]);

  const reset = () => {
    setVelocity(0.8);
    timeRef.current = 0;
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Relativitas Khusus</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Albert Einstein • Dilatasi Waktu • Kontraksi Panjang</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Gamma HUD */}
           <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap className="w-12 h-12 text-white" />
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Faktor Lorentz (γ)</span>
                    <span className="text-3xl font-black text-white">{gamma.toFixed(3)}</span>
                 </div>
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Kontraksi Panjang</span>
                    <span className="text-xl font-black text-rose-400">{Math.round(lengthFactor * 100)}%</span>
                 </div>
                 <Ruler className="w-5 h-5 text-rose-400" />
              </div>
           </div>

           {/* Velocity Slider */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Gauge className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kecepatan (v/c)</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-sky-400">{velocity.toFixed(3)} c</span>
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Warp Speed</span>
                    </div>
                    <input type="range" className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="0" max="0.999" step="0.001" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Analysis Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Einstein</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Dilatasi Waktu:</strong> Bagi pengamat di Bumi, jam di dalam pesawat yang bergerak cepat terlihat berdetak lebih lambat.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Massa Relativistik:</strong> Semakin mendekati kecepatan cahaya, massa efektif benda akan meningkat secara drastis hingga tak terhingga pada v = c.
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
