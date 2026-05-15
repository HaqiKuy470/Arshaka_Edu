"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Radio } from "lucide-react";
import Link from "next/link";

export default function BandulSederhana() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Settings
  const [length, setLength] = useState(1.5); // meters
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [mass, setMass] = useState(2); // kg
  const [damping, setDamping] = useState(0.02); // air resistance

  // Physics State
  const [theta, setTheta] = useState(Math.PI / 4); // position angle
  const [omega, setOmega] = useState(0); // angular velocity
  
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Derived Physics
  const period = 2 * Math.PI * Math.sqrt(length / gravity);
  const frequency = 1 / period;
  const maxVel = Math.sqrt(2 * gravity * length * (1 - Math.cos(theta))); // approximate max v

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = timestamp;

        // Physics: alpha = -(g/L) * sin(theta) - damping * omega
        const alpha = -(gravity / length) * Math.sin(theta);
        const friction = -damping * omega;
        
        setOmega(w => w + (alpha + friction) * dt);
        setTheta(t => t + omega * dt);

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, theta, omega, gravity, length, damping]);

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
      const cy = 100;
      const meterScale = 150;
      const visualLength = length * meterScale;

      // --- Draw Pivot Area ---
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.roundRect(cx - 40, cy - 15, 80, 15, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.stroke();

      // --- Draw Protractor Grid ---
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let a = -60; a <= 60; a += 15) {
        const rad = (a * Math.PI) / 180 + Math.PI/2;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * (visualLength + 40), cy + Math.sin(rad) * (visualLength + 40));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Equilibrium Line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + visualLength + 40);
      ctx.stroke();

      const px = cx + Math.sin(theta) * visualLength;
      const py = cy + Math.cos(theta) * visualLength;

      // --- Draw Arc Path Trace ---
      ctx.beginPath();
      ctx.arc(cx, cy, visualLength, Math.PI/2 - 1, Math.PI/2 + 1);
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Draw String ---
      const stringGrad = ctx.createLinearGradient(cx, cy, px, py);
      stringGrad.addColorStop(0, "#52525b");
      stringGrad.addColorStop(1, "#a1a1aa");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = stringGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Draw Bob (Ball) ---
      const r = 20 + mass * 2;
      const bobGrad = ctx.createRadialGradient(px - r/3, py - r/3, 0, px, py, r);
      bobGrad.addColorStop(0, "#f59e0b");
      bobGrad.addColorStop(1, "#78350f");
      
      // Shadow
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.fillStyle = bobGrad;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.arc(px - r/3, py - r/3, r/4, 0, Math.PI * 2); ctx.fill();

      // --- Pivot Detail ---
      ctx.fillStyle = "white";
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [theta, length, mass]);

  const reset = () => {
    setTheta(Math.PI / 4);
    setOmega(0);
    lastTimeRef.current = 0;
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Bandul Sederhana</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Osilasi Harmonik • Fisika</span>
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
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Osilasi</span>
              </div>
              
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Periode (T)</span>
                       <span className="text-xl font-black text-white font-mono">{period.toFixed(2)} s</span>
                    </div>
                    <Timer className="w-5 h-5 text-amber-500/50" />
                 </div>
                 
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Frekuensi (f)</span>
                       <span className="text-xl font-black text-rose-400 font-mono">{frequency.toFixed(2)} Hz</span>
                    </div>
                    <Radio className="w-5 h-5 text-rose-500/50" />
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kecepatan Maks</span>
                       <span className="text-xl font-black text-emerald-400 font-mono">{maxVel.toFixed(1)} m/s</span>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Variabel</span>
              </div>

              {/* Length Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Panjang Tali: {length.toFixed(1)}m</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="0.5" max="3" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} />
              </div>

              {/* Gravity Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Gravitasi: {gravity.toFixed(1)} m/s²</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="1" max="25" step="0.5" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
                 <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Bulan</span><span>Bumi</span><span>Jupiter</span></div>
              </div>

              {/* Damping Slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Hambatan Udara: {(damping * 100).toFixed(0)}%</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" min="0" max="0.2" step="0.01" value={damping} onChange={(e) => setDamping(parseFloat(e.target.value))} />
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Periode ayunan bandul hanya dipengaruhi oleh panjang tali dan percepatan gravitasi, tidak bergantung pada massa beban."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'}`}>
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Hentikan Ayunan' : 'Mulai Ayunan'}
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Posisi
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}
