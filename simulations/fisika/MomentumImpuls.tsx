"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer } from "lucide-react";
import Link from "next/link";

export default function MomentumImpuls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Settings
  const [mass, setMass] = useState(4); // kg
  const [vInitial, setVInitial] = useState(15); // m/s
  const [contactTime, setContactTime] = useState(0.3); // seconds
  const [elasticity, setElasticity] = useState(0.8); // bounce factor

  // Simulation State
  const [pos, setPos] = useState(-300);
  const [vel, setVel] = useState(vInitial);
  const [impactForce, setImpactForce] = useState(0);
  const [showSpark, setShowSpark] = useState(false);
  
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);
  const impactTimerRef = useRef(0);

  // Derived Physics
  const vFinal = -vInitial * elasticity;
  const deltaP = mass * (vFinal - vInitial);
  const avgForce = Math.abs(deltaP / contactTime);

  useEffect(() => {
    if (!isRunning) {
      setVel(vInitial);
    }
  }, [vInitial, isRunning]);

  // Physics Loop
  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const visualScale = 40;
        const wallX = 150; // Visual wall position
        const ballR = 20 + mass * 3;

        setPos(p => {
          let nextP = p + vel * dt * visualScale;
          
          // Collision Logic
          if (nextP + ballR >= wallX && vel > 0) {
            if (impactTimerRef.current === 0) {
              impactTimerRef.current = timestamp;
              setImpactForce(avgForce);
              setShowSpark(true);
            }

            const elapsedImpact = (timestamp - impactTimerRef.current) / 1000;
            
            if (elapsedImpact >= contactTime) {
              setVel(vFinal);
              setImpactForce(0);
              setShowSpark(false);
              return wallX - ballR - 1; 
            } else {
              return wallX - ballR; // Pressed against wall
            }
          }
          
          return nextP;
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
      impactTimerRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, vel, contactTime, vFinal, avgForce, mass]);

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
      const cy = canvas.height * 0.6;
      const wallX = cx + 150;

      // --- Draw Ground ---
      const groundY = cy;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGrad.addColorStop(0, "#18181b");
      groundGrad.addColorStop(1, "#09090b");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

      // --- Draw Wall ---
      const wallW = 60;
      const wallH = 200;
      const wallGrad = ctx.createLinearGradient(wallX, cy - wallH, wallX + wallW, cy - wallH);
      wallGrad.addColorStop(0, "#3f3f46");
      wallGrad.addColorStop(0.5, "#52525b");
      wallGrad.addColorStop(1, "#27272a");
      ctx.fillStyle = wallGrad;
      ctx.beginPath();
      ctx.roundRect(wallX, cy - wallH, wallW, wallH, [0, 10, 0, 0]);
      ctx.fill();
      // Wall Detail
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let i = 20; i < wallH; i += 40) {
        ctx.beginPath(); ctx.moveTo(wallX, cy - i); ctx.lineTo(wallX + wallW, cy - i); ctx.stroke();
      }

      // --- Draw Ball ---
      const r = 20 + mass * 3;
      const bx = cx + pos;
      const by = cy - r;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath(); ctx.ellipse(bx, cy, r, r/4, 0, 0, Math.PI * 2); ctx.fill();

      // Rolling Rotation
      const rotation = pos / r;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(rotation);
      const grad = ctx.createRadialGradient(-r/3, -r/3, 0, 0, 0, r);
      grad.addColorStop(0, "#f59e0b"); // amber-500
      grad.addColorStop(1, "#b45309"); // amber-700
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      // Markings
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = r/4;
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath(); ctx.arc(-r/3, -r/3, r/3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // --- Impact Effect ---
      if (showSpark) {
        ctx.beginPath();
        const sparkGrad = ctx.createRadialGradient(wallX, by, 0, wallX, by, 60);
        sparkGrad.addColorStop(0, "rgba(255,255,255,0.8)");
        sparkGrad.addColorStop(1, "rgba(239,68,68,0)");
        ctx.fillStyle = sparkGrad;
        ctx.arc(wallX, by, 60, 0, Math.PI * 2);
        ctx.fill();

        // Impulse Arrow
        const arrowLen = Math.min(150, impactForce / 5);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(wallX, by); ctx.lineTo(wallX - arrowLen, by); ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(wallX - arrowLen, by);
        ctx.lineTo(wallX - arrowLen + 10, by - 6);
        ctx.lineTo(wallX - arrowLen + 10, by + 6);
        ctx.fill();
        ctx.font = "bold 12px monospace";
        ctx.fillText(`${impactForce.toFixed(0)} N`, wallX - arrowLen/2 - 20, by - 15);
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [pos, impactForce, showSpark, mass]);

  const reset = () => {
    setIsRunning(false);
    setPos(-300);
    setVel(vInitial);
    setImpactForce(0);
    setShowSpark(false);
    lastTimeRef.current = 0;
    impactTimerRef.current = 0;
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Physics Insight */}
      <div className="absolute top-20 right-8 w-80 glass-card p-5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl z-20 pointer-events-none bg-black/40">
        <div className="flex items-center gap-2 mb-2">
           <ShieldAlert className="w-4 h-4 text-amber-400" />
           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed italic">
           "Dalam sistem tertutup, total momentum sebelum dan sesudah tumbukan selalu konstan. Impuls adalah perubahan momentum yang dihasilkan dari gaya sesaat."
        </p>
      </div>


      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Momentum & Impuls</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dinamika Partikel • Fisika</span>
          </div>
        </div>
      </div>

      {/* TOP ANALISIS CARDS */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Momentum Awal (p)</div>
              <div className="text-xl font-black text-white font-mono">{(mass * vInitial).toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500">kg·m/s</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Move className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Impuls (I)</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{Math.abs(deltaP).toFixed(1)}<span className="text-[10px] ml-1 text-zinc-500">N·s</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Gaya Rata-rata (F)</div>
              <div className="text-xl font-black text-rose-400 font-mono">{avgForce.toFixed(0)}<span className="text-[10px] ml-1 text-zinc-500">Newton</span></div>
            </div>
          </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-20">
        <div className="glass-card p-5 rounded-[28px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-5">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Mass & Velocity */}
            <div className="space-y-3 p-3 bg-white/5 border border-white/5 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Massa & Kecepatan</span>
                  <span className="text-[10px] font-mono text-amber-400">{mass}kg / {vInitial}m/s</span>
               </div>
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="1" max="10" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} disabled={isRunning} />
               <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="5" max="30" step="1" value={vInitial} onChange={(e) => setVInitial(parseInt(e.target.value))} disabled={isRunning} />
            </div>

            {/* Contact Time */}
            <div className="space-y-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Waktu Kontak (Δt)</span>
                  <span className="text-[10px] font-mono text-rose-400">{contactTime}s</span>
               </div>
               <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="0.1" max="1.0" step="0.1" value={contactTime} onChange={(e) => setContactTime(parseFloat(e.target.value))} disabled={isRunning} />
               <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Keras (0.1s)</span><span>Lunak (1.0s)</span></div>
            </div>

            {/* Elasticity */}
            <div className="space-y-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex-1">
               <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Lenting (Bounce)</span>
                  <span className="text-[10px] font-mono text-indigo-400">{(elasticity * 100).toFixed(0)}%</span>
               </div>
               <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" min="0" max="1" step="0.1" value={elasticity} onChange={(e) => setElasticity(parseFloat(e.target.value))} disabled={isRunning} />
               <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase"><span>Plastis</span><span>Elastis</span></div>
            </div>
          </div>

          <div className="flex gap-3 w-full justify-center border-t border-white/5 pt-4">
            <button onClick={() => setIsRunning(true)} disabled={isRunning} className={`flex-1 max-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-zinc-500' : 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-500/20'}`}>
              <Play className="w-4 h-4 fill-current"/> Lempar Bola
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
