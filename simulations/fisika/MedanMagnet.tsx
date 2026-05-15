"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Compass, Globe } from "lucide-react";
import Link from "next/link";

export default function MedanMagnet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [strength, setStrength] = useState(60);
  const [showLines, setShowLines] = useState(true);
  const [showCompasses, setShowCompasses] = useState(true);
  const [showEarth, setShowEarth] = useState(false);

  const animationRef = useRef(0);
  const magnetPos = useRef({ x: 0, y: 0, angle: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

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

      magnetPos.current.x = cx;
      magnetPos.current.y = cy;

      // --- Draw Vector Field (Compasses) ---
      if (showCompasses) {
         const spacing = 50;
         for (let x = 0; x < arenaW; x += spacing) {
            for (let y = 0; y < arenaH; y += spacing) {
               const b = calculateBField(x, y, cx, cy, magnetPos.current.angle, strength);
               const angle = Math.atan2(b.y, b.x);
               const mag = Math.sqrt(b.x*b.x + b.y*b.y);
               const alpha = Math.min(1, mag * 20);
               
               ctx.save();
               ctx.translate(x, y);
               ctx.rotate(angle);
               ctx.globalAlpha = alpha * 0.6;
               
               // Needle
               ctx.beginPath();
               ctx.fillStyle = "#f43f5e"; // North (Red)
               ctx.moveTo(0, -2); ctx.lineTo(12, 0); ctx.lineTo(0, 2); ctx.fill();
               ctx.fillStyle = "white"; // South
               ctx.moveTo(0, -2); ctx.lineTo(-12, 0); ctx.lineTo(0, 2); ctx.fill();
               
               ctx.restore();
            }
         }
      }

      // --- Draw Magnetic Field Lines (Streamlines) ---
      if (showLines) {
         ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
         ctx.lineWidth = 1.5;
         const lineCount = 12;
         const magL = 80;
         
         for (let i = 0; i < lineCount; i++) {
            const startAngle = (i / lineCount) * Math.PI * 2;
            let sx = cx + Math.cos(startAngle) * 40;
            let sy = cy + Math.sin(startAngle) * 40;
            
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            
            for (let j = 0; j < 100; j++) {
               const b = calculateBField(sx, sy, cx, cy, magnetPos.current.angle, strength);
               const bMag = Math.sqrt(b.x*b.x + b.y*b.y);
               sx += (b.x / bMag) * 10;
               sy += (b.y / bMag) * 10;
               ctx.lineTo(sx, sy);
               
               const d = Math.sqrt((sx-cx)**2 + (sy-cy)**2);
               if (d < 30 || d > 1000) break;
            }
            ctx.stroke();
         }
      }

      // --- Draw Magnet ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(magnetPos.current.angle);
      
      const mW = 160, mH = 50;
      // South (Left)
      ctx.fillStyle = "white";
      ctx.fillRect(-mW/2, -mH/2, mW/2, mH);
      ctx.fillStyle = "#3f3f46"; ctx.font = "bold 20px Inter"; ctx.textAlign = "center";
      ctx.fillText("S", -mW/4, 7);
      
      // North (Right)
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(0, -mH/2, mW/2, mH);
      ctx.fillStyle = "white";
      ctx.fillText("N", mW/4, 7);
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 2;
      ctx.strokeRect(-mW/2, -mH/2, mW, mH);
      ctx.restore();

      // --- Field Meter at Mouse ---
      const bAtMouse = calculateBField(mousePos.current.x, mousePos.current.y, cx, cy, magnetPos.current.angle, strength);
      const bMagAtMouse = Math.sqrt(bAtMouse.x**2 + bAtMouse.y**2) * 1000;
      
      if (mousePos.current.x > 0 && mousePos.current.x < arenaW) {
         ctx.fillStyle = "white"; ctx.font = "bold 10px Inter"; ctx.textAlign = "left";
         ctx.fillText(`B: ${bMagAtMouse.toFixed(1)} mT`, mousePos.current.x + 15, mousePos.current.y - 15);
         ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; ctx.beginPath(); ctx.arc(mousePos.current.x, mousePos.current.y, 5, 0, Math.PI * 2); ctx.stroke();
      }
    };

    const calculateBField = (x: number, y: number, mx: number, my: number, angle: number, strength: number) => {
       const dx = x - mx;
       const dy = y - my;
       const r2 = dx*dx + dy*dy;
       const r = Math.sqrt(r2);
       if (r < 40) return { x: 0, y: 0 };
       
       // Dipole model: m is along x axis
       const theta = Math.atan2(dy, dx) - angle;
       const m = strength * 50;
       
       const Br = (2 * m * Math.cos(theta)) / (r**3);
       const Btheta = (m * Math.sin(theta)) / (r**3);
       
       // Back to cartesian
       const bxLocal = Br * Math.cos(theta) - Btheta * Math.sin(theta);
       const byLocal = Br * Math.sin(theta) + Btheta * Math.cos(theta);
       
       // Rotate back to global
       return {
          x: bxLocal * Math.cos(angle) - byLocal * Math.sin(angle),
          y: bxLocal * Math.sin(angle) + byLocal * Math.cos(angle)
       };
    };

    const handleMouseMove = (e: MouseEvent) => {
       mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
       cancelAnimationFrame(animationRef.current);
       window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength, showLines, showCompasses, showEarth]);

  const reset = () => {
    setStrength(60);
    setShowLines(true);
    setShowCompasses(true);
  };

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Medan Magnet</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dipol Magnetik • Fluks Magnet • Kompas</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Magnet HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Magnetostatik</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Intensitas (B)</span>
                    <span className="text-sm font-black text-white">{strength} mT</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Tipe Source</span>
                    <span className="text-sm font-black text-emerald-400">BAR MAGNET</span>
                 </div>
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Magnet</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kekuatan (Strength)</label>
                       <span className="text-xs font-black text-rose-400">{strength}%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="0" max="200" step="1" value={strength} onChange={(e) => setStrength(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Visualization Toggles */}
           <div className="space-y-2">
              <button onClick={() => setShowLines(!showLines)} className={`w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase transition-all border flex items-center justify-between ${showLines ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Garis Gaya Magnet
                 <Waves className="w-3 h-3" />
              </button>
              <button onClick={() => setShowCompasses(!showCompasses)} className={`w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase transition-all border flex items-center justify-between ${showCompasses ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 Grid Kompas
                 <Compass className="w-3 h-3" />
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Magnet</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Medan magnet selalu membentuk loop tertutup dari Kutub Utara ke Kutub Selatan. Garis-garis ini tidak pernah berpotongan dan menunjukkan arah gaya magnetik di setiap titik ruang."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={reset} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 <RotateCcw className="w-4 h-4" /> RESET MAGNET
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
