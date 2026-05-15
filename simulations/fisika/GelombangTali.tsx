"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope } from "lucide-react";
import Link from "next/link";

interface Bead {
  x: number;
  y: number;
  vy: number;
}

export default function GelombangTali() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(1.5);
  const [damping, setDamping] = useState(0.02);
  const [tension, setTension] = useState(5); // Tension affects propagation speed
  const [endType, setEndType] = useState<"fixed" | "loose" | "infinite">("infinite");
  const [waveMode, setWaveMode] = useState<"oscilate" | "pulse">("oscilate");

  const animationRef = useRef(0);
  const timeRef = useRef(0);
  const beadsRef = useRef<Bead[]>([]);

  useEffect(() => {
    // Init beads
    const b: Bead[] = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
       b.push({ x: 0, y: 0, vy: 0 });
    }
    beadsRef.current = b;
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

      const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      if (isRunning) timeRef.current += 0.016;
      const t = timeRef.current;

      const beadCount = beadsRef.current.length;
      const spacing = (arenaW - 200) / beadCount;
      const startX = 100;

      // --- Wave Physics Simulation ---
      // We use a simple 1D wave equation simulation (finite difference)
      if (isRunning) {
         const speed = tension * 0.1;
         
         // Left End: Oscillator
         if (waveMode === "oscilate") {
            beadsRef.current[0].y = Math.sin(t * frequency * Math.PI * 2) * amplitude;
         }

         // Update internal beads
         const nextY = beadsRef.current.map(b => b.y);
         for (let i = 1; i < beadCount - 1; i++) {
            const force = (beadsRef.current[i-1].y + beadsRef.current[i+1].y - 2 * beadsRef.current[i].y) * speed;
            beadsRef.current[i].vy += force;
            beadsRef.current[i].vy *= (1 - damping);
            nextY[i] = beadsRef.current[i].y + beadsRef.current[i].vy;
         }

         // Right End: Boundary Conditions
         if (endType === "fixed") {
            nextY[beadCount-1] = 0;
         } else if (endType === "loose") {
            const force = (beadsRef.current[beadCount-2].y - beadsRef.current[beadCount-1].y) * speed;
            beadsRef.current[beadCount-1].vy += force;
            beadsRef.current[beadCount-1].vy *= (1 - damping);
            nextY[beadCount-1] = beadsRef.current[beadCount-1].y + beadsRef.current[beadCount-1].vy;
         } else {
            // Infinite / Absorptive
            nextY[beadCount-1] = beadsRef.current[beadCount-2].y * (1 - damping);
         }

         for (let i = 0; i < beadCount; i++) beadsRef.current[i].y = nextY[i];
      }

      // --- Drawing ---
      // Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < arenaW; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, arenaH); ctx.stroke(); }
      for (let i = 0; i < arenaH; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(arenaW, i); ctx.stroke(); }

      // Equilibrium Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(startX, cy); ctx.lineTo(startX + arenaW - 200, cy); ctx.stroke();
      ctx.setLineDash([]);

      // String Line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.lineWidth = 3;
      beadsRef.current.forEach((b, i) => {
         const x = startX + i * spacing;
         const y = cy + b.y;
         if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Beads
      beadsRef.current.forEach((b, i) => {
         const x = startX + i * spacing;
         const y = cy + b.y;
         
         ctx.shadowBlur = 10;
         ctx.shadowColor = i % 10 === 0 ? "#8b5cf6" : "#ec4899";
         ctx.fillStyle = i % 10 === 0 ? "#8b5cf6" : "#ec4899";
         ctx.beginPath();
         ctx.arc(x, y, i % 10 === 0 ? 4 : 2, 0, Math.PI * 2);
         ctx.fill();
         ctx.shadowBlur = 0;
      });

      // Oscillator (Left)
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(startX - 20, cy + beadsRef.current[0].y - 20, 20, 40);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX - 20, cy + beadsRef.current[0].y - 20, 20, 40);

      // Boundary (Right)
      if (endType === "fixed") {
         ctx.fillStyle = "#3f3f46";
         ctx.fillRect(startX + (beadCount-1) * spacing, cy - 50, 10, 100);
      } else if (endType === "loose") {
         ctx.strokeStyle = "#3f3f46"; ctx.lineWidth = 4;
         ctx.beginPath(); ctx.moveTo(startX + (beadCount-1) * spacing, cy - 80); ctx.lineTo(startX + (beadCount-1) * spacing, cy + 80); ctx.stroke();
         ctx.beginPath(); ctx.arc(startX + (beadCount-1) * spacing, cy + beadsRef.current[beadCount-1].y, 10, 0, Math.PI * 2); ctx.stroke();
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, amplitude, frequency, damping, tension, endType, waveMode]);

  const sendPulse = () => {
    if (!isRunning) return;
    setWaveMode("pulse");
    let pTime = 0;
    const interval = setInterval(() => {
       pTime += 0.1;
       beadsRef.current[0].y = Math.sin(pTime * Math.PI) * amplitude * 2;
       if (pTime >= Math.PI) {
          beadsRef.current[0].y = 0;
          clearInterval(interval);
          setWaveMode("oscilate");
       }
    }, 16);
  };

  const reset = () => {
    beadsRef.current.forEach(b => { b.y = 0; b.vy = 0; });
    timeRef.current = 0;
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gelombang pada Tali</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Transversal • Amplitudo • Frekuensi • Refleksi</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Gelombang</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Amplitudo</label>
                       <span className="text-xs font-mono text-white">{amplitude} px</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0" max="80" step="1" value={amplitude} onChange={(e) => setAmplitude(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Frekuensi</label>
                       <span className="text-xs font-mono text-white">{frequency.toFixed(1)} Hz</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0.1" max="5" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Damping (Redaman)</label>
                       <span className="text-xs font-mono text-white">{(damping * 100).toFixed(1)}%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0" max="0.1" step="0.001" value={damping} onChange={(e) => setDamping(parseFloat(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tegangan (Tension)</label>
                       <span className="text-xs font-mono text-white">{tension} N</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="1" max="20" step="1" value={tension} onChange={(e) => setTension(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Boundary Selection */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Lock className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ujung Tali</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 <button onClick={() => setEndType("fixed")} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center justify-between ${endType === "fixed" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                    Ujung Terikat
                    <Lock className="w-3 h-3" />
                 </button>
                 <button onClick={() => setEndType("loose")} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center justify-between ${endType === "loose" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                    Ujung Bebas
                    <Unlock className="w-3 h-3" />
                 </button>
                 <button onClick={() => setEndType("infinite")} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border flex items-center justify-between ${endType === "infinite" ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                    Tanpa Ujung
                    <RefreshCcw className="w-3 h-3" />
                 </button>
              </div>
           </div>

           {/* Pulse Button */}
           <div className="pt-2">
              <button onClick={sendPulse} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/10">
                 <Zap className="w-4 h-4 text-amber-300" /> KIRIM PULSA TUNGGAL
              </button>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Gelombang mekanik mentransfer energi tanpa memindahkan materi. Ujung terikat memantulkan gelombang dengan fase terbalik (berlawanan)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "PAUSE" : "START"}
              </button>
              <button onClick={reset} className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl border border-white/5 transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
