"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Anchor } from "lucide-react";
import Link from "next/link";

export default function HukumArchimedes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [fluidDensity, setFluidDensity] = useState(1000); // kg/m^3 (Water)
  const [objectDensity, setObjectDensity] = useState(700); // kg/m^3 (Wood)
  const [objectVolume, setObjectVolume] = useState(1); // m^3

  // Physics Logic
  const g = 9.8;
  const weight = objectDensity * objectVolume * g; // W = rho_obj * V * g
  
  // V_submerged = W / (rho_fluid * g) = (rho_obj * V) / rho_fluid
  let vSub = objectVolume * (objectDensity / fluidDensity);
  if (vSub > objectVolume) vSub = objectVolume; // sinking
  
  const buoyantForce = fluidDensity * vSub * g;
  const subRatio = vSub / objectVolume;

  // Animation Refs
  const currentYRef = useRef(0);
  const targetYRef = useRef(0);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const animate = () => {
      setWaveOffset(prev => (prev + 0.05) % (Math.PI * 2));

      const diff = targetYRef.current - currentYRef.current;
      if (Math.abs(diff) > 0.1) {
        currentYRef.current += diff * 0.05;
      } else {
        currentYRef.current = targetYRef.current;
      }

      requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
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

      // Tank Dimensions
      const tankW = 340;
      const tankH = 400;
      const tankX = cx - tankW / 2;
      const tankY = cy - tankH / 4;
      const waterLevel = tankY + 100;
      const waterH = tankH - 100;

      const boxSize = 80 + objectVolume * 10;

      // Update TargetY
      let tY = 0;
      if (objectDensity < fluidDensity) {
        tY = waterLevel - boxSize + (subRatio * boxSize);
      } else if (objectDensity === fluidDensity) {
        tY = waterLevel + 50;
      } else {
        tY = tankY + tankH - boxSize - 4;
      }
      targetYRef.current = tY;

      if (currentYRef.current === 0) currentYRef.current = tY;

      // --- Draw Tank Back ---
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(tankX, tankY, tankW, tankH);

      // --- Draw Water ---
      ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
      ctx.fillRect(tankX, waterLevel, tankW, waterH);
      
      ctx.beginPath();
      ctx.moveTo(tankX, waterLevel);
      for (let x = 0; x <= tankW; x++) {
         const y = waterLevel + Math.sin(x/25 + waveOffset) * 3;
         ctx.lineTo(tankX + x, y);
      }
      ctx.lineTo(tankX + tankW, tankY + tankH);
      ctx.lineTo(tankX, tankY + tankH);
      ctx.fill();

      // --- Draw Object (Box) ---
      const bx = cx - boxSize/2;
      const by = currentYRef.current;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 20;
      
      let boxColor = "#d97706";
      if (objectDensity > 1200) boxColor = "#52525b";
      if (objectDensity > 2000) boxColor = "#27272a";

      const boxGrad = ctx.createLinearGradient(bx, by, bx + boxSize, by + boxSize);
      boxGrad.addColorStop(0, boxColor);
      boxGrad.addColorStop(1, "#18181b");
      ctx.fillStyle = boxGrad;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxSize, boxSize, 4);
      ctx.fill();
      
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(bx + 5, by + 5, boxSize - 10, 4);
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${objectDensity}kg/m³`, cx, by + boxSize/2 + 5);

      // Forces
      const arrowX = cx;
      const centerY = by + boxSize/2;
      const wLen = 60;
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(arrowX - 10, centerY); ctx.lineTo(arrowX - 10, centerY + wLen); ctx.stroke();
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath(); ctx.moveTo(arrowX - 10, centerY + wLen); ctx.lineTo(arrowX - 15, centerY + wLen - 8); ctx.lineTo(arrowX - 5, centerY + wLen - 8); ctx.fill();
      ctx.font = "bold 9px Inter";
      ctx.fillText("W", arrowX - 10, centerY + wLen + 12);

      const bLen = 60 * (buoyantForce / weight);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(arrowX + 10, centerY); ctx.lineTo(arrowX + 10, centerY - bLen); ctx.stroke();
      ctx.fillStyle = "#10b981";
      ctx.beginPath(); ctx.moveTo(arrowX + 10, centerY - bLen); ctx.lineTo(arrowX + 5, centerY - bLen + 8); ctx.lineTo(arrowX + 15, centerY - bLen + 8); ctx.fill();
      ctx.fillText("Fa", arrowX + 10, centerY - bLen - 5);

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tankX, tankY);
      ctx.lineTo(tankX, tankY + tankH);
      ctx.lineTo(tankX + tankW, tankY + tankH);
      ctx.lineTo(tankX + tankW, tankY);
      ctx.stroke();
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [fluidDensity, objectDensity, objectVolume, waveOffset, buoyantForce, weight, subRatio]);

  const reset = () => {
    setObjectDensity(700);
    setFluidDensity(1000);
    setObjectVolume(1);
  };

  let statusText = "Melayang (Seimbang)";
  let statusColor = "text-yellow-400";
  if (objectDensity < fluidDensity) { statusText = "Mengapung"; statusColor = "text-emerald-400"; }
  else if (objectDensity > fluidDensity) { statusText = "Tenggelam"; statusColor = "text-rose-400"; }

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Hukum Archimedes</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Gaya Apung • Fisika</span>
          </div>
        </div>
      </div>

      {/* TOP STATUS BADGE (Centered on remaining space) */}
      <div className="absolute top-20 lg:right-80 lg:left-0 flex justify-center z-10 pointer-events-none w-full lg:w-[calc(100%-320px)]">
         <div className="glass-card px-8 py-3 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl flex items-center gap-4 bg-white/5 pointer-events-auto">
            <div className={`w-3 h-3 rounded-full animate-pulse ${statusColor.replace('text-', 'bg-')}`} />
            <span className={`text-sm font-black uppercase tracking-widest ${statusColor}`}>STATUS: {statusText}</span>
         </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Gaya</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Berat Benda (W)</span>
                       <span className="text-lg font-black text-rose-400">{weight.toFixed(0)} N</span>
                    </div>
                    <Move className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Gaya Apung (Fa)</span>
                       <span className="text-lg font-black text-emerald-400">{buoyantForce.toFixed(0)} N</span>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Volume Tercelup</span>
                       <span className="text-lg font-black text-sky-400">{(subRatio * 100).toFixed(0)}%</span>
                    </div>
                    <Droplets className="w-5 h-5 text-sky-500/50" />
                 </div>
              </div>
           </div>

           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Variabel</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Massa Jenis Cairan: {fluidDensity}</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="500" max="1500" step="50" value={fluidDensity} onChange={(e) => setFluidDensity(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Massa Jenis Benda: {objectDensity}</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="100" max="2500" step="50" value={objectDensity} onChange={(e) => setObjectDensity(parseInt(e.target.value))} />
                 <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Gabus</span><span>Kayu</span><span>Besi</span></div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Volume Benda: {objectVolume.toFixed(1)} m³</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0.5" max="5" step="0.5" value={objectVolume} onChange={(e) => setObjectVolume(parseFloat(e.target.value))} />
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
