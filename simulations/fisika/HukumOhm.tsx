"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, ZapOff, Cpu } from "lucide-react";
import Link from "next/link";

export default function HukumOhm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation State
  const [voltage, setVoltage] = useState(12); // V
  const [resistance, setResistance] = useState(10); // Ω
  
  // Derived Physics
  const current = voltage / resistance; // I = V / R
  const power = voltage * current; // P = V * I

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

      timeRef.current += current * 0.05; // Speed based on current

      // --- Draw Circuit Path (Rectangular) ---
      const rw = 400;
      const rh = 250;
      const tx = cx - rw/2;
      const ty = cy - rh/2;

      ctx.strokeStyle = "#18181b"; // zinc-950
      ctx.lineWidth = 12;
      ctx.lineJoin = "round";
      ctx.strokeRect(tx, ty, rw, rh);
      
      // Wire Glow
      ctx.strokeStyle = `rgba(251, 191, 36, ${Math.min(0.2, current * 0.1)})`;
      ctx.lineWidth = 16;
      ctx.strokeRect(tx, ty, rw, rh);

      // --- Battery (Bottom) ---
      const bx = cx;
      const by = cy + rh/2;
      ctx.fillStyle = "#09090b";
      ctx.fillRect(bx - 50, by - 25, 100, 50);
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - 50, by - 25, 100, 50);
      
      // Battery Glow (Positive side)
      ctx.fillStyle = "#ef4444";
      ctx.shadowBlur = 15 * (voltage / 24);
      ctx.shadowColor = "#ef4444";
      ctx.fillRect(bx - 50, by - 25, 20, 50);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, bx + 10, by + 5);

      // --- Resistor (Top) ---
      const rx = cx;
      const ry = cy - rh/2;
      ctx.fillStyle = "#18181b";
      ctx.fillRect(rx - 60, ry - 30, 120, 60);
      ctx.strokeStyle = "#3f3f46";
      ctx.strokeRect(rx - 60, ry - 30, 120, 60);
      
      // Zigzag Heating Effect
      const heatIntensity = Math.min(1, power / 50);
      ctx.strokeStyle = heatIntensity > 0.1 ? `rgba(249, 115, 22, ${0.3 + heatIntensity * 0.7})` : "#52525b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rx - 50, ry);
      for (let i = 0; i < 10; i++) {
        ctx.lineTo(rx - 40 + i * 10, ry + (i % 2 === 0 ? 15 : -15));
      }
      ctx.lineTo(rx + 50, ry);
      ctx.stroke();
      
      if (heatIntensity > 0.3) {
        ctx.shadowBlur = 20 * heatIntensity;
        ctx.shadowColor = "#f97316";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = "white";
      ctx.font = "bold 10px Inter";
      ctx.fillText(`${resistance} Ω`, rx, ry + 45);

      // --- Ammeter (Right) ---
      const ax = cx + rw/2;
      const ay = cy;
      ctx.fillStyle = "#09090b";
      ctx.beginPath();
      ctx.arc(ax, ay, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 10px Inter";
      ctx.fillText("AMMETER", ax, ay - 10);
      ctx.font = "bold 16px Inter";
      ctx.fillText(`${current.toFixed(2)}A`, ax, ay + 10);

      // --- Moving Electrons ---
      if (current > 0) {
        const perimeter = 2 * (rw + rh);
        const numElectrons = 25;
        const speed = current * 20;
        
        ctx.fillStyle = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#fbbf24";
        
        for (let i = 0; i < numElectrons; i++) {
          const dist = (timeRef.current * 100 + i * (perimeter / numElectrons)) % perimeter;
          let ex, ey;
          
          if (dist < rw) { // Top (L to R)
            ex = tx + dist; ey = ty;
          } else if (dist < rw + rh) { // Right (T to B)
            ex = tx + rw; ey = ty + (dist - rw);
          } else if (dist < 2 * rw + rh) { // Bottom (R to L)
            ex = tx + rw - (dist - rw - rh); ey = ty + rh;
          } else { // Left (B to T)
            ex = tx; ey = ty + rh - (dist - 2 * rw - rh);
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [voltage, resistance, current, power]);

  const reset = () => {
    setVoltage(12);
    setResistance(10);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Hukum Ohm</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Sirkuit Listrik • Tegangan & Arus</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Multimeter Dashboard */}
           <div className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-3xl shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                 <Activity className="w-3 h-3" /> Arus Rangkaian (I)
              </div>
              <div className="text-5xl font-black text-white text-center">
                {current.toFixed(2)}<span className="text-xl text-zinc-500 ml-1">A</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase text-zinc-500 border-t border-white/5 pt-4">
                 <div className="flex flex-col items-center">
                    <span>Power (P)</span>
                    <span className="text-sm text-amber-500 font-bold font-mono">{power.toFixed(1)} W</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span>Ohm Ratio</span>
                    <span className="text-sm text-zinc-300 font-bold font-mono">{(voltage/resistance).toFixed(1)}</span>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parameter Sirkuit</span>
              </div>
              
              <div className="space-y-4">
                 {/* Voltage Control */}
                 <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                          <Battery className="w-3 h-3 text-rose-500" />
                          <label className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Tegangan (V)</label>
                       </div>
                       <span className="text-xs font-mono text-rose-400">{voltage} V</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                      min="0" max="24" step="1" value={voltage} 
                      onChange={(e) => setVoltage(parseInt(e.target.value))} 
                    />
                 </div>

                 {/* Resistance Control */}
                 <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                          <Cpu className="w-3 h-3 text-amber-500" />
                          <label className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Hambatan (R)</label>
                       </div>
                       <span className="text-xs font-mono text-amber-400">{resistance} Ω</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" 
                      min="1" max="100" step="1" value={resistance} 
                      onChange={(e) => setResistance(parseInt(e.target.value))} 
                    />
                 </div>
              </div>
           </div>

           {/* Theoretical Highlight */}
           <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Hubungan Linear:</strong> Arus listrik (I) berbanding lurus dengan tegangan (V). Jika V naik, I naik.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Hukum Joule:</strong> Perhatikan efek pendaran pada hambatan. Semakin besar daya (P), hambatan akan semakin "panas" (berpendar oranye).
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Sirkuit
              </button>
              <div className="text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest pt-2">
                 V = I × R
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
