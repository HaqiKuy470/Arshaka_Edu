"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Layers, ZapOff } from "lucide-react";
import Link from "next/link";

export default function Kapasitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation State
  const [voltage, setVoltage] = useState(5); // Volts
  const [area, setArea] = useState(150); // relative cm2
  const [distance, setDistance] = useState(60); // relative mm
  const [dielectric, setDielectric] = useState(1); // K constant
  
  const [showField, setShowField] = useState(true);
  const [showCharges, setShowCharges] = useState(true);

  // Derived Physics
  // C = K * e0 * A / d
  const e0 = 8.854e-12;
  const capacitance = (dielectric * area * 1e-4) / (distance * 1e-3); // Farads (scaled)
  const charge = capacitance * voltage;
  const energy = 0.5 * capacitance * Math.pow(voltage, 2);

  const animationRef = useRef(0);
  const timeRef = useRef(0);

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

      timeRef.current += 0.02;

      // --- Draw Circuitry ---
      ctx.strokeStyle = "#27272a"; // zinc-800
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 150);
      ctx.lineTo(cx - 200, cy);
      ctx.lineTo(cx - distance/2, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 200, cy + 150);
      ctx.lineTo(cx + 200, cy);
      ctx.lineTo(cx + distance/2, cy);
      ctx.stroke();

      // Battery at bottom
      const bx = cx;
      const by = cy + 150;
      ctx.fillStyle = "#09090b";
      ctx.fillRect(bx - 40, by - 20, 80, 40);
      ctx.strokeStyle = "#3f3f46";
      ctx.strokeRect(bx - 40, by - 20, 80, 40);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(bx - 40, by - 20, 15, 40);
      ctx.fillStyle = "white"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, bx, by + 5);

      // --- Dielectric Material ---
      if (dielectric > 1) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.2)"; // emerald-500 alpha
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 2;
        const dWidth = distance - 10;
        const dHeight = area + 40;
        ctx.fillRect(cx - dWidth/2, cy - dHeight/2, dWidth, dHeight);
        ctx.strokeRect(cx - dWidth/2, cy - dHeight/2, dWidth, dHeight);
        
        ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
        ctx.font = "bold 9px Inter";
        ctx.fillText(`K = ${dielectric}`, cx, cy - dHeight/2 - 10);
      }

      // --- Plates ---
      const plateH = area + 20;
      const plateW = 12;
      
      const drawPlate = (x: number, isPositive: boolean) => {
        const color = isPositive ? "#ef4444" : "#3b82f6";
        const gradient = ctx.createLinearGradient(x - plateW/2, 0, x + plateW/2, 0);
        gradient.addColorStop(0, "#52525b");
        gradient.addColorStop(0.5, "#a1a1aa");
        gradient.addColorStop(1, "#3f3f46");

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15 * (voltage / 12);
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.roundRect(x - plateW/2, cy - plateH/2, plateW, plateH, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Charges
        if (showCharges && voltage > 0) {
          const numCharges = Math.min(15, Math.max(3, Math.floor(charge * 5e11)));
          ctx.fillStyle = "white";
          ctx.font = "bold 10px Inter";
          for (let i = 0; i < numCharges; i++) {
            const y = cy - plateH/2 + (i + 0.5) * (plateH / numCharges);
            ctx.fillText(isPositive ? "+" : "-", x + (isPositive ? -12 : 12), y);
          }
        }
      };

      drawPlate(cx - distance/2, true);
      drawPlate(cx + distance/2, false);

      // --- Electric Field lines ---
      if (showField && voltage > 0) {
        const numLines = Math.min(12, Math.max(3, Math.floor(charge * 4e11)));
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < numLines; i++) {
          const y = cy - plateH/2 + (i + 0.5) * (plateH / numLines);
          ctx.beginPath();
          ctx.moveTo(cx - distance/2 + 6, y);
          ctx.lineTo(cx + distance/2 - 6, y);
          ctx.stroke();

          // Field Arrow
          const arrowX = cx - distance/2 + 10 + ((timeRef.current * 50 + i * 20) % (distance - 20));
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.beginPath();
          ctx.moveTo(arrowX, y - 3);
          ctx.lineTo(arrowX + 5, y);
          ctx.lineTo(arrowX, y + 3);
          ctx.fill();
        }
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [voltage, area, distance, dielectric, showField, showCharges, charge]);

  const reset = () => {
    setVoltage(5);
    setArea(150);
    setDistance(60);
    setDielectric(1);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Kapasitor Keping Sejajar</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Penyimpanan Energi • Elektrostatis</span>
          </div>
        </div>
        <div className="flex gap-2 pointer-events-auto">
           <button onClick={() => setShowField(!showField)} className={`p-2.5 rounded-xl border transition-all ${showField ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
              <Waves className="w-5 h-5" />
           </button>
           <button onClick={() => setShowCharges(!showCharges)} className={`p-2.5 rounded-xl border transition-all ${showCharges ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-transparent border-white/5 text-zinc-600'}`}>
              <Zap className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Data Dashboard */}
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-center">
                 <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mb-1">Kapasitansi (C)</div>
                 <div className="text-xl font-black text-white">{(capacitance * 1e12).toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500 font-normal">pF</span></div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl text-center">
                 <div className="text-[8px] text-amber-500 font-black uppercase tracking-widest mb-1">Energi (U)</div>
                 <div className="text-xl font-black text-white">{(energy * 1e12).toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500 font-normal">pJ</span></div>
              </div>
           </div>

           {/* Battery Control */}
           <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Battery className="w-12 h-12 text-rose-500" />
              </div>
              <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-4">Tegangan Baterai (V)</div>
              <div className="text-4xl font-black text-white mb-4">{voltage}<span className="text-xl ml-1 text-zinc-500">V</span></div>
              <input 
                type="range" 
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                min="0" max="12" step="1" value={voltage} 
                onChange={(e) => setVoltage(parseInt(e.target.value))} 
              />
           </div>

           {/* Geometry Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Ruler className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Geometri Keping</span>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-sky-500/5 p-4 rounded-2xl border border-sky-500/10">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Luas (A)</label>
                       <span className="text-xs font-mono text-sky-400">{area} cm²</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="50" max="250" value={area} onChange={(e) => setArea(parseInt(e.target.value))} />
                 </div>

                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jarak (d)</label>
                       <span className="text-xs font-mono text-zinc-400">{distance} mm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="30" max="150" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Dielectric Control */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Layers className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Material Dielektrik</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {[
                   { name: "Vakum", k: 1 },
                   { name: "Kaca", k: 5 },
                   { name: "Keramik", k: 10 }
                 ].map(m => (
                   <button key={m.name} onClick={() => setDielectric(m.k)} className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${dielectric === m.k ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600 hover:border-white/10'}`}>
                      {m.name}
                   </button>
                 ))}
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Kapasitor menyimpan energi dalam medan listrik antar pelat. Kapasitansinya sebanding dengan luas pelat dan berbanding terbalik dengan jarak pisahnya."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-zinc-500 leading-relaxed text-center italic">
                 "C = K . ε₀ . A / d"
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
