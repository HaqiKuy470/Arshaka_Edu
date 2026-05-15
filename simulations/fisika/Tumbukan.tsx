"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Tumbukan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Settings
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(6);
  const [m2, setM2] = useState(4);
  const [v2, setV2] = useState(-3);
  const [elasticity, setElasticity] = useState(1); // 1 = elastic, 0 = inelastic

  // Simulation State
  const [pos1, setPos1] = useState(-200);
  const [pos2, setPos2] = useState(200);
  const [currV1, setCurrV1] = useState(v1);
  const [currV2, setCurrV2] = useState(v2);
  
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Sync initial velocities when not running
  useEffect(() => {
    if (!isRunning) {
      setCurrV1(v1);
      setCurrV2(v2);
    }
  }, [v1, v2, isRunning]);

  // Physics Loop
  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const visualScale = 30; // pixels per m/s

        setPos1(p1 => p1 + currV1 * dt * visualScale);
        setPos2(p2 => p2 + currV2 * dt * visualScale);

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, currV1, currV2]);

  // Collision Detection & Resolution
  useEffect(() => {
    if (!isRunning) return;

    const r1 = 20 + m1 * 4;
    const r2 = 20 + m2 * 4;
    const distance = pos2 - pos1;

    if (distance <= (r1 + r2)) {
      const e = elasticity;
      const totalM = m1 + m2;
      const nextV1 = ((m1 - e * m2) * currV1 + (1 + e) * m2 * currV2) / totalM;
      const nextV2 = ((m2 - e * m1) * currV2 + (1 + e) * m1 * currV1) / totalM;

      setCurrV1(nextV1);
      setCurrV2(nextV2);

      const overlap = (r1 + r2) - distance;
      setPos1(p => p - overlap / 2 - 1);
      setPos2(p => p + overlap / 2 + 1);
    }
  }, [pos1, pos2, currV1, currV2, m1, m2, elasticity, isRunning]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.55;

      // --- Draw Ground ---
      const groundY = cy;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGrad.addColorStop(0, "#18181b");
      groundGrad.addColorStop(1, "#09090b");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

      const drawBall = (x: number, mass: number, velocity: number, color1: string, color2: string) => {
        const r = 20 + mass * 4;
        const bx = cx + x;
        const by = cy - r;

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath(); ctx.ellipse(bx, cy, r, r/4, 0, 0, Math.PI * 2); ctx.fill();

        const rotation = x / r;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(rotation);
        const grad = ctx.createRadialGradient(-r/3, -r/3, 0, 0, 0, r);
        grad.addColorStop(0, color1); grad.addColorStop(1, color2);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = r/6;
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath(); ctx.arc(-r/3, -r/3, r/3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(10, r/2)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(`${mass}kg`, bx, by + r + 20);

        if (Math.abs(velocity) > 0.01) {
          const arrowLen = velocity * 15;
          const arrowY = by - r - 20;
          ctx.strokeStyle = color1;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(bx, arrowY); ctx.lineTo(bx + arrowLen, arrowY); ctx.stroke();
          const dir = Math.sign(velocity);
          ctx.fillStyle = color1;
          ctx.beginPath();
          ctx.moveTo(bx + arrowLen, arrowY);
          ctx.lineTo(bx + arrowLen - dir * 10, arrowY - 6);
          ctx.lineTo(bx + arrowLen - dir * 10, arrowY + 6);
          ctx.fill();
          ctx.font = "bold 10px monospace";
          ctx.fillText(`${velocity.toFixed(1)} m/s`, bx + arrowLen/2, arrowY - 10);
        }
      };

      drawBall(pos1, m1, currV1, "#0ea5e9", "#0369a1");
      drawBall(pos2, m2, currV2, "#f43f5e", "#be123c");
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [pos1, pos2, m1, m2, currV1, currV2]);

  const reset = () => {
    setIsRunning(false);
    setPos1(-200);
    setPos2(200);
    setCurrV1(v1);
    setCurrV2(v2);
    lastTimeRef.current = 0;
  };

  const initialMomentum = (m1 * v1) + (m2 * v2);
  const currentMomentum = (m1 * currV1) + (m2 * currV2);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Tumbukan & Momentum</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Kekekalan Momentum • Fisika</span>
          </div>
        </div>
      </div>

      {/* TOP FLOATING ANALISIS */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Momentum Awal</div>
              <div className="text-xl font-black text-white font-mono">{initialMomentum.toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500">kg·m/s</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Momentum Sekarang</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{currentMomentum.toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500">kg·m/s</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${Math.abs(initialMomentum - currentMomentum) < 0.1 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              <ShieldAlert className={`w-5 h-5 ${Math.abs(initialMomentum - currentMomentum) < 0.1 ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Status Hukum Fisika</div>
              <div className={`text-sm font-black uppercase tracking-tight ${Math.abs(initialMomentum - currentMomentum) < 0.1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {Math.abs(initialMomentum - currentMomentum) < 0.1 ? 'Kekekalan Terbukti' : 'Momentum Berubah'}
              </div>
            </div>
          </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-20">
        <div className="glass-card p-5 rounded-[28px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-5">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Object 1 */}
            <div className="space-y-3 p-3 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Benda 1 (m₁/v₁)</span>
                  <span className="text-[10px] font-mono text-sky-400">{m1}kg / {v1}m/s</span>
               </div>
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="1" max="10" step="1" value={m1} onChange={(e) => setM1(parseInt(e.target.value))} disabled={isRunning} />
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="-10" max="10" step="1" value={v1} onChange={(e) => setV1(parseInt(e.target.value))} disabled={isRunning} />
            </div>

            {/* Elasticity */}
            <div className="space-y-3 p-3 flex flex-col justify-center">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Lenting (e): {elasticity.toFixed(1)}</label>
               </div>
               <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0" max="1" step="0.1" value={elasticity} onChange={(e) => setElasticity(parseFloat(e.target.value))} />
               <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Inelastis</span><span>Elastis</span></div>
            </div>

            {/* Object 2 */}
            <div className="space-y-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Benda 2 (m₂/v₂)</span>
                  <span className="text-[10px] font-mono text-rose-400">{m2}kg / {v2}m/s</span>
               </div>
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="1" max="10" step="1" value={m2} onChange={(e) => setM2(parseInt(e.target.value))} disabled={isRunning} />
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="-10" max="10" step="1" value={v2} onChange={(e) => setV2(parseInt(e.target.value))} disabled={isRunning} />
            </div>
          </div>

          <div className="flex gap-3 w-full justify-center border-t border-white/5 pt-4">
            <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 max-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}>
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4 fill-current"/>}
              {isRunning ? 'Pause' : 'Mulai Tumbukan'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all active:scale-95">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
