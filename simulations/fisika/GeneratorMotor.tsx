"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function GeneratorMotor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"generator" | "motor">("motor");
  const [inputVal, setInputVal] = useState(50); // 0 to 100
  const [showField, setShowField] = useState(true);
  const [commType, setCommType] = useState<"DC" | "AC">("DC");

  const angleRef = useRef(0);
  const animationRef = useRef(0);

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

      // Physics: Speed determines voltage (Generator) or vice versa (Motor)
      const speed = inputVal * 0.001;
      angleRef.current += speed;
      const angle = angleRef.current;

      // --- Draw Magnets ---
      const mw = 100;
      const mh = 200;
      
      // North (Red)
      ctx.fillStyle = "#ef4444";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath();
      ctx.roundRect(cx - 250, cy - mh/2, mw, mh, 12);
      ctx.fill();
      
      // South (Blue)
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
      ctx.beginPath();
      ctx.roundRect(cx + 150, cy - mh/2, mw, mh, 12);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "white";
      ctx.font = "bold 24px Inter";
      ctx.textAlign = "center";
      ctx.fillText("N", cx - 200, cy + 10);
      ctx.fillText("S", cx + 200, cy + 10);

      // --- Draw Field Lines ---
      if (showField) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let y = cy - 80; y <= cy + 80; y += 20) {
          ctx.beginPath();
          ctx.moveTo(cx - 150, y);
          ctx.lineTo(cx + 150, y);
          ctx.stroke();
          
          // Field Arrow
          const arrowX = cx - 150 + ((angle * 100 + y) % 300);
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
          ctx.beginPath();
          ctx.moveTo(arrowX, y - 3); ctx.lineTo(arrowX + 5, y); ctx.lineTo(arrowX, y + 3); ctx.fill();
        }
      }

      // --- Draw Armature (Rotating Coil) ---
      const armW = 120;
      const armH = 80;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // We project the 3D rotation onto 2D
      const x1 = -armW/2 * cosA;
      const y1 = -armW/2 * sinA;
      const x2 = armW/2 * cosA;
      const y2 = armW/2 * sinA;

      ctx.strokeStyle = "#f59e0b"; // copper color
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx + x1, cy + y1 - armH/2);
      ctx.lineTo(cx + x1, cy + y1 + armH/2);
      ctx.lineTo(cx + x2, cy + y2 + armH/2);
      ctx.lineTo(cx + x2, cy + y2 - armH/2);
      ctx.closePath();
      ctx.stroke();
      
      // Wire Glow
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.1 + Math.abs(cosA) * 0.4})`;
      ctx.lineWidth = 10;
      ctx.stroke();

      // --- Shaft & Commutator ---
      ctx.fillStyle = "#3f3f46";
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();

      // --- Circuit Flow ---
      const circuitY = cy + 180;
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy + 15);
      ctx.lineTo(cx - 40, circuitY);
      ctx.lineTo(cx + 40, circuitY);
      ctx.lineTo(cx + 40, cy + 15);
      ctx.stroke();

      // Electrons
      const currentDir = mode === "motor" ? 1 : -1;
      const currentMag = mode === "motor" ? inputVal : Math.abs(cosA) * inputVal;
      if (currentMag > 2) {
        ctx.fillStyle = "#fbbf24";
        const numE = 8;
        const perimeter = 300;
        for (let i = 0; i < numE; i++) {
          const dist = (angle * 200 * currentDir + i * (perimeter / numE)) % perimeter;
          ctx.beginPath();
          ctx.arc(cx - 40 + (dist < 150 ? 0 : dist - 150 < 80 ? (dist - 150) : 80), cy + (dist < 150 ? dist : 150), 3, 0, Math.PI * 2);
          // Simplified path for particles
        }
      }

      // --- Mode Specific Indicators ---
      if (mode === "motor") {
        // Battery at bottom
        ctx.fillStyle = "#09090b";
        ctx.fillRect(cx - 40, circuitY - 20, 80, 40);
        ctx.strokeStyle = "#ef4444";
        ctx.strokeRect(cx - 40, circuitY - 20, 80, 40);
        ctx.fillStyle = "white"; ctx.font = "bold 12px Inter";
        ctx.fillText(`${inputVal}V`, cx, circuitY + 5);
      } else {
        // Bulb at bottom
        const intensity = Math.abs(cosA) * (inputVal / 100);
        ctx.shadowBlur = 40 * intensity;
        ctx.shadowColor = "#fbbf24";
        ctx.fillStyle = `rgba(251, 191, 36, ${intensity})`;
        ctx.beginPath(); ctx.arc(cx, circuitY, 25, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(cx, circuitY, 25, 0, Math.PI * 2); ctx.stroke();
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [mode, inputVal, showField, commType]);

  const reset = () => {
    angleRef.current = 0;
    setInputVal(50);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Generator & Motor Listrik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Konversi Energi • Gaya Lorentz • Induksi</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Mode Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <RefreshCcw className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Mode Operasi</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => { setMode("motor"); setInputVal(50); }} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${mode === 'motor' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                    <Zap className="w-5 h-5" /> Motor
                 </button>
                 <button onClick={() => { setMode("generator"); setInputVal(50); }} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${mode === 'generator' ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                    <Target className="w-5 h-5" /> Generator
                 </button>
              </div>
           </div>

           {/* Performance Dashboard */}
           <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Kecepatan (RPM)</span>
                    <span className="text-xl font-black text-white">{(inputVal * 12).toFixed(0)} <span className="text-[10px] text-zinc-500 font-normal">rpm</span></span>
                 </div>
                 <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{mode === 'motor' ? 'Torsi (τ)' : 'GGL Induksi (ε)'}</span>
                    <span className="text-xl font-black text-white">{(inputVal * 0.85).toFixed(1)} <span className="text-[10px] text-zinc-500 font-normal">{mode === 'motor' ? 'N·m' : 'V'}</span></span>
                 </div>
                 <Zap className="w-4 h-4 text-indigo-400" />
              </div>
           </div>

           {/* Input Control */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Input</span>
              </div>
              <div className={`p-5 rounded-2xl border transition-all ${mode === 'motor' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-sky-500/5 border-sky-500/20'}`}>
                 <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                       {mode === 'motor' ? 'Voltase Input' : 'Kecepatan Mekanik'}
                    </label>
                    <span className={`text-xs font-mono ${mode === 'motor' ? 'text-rose-400' : 'text-sky-400'}`}>{inputVal}%</span>
                 </div>
                 <input type="range" className={`w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer ${mode === 'motor' ? 'accent-rose-500' : 'accent-sky-500'}`} min="0" max="100" value={inputVal} onChange={(e) => setInputVal(parseInt(e.target.value))} />
              </div>
           </div>

           {/* Insights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-amber-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Konsep Kunci</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                 {mode === "motor" 
                   ? "Energi Listrik → Mekanik. Arus pada kumparan di dalam medan magnet menghasilkan Gaya Lorentz yang memutar poros." 
                   : "Energi Mekanik → Listrik. Perubahan fluks magnetik saat kumparan diputar menghasilkan arus induksi (Hukum Faraday)."}
              </p>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all text-xs font-bold flex items-center justify-center gap-2">
                 <RotateCcw className="w-3 h-3" /> Reset Sistem
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
