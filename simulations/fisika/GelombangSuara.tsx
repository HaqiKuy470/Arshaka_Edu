"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Volume2, VolumeX, Music } from "lucide-react";
import Link from "next/link";

export default function GelombangSuara() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(440); // Standard A4 tuning
  const [medium, setMedium] = useState<"udara" | "air" | "besi">("udara");
  const [showParticles, setShowParticles] = useState(true);

  const timeRef = useRef(0);
  const animationRef = useRef(0);

  // Sound speed in different media (m/s)
  const speeds = {
    udara: 343,
    air: 1482,
    besi: 5120
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
      const cx = (canvas.width - sidebarWidth) / 2;
      const cy = canvas.height / 2;

      if (isRunning) timeRef.current += 0.016;

      const t = timeRef.current;
      const speedOfSound = speeds[medium];
      const wavelength = speedOfSound / frequency;
      
      // Scaling for visualization
      const visualFreq = frequency / 100;
      const visualAmp = amplitude * 0.5;
      const k = (2 * Math.PI) / (wavelength * 0.5); // spatial frequency

      // --- Draw Speaker (Left) ---
      const sx = cx - 350;
      const sy = cy;
      const coneDisplacement = Math.sin(t * frequency * 0.1) * (amplitude * 0.2);
      
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.moveTo(sx - 40, sy - 60);
      ctx.lineTo(sx, sy - 100);
      ctx.lineTo(sx, sy + 100);
      ctx.lineTo(sx - 40, sy + 60);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#3f3f46"; ctx.lineWidth = 4; ctx.stroke();

      // Cone
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.moveTo(sx, sy - 100);
      ctx.lineTo(sx + 20 + coneDisplacement, sy - 80);
      ctx.lineTo(sx + 20 + coneDisplacement, sy + 80);
      ctx.lineTo(sx, sy + 100);
      ctx.closePath();
      ctx.fill();

      // --- Draw Wave Particles (Longitudinal) ---
      if (showParticles) {
        const rows = 12;
        const cols = 80;
        const spacing = 600 / cols;
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const bx = cx - 300 + c * spacing;
            const by = cy - 80 + r * 15 + (Math.sin(c * r) * 3);
            
            // Displacement: D(x, t) = A * sin(k*x - w*t)
            const phase = (c * spacing * k) - (t * frequency * 0.1);
            const disp = Math.sin(phase) * visualAmp;
            
            ctx.beginPath();
            ctx.arc(bx + disp, by, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // High pressure glow
            if (Math.abs(Math.sin(phase) - 1) < 0.2) {
              ctx.fillStyle = "rgba(56, 189, 248, 0.1)";
              ctx.beginPath(); ctx.arc(bx + disp, by, 6, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
            }
          }
        }
      }

      // --- Pressure Graph overlay (Transverse representation) ---
      const gx = cx - 300;
      const gy = cy + 150;
      const gw = 600;
      const gh = 100;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#38bdf8";
      for (let x = 0; x < gw; x++) {
        const phase = (x * k) - (t * frequency * 0.1);
        const y = gy - Math.sin(phase) * visualAmp;
        if (x === 0) ctx.moveTo(gx + x, y);
        else ctx.lineTo(gx + x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "bold 9px Inter";
      ctx.fillText("COMPRESSION", gx + wavelength*0.5, gy - visualAmp - 20);
      ctx.fillText("RAREFACTION", gx + wavelength*1.5, gy + visualAmp + 20);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, amplitude, frequency, medium, showParticles]);

  const reset = () => {
    setFrequency(440);
    setAmplitude(40);
    setMedium("udara");
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gelombang Suara</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Bunyi • Longitudinal • Akustik</span>
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
           
           {/* Wave Stats Card */}
           <div className="bg-sky-500/5 border border-sky-500/10 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Panjang Gelombang (λ)</span>
                    <span className="text-xl font-black text-white">{(speeds[medium]/frequency).toFixed(2)} <span className="text-[10px] text-zinc-500 font-normal">m</span></span>
                 </div>
                 <Ruler className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Kecepatan Bunyi (v)</span>
                    <span className="text-xl font-black text-white">{speeds[medium]} <span className="text-[10px] text-zinc-500 font-normal">m/s</span></span>
                 </div>
                 <Gauge className="w-4 h-4 text-sky-400" />
              </div>
           </div>

           {/* Pitch & Volume Controls */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Music className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parameter Bunyi</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Frequency (Pitch)</label>
                       <span className="text-xs font-mono text-white">{frequency} Hz</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="20" max="2000" step="10" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Amplitude (Volume)</label>
                       <span className="text-xs font-mono text-white">{amplitude}%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="0" max="100" value={amplitude} onChange={(e) => setAmplitude(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Medium Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Droplets className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Medium Rambat</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {(["udara", "air", "besi"] as const).map(m => (
                   <button 
                     key={m} 
                     onClick={() => setMedium(m)} 
                     className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${medium === m ? 'bg-white/10 border-white/30 text-white shadow-lg scale-105' : 'bg-transparent border-white/5 text-zinc-600 opacity-50'}`}
                   >
                      {m}
                   </button>
                 ))}
              </div>
           </div>

           {/* Insights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fakta Akustik</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                 Bunyi merambat lebih cepat pada benda padat ({speeds.besi} m/s) karena kerapatan partikel yang tinggi memungkinkan transfer energi mekanik lebih instan dibanding gas.
              </p>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Suara merambat melalui rapatan dan renggangan partikel medium (gelombang longitudinal). Nada bergantung pada frekuensi, kekerasan pada amplitudo."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setShowParticles(!showParticles)} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold transition-all ${showParticles ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                 {showParticles ? "Hide Particles" : "Show Particles"}
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
