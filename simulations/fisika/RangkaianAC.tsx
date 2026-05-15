"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, ZapOff, Cpu, RefreshCw } from "lucide-react";
import Link from "next/link";

type ComponentType = "R" | "L" | "C";

export default function RangkaianAC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [frequency, setFrequency] = useState(50); // Hz
  const [component, setComponent] = useState<ComponentType>("R");
  const [value, setValue] = useState(50); // R(Ω), L(mH), or C(μF)
  
  const timeRef = useRef(0);
  const animationRef = useRef(0);

  // Constants
  const V_max = 100;
  
  // Physics Calculation
  const w = 2 * Math.PI * frequency;
  let phase = 0; // Phase shift in radians
  let reactance = 0;
  
  if (component === "R") {
    reactance = value;
    phase = 0;
  } else if (component === "L") {
    reactance = w * (value * 1e-3);
    phase = -Math.PI / 2;
  } else if (component === "C") {
    reactance = 1 / (w * (value * 1e-6));
    phase = Math.PI / 2;
  }

  const I_max = V_max / (reactance || 1);

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

      if (isRunning) timeRef.current += 0.016 * (frequency / 50);

      const t = timeRef.current;
      const omega = 2 * Math.PI; // Normalized for visual loop

      // --- Draw Oscilloscope (Top) ---
      const ow = 400;
      const oh = 150;
      const ox = cx - ow/2;
      const oy = cy - 180;
      
      ctx.fillStyle = "#09090b";
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = "#27272a";
      ctx.lineWidth = 1;
      // Grid
      for(let i=0; i<=10; i++) {
        ctx.beginPath(); ctx.moveTo(ox + i*(ow/10), oy); ctx.lineTo(ox + i*(ow/10), oy + oh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, oy + i*(oh/10)); ctx.lineTo(ox + ow, oy + i*(oh/10)); ctx.stroke();
      }

      // Sine Waves
      ctx.lineWidth = 3;
      // Voltage Wave (Red)
      ctx.beginPath();
      ctx.strokeStyle = "#ef4444";
      for (let x = 0; x < ow; x++) {
        const val = Math.sin((x / ow) * 4 * Math.PI - t * 10);
        ctx.lineTo(ox + x, oy + oh/2 - val * (oh/2 - 10));
      }
      ctx.stroke();

      // Current Wave (Blue)
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6";
      for (let x = 0; x < ow; x++) {
        const val = Math.sin((x / ow) * 4 * Math.PI - t * 10 + phase);
        ctx.lineTo(ox + x, oy + oh/2 - val * (oh/2 - 25));
      }
      ctx.stroke();

      // --- Draw Phasor Diagram (Bottom Left) ---
      const px = cx - 150;
      const py = cy + 100;
      const pr = 60;
      ctx.strokeStyle = "#27272a";
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px-pr, py); ctx.lineTo(px+pr, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py-pr); ctx.lineTo(px, py+pr); ctx.stroke();

      // V vector
      const vAngle = -t * 10;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(vAngle) * pr, py + Math.sin(vAngle) * pr);
      ctx.stroke();

      // I vector
      ctx.strokeStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(vAngle - phase) * pr * 0.8, py + Math.sin(vAngle - phase) * pr * 0.8);
      ctx.stroke();

      // --- Draw Circuit Diagram (Bottom Right) ---
      const ctx_circ = cx + 150;
      const cty_circ = cy + 100;
      const cw = 160, ch = 80;
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 4;
      ctx.strokeRect(ctx_circ - cw/2, cty_circ - ch/2, cw, ch);

      // AC Source
      ctx.fillStyle = "#09090b";
      ctx.beginPath(); ctx.arc(ctx_circ - cw/2, cty_circ, 20, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ctx_circ - cw/2 - 10, cty_circ);
      ctx.bezierCurveTo(ctx_circ - cw/2 - 5, cty_circ - 10, ctx_circ - cw/2 + 5, cty_circ + 10, ctx_circ - cw/2 + 10, cty_circ);
      ctx.stroke();

      // Component Icon
      const ix = ctx_circ + cw/2;
      const iy = cty_circ;
      ctx.fillStyle = "#09090b"; ctx.fillRect(ix - 25, iy - 30, 50, 60);
      
      if (component === "R") {
        ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ix, iy-20);
        for(let i=0; i<6; i++) ctx.lineTo(ix + (i%2===0?10:-10), iy - 20 + i*8);
        ctx.lineTo(ix, iy+20); ctx.stroke();
      } else if (component === "L") {
        ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ix, iy-25);
        for(let i=0; i<4; i++) ctx.arc(ix, iy-15 + i*10, 6, -Math.PI/2, Math.PI/2, true);
        ctx.lineTo(ix, iy+25); ctx.stroke();
      } else if (component === "C") {
        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ix, iy-20); ctx.lineTo(ix, iy-5);
        ctx.moveTo(ix-12, iy-5); ctx.lineTo(ix+12, iy-5);
        ctx.moveTo(ix-12, iy+5); ctx.lineTo(ix+12, iy+5);
        ctx.moveTo(ix, iy+5); ctx.lineTo(ix, iy+20);
        ctx.stroke();
      }

      // Electrons
      const currentInst = Math.sin(t * 10 - phase);
      const numElectrons = 15;
      const perimeter = 2 * (cw + ch);
      ctx.fillStyle = "#fbbf24";
      for (let i = 0; i < numElectrons; i++) {
        // Base position + oscillating offset
        const baseDist = i * (perimeter / numElectrons);
        const offset = currentInst * 20;
        const dist = (baseDist + offset + perimeter) % perimeter;
        let ex, ey;
        if (dist < cw) { ex = ctx_circ - cw/2 + dist; ey = cty_circ - ch/2; }
        else if (dist < cw + ch) { ex = ctx_circ + cw/2; ey = cty_circ - ch/2 + (dist - cw); }
        else if (dist < 2*cw + ch) { ex = ctx_circ + cw/2 - (dist - cw - ch); ey = cty_circ + ch/2; }
        else { ex = ctx_circ - cw/2; ey = cty_circ + ch/2 - (dist - 2*cw - ch); }
        ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI*2); ctx.fill();
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, frequency, component, value, phase]);

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Rangkaian Arus Bolak-Balik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Impedansi • Diagram Fasor • AC Circuits</span>
          </div>
        </div>
        <button onClick={() => setIsRunning(!isRunning)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all pointer-events-auto">
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Component Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Box className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Komponen</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {(["R", "L", "C"] as ComponentType[]).map(c => (
                   <button 
                     key={c} 
                     onClick={() => { setComponent(c); setValue(c === "R" ? 50 : c === "L" ? 100 : 47); }} 
                     className={`py-3 rounded-xl text-xs font-black transition-all border ${component === c ? 'bg-white/10 border-white/30 text-white shadow-lg scale-105' : 'bg-transparent border-white/5 text-zinc-500 opacity-50'}`}
                   >
                      {c === "R" ? "Resistor" : c === "L" ? "Induktor" : "Kapasitor"}
                   </button>
                 ))}
              </div>
           </div>

           {/* Analysis Panel */}
           <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Impedansi (Z)</span>
                    <span className="text-xl font-black text-white">{reactance.toFixed(1)} <span className="text-[10px] text-zinc-500 font-normal">Ω</span></span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-400" />
                 </div>
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Phase Angle (φ)</span>
                    <span className={`text-xl font-black ${phase === 0 ? 'text-white' : phase > 0 ? 'text-sky-400' : 'text-orange-400'}`}>
                      {(phase * 180 / Math.PI).toFixed(0)}°
                    </span>
                 </div>
                 <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                   {phase === 0 ? "In Phase" : phase > 0 ? "Leading" : "Lagging"}
                 </span>
              </div>
           </div>

           {/* Parameter Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Sirkuit</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Frequency (f)</label>
                       <span className="text-xs font-mono text-white">{frequency} Hz</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="10" max="200" step="5" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">
                         {component === "R" ? "Resistance (R)" : component === "L" ? "Inductance (L)" : "Capacitance (C)"}
                       </label>
                       <span className="text-xs font-mono text-white">{value} {component === "R" ? "Ω" : component === "L" ? "mH" : "μF"}</span>
                    </div>
                    <input 
                      type="range" 
                      className={`w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer ${component === 'R' ? 'accent-amber-400' : component === 'L' ? 'accent-orange-400' : 'accent-sky-400'}`} 
                      min="1" max="200" value={value} 
                      onChange={(e) => setValue(parseInt(e.target.value))} 
                    />
                 </div>
              </div>
           </div>

           {/* Insights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Sifat AC</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                {component === "R" && "Pada Resistor, tegangan dan arus sefase (φ = 0°). Energi diubah menjadi panas."}
                {component === "L" && "Pada Induktor, arus tertinggal (Lagging) 90° terhadap tegangan karena GGL balik."}
                {component === "C" && "Pada Kapasitor, arus mendahului (Leading) 90° terhadap tegangan saat pengisian muatan."}
              </p>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Dalam arus AC, polaritas berosilasi bolak-balik. Komponen Induktor membuat fasa arus tertinggal (lagging), sedangkan Kapasitor membuatnya mendahului (leading)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={() => { setFrequency(50); setComponent("R"); setValue(50); }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all text-xs font-bold flex items-center justify-center gap-2">
                 <RotateCcw className="w-3 h-3" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
