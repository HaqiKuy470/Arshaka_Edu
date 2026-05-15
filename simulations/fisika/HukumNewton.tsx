"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope } from "lucide-react";
import Link from "next/link";

interface PhysicsState {
  x: number;
  v: number;
  a: number;
  fNet: number;
}

export default function HukumNewton() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Parameters
  const [mass, setMass] = useState(20);
  const [appliedForce, setAppliedForce] = useState(0);
  const [frictionMu, setFrictionMu] = useState(0.2);
  const [showVectors, setShowVectors] = useState(true);

  const animationRef = useRef(0);
  const stateRef = useRef<PhysicsState>({ x: 0, v: 0, a: 0, fNet: 0 });
  const lastUpdateRef = useRef(Date.now());

  const reset = () => {
    stateRef.current = { x: 0, v: 0, a: 0, fNet: 0 };
    setIsRunning(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gravity = 9.8;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      
      const groundY = arenaH - 150;
      const cx = arenaW / 2;

      const now = Date.now();
      const dt = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      // --- Physics Core ($F = ma$) ---
      const weight = mass * gravity;
      const normalForce = weight;
      const maxStaticFriction = frictionMu * normalForce;
      
      let frictionF = 0;
      let netF = 0;

      // Friction Logic
      if (Math.abs(stateRef.current.v) < 0.01) {
         // Static Case
         if (Math.abs(appliedForce) > maxStaticFriction) {
            frictionF = Math.sign(appliedForce) * -maxStaticFriction;
            netF = appliedForce + frictionF;
         } else {
            frictionF = -appliedForce;
            netF = 0;
            stateRef.current.v = 0;
         }
      } else {
         // Kinetic Case
         frictionF = Math.sign(stateRef.current.v) * -maxStaticFriction;
         netF = appliedForce + frictionF;
         
         // Stop if friction overcomes motion
         if (Math.abs(netF) < 0.1 && Math.abs(stateRef.current.v) < 0.5) {
            stateRef.current.v = 0;
            netF = 0;
         }
      }

      const accel = netF / mass;
      stateRef.current.a = accel;
      stateRef.current.fNet = netF;

      if (isRunning) {
         stateRef.current.v += accel * dt * 60; // Scale dt for visibility
         stateRef.current.x += stateRef.current.v * dt * 10;
         
         // Loop background
         if (stateRef.current.x > arenaW) stateRef.current.x = -arenaW;
         if (stateRef.current.x < -arenaW) stateRef.current.x = arenaW;
      }

      // --- Drawing ---
      // Ground with motion lines
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, groundY, arenaW, 150);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(arenaW, groundY); ctx.stroke();
      
      // Speed lines
      if (Math.abs(stateRef.current.v) > 1) {
         ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
         for (let i = 0; i < 10; i++) {
            const lx = (i * 200 + t * stateRef.current.v * 10) % arenaW;
            ctx.beginPath(); ctx.moveTo(lx, groundY + 20 + i*10); ctx.lineTo(lx + 50, groundY + 20 + i*10); ctx.stroke();
         }
      }

      const boxSize = 80 + mass;
      const boxX = cx + stateRef.current.x - boxSize/2;
      const boxY = groundY - boxSize;

      // Draw Object
      ctx.save();
      ctx.shadowBlur = 15; ctx.shadowColor = "rgba(139, 92, 246, 0.3)";
      ctx.fillStyle = "#27272a";
      ctx.fillRect(boxX, boxY, boxSize, boxSize);
      ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxSize, boxSize);
      
      // Box Texture
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath(); ctx.moveTo(boxX, boxY); ctx.lineTo(boxX + boxSize, boxY + boxSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(boxX + boxSize, boxY); ctx.lineTo(boxX, boxY + boxSize); ctx.stroke();
      
      ctx.fillStyle = "white"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText(`${mass} kg`, boxX + boxSize/2, boxY + boxSize/2 + 5);
      ctx.restore();

      // --- Vectors ---
      if (showVectors) {
         const vecY = boxY + boxSize/2;
         const vecX = boxX + boxSize/2;
         
         // Fa (Green)
         if (appliedForce !== 0) drawVector(ctx, vecX, vecY, appliedForce, "#10b981", "Fa");
         // Ff (Red)
         if (frictionF !== 0) drawVector(ctx, vecX, groundY - 5, frictionF, "#f43f5e", "Ff");
         // W (Blue)
         drawVectorVert(ctx, vecX, vecY, weight, "#3b82f6", "W");
         // Fn (Yellow)
         drawVectorVert(ctx, vecX, boxY, -normalForce, "#eab308", "Fn");
      }

      // HUD Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
      ctx.fillText("HUKUM II NEWTON: ΣF = m · a", cx, 100);
    };

    const drawVector = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, color: string, label: string) => {
       if (Math.abs(len) < 1) return;
       const sLen = len * 1.5;
       ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
       ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sLen, y); ctx.stroke();
       // Head
       const dir = Math.sign(len);
       ctx.beginPath(); ctx.moveTo(x + sLen, y); ctx.lineTo(x + sLen - 8*dir, y - 5); ctx.lineTo(x + sLen - 8*dir, y + 5); ctx.fill();
       ctx.font = "bold 9px Inter"; ctx.fillText(`${label}: ${Math.abs(len).toFixed(0)}N`, x + sLen/2, y - 10);
    };

    const drawVectorVert = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, color: string, label: string) => {
       const sLen = len * 0.5;
       ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
       ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + sLen); ctx.stroke();
       const dir = Math.sign(len);
       ctx.beginPath(); ctx.moveTo(x, y + sLen); ctx.lineTo(x - 5, y + sLen - 8*dir); ctx.lineTo(x + 5, y + sLen - 8*dir); ctx.fill();
    };

    const t = 0; // for loop
    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, mass, appliedForce, frictionMu, showVectors]);

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Hukum Newton</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dinamika • Gaya Gesek • Inersia</span>
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
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Dinamika</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Percepatan (a)</span>
                    <span className="text-sm font-black text-white">{stateRef.current.a.toFixed(2)} m/s²</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Kecepatan (v)</span>
                    <span className="text-sm font-black text-emerald-400">{stateRef.current.v.toFixed(1)} m/s</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Gaya Netto (ΣF)</span>
                    <span className="text-sm font-black text-amber-400">{stateRef.current.fNet.toFixed(0)} N</span>
                 </div>
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Gaya & Massa</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Gaya Dorong (Fa)</label>
                       <span className="text-xs font-black text-emerald-400">{appliedForce} N</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400" min="-200" max="200" step="1" value={appliedForce} onChange={(e) => setAppliedForce(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Massa Benda (m)</label>
                       <span className="text-xs font-black text-indigo-400">{mass} kg</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-400" min="5" max="100" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Koefisien Gesek (μ)</label>
                       <span className="text-xs font-black text-rose-400">{frictionMu.toFixed(2)}</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="0" max="1" step="0.01" value={frictionMu} onChange={(e) => setFrictionMu(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Toggle Vectors */}
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Visualisasi Vektor</span>
              </div>
              <button onClick={() => setShowVectors(!showVectors)} className={`w-10 h-5 rounded-full relative transition-all ${showVectors ? 'bg-sky-500' : 'bg-zinc-700'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showVectors ? 'right-1' : 'left-1'}`} />
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hukum Dinamika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Hukum I (Inersia):</strong> Benda akan tetap diam jika gaya dorong tidak melebihi ambang batas gaya gesek statis.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Hukum II:</strong> Percepatan berbanding lurus dengan gaya netto ($\Sigma F$) dan berbanding terbalik dengan massa ($m$).
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
