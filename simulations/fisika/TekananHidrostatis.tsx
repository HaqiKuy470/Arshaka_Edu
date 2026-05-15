"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Droplets, Thermometer, Waves } from "lucide-react";
import Link from "next/link";

export default function TekananHidrostatis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [depth, setDepth] = useState(5); // meters
  const [density, setDensity] = useState(1000); // kg/m^3
  const [gravity, setGravity] = useState(9.8); // m/s^2

  // Physics Logic
  const P_atm = 101.325; // kPa
  const P_h = (density * gravity * depth) / 1000; // kPa
  const P_total = P_h + P_atm;

  // Animation State
  const [waveOffset, setWaveOffset] = useState(0);
  const bubbles = useRef<{x: number, y: number, r: number, s: number}[]>([]);

  useEffect(() => {
    // Initialize bubbles
    bubbles.current = Array.from({length: 20}, () => ({
      x: Math.random() * 300 - 150,
      y: Math.random() * 400,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.5 + 0.5
    }));

    const animate = () => {
      setWaveOffset(prev => (prev + 0.05) % (Math.PI * 2));
      
      bubbles.current = bubbles.current.map(b => ({
        ...b,
        y: b.y < 0 ? 400 : b.y - b.s,
        x: b.x + Math.sin(b.y / 20) * 0.2
      }));

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

      const cx = (canvas.width - 320) / 2;
      const cy = canvas.height / 2;

      // Tank Dimensions
      const tankW = 320;
      const tankH = 450;
      const tankX = cx - tankW / 2;
      const tankY = cy - tankH / 2;

      // --- Draw Tank Back ---
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(tankX, tankY, tankW, tankH);

      // --- Draw Water ---
      const waterTop = tankY + 50;
      const waterH = tankH - 50;
      
      // Liquid Color based on density
      let liquidColor = "rgba(59, 130, 246, 0.4)"; // Water
      if (density < 800) liquidColor = "rgba(245, 158, 11, 0.4)"; // Gasoline
      if (density > 1200) liquidColor = "rgba(16, 185, 129, 0.4)"; // Honey/Syrup

      ctx.fillStyle = liquidColor;
      ctx.fillRect(tankX, waterTop, tankW, waterH);

      // Surface Wave
      ctx.beginPath();
      ctx.moveTo(tankX, waterTop);
      for (let x = 0; x <= tankW; x++) {
        const y = waterTop + Math.sin(x / 20 + waveOffset) * 4;
        ctx.lineTo(tankX + x, y);
      }
      ctx.lineTo(tankX + tankW, tankY + tankH);
      ctx.lineTo(tankX, tankY + tankH);
      ctx.fill();

      // Bubbles
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      bubbles.current.forEach(b => {
        ctx.beginPath();
        ctx.arc(cx + b.x, waterTop + b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Tank Front/Glass ---
      const glassGrad = ctx.createLinearGradient(tankX, tankY, tankX + tankW, tankY);
      glassGrad.addColorStop(0, "rgba(255,255,255,0.1)");
      glassGrad.addColorStop(0.1, "rgba(255,255,255,0.05)");
      glassGrad.addColorStop(0.5, "rgba(255,255,255,0.01)");
      glassGrad.addColorStop(0.9, "rgba(255,255,255,0.05)");
      glassGrad.addColorStop(1, "rgba(255,255,255,0.1)");
      ctx.fillStyle = glassGrad;
      ctx.fillRect(tankX, tankY, tankW, tankH);

      // Tank Edges
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 4;
      ctx.strokeRect(tankX, tankY, tankW, tankH);

      // Depth Markers
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "right";
      for (let i = 0; i <= 10; i++) {
        const y = waterTop + (i / 10) * (waterH - 20);
        ctx.fillRect(tankX + tankW - 15, y, 10, 1);
        ctx.fillText(`${i}m`, tankX + tankW - 20, y + 4);
      }

      // --- Draw Sensor Probe ---
      const meterScale = (waterH - 20) / 10;
      const sensorY = waterTop + depth * meterScale;
      
      // Probe Cable
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, tankY - 20);
      ctx.lineTo(cx, sensorY);
      ctx.stroke();

      // Sensor Head
      const headR = 18;
      const headGrad = ctx.createRadialGradient(cx - 5, sensorY - 5, 0, cx, sensorY, headR);
      headGrad.addColorStop(0, "#ef4444");
      headGrad.addColorStop(1, "#991b1b");
      ctx.fillStyle = headGrad;
      ctx.beginPath(); ctx.arc(cx, sensorY, headR, 0, Math.PI * 2); ctx.fill();
      
      // Sensor Display Overlay
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.beginPath(); ctx.roundRect(cx + 25, sensorY - 15, 70, 30, 4); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${P_h.toFixed(1)}`, cx + 60, sensorY - 2);
      ctx.font = "8px monospace";
      ctx.fillText("kPa", cx + 60, sensorY + 10);

      // Sensor Glow
      const glow = ctx.createRadialGradient(cx, sensorY, 0, cx, sensorY, 40);
      glow.addColorStop(0, "rgba(239, 68, 68, 0.2)");
      glow.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, sensorY, 40, 0, Math.PI * 2); ctx.fill();

    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [depth, density, waveOffset]);

  const reset = () => {
    setDepth(5);
    setDensity(1000);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Tekanan Hidrostatis</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Mekanika Fluida • Fisika</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        
        <div className="p-6 space-y-6 pt-20">
           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Tekanan</span>
              </div>
              
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Tekanan Hidrostatis (P_h)</span>
                       <span className="text-xl font-black text-white font-mono">{P_h.toFixed(1)} kPa</span>
                    </div>
                    <Droplets className="w-5 h-5 text-blue-500/50" />
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Tekanan Total (+Atm)</span>
                       <span className="text-xl font-black text-emerald-400 font-mono">{P_total.toFixed(1)} kPa</span>
                    </div>
                    <Thermometer className="w-5 h-5 text-emerald-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Waves className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Variabel</span>
              </div>

              {/* Depth Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kedalaman (h): {depth.toFixed(1)}m</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0" max="10" step="0.1" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))} />
              </div>

              {/* Density Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Massa Jenis (ρ): {density} kg/m³</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" min="500" max="1500" step="50" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} />
                 <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Bensin</span><span>Air</span><span>Madu</span></div>
              </div>

              {/* Gravity Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Gravitasi: {gravity.toFixed(1)} m/s²</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="1" max="25" step="0.5" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Tekanan yang dialami di dalam fluida diam bertambah besar seiring bertambahnya kedalaman air, massa jenis fluida, dan tarikan percepatan gravitasi."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] text-zinc-500 leading-relaxed text-center italic">
                    "Tekanan hidrostatik berbanding lurus dengan massa jenis cairan dan kedalamannya."
                 </p>
                 <div className="mt-2 text-center text-xs font-black text-white uppercase tracking-widest">P = ρ · g · h</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
