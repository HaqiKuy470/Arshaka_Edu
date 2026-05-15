"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Info, Settings2, Anchor, ArrowDown, Scale , ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function KeseimbanganTorsi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Targets (where we want to be)
  const [targetM1, setTargetM1] = useState(10);
  const [targetD1, setTargetD1] = useState(4);
  const [targetM2, setTargetM2] = useState(15);
  const [targetD2, setTargetD2] = useState(2);

  // Current values (for animation)
  const [m1, setM1] = useState(10);
  const [d1, setD1] = useState(4);
  const [m2, setM2] = useState(15);
  const [d2, setD2] = useState(2);
  const [tilt, setTilt] = useState(0);

  const animationRef = useRef(0);
  const g = 9.8;

  // Animation Loop for Smooth Transitions
  useEffect(() => {
    const update = () => {
      // Lerp function: current + (target - current) * factor
      const lerp = (cur: number, tar: number, factor: number) => cur + (tar - cur) * factor;
      
      setM1(v => lerp(v, targetM1, 0.15));
      setD1(v => lerp(v, targetD1, 0.1));
      setM2(v => lerp(v, targetM2, 0.15));
      setD2(v => lerp(v, targetD2, 0.1));

      // Calculate desired tilt
      const torque1 = targetM1 * g * targetD1;
      const torque2 = targetM2 * g * targetD2;
      const net = torque1 - torque2;
      
      const maxTilt = 20 * (Math.PI / 180);
      const targetTilt = Math.max(-maxTilt, Math.min(maxTilt, net * 0.005));
      setTilt(v => lerp(v, targetTilt, 0.05));

      animationRef.current = requestAnimationFrame(update);
    };
    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [targetM1, targetD1, targetM2, targetD2]);

  // Canvas Render
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
      const cy = canvas.height * 0.45; // Moved up from 0.6
      const scale = 40; // px per meter

      // --- Draw Pivot ---
      ctx.fillStyle = "#3f3f46"; // zinc-700
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 30, cy + 120); // Height increased from 80
      ctx.lineTo(cx + 30, cy + 120);
      ctx.closePath();
      ctx.fill();
      // Pivot Highlight
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Draw Lever Plank (Tilted) ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-tilt); // CCW torque is positive tilt

      // Plank Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(-340, 5, 680, 5);

      // Plank Body
      const plankGrad = ctx.createLinearGradient(-350, -10, 350, 0);
      plankGrad.addColorStop(0, "#d97706");
      plankGrad.addColorStop(0.5, "#f59e0b");
      plankGrad.addColorStop(1, "#d97706");
      ctx.fillStyle = plankGrad;
      ctx.beginPath();
      ctx.roundRect(-350, -12, 700, 12, 4);
      ctx.fill();

      // Plank Markers
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.font = "bold 10px Inter, sans-serif";
      for (let i = -8; i <= 8; i++) {
        if (i === 0) continue;
        const x = i * scale;
        ctx.fillRect(x - 1, -12, 2, 8);
        ctx.fillText(Math.abs(i).toString(), x - 4, 15);
      }

      // --- Draw Weights ---
      const drawWeight = (dist: number, mass: number, color: string, label: string) => {
        const size = 30 + mass * 0.5;
        const wx = dist * scale - size/2;
        const wy = -12 - size;

        // Weight Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(wx, wy, size, size, 6);
        ctx.fill();
        // Inner detail
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 2;
        ctx.strokeRect(wx + 5, wy + 5, size - 10, size - 10);

        // Mass text
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(mass)}kg`, wx + size/2, wy + size/2 + 4);

        // Gravity Arrow
        ctx.strokeStyle = color;
        ctx.setLineDash([4, 2]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wx + size/2, wy + size);
        ctx.lineTo(wx + size/2, wy + size + 40);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawWeight(-d1, m1, "#0ea5e9", "m1");
      drawWeight(d2, m2, "#f43f5e", "m2");

      ctx.restore();

      // --- Draw Ground ---
      const groundY = cy + 120; // Lowered from 80
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGrad.addColorStop(0, "#18181b"); // zinc-900
      groundGrad.addColorStop(1, "#09090b"); // zinc-950
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [m1, d1, m2, d2, tilt]);

  const reset = () => {
    setTargetM1(10);
    setTargetD1(4);
    setTargetM2(15);
    setTargetD2(2);
  };

  const torque1 = targetM1 * g * targetD1;
  const torque2 = targetM2 * g * targetD2;
  const net = torque1 - torque2;

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
           "Sistem berada dalam kesetimbangan rotasi ketika total momen gaya (torsi) yang memutar ke kanan sama dengan momen yang memutar ke kiri."
        </p>
      </div>


      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Keseimbangan Torsi</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Momen Gaya • Fisika</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {Math.abs(net) < 1 ? (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Sistem Seimbang</span>
            </div>
          ) : (
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${net > 0 ? 'bg-sky-500/20 border-sky-500/50' : 'bg-rose-500/20 border-rose-500/50'} border`}>
              <Scale className={`w-4 h-4 ${net > 0 ? 'text-sky-400' : 'text-rose-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${net > 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                Torsi Netto: {Math.abs(net).toFixed(0)} N·m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Status Cards */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Anchor className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Torsi Kiri (τ₁)</div>
              <div className="text-xl font-black text-sky-400 font-mono">{torque1.toFixed(0)}<span className="text-xs ml-1 text-zinc-500">N·m</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Anchor className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Torsi Kanan (τ₂)</div>
              <div className="text-xl font-black text-rose-400 font-mono">{torque2.toFixed(0)}<span className="text-xs ml-1 text-zinc-500">N·m</span></div>
            </div>
          </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 z-20">
        <div className="glass-card p-4 rounded-[24px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
            {/* Left Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center"><label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Beban Kiri</label></div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold px-1">Massa (kg)</span>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sky-400 font-mono text-xs outline-none" value={targetM1} onChange={(e) => setTargetM1(parseFloat(e.target.value) || 0)} />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold px-1">Jarak (m)</span>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sky-400 font-mono text-xs outline-none" value={targetD1} onChange={(e) => setTargetD1(parseFloat(e.target.value) || 0)} />
                 </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center"><label className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Beban Kanan</label></div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold px-1">Massa (kg)</span>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-rose-400 font-mono text-xs outline-none" value={targetM2} onChange={(e) => setTargetM2(parseFloat(e.target.value) || 0)} />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold px-1">Jarak (m)</span>
                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-rose-400 font-mono text-xs outline-none" value={targetD2} onChange={(e) => setTargetD2(parseFloat(e.target.value) || 0)} />
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white/5 pt-3 flex justify-center gap-4">
             <button onClick={reset} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all active:scale-95">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Posisi
             </button>
          </div>

        </div>
      </div>

    </div>
  );
}
