"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  yRatio: number; // Vertical position relative to pipe height (-1 to 1)
}

export default function AliranFluida() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Settings
  const [v1, setV1] = useState(3); // m/s (Input velocity)
  const [d1, setD1] = useState(12); // cm (Input diameter)
  const [d2, setD2] = useState(6); // cm (Output diameter)

  // Math: A1v1 = A2v2 => (d1^2)v1 = (d2^2)v2
  const v2 = Math.pow(d1 / d2, 2) * v1;
  const A1 = Math.PI * Math.pow(d1 / 2, 2);
  const A2 = Math.PI * Math.pow(d2 / 2, 2);
  const Q = A1 * v1; // cm^3/s

  // Animation State
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  // Initialize Particles once
  useEffect(() => {
    const p: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      p.push({
        x: Math.random() * (window.innerWidth || 1000),
        yRatio: Math.random() * 1.6 - 0.8 
      });
    }
    particles.current = p;
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
      const cx = (canvas.width - sidebarWidth) / 2;
      const cy = canvas.height / 2;

      const h1 = d1 * 8;
      const h2 = d2 * 8;
      const transStart = cx - 80;
      const transEnd = cx + 80;

      // Update Particles if running
      if (isRunning) {
        particles.current.forEach(p => {
          let speed = v1 * 3;
          if (p.x > transEnd) {
            speed = v2 * 3;
          } else if (p.x > transStart) {
            const ratio = (p.x - transStart) / 160;
            speed = (v1 + (v2 - v1) * ratio) * 3;
          }
          p.x += speed;
          if (p.x > canvas.width - sidebarWidth) p.x = 0;
        });
      }

      // --- Draw Pipe Back / Liquid ---
      ctx.beginPath();
      const liquidGrad = ctx.createLinearGradient(0, cy - h1, 0, cy + h1);
      liquidGrad.addColorStop(0, "rgba(14, 165, 233, 0.1)");
      liquidGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.25)");
      liquidGrad.addColorStop(1, "rgba(14, 165, 233, 0.1)");
      ctx.fillStyle = liquidGrad;
      
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(transStart, cy - h1/2);
      ctx.lineTo(transEnd, cy - h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy - h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy + h2/2);
      ctx.lineTo(transEnd, cy + h2/2);
      ctx.lineTo(transStart, cy + h1/2);
      ctx.lineTo(0, cy + h1/2);
      ctx.fill();

      // --- Draw Flow Particles ---
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      particles.current.forEach(p => {
        const currentH = p.x < transStart ? h1 : p.x > transEnd ? h2 : h1 + (h2 - h1) * ((p.x - transStart) / 160);
        const y = cy + p.yRatio * (currentH / 2);
        
        ctx.beginPath();
        ctx.arc(p.x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (isRunning) {
           const speed = p.x < transStart ? v1 : p.x > transEnd ? v2 : (v1+v2)/2;
           ctx.strokeStyle = "rgba(255,255,255,0.15)";
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(p.x, y);
           ctx.lineTo(p.x - speed * 4, y);
           ctx.stroke();
        }
      });

      // --- Draw Pipe Walls ---
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(transStart, cy - h1/2);
      ctx.lineTo(transEnd, cy - h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy - h2/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, cy + h1/2);
      ctx.lineTo(transStart, cy + h1/2);
      ctx.lineTo(transEnd, cy + h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy + h2/2);
      ctx.stroke();

      // Glass Highlight
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 12;
      ctx.moveTo(0, cy - h1/2 + 10);
      ctx.lineTo(transStart, cy - h1/2 + 10);
      ctx.lineTo(transEnd, cy - h2/2 + 10);
      ctx.lineTo(canvas.width - sidebarWidth, cy - h2/2 + 10);
      ctx.stroke();

      // Labels
      const drawLabel = (x: number, y: number, label: string, color: string) => {
         ctx.fillStyle = color;
         ctx.font = "bold 13px monospace";
         ctx.textAlign = "center";
         ctx.fillText(label, x, y);
         ctx.strokeStyle = color;
         ctx.lineWidth = 1.5;
         ctx.beginPath(); ctx.moveTo(x - 20, y + 12); ctx.lineTo(x + 20, y + 12); ctx.stroke();
         ctx.beginPath(); ctx.moveTo(x + 20, y + 12); ctx.lineTo(x + 15, y + 8); ctx.lineTo(x + 15, y + 16); ctx.fill();
      }
      drawLabel(cx - 220, cy - h1/2 - 40, `v1 = ${v1.toFixed(1)} m/s`, "#38bdf8");
      drawLabel(cx + 220, cy - h2/2 - 40, `v2 = ${v2.toFixed(1)} m/s`, "#10b981");
    };

    const animate = () => {
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [d1, d2, v1, v2, isRunning]);

  const reset = () => {
    setV1(3);
    setD1(12);
    setD2(6);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Aliran Fluida</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Kontinuitas • Fisika</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" />

      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Fluida</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Debit Aliran (Q)</span>
                       <span className="text-lg font-black text-white font-mono">{Q.toFixed(0)} <span className="text-[10px] text-zinc-500">cm³/s</span></span>
                    </div>
                    <Waves className="w-5 h-5 text-blue-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Laju Keluar (v2)</span>
                       <span className="text-lg font-black text-emerald-400 font-mono">{v2.toFixed(1)} <span className="text-[10px] text-zinc-500">m/s</span></span>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Rasio Luas (A1:A2)</span>
                       <span className="text-lg font-black text-sky-400 font-mono">{(A1/A2).toFixed(1)}:1</span>
                    </div>
                    <Gauge className="w-5 h-5 text-sky-500/50" />
                 </div>
              </div>
           </div>

           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <Move className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Pipa</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Laju Input (v1): {v1} m/s</label>
                 </div>
                 <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="1" max="10" step="1" value={v1} onChange={(e) => setV1(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Diameter Kiri (d1): {d1} cm</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="5" max="20" step="1" value={d1} onChange={(e) => setD1(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Diameter Kanan (d2): {d2} cm</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" min="2" max="20" step="1" value={d2} onChange={(e) => setD2(parseInt(e.target.value))} />
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Hentikan Aliran' : 'Mulai Aliran'}
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
