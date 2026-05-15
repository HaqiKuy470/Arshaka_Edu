"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Eye } from "lucide-react";
import Link from "next/link";

export default function OptikLensa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [focalLength, setFocalLength] = useState(120); 
  const [objectDist, setObjectDist] = useState(240);
  const [objectHeight, setObjectHeight] = useState(80);
  const [opticalMode, setOpticalMode] = useState<"lens" | "mirror">("lens");
  const [showRays, setShowRays] = useState(true);

  const animationRef = useRef(0);

  const reset = () => {
    setFocalLength(120);
    setObjectDist(240);
    setObjectHeight(80);
  };

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

      // --- Drawing Grid ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < arenaW; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, arenaH); ctx.stroke(); }
      for (let y = 0; y < arenaH; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(arenaW, y); ctx.stroke(); }

      // --- Optical Axis ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(arenaW, cy); ctx.stroke();

      // --- Lens / Mirror Drawing ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
      ctx.shadowBlur = 20; ctx.shadowColor = "#38bdf8";
      
      if (opticalMode === "lens") {
         // Lens arc
         ctx.beginPath();
         if (focalLength > 0) { // Convex
            ctx.ellipse(0, 0, 15, 180, 0, 0, Math.PI * 2);
         } else { // Concave
            ctx.moveTo(-15, -180); ctx.lineTo(15, -180);
            ctx.bezierCurveTo(0, -100, 0, 100, 15, 180);
            ctx.lineTo(-15, 180);
            ctx.bezierCurveTo(0, 100, 0, -100, -15, -180);
         }
         ctx.stroke();
         ctx.fillStyle = "rgba(56, 189, 248, 0.1)"; ctx.fill();
      } else {
         // Mirror arc
         ctx.beginPath();
         const arcH = 180;
         const curvature = focalLength * 2;
         ctx.moveTo(0, -arcH);
         ctx.quadraticCurveTo(focalLength > 0 ? -40 : 40, 0, 0, arcH);
         ctx.stroke();
         // Mirror back dash
         ctx.setLineDash([5, 5]);
         ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
         ctx.beginPath(); ctx.moveTo(5, -arcH); ctx.quadraticCurveTo(focalLength > 0 ? -35 : 45, 0, 5, arcH); ctx.stroke();
         ctx.setLineDash([]);
      }
      ctx.restore();

      // --- Points (F, 2F) ---
      const drawPoint = (x: number, label: string) => {
         ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(cx + x, cy, 3, 0, Math.PI * 2); ctx.fill();
         ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
         ctx.fillText(label, cx + x, cy + 20);
      };
      drawPoint(-focalLength, "F");
      drawPoint(focalLength, "F'");
      drawPoint(-focalLength * 2, "2F");
      drawPoint(focalLength * 2, "2F'");

      // --- Object ---
      const objX = cx - objectDist;
      const objY = cy - objectHeight;
      drawArrow(ctx, objX, cy, -objectHeight, "#10b981", "Benda");

      // --- Ray Tracing Logic ---
      // 1/f = 1/s + 1/s' => s' = (f * s) / (s - f)
      const s = objectDist;
      const f = focalLength;
      const si = (f * s) / (s - f);
      const hi = -(si / s) * objectHeight;
      const imgX = opticalMode === "lens" ? cx + si : cx - si;
      const imgY = cy - hi;

      if (showRays) {
         ctx.lineWidth = 1.5;
         ctx.shadowBlur = 10;
         
         // Ray 1: Parallel -> Focal
         ctx.strokeStyle = "#fbbf24"; ctx.shadowColor = "#fbbf24";
         ctx.beginPath();
         ctx.moveTo(objX, objY);
         ctx.lineTo(cx, objY);
         if (opticalMode === "lens") {
            ctx.lineTo(cx + arenaW, cy + (arenaW / si) * hi); // Approximate line
            ctx.lineTo(imgX, imgY);
         } else {
            ctx.lineTo(imgX, imgY);
         }
         ctx.stroke();

         // Ray 2: Center (No refraction)
         ctx.strokeStyle = "#a78bfa"; ctx.shadowColor = "#a78bfa";
         ctx.beginPath();
         ctx.moveTo(objX, objY);
         ctx.lineTo(cx, cy);
         ctx.lineTo(imgX, imgY);
         ctx.stroke();
         
         ctx.shadowBlur = 0;
      }

      // --- Image ---
      const isVirtual = si < 0;
      ctx.globalAlpha = isVirtual ? 0.5 : 1.0;
      drawArrow(ctx, imgX, cy, -hi, "#f43f5e", `Bayangan (${isVirtual ? "Virtual" : "Nyata"})`);
      ctx.globalAlpha = 1.0;
    };

    const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string, label: string) => {
       ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
       ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + height); ctx.stroke();
       const head = Math.sign(height) * 10;
       ctx.beginPath(); ctx.moveTo(x, y + height); ctx.lineTo(x - 5, y + height - head); ctx.lineTo(x + 5, y + height - head); ctx.fill();
       ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
       ctx.fillText(label, x, y + height + (height > 0 ? 15 : -15));
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [focalLength, objectDist, objectHeight, opticalMode, showRays]);

  // Image calculations for HUD
  const si = (focalLength * objectDist) / (objectDist - focalLength);
  const mag = Math.abs(si / objectDist);
  const isReal = si > 0;

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Optik Geometri</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Lensa & Cermin • Pembentukan Bayangan • Ray Tracing</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Image HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Eye className="w-4 h-4 text-rose-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Sifat Bayangan</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Tipe</span>
                    <span className="text-sm font-black text-white">{isReal ? "NYATA" : "MAYA (Virtual)"}</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Perbesaran (M)</span>
                    <span className="text-sm font-black text-emerald-400">{mag.toFixed(2)}x</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Orientasi</span>
                    <span className="text-sm font-black text-amber-400">{si/objectDist < 0 ? "TEGAK" : "TERBALIK"}</span>
                 </div>
              </div>
           </div>

           {/* Mode Selection */}
           <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setOpticalMode("lens")} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${opticalMode === "lens" ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 <Microscope className="w-4 h-4" />
                 LENSA
              </button>
              <button onClick={() => setOpticalMode("mirror")} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${opticalMode === "mirror" ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 <Sun className="w-4 h-4" />
                 CERMIN
              </button>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurasi Optik</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jarak Fokus (f)</label>
                       <span className="text-xs font-black text-sky-400">{focalLength} mm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="-300" max="300" step="10" value={focalLength} onChange={(e) => setFocalLength(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jarak Benda (s)</label>
                       <span className="text-xs font-black text-emerald-400">{objectDist} mm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400" min="20" max="600" step="1" value={objectDist} onChange={(e) => setObjectDist(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Toggle Rays */}
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Lightbulb className="w-4 h-4 text-zinc-500" />
                 <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Ray Tracing</span>
              </div>
              <button onClick={() => setShowRays(!showRays)} className={`w-10 h-5 rounded-full relative transition-all ${showRays ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showRays ? 'right-1' : 'left-1'}`} />
              </button>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Lensa cembung mengumpulkan cahaya (konvergen), cekung menyebarkan cahaya (divergen). Posisi awal benda akan sangat menentukan sifat akhir bayangan."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={reset} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 <RotateCcw className="w-4 h-4" /> RESET LAB
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
