"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function InterferensiGelombang() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [separation, setSeparation] = useState(120); // px
  const [phaseDiff, setPhaseDiff] = useState(0); // degrees
  const [frequency, setFrequency] = useState(5); // arbitrary units

  const timeRef = useRef(0);
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
      const cy = canvas.height / 2 - 50;

      if (isRunning) timeRef.current += 0.03;
      const t = timeRef.current;

      const phaseRad = (phaseDiff * Math.PI) / 180;
      const lambda = 400 / frequency; // Wavelength in pixels

      // Source positions
      const s1x = cx - separation/2;
      const s1y = cy;
      const s2x = cx + separation/2;
      const s2y = cy;

      // --- Draw Wavefronts (Concentric Circles) ---
      // This approach is much easier on the eyes than a pixel-by-pixel heatmap
      const drawWavefronts = (sx: number, sy: number, color: string, offset: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        const maxR = 800;
        for (let r = (t * 50 + offset) % lambda; r < maxR; r += lambda) {
          const alpha = Math.max(0, 1 - r / maxR) * 0.15;
          ctx.beginPath();
          ctx.globalAlpha = alpha;
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      };

      // Set blend mode for constructive areas
      ctx.globalCompositeOperation = "screen";
      drawWavefronts(s1x, s1y, "#38bdf8", 0);
      drawWavefronts(s2x, s2y, "#f43f5e", (phaseDiff / 360) * lambda);
      ctx.globalCompositeOperation = "source-over";

      // --- Draw Node/Antinode Guide Lines (Static cues) ---
      // These show where constructive/destructive interference happens without flickering
      ctx.setLineDash([5, 10]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        const angle = Math.asin((i * lambda) / separation);
        if (!isNaN(angle)) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          const lx = cx + Math.sin(angle) * 1000;
          const ly = cy + Math.cos(angle) * 1000;
          ctx.lineTo(lx, ly);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx - Math.sin(angle) * 1000, cy - Math.cos(angle) * 1000);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // --- Draw Sources ---
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(s1x, s1y, 8, 0, Math.PI * 2); ctx.fill();
      
      ctx.shadowColor = "#f43f5e";
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath(); ctx.arc(s2x, s2y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // --- Detector Graph (Bottom) ---
      const gx = cx - 250;
      const gy = cy + 280;
      const gw = 500;
      const gh = 80;

      // Card background for detector
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.roundRect(gx - 20, gy - gh - 20, gw + 40, gh * 2 + 40, 16);
      ctx.fill();
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#a855f7"; // purple-500
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#a855f7";
      
      const k = (2 * Math.PI) / lambda;
      for (let x = 0; x <= gw; x += 2) {
        const px = gx + x;
        const py = cy + 200; // Sample line
        const r1 = Math.sqrt((px - s1x)**2 + (py - s1y)**2);
        const r2 = Math.sqrt((px - s2x)**2 + (py - s2y)**2);
        
        const val1 = Math.sin(k * r1 - t * 5);
        const val2 = Math.sin(k * r2 - t * 5 + phaseRad);
        const total = (val1 + val2) / 2;
        
        const vy = gy - total * gh;
        if (x === 0) ctx.moveTo(px, vy);
        else ctx.lineTo(px, vy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText("DETEKTOR INTENSITAS GELOMBANG", cx, gy + gh + 10);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, separation, phaseDiff, frequency]);

  const reset = () => {
    setSeparation(120);
    setPhaseDiff(0);
    setFrequency(5);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Interferensi Gelombang</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Wavefronts • Superposisi • Young</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Superposition Logic Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${Math.abs(phaseDiff - 180) < 30 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Pola Superposisi</div>
              <div className={`text-2xl font-black ${Math.abs(phaseDiff - 180) < 30 ? 'text-rose-500' : 'text-sky-400'}`}>
                 {Math.abs(phaseDiff - 180) < 30 ? 'DESTRUKTIF' : phaseDiff < 30 ? 'KONSTRUKTIF' : 'INTERFERENSI'}
              </div>
              <p className="mt-2 text-[9px] text-zinc-500 font-medium">
                {Math.abs(phaseDiff - 180) < 30 ? 'Puncak bertemu lembah, gelombang saling membatalkan.' : 'Puncak bertemu puncak, gelombang saling menguatkan.'}
              </p>
           </div>

           {/* Parameters */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Gelombang</span>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Jarak Celah (d)</label>
                          <span className="text-xs font-mono text-white">{separation} px</span>
                       </div>
                       <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="40" max="300" step="5" value={separation} onChange={(e) => setSeparation(parseInt(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Beda Fase (φ)</label>
                          <span className="text-xs font-mono text-purple-400">{phaseDiff}°</span>
                       </div>
                       <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500" min="0" max="360" step="15" value={phaseDiff} onChange={(e) => setPhaseDiff(parseInt(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Frekuensi (f)</label>
                          <span className="text-xs font-mono text-sky-400">{frequency} Hz</span>
                       </div>
                       <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="2" max="15" step="0.5" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} />
                    </div>
                 </div>
              </div>
           </div>

           {/* Theory Highlights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Waves className="w-4 h-4 text-purple-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fisika Celah Ganda</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Wavefronts:</strong> Garis lingkaran menunjukkan puncak gelombang. Titik temu antar lingkaran adalah lokasi interferensi maksimal.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Hukum Young:</strong> Perhatikan bagaimana mengubah jarak (d) atau frekuensi (f) akan merubah jarak antar garis terang (fringes) pada detektor.
                 </p>
              </div>
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
