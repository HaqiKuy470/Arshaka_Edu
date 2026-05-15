"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Siren, Wind } from "lucide-react";
import Link from "next/link";

interface Wave {
  x: number;
  y: number;
  radius: number;
  t: number;
}

export default function EfekDoppler() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [sourceSpeed, setSourceSpeed] = useState(0.5); // Mach number: 0 to 1.5
  const [obsPos, setObsPos] = useState({ x: 0.8, y: 0.6 }); // Normalized 0-1
  const [showMachCone, setShowMachCone] = useState(true);

  const wavesRef = useRef<Wave[]>([]);
  const sourcePosRef = useRef({ x: 0.1, y: 0.5 });
  const timeRef = useRef(0);
  const animationRef = useRef(0);

  // Constants
  const vSound = 343; // m/s (visual scaling)
  const fSource = 440; // Hz base

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
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;

      if (isRunning) {
        timeRef.current += 1;
        // Update source position
        sourcePosRef.current.x += sourceSpeed * 0.005;
        if (sourcePosRef.current.x > 1.1) sourcePosRef.current.x = -0.1;

        // Emit waves
        if (timeRef.current % 10 === 0) {
          wavesRef.current.push({
            x: sourcePosRef.current.x * arenaW,
            y: sourcePosRef.current.y * arenaH,
            radius: 0,
            t: 0
          });
        }
      }

      // --- Draw Ground/Environment ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(arenaW, cy); ctx.stroke();

      // --- Draw Waves ---
      ctx.lineWidth = 1.5;
      wavesRef.current = wavesRef.current.filter(w => w.radius < arenaW);
      wavesRef.current.forEach(w => {
        if (isRunning) w.radius += 3; // speed of sound
        
        const alpha = Math.max(0, 1 - w.radius / (arenaW * 0.8));
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Highlight "bunched" waves
        if (sourceSpeed > 0.1) {
           const dx = sourcePosRef.current.x * arenaW - w.x;
           if (dx > 0 && dx < 20) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
              ctx.stroke();
           }
        }
      });

      // --- Draw Mach Cone (Shockwave) ---
      if (sourceSpeed >= 1.0 && showMachCone) {
        const sx = sourcePosRef.current.x * arenaW;
        const sy = sourcePosRef.current.y * arenaH;
        const machAngle = Math.asin(1 / sourceSpeed);
        
        ctx.strokeStyle = "rgba(244, 63, 94, 0.4)"; // rose-500
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(machAngle) * 1000, sy - Math.sin(machAngle) * 1000);
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - Math.cos(machAngle) * 1000, sy + Math.sin(machAngle) * 1000);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = "rgba(244, 63, 94, 0.05)";
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 1000, sy - Math.tan(machAngle) * 1000);
        ctx.lineTo(sx - 1000, sy + Math.tan(machAngle) * 1000);
        ctx.fill();
      }

      // --- Draw Observer ---
      const ox = obsPos.x * arenaW;
      const oy = obsPos.y * arenaH;
      ctx.fillStyle = "white";
      ctx.font = "24px Inter";
      ctx.textAlign = "center";
      ctx.fillText("🧍", ox, oy + 10);
      
      // Calculate Doppler Frequency
      // f' = f * (v / (v - vs))
      const distToSource = Math.sqrt((ox - sourcePosRef.current.x * arenaW)**2 + (oy - sourcePosRef.current.y * arenaH)**2);
      const isApproaching = sourcePosRef.current.x * arenaW < ox;
      const fObserved = isApproaching 
        ? fSource * (1 / (1 - Math.min(0.99, sourceSpeed)))
        : fSource * (1 / (1 + sourceSpeed));

      ctx.fillStyle = isApproaching ? "#4ade80" : "#fb7185";
      ctx.font = "bold 12px Inter";
      ctx.fillText(`${fObserved.toFixed(0)} Hz`, ox, oy + 35);

      // --- Draw Source (Vehicle) ---
      const sx = sourcePosRef.current.x * arenaW;
      const sy = sourcePosRef.current.y * arenaH;
      ctx.save();
      ctx.translate(sx, sy);
      
      // Shadow
      ctx.shadowBlur = 20;
      ctx.shadowColor = sourceSpeed >= 1.0 ? "#f43f5e" : "#38bdf8";

      // Body
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.roundRect(-25, -12, 50, 24, 6);
      ctx.fill();
      ctx.strokeStyle = sourceSpeed >= 1.0 ? "#f43f5e" : "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flashes
      if (isRunning && timeRef.current % 20 < 10) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(-15, -8, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, sourceSpeed, obsPos, showMachCone]);

  const reset = () => {
    sourcePosRef.current = { x: 0.1, y: 0.5 };
    wavesRef.current = [];
    setSourceSpeed(0.5);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Efek Doppler</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Akustik • Mach Number • Gelombang</span>
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
           
           {/* Mach Speed Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${sourceSpeed >= 1.0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Status Kecepatan</div>
              <div className={`text-3xl font-black ${sourceSpeed >= 1.0 ? 'text-rose-500' : 'text-sky-400'}`}>
                 MACH {sourceSpeed.toFixed(2)}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 {sourceSpeed >= 1.0 ? <Wind className="w-4 h-4 text-rose-500 animate-pulse" /> : <Siren className="w-4 h-4 text-sky-400" />}
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                   {sourceSpeed >= 1.0 ? 'Supersonik' : 'Subsonik'}
                 </span>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Sumber Bunyi</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Kecepatan (v_s)</label>
                       <span className="text-xs font-mono text-white">{Math.round(sourceSpeed * 343)} m/s</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0" max="1.5" step="0.05" value={sourceSpeed} onChange={(e) => setSourceSpeed(parseFloat(e.target.value))} />
                 </div>

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Shockwave Cone</span>
                    <button onClick={() => setShowMachCone(!showMachCone)} className={`w-10 h-5 rounded-full transition-all relative ${showMachCone ? 'bg-rose-500' : 'bg-zinc-700'}`}>
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showMachCone ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-rose-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Mendekat:</strong> Muka gelombang memadat di depan sumber, menyebabkan frekuensi yang terdengar menjadi <span className="text-green-400 font-bold">lebih tinggi</span>.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Mach 1+:</strong> Saat kecepatan melampaui suara, semua muka gelombang bertumpuk membentuk kerucut gelombang kejut (Sonic Boom).
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
                 "Frekuensi gelombang yang diterima pengamat lebih tinggi saat sumber mendekat, dan lebih rendah saat menjauh akibat kompresi/ekspansi ruang gelombang."
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
