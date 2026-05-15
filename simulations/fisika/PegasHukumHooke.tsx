"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Weight } from "lucide-react";
import Link from "next/link";

export default function PegasHukumHooke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [mass, setMass] = useState(20); // kg
  const [k, setK] = useState(100); // N/m
  const [gravity, setGravity] = useState(9.8); // m/s^2

  // Physics Logic
  const F = mass * gravity;
  const deltaX = F / k; // displacement in meters
  const Ep = 0.5 * k * Math.pow(deltaX, 2); // elastic potential energy

  // Animation State for smooth transitions
  const [currentDeltaX, setCurrentDeltaX] = useState(deltaX);
  const animationRef = useRef(0);

  useEffect(() => {
    const step = () => {
      setCurrentDeltaX(prev => {
        const diff = deltaX - prev;
        if (Math.abs(diff) < 0.001) return deltaX;
        return prev + diff * 0.1; // Lerp for smoothness
      });
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [deltaX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Offset cx to the left because of the sidebar
      const cx = (canvas.width - 320) / 2;
      const ceilingY = 60;
      const meterScale = 120; // Slightly reduced scale to fit more
      const unextendedLength = 120;
      const currentLength = unextendedLength + currentDeltaX * meterScale;

      // --- Draw Ceiling Support ---
      const beamW = 200;
      const beamH = 15;
      const beamGrad = ctx.createLinearGradient(cx - beamW/2, ceilingY - beamH, cx + beamW/2, ceilingY - beamH);
      beamGrad.addColorStop(0, "#27272a");
      beamGrad.addColorStop(0.5, "#52525b");
      beamGrad.addColorStop(1, "#27272a");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.roundRect(cx - beamW/2, ceilingY - beamH, beamW, beamH, 4);
      ctx.fill();

      // --- Draw Spring ---
      const springX = cx;
      const startY = ceilingY;
      const endY = ceilingY + currentLength;
      
      ctx.beginPath();
      const springGrad = ctx.createLinearGradient(springX - 20, 0, springX + 20, 0);
      springGrad.addColorStop(0, "#94a3b8");
      springGrad.addColorStop(0.5, "#f8fafc");
      springGrad.addColorStop(1, "#94a3b8");
      ctx.strokeStyle = springGrad;
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";

      const numTurns = 15;
      const pointsPerTurn = 20;
      const totalPoints = numTurns * pointsPerTurn;
      const springW = 25;

      ctx.moveTo(springX, startY);
      ctx.lineTo(springX, startY + 15);

      for (let i = 0; i <= totalPoints; i++) {
        const progress = i / totalPoints;
        const y = startY + 15 + progress * (currentLength - 30);
        const angle = i * (Math.PI * 2 / pointsPerTurn);
        const x = springX + Math.sin(angle) * springW;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(springX, endY);
      ctx.stroke();

      // --- Draw Equilibrium Line ---
      const eqY = startY + unextendedLength;
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx - 150, eqY); ctx.lineTo(cx + 150, eqY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 9px Inter";
      ctx.fillText("POSISI SETIMBANG", cx - 140, eqY - 8);

      // --- Draw Ruler/Measurement ---
      if (currentDeltaX > 0.02) {
        const rulerX = cx + 70;
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rulerX, eqY);
        ctx.lineTo(rulerX, endY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rulerX - 8, eqY); ctx.lineTo(rulerX + 8, eqY);
        ctx.moveTo(rulerX - 8, endY); ctx.lineTo(rulerX + 8, endY);
        ctx.stroke();
        ctx.fillStyle = "#f43f5e";
        ctx.font = "bold 11px monospace";
        ctx.fillText(`Δx = ${currentDeltaX.toFixed(2)}m`, rulerX + 15, eqY + (endY - eqY)/2);
      }

      // --- Draw Mass ---
      if (mass > 0) {
        const mw = 35 + mass * 0.4;
        const mh = 25 + mass * 0.25;
        const mx = cx - mw/2;
        const my = endY;

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, my + 8, 8, -Math.PI/2, Math.PI/2, false);
        ctx.stroke();

        const massGrad = ctx.createLinearGradient(mx, my, mx + mw, my);
        massGrad.addColorStop(0, "#f59e0b");
        massGrad.addColorStop(0.5, "#fbbf24");
        massGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = massGrad;
        ctx.beginPath();
        ctx.roundRect(mx, my + 12, mw, mh, 4);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Inter";
        ctx.textAlign = "center";
        ctx.fillText(`${mass}kg`, cx, my + 12 + mh/2 + 4);
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [currentDeltaX, mass]);

  const reset = () => {
    setMass(0);
    setK(100);
    setGravity(9.8);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Pegas & Hukum Hooke</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Elastisitas • Fisika</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar">
        
        <div className="p-6 space-y-6 pt-20">
           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Data</span>
              </div>
              
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Gaya Berat (F)</span>
                       <span className="text-lg font-black text-white font-mono">{F.toFixed(1)} N</span>
                    </div>
                    <Zap className="w-5 h-5 text-amber-500/50" />
                 </div>
                 
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Dislokasi (Δx)</span>
                       <span className="text-lg font-black text-rose-400 font-mono">{deltaX.toFixed(2)} m</span>
                    </div>
                    <Ruler className="w-5 h-5 text-rose-500/50" />
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Energi Potensial</span>
                       <span className="text-lg font-black text-emerald-400 font-mono">{Ep.toFixed(1)} J</span>
                    </div>
                    <Timer className="w-5 h-5 text-emerald-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Variabel</span>
              </div>

              {/* Mass Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase">Massa Beban: {mass}kg</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0" max="100" step="5" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
              </div>

              {/* K Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-sky-400 uppercase">Konstanta (k): {k} N/m</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="20" max="300" step="10" value={k} onChange={(e) => setK(parseInt(e.target.value))} />
              </div>

              {/* Gravity Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-rose-400 uppercase">Gravitasi: {gravity.toFixed(1)} m/s²</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="0" max="25" step="0.5" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] text-zinc-500 leading-relaxed text-center italic">
                    "Gaya yang bekerja pada pegas berbanding lurus dengan pertambahan panjangnya."
                 </p>
                 <div className="mt-2 text-center text-xs font-black text-white">F = k · Δx</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
