"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, FlaskConical, Beaker } from "lucide-react";
import Link from "next/link";

export default function Viskositas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Settings
  const [fluid, setFluid] = useState<"water" | "oil" | "honey">("water");
  const [ballRadius, setBallRadius] = useState(10); // mm
  const [ballDensity, setBallDensity] = useState(7800); // kg/m^3 (Steel)

  // Fluid Data
  const fluidData = {
    water: { eta: 1, rho: 1000, name: "Air", color: "rgba(14, 165, 233, 0.3)", surf: "#38bdf8" },
    oil: { eta: 15, rho: 900, name: "Oli Mesin", color: "rgba(234, 179, 8, 0.5)", surf: "#fbbf24" },
    honey: { eta: 80, rho: 1400, name: "Madu", color: "rgba(180, 83, 9, 0.7)", surf: "#d97706" }
  };

  const { eta, rho: rhoF } = fluidData[fluid];
  const g = 9.8;
  const r = ballRadius / 1000; // to meters
  
  // Terminal Velocity: vt = (2 * r^2 * g * (rhoB - rhoF)) / (9 * eta * 1e-3)
  // Scaled for visualization
  const vt = (2 * Math.pow(r, 2) * g * (ballDensity - rhoF)) / (9 * (eta * 0.1)); 
  
  // Animation State
  const [pos, setPos] = useState(0);
  const [vel, setVel] = useState(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef(0);

  useEffect(() => {
    if (isRunning && pos < 400) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min(0.032, (timestamp - lastTimeRef.current) / 1000); // capped dt
        lastTimeRef.current = timestamp;

        // Simplified Euler for terminal velocity approach: v_new = v + (vt - v) * (some_factor)
        // More realistic: F_net = W - Fa - Fs => m*a = mg - rhoF*Vg - 6*pi*eta*r*v
        const mass = (4/3) * Math.PI * Math.pow(r, 3) * ballDensity;
        const buoyancy = (4/3) * Math.PI * Math.pow(r, 3) * rhoF * g;
        const weight = mass * g;
        const stokesDrag = 6 * Math.PI * (eta * 0.05) * r * vel;
        
        const acc = (weight - buoyancy - stokesDrag) / mass;
        const newVel = vel + acc * dt;
        const newPos = pos + newVel * 50 * dt; // scaled for pixels

        setVel(newVel);
        setPos(Math.min(420, newPos));

        if (newPos < 420) {
           animationRef.current = requestAnimationFrame(update);
        } else {
           setIsRunning(false);
        }
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, vel, pos, vt, eta, r, ballDensity, rhoF]);

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
      const cy = 100; // top of tube

      // --- Draw Graduate Cylinder ---
      const tubeW = 100;
      const tubeH = 450;
      const tx = cx - tubeW/2;
      
      // Tube Body Glass
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(tx, cy, tubeW, tubeH);
      
      // Markings
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let h = 0; h <= tubeH; h += 50) {
         ctx.beginPath();
         ctx.moveTo(tx, cy + h);
         ctx.lineTo(tx + 15, cy + h);
         ctx.stroke();
         ctx.fillStyle = "rgba(255,255,255,0.2)";
         ctx.font = "8px monospace";
         ctx.fillText(`${450 - h}ml`, tx + 20, cy + h + 3);
      }

      // --- Draw Liquid ---
      const liquidInfo = fluidData[fluid];
      ctx.fillStyle = liquidInfo.color;
      ctx.fillRect(tx + 2, cy + 20, tubeW - 4, tubeH - 20);
      
      // Surface highlight
      ctx.strokeStyle = liquidInfo.surf;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx + 2, cy + 20);
      ctx.lineTo(tx + tubeW - 2, cy + 20);
      ctx.stroke();

      // --- Draw Falling Ball ---
      const ballY = cy + 20 + pos;
      const drawR = ballRadius;

      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      const ballGrad = ctx.createRadialGradient(cx - drawR/3, ballY - drawR/3, 2, cx, ballY, drawR);
      ballGrad.addColorStop(0, "#d1d5db");
      ballGrad.addColorStop(1, "#374151");
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(cx, ballY, drawR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- Forces Visualization ---
      if (pos > 1 && pos < 415) {
         const arrowX = cx + tubeW / 2 + 30;
         const fLen = 40;
         
         // Weight (Down)
         ctx.strokeStyle = "#f43f5e";
         ctx.lineWidth = 2;
         ctx.beginPath(); ctx.moveTo(arrowX - 5, ballY); ctx.lineTo(arrowX - 5, ballY + fLen); ctx.stroke();
         ctx.fillStyle = "#f43f5e";
         ctx.beginPath(); ctx.moveTo(arrowX - 5, ballY + fLen); ctx.lineTo(arrowX - 9, ballY + fLen - 5); ctx.lineTo(arrowX - 1, ballY + fLen - 5); ctx.fill();
         
         // Stokes Drag + Buoyancy (Up)
         const dragRatio = vel / vt;
         const dragLen = fLen * dragRatio;
         ctx.strokeStyle = "#10b981";
         ctx.beginPath(); ctx.moveTo(arrowX + 5, ballY); ctx.lineTo(arrowX + 5, ballY - dragLen); ctx.stroke();
         ctx.fillStyle = "#10b981";
         ctx.beginPath(); ctx.moveTo(arrowX + 5, ballY - dragLen); ctx.lineTo(arrowX + 1, ballY - dragLen + 5); ctx.lineTo(arrowX + 9, ballY - dragLen + 5); ctx.fill();
         
         ctx.fillStyle = "rgba(255,255,255,0.4)";
         ctx.font = "bold 9px Inter";
         ctx.textAlign = "left";
         ctx.fillText("W", arrowX - 5, ballY + fLen + 12);
         ctx.fillText("Fs", arrowX + 5, ballY - dragLen - 5);
      }

      // --- Tube Walls ---
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 3;
      ctx.strokeRect(tx, cy, tubeW, tubeH);
    };

    render();
  }, [fluid, pos, vel, ballRadius, vt]);

  const reset = () => {
    setIsRunning(false);
    setPos(0);
    setVel(0);
    lastTimeRef.current = 0;
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Viskositas</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Stokes • Fisika</span>
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
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Viskos</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kecepatan Terminal (vt)</span>
                       <span className="text-xl font-black text-emerald-400">{vt.toFixed(1)} <span className="text-[10px] text-zinc-500 font-bold">m/s</span></span>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kecepatan Saat Ini</span>
                       <span className="text-xl font-black text-white">{vel.toFixed(2)} <span className="text-[10px] text-zinc-500 font-bold">m/s</span></span>
                    </div>
                    <Gauge className="w-5 h-5 text-zinc-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Viskositas (η)</span>
                       <span className="text-xl font-black text-amber-400">{eta} <span className="text-[10px] text-zinc-500 font-bold">mPa·s</span></span>
                    </div>
                    <Droplets className="w-5 h-5 text-amber-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <FlaskConical className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jenis Fluida</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {Object.entries(fluidData).map(([key, f]) => (
                   <button key={key} onClick={() => {setFluid(key as any); reset();}} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${fluid === key ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                      <Beaker className={`w-5 h-5 mb-1 ${f.surf === '#38bdf8' ? 'text-sky-400' : f.surf === '#fbbf24' ? 'text-amber-400' : 'text-orange-500'}`} />
                      <span className="text-[8px] font-black uppercase text-zinc-400">{f.name}</span>
                   </button>
                 ))}
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jari-jari Bola: {ballRadius} mm</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="5" max="25" step="1" value={ballRadius} onChange={(e) => {setBallRadius(parseInt(e.target.value)); reset();}} />
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(true)} disabled={isRunning || pos >= 415} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning || pos >= 415 ? 'bg-zinc-800 text-zinc-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                <Play className={`w-5 h-5 ${isRunning ? '' : 'fill-current'}`}/> Jatuhkan Bola
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Ulangi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
