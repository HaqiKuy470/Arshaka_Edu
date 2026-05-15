"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope } from "lucide-react";
import Link from "next/link";

// Helper for wavelength to RGB
function nmToRGB(wavelength: number): string {
    let r, g, b;
    if (wavelength >= 380 && wavelength < 440) {
        r = (-(wavelength - 440) / (440 - 380)); g = 0; b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0; g = (wavelength - 440) / (490 - 440); b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0; g = 1; b = (-(wavelength - 510) / (510 - 490));
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510); g = 1; b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1; g = (-(wavelength - 645) / (645 - 580)); b = 0;
    } else if (wavelength >= 645 && wavelength <= 780) {
        r = 1; g = 0; b = 0;
    } else {
        r = 0; g = 0; b = 0;
    }
    // Intensity factor
    let factor = 1.0;
    if (wavelength >= 380 && wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    else if (wavelength >= 701 && wavelength <= 780) factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 701);

    return `rgb(${Math.round(r * factor * 255)}, ${Math.round(g * factor * 255)}, ${Math.round(b * factor * 255)})`;
}

export default function DifraksiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [mode, setMode] = useState<"single" | "double">("single");
  const [wavelength, setWavelength] = useState(632); // He-Ne Laser approx (nm)
  const [slitWidth, setSlitWidth] = useState(0.04); // mm
  const [slitDistance, setSlitDistance] = useState(0.2); // mm (for double slit)
  const [screenDistance, setScreenDistance] = useState(1.5); // meters

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

      if (isRunning) timeRef.current += 1;

      const laserColor = nmToRGB(wavelength);

      // --- Draw Optical Bench ---
      // Screen (Right Side)
      const screenX = arenaW - 120;
      const screenW = 100;
      ctx.fillStyle = "#09090b";
      ctx.roundRect(screenX, 40, screenW, arenaH - 80, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; ctx.stroke();

      // Slit Wall
      const wallX = 120;
      ctx.fillStyle = "#27272a";
      ctx.fillRect(wallX, 0, 8, arenaH);
      
      // Slit Opening Visual
      ctx.fillStyle = "#000";
      if (mode === "single") {
         ctx.fillRect(wallX - 2, cy - 20, 12, 40);
         ctx.fillStyle = laserColor;
         ctx.fillRect(wallX + 2, cy - 2, 4, 4);
      } else {
         ctx.fillRect(wallX - 2, cy - 30, 12, 10);
         ctx.fillRect(wallX - 2, cy + 20, 12, 10);
         ctx.fillStyle = laserColor;
         ctx.fillRect(wallX + 2, cy - 26, 4, 4);
         ctx.fillRect(wallX + 2, cy + 24, 4, 4);
      }

      // --- Draw Laser Source ---
      ctx.shadowBlur = 20;
      ctx.shadowColor = laserColor;
      ctx.strokeStyle = laserColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(wallX, cy);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // --- Calculate & Draw Pattern ---
      // I = I0 * [sinc(beta)]^2 * [cos(alpha)]^2
      // beta = (pi * a * sin(theta)) / lambda
      // alpha = (pi * d * sin(theta)) / lambda
      
      const L = screenDistance * 1000; // mm
      const a = slitWidth; // mm
      const d = slitDistance; // mm
      const lam = wavelength * 1e-6; // mm
      
      const patternY = 60;
      const patternH = arenaH - 120;
      
      // Draw Intensity Graph & Pattern on Screen
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      
      for (let y = 0; y < patternH; y++) {
         const screenY = y - patternH/2;
         const theta = Math.atan(screenY / (L * 0.1)); // scaling for visual
         
         // Single slit diffraction envelope
         const beta = (Math.PI * a * Math.sin(theta)) / lam;
         const sinc = beta === 0 ? 1 : Math.sin(beta) / beta;
         let intensity = sinc * sinc;
         
         if (mode === "double") {
            const alpha = (Math.PI * d * Math.sin(theta)) / lam;
            intensity *= Math.pow(Math.cos(alpha), 2);
         }
         
         // Draw on screen
         const alphaVal = Math.min(1, intensity * 4.0); // Boosted from 1.5
         ctx.fillStyle = laserColor.replace("rgb", "rgba").replace(")", `, ${alphaVal})`);
         ctx.fillRect(screenX + 5, patternY + y, screenW - 10, 1);
         
         // Intensity Graph
         const graphX = screenX - 180 + intensity * 150; // More pronounced graph
         if (y === 0) ctx.moveTo(graphX, patternY + y);
         else ctx.lineTo(graphX, patternY + y);
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"; // Brighter graph line
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Draw Wave Propagation (Abstract) ---
      if (isRunning) {
         ctx.setLineDash([5, 15]);
         ctx.strokeStyle = laserColor.replace("rgb", "rgba").replace(")", ", 0.5)"); // Brighter waves
         ctx.lineWidth = 1.5;
         const rBase = (timeRef.current * 2) % 100;
         for (let r = rBase; r < screenX - wallX; r += 40) {
            ctx.beginPath();
            if (mode === "single") {
               ctx.arc(wallX, cy, r, -Math.PI/4, Math.PI/4);
            } else {
               ctx.arc(wallX, cy - 25, r, -Math.PI/6, Math.PI/6);
               ctx.arc(wallX, cy + 25, r, -Math.PI/6, Math.PI/6);
            }
            ctx.stroke();
         }
         ctx.setLineDash([]);
      }

      // HUD Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter";
      ctx.textAlign = "center";
      ctx.fillText("DISTRIBUSI INTENSITAS", screenX - 100, patternY - 10);
      ctx.fillText("LAYAR PENGAMATAN", screenX + 50, patternY - 10);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, mode, wavelength, slitWidth, slitDistance, screenDistance]);

  const reset = () => {
    setWavelength(632);
    setSlitWidth(0.04);
    setSlitDistance(0.2);
    setScreenDistance(1.5);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Difraksi & Interferensi</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Optik Fisis • Single Slit • Young Experiment</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Mode Selector */}
           <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMode("single")} className={`py-3 rounded-2xl text-[9px] font-black uppercase transition-all border ${mode === "single" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Celah Tunggal
              </button>
              <button onClick={() => setMode("double")} className={`py-3 rounded-2xl text-[9px] font-black uppercase transition-all border ${mode === "double" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Celah Ganda
              </button>
           </div>

           {/* Laser Settings */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Zap className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sumber Cahaya</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Wavelength (λ)</label>
                       <span className="text-xs font-mono" style={{ color: nmToRGB(wavelength) }}>{wavelength} nm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" min="380" max="750" value={wavelength} onChange={(e) => setWavelength(parseInt(e.target.value))} />
                    <div className="flex justify-between text-[8px] text-zinc-600 font-bold">
                       <span>VIOLET</span><span>GREEN</span><span>RED</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Geometry Parameters */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Microscope className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Geometri Alat</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-5">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Lebar Celah (a)</label>
                       <span className="text-xs font-mono text-white">{slitWidth.toFixed(2)} mm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0.01" max="0.1" step="0.01" value={slitWidth} onChange={(e) => setSlitWidth(parseFloat(e.target.value))} />
                 </div>

                 {mode === "double" && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                         <label className="text-[9px] font-bold text-zinc-400 uppercase">Jarak Antar Celah (d)</label>
                         <span className="text-xs font-mono text-white">{slitDistance.toFixed(2)} mm</span>
                      </div>
                      <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="0.1" max="0.5" step="0.05" value={slitDistance} onChange={(e) => setSlitDistance(parseFloat(e.target.value))} />
                   </div>
                 )}

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Jarak Layar (L)</label>
                       <span className="text-xs font-mono text-white">{screenDistance.toFixed(1)} m</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0.5" max="3" step="0.1" value={screenDistance} onChange={(e) => setScreenDistance(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Analysis Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Optik</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Hubungan λ:</strong> Perhatikan bagaimana warna merah (λ besar) menghasilkan pola yang lebih lebar dibandingkan warna ungu (λ kecil).
                 </p>
                 <p>
                    <strong className="text-zinc-300">Celah Ganda:</strong> Pada celah ganda, Anda melihat garis-garis tajam (interferensi) yang dibatasi oleh amplop difraksi celah tunggal.
                 </p>
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Cahaya akan melentur saat melewati celah sempit, menghasilkan pola pita terang (interferensi konstruktif) dan pita gelap (interferensi destruktif)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
