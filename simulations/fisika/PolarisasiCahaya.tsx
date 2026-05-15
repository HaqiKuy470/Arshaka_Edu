"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Eye } from "lucide-react";
import Link from "next/link";

export default function PolarisasiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [angle1, setAngle1] = useState(0); // Polarizer 1 (Degrees)
  const [angle2, setAngle2] = useState(90); // Polarizer 2 (Degrees)
  const [showWaves, setShowWaves] = useState(true);

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
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      if (isRunning) timeRef.current += 0.05;
      const t = timeRef.current;

      // --- Optical Bench Geometry ---
      const benchY = cy + 120;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, benchY); ctx.lineTo(arenaW - 100, benchY);
      ctx.stroke();

      // Malus's Law calculation
      const deltaTheta = Math.abs(angle2 - angle1);
      const deltaRad = (deltaTheta * Math.PI) / 180;
      const intensity = Math.pow(Math.cos(deltaRad), 2);

      // --- Stage Positions ---
      const xStart = 150;
      const xPol1 = cx - 120;
      const xPol2 = cx + 120;
      const xEnd = arenaW - 150;

      // --- Draw Wave Blocks ---
      const drawSineWave = (x1: number, x2: number, angle: number, amp: number, color: string, alpha: number) => {
         const rad = (angle * Math.PI) / 180;
         ctx.beginPath();
         ctx.strokeStyle = color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
         ctx.lineWidth = 2;
         for (let x = x1; x < x2; x += 2) {
            const phase = (x - xStart) * 0.1 - t * 2;
            const wave = Math.sin(phase) * amp;
            
            // 3D-ish projection
            const wx = x;
            const wy = cy - wave * Math.cos(rad);
            const wz = wave * Math.sin(rad) * 0.5; // Z-axis tilt
            
            if (x === x1) ctx.moveTo(wx + wz, wy);
            else ctx.lineTo(wx + wz, wy);
         }
         ctx.stroke();
      };

      // 1. Unpolarized (Random mix)
      if (showWaves) {
         for (let a = 0; a < 180; a += 45) {
            drawSineWave(xStart, xPol1, a, 30, "rgb(255, 255, 255)", 0.2);
         }
      }

      // 2. Linearly Polarized (After Pol 1)
      drawSineWave(xPol1, xPol2, angle1, 35, "rgb(56, 189, 248)", 0.8);

      // 3. Analyzed Polarized (After Pol 2)
      drawSineWave(xPol2, xEnd, angle2, 35 * Math.cos(deltaRad), "rgb(244, 63, 94)", intensity * 0.8 + 0.1);

      // --- Draw Polarizer Filters ---
      const drawFilter = (x: number, angle: number, color: string, label: string) => {
         ctx.save();
         ctx.translate(x, cy);
         
         // Frame
         ctx.fillStyle = "rgba(24, 24, 27, 0.8)";
         ctx.roundRect(-10, -80, 20, 160, 4);
         ctx.fill();
         ctx.strokeStyle = color;
         ctx.lineWidth = 2;
         ctx.stroke();

         // Slits indicating orientation
         const rad = (angle * Math.PI) / 180;
         ctx.beginPath();
         ctx.strokeStyle = color;
         ctx.lineWidth = 1;
         ctx.setLineDash([5, 5]);
         for (let i = -60; i <= 60; i += 15) {
            ctx.moveTo(Math.sin(rad) * i - Math.cos(rad)*8, -Math.cos(rad) * i - Math.sin(rad)*8);
            ctx.lineTo(Math.sin(rad) * i + Math.cos(rad)*8, -Math.cos(rad) * i + Math.sin(rad)*8);
         }
         ctx.stroke();
         ctx.setLineDash([]);

         // Label
         ctx.fillStyle = "white";
         ctx.font = "bold 9px Inter";
         ctx.textAlign = "center";
         ctx.fillText(label, 0, 95);
         ctx.restore();
      };

      drawFilter(xPol1, angle1, "#38bdf8", `POLARISATOR (${angle1}°)`);
      drawFilter(xPol2, angle2, "#f43f5e", `ANALISATOR (${angle2}°)`);

      // --- Intensity Result (End Screen) ---
      ctx.save();
      ctx.translate(xEnd + 40, cy);
      const glow = intensity * 40;
      ctx.shadowBlur = glow;
      ctx.shadowColor = "#eab308";
      ctx.fillStyle = intensity > 0.01 ? `rgba(234, 179, 8, ${intensity * 0.8 + 0.2})` : "#18181b";
      ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.stroke();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = "white"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText("HASIL", 0, 60);
      ctx.restore();

      // --- HUD Data ---
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter";
      ctx.textAlign = "left";
      ctx.fillText("SUMBER CAHAYA ACAK", xStart, cy - 100);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, angle1, angle2, showWaves]);

  const reset = () => {
    setAngle1(0);
    setAngle2(90);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Polarisasi Cahaya</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Malus • Filter Optik • Vektor Medan Listrik</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Malus HUD */}
           <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Beda Sudut (Δθ)</span>
                    <span className="text-2xl font-black text-white">{Math.abs(angle2 - angle1)}°</span>
                 </div>
                 <Activity className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Intensitas Relatif (I/I₀)</span>
                    <span className="text-2xl font-black text-amber-400">{Math.round(Math.pow(Math.cos(Math.abs(angle2 - angle1) * Math.PI / 180), 2) * 100)}%</span>
                 </div>
                 <Sun className="w-5 h-5 text-amber-400" />
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Filter className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rotasi Filter</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Polarisator 1</label>
                       <span className="text-xs font-mono text-sky-400">{angle1}°</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="0" max="180" step="5" value={angle1} onChange={(e) => setAngle1(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Analisator (Pol 2)</label>
                       <span className="text-xs font-mono text-rose-400">{angle2}°</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="0" max="180" step="5" value={angle2} onChange={(e) => setAngle2(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-rose-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hukum Malus</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Crossed Polarizers:</strong> Jika kedua filter membentuk sudut 90° tegak lurus, intensitas cahaya akan menjadi <span className="text-rose-500 font-bold">NOL</span> karena tidak ada komponen getaran yang sejajar.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Aplikasi:</strong> Konsep ini digunakan pada layar LCD, kacamata hitam anti-silau (Polarized), dan fotografi untuk mengurangi pantulan cahaya.
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setShowWaves(!showWaves)} className={`flex-1 py-3 rounded-xl border text-[9px] font-bold transition-all ${showWaves ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 {showWaves ? "Hide Raw Waves" : "Show Raw Waves"}
              </button>
              <button onClick={reset} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
