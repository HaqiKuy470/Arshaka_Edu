"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  yRatio: number;
}

export default function PrinsipBernoulli() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Settings
  const [v1, setV1] = useState(2); // m/s
  const [d1, setD1] = useState(12); // cm
  const [d2, setD2] = useState(6); // cm
  const [rho, setRho] = useState(1000); // kg/m^3

  // Math: Bernoulli & Continuity
  const v2 = v1 * Math.pow(d1 / d2, 2);
  const P_atm = 101325; // Pa
  const P1 = P_atm + 5000; // Standard pressure at input
  // P1 + 0.5*rho*v1^2 = P2 + 0.5*rho*v2^2
  const P2 = P1 + 0.5 * rho * (Math.pow(v1, 2) - Math.pow(v2, 2));

  // Animation State
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  useEffect(() => {
    const p: Particle[] = [];
    for (let i = 0; i < 120; i++) {
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
      const cy = canvas.height / 2 + 50;

      const h1 = d1 * 8;
      const h2 = d2 * 8;
      const transStart = cx - 100;
      const transEnd = cx + 100;

      if (isRunning) {
        particles.current.forEach(p => {
          let speed = v1 * 4;
          if (p.x > transEnd) speed = v2 * 4;
          else if (p.x > transStart) {
            const ratio = (p.x - transStart) / 200;
            speed = (v1 + (v2 - v1) * ratio) * 4;
          }
          p.x += speed;
          if (p.x > canvas.width - sidebarWidth) p.x = 0;
        });
      }

      // --- Draw Manometer Tubes (Vertical) ---
      const drawManometer = (x: number, pipeH: number, pressure: number) => {
         const tubeW = 24;
         const tubeH = 180;
         const waterLevelY = cy - pipeH/2 - (pressure - P_atm) / 100; // scale pressure to height
         
         // Tube Wall
         ctx.strokeStyle = "rgba(255,255,255,0.15)";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(x - tubeW/2, cy - pipeH/2);
         ctx.lineTo(x - tubeW/2, cy - pipeH/2 - tubeH);
         ctx.moveTo(x + tubeW/2, cy - pipeH/2);
         ctx.lineTo(x + tubeW/2, cy - pipeH/2 - tubeH);
         ctx.stroke();

         // Water in tube
         ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
         ctx.fillRect(x - tubeW/2 + 2, waterLevelY, tubeW - 4, (cy - pipeH/2) - waterLevelY);
         
         // Pressure Label
         ctx.fillStyle = "white";
         ctx.font = "bold 11px monospace";
         ctx.textAlign = "center";
         ctx.fillText(`${(pressure/1000).toFixed(1)} kPa`, x, cy - pipeH/2 - tubeH - 10);
      };

      drawManometer(cx - 220, h1, P1);
      drawManometer(cx + 220, h2, P2);

      // --- Draw Pipe ---
      ctx.beginPath();
      ctx.fillStyle = "rgba(14, 165, 233, 0.2)";
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(transStart, cy - h1/2);
      ctx.lineTo(transEnd, cy - h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy - h2/2);
      ctx.lineTo(canvas.width - sidebarWidth, cy + h2/2);
      ctx.lineTo(transEnd, cy + h2/2);
      ctx.lineTo(transStart, cy + h1/2);
      ctx.lineTo(0, cy + h1/2);
      ctx.fill();

      // Flow Lines
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      particles.current.forEach(p => {
        const currentH = p.x < transStart ? h1 : p.x > transEnd ? h2 : h1 + (h2 - h1) * ((p.x - transStart) / 200);
        const y = cy + p.yRatio * (currentH / 2);
        ctx.beginPath(); ctx.arc(p.x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        if (isRunning) {
          const speed = p.x < transStart ? v1 : p.x > transEnd ? v2 : (v1+v2)/2;
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.beginPath(); ctx.moveTo(p.x, y); ctx.lineTo(p.x - speed * 4, y); ctx.stroke();
        }
      });

      // Walls
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, cy - h1/2); ctx.lineTo(transStart, cy - h1/2); ctx.lineTo(transEnd, cy - h2/2); ctx.lineTo(canvas.width - sidebarWidth, cy - h2/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, cy + h1/2); ctx.lineTo(transStart, cy + h1/2); ctx.lineTo(transEnd, cy + h2/2); ctx.lineTo(canvas.width - sidebarWidth, cy + h2/2);
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#38bdf8"; ctx.font = "bold 12px Inter";
      ctx.fillText(`v1 = ${v1.toFixed(1)} m/s`, cx - 220, cy + h1/2 + 30);
      ctx.fillStyle = "#10b981";
      ctx.fillText(`v2 = ${v2.toFixed(1)} m/s`, cx + 220, cy + h2/2 + 30);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [d1, d2, v1, v2, isRunning, P1, P2]);

  const reset = () => { setV1(2); setD1(12); setD2(6); };

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Prinsip Bernoulli</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Efek Venturi • Fisika</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Tekanan</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Tekanan Output (P2)</span>
                       <span className={`text-lg font-black font-mono ${P2 < P1 ? 'text-rose-400' : 'text-emerald-400'}`}>{(P2/1000).toFixed(1)} kPa</span>
                    </div>
                    <Gauge className="w-5 h-5 text-rose-500/50" />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Laju Keluar (v2)</span>
                       <span className="text-lg font-black text-emerald-400 font-mono">{v2.toFixed(1)} m/s</span>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Energi Kinetik Spesifik</span>
                       <span className="text-lg font-black text-sky-400 font-mono">{(0.5 * rho * v2 * v2 / 1000).toFixed(1)} kJ/m³</span>
                    </div>
                    <Waves className="w-5 h-5 text-sky-500/50" />
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
                    <label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Diameter Input (d1): {d1} cm</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="8" max="20" step="1" value={d1} onChange={(e) => setD1(parseInt(e.target.value))} />
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Diameter Output (d2): {d2} cm</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" min="2" max="20" step="1" value={d2} onChange={(e) => setD2(parseInt(e.target.value))} />
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Hukum Bernoulli menyatakan bahwa dalam aliran fluida konstan, setiap peningkatan laju aliran akan disertai dengan penurunan tekanan fluida tersebut."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Jeda Animasi' : 'Mulai Aliran'}
              </button>
              <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Parameter
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] text-zinc-500 leading-relaxed text-center italic">
                    "Pada bagian fluida yang bergerak lebih cepat, tekanannya justru akan menjadi lebih rendah."
                 </p>
                 <div className="mt-2 text-center text-xs font-black text-white">P + ½ρv² = Konstan</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
