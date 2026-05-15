"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun } from "lucide-react";
import Link from "next/link";

type Material = { name: string; n: number; color: string };
const MATERIALS: Material[] = [
  { name: "Udara", n: 1.0, color: "rgba(255, 255, 255, 0.05)" },
  { name: "Air", n: 1.33, color: "rgba(56, 189, 248, 0.2)" },
  { name: "Kaca", n: 1.5, color: "rgba(148, 163, 184, 0.3)" },
  { name: "Berlian", n: 2.42, color: "rgba(241, 245, 249, 0.4)" },
];

export default function PemantulanPembiasan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.5);
  const [angleIncident, setAngleIncident] = useState(45);
  const [showNormal, setShowNormal] = useState(true);

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
      const cy = canvas.height / 2;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;

      // --- Draw Mediums ---
      // Top Medium (n1)
      const m1 = MATERIALS.find(m => Math.abs(m.n - n1) < 0.05) || MATERIALS[0];
      ctx.fillStyle = m1.color;
      ctx.fillRect(0, 0, arenaW, cy);
      
      // Bottom Medium (n2)
      const m2 = MATERIALS.find(m => Math.abs(m.n - n2) < 0.05) || MATERIALS[2];
      ctx.fillStyle = m2.color;
      ctx.fillRect(0, cy, arenaW, arenaH - cy);

      // Interface Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(arenaW, cy); ctx.stroke();

      // Normal Line
      if (showNormal) {
        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, arenaH); ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- Physics Logic ---
      const theta1 = (angleIncident * Math.PI) / 180;
      const sinTheta2 = (n1 * Math.sin(theta1)) / n2;
      const isTIR = sinTheta2 > 1.0;
      const theta2 = isTIR ? 0 : Math.asin(sinTheta2);
      
      const rayLen = 1000;

      // --- Draw Rays ---
      
      // Incident Ray (From Top Left)
      const incX = cx - Math.sin(theta1) * 300;
      const incY = cy - Math.cos(theta1) * 300;
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#f43f5e";
      ctx.strokeStyle = "#f43f5e"; // rose-500
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(incX, incY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Reflected Ray
      ctx.shadowColor = "#f43f5e";
      ctx.strokeStyle = isTIR ? "#f43f5e" : "rgba(244, 63, 94, 0.3)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(theta1) * rayLen, cy - Math.cos(theta1) * rayLen);
      ctx.stroke();

      // Refracted Ray
      if (!isTIR) {
        ctx.shadowColor = "#38bdf8";
        ctx.strokeStyle = "#38bdf8"; // sky-400
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(theta2) * rayLen, cy + Math.cos(theta2) * rayLen);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // --- Draw Angles & Labels ---
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      
      // Incident Angle Arc
      ctx.beginPath();
      ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
      ctx.arc(cx, cy, 40, -Math.PI/2 - theta1, -Math.PI/2);
      ctx.stroke();
      ctx.fillText(`θ₁ = ${angleIncident}°`, cx - 50, cy - 50);

      if (!isTIR) {
        // Refracted Angle Arc
        ctx.beginPath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.arc(cx, cy, 40, Math.PI/2, Math.PI/2 - theta2, true);
        ctx.stroke();
        ctx.fillText(`θ₂ = ${(theta2 * 180 / Math.PI).toFixed(1)}°`, cx + 50, cy + 60);
      } else {
        ctx.fillStyle = "#f43f5e";
        ctx.font = "black 14px Inter";
        ctx.fillText("TOTAL INTERNAL REFLECTION", cx + 150, cy - 50);
      }

      // Laser Source Pointer
      ctx.fillStyle = "#18181b";
      ctx.save();
      ctx.translate(incX, incY);
      ctx.rotate(-Math.PI/2 - theta1);
      ctx.roundRect(-20, -8, 40, 16, 4);
      ctx.fill();
      ctx.strokeStyle = "#f43f5e"; ctx.stroke();
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, n1, n2, angleIncident, showNormal]);

  const reset = () => {
    setAngleIncident(45);
    setN1(1.0);
    setN2(1.5);
  };

  const criticalAngle = n1 > n2 ? (Math.asin(n2/n1) * 180 / Math.PI).toFixed(1) : null;

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Pemantulan & Pembiasan</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Optik Geometris • Snellius • TIR</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Snell's Law HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Incident Angle (θ₁)</span>
                    <span className="text-xl font-black text-rose-500">{angleIncident}°</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Refracted Angle (θ₂)</span>
                    <span className="text-xl font-black text-sky-400">
                      {(n1 * Math.sin(angleIncident * Math.PI / 180) / n2 > 1) ? "N/A" : (Math.asin(n1 * Math.sin(angleIncident * Math.PI / 180) / n2) * 180 / Math.PI).toFixed(1) + "°"}
                    </span>
                 </div>
              </div>
              
              {criticalAngle && (
                <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                   <span className="text-[9px] text-amber-400 font-bold uppercase">Critical Angle (θc)</span>
                   <span className="text-xs font-black text-white">{criticalAngle}°</span>
                </div>
              )}
           </div>

           {/* Material Selector Medium 1 */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Sun className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Medium 1 (Atas)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {MATERIALS.map(m => (
                   <button key={`n1-${m.name}`} onClick={() => setN1(m.n)} className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${n1 === m.n ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      {m.name} ({m.n})
                   </button>
                 ))}
              </div>
           </div>

           {/* Material Selector Medium 2 */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Droplets className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Medium 2 (Bawah)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {MATERIALS.map(m => (
                   <button key={`n2-${m.name}`} onClick={() => setN2(m.n)} className={`py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${n2 === m.n ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      {m.name} ({m.n})
                   </button>
                 ))}
              </div>
           </div>

           {/* Angle Slider */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rotasi Laser</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="0" max="89" value={angleIncident} onChange={(e) => setAngleIncident(parseInt(e.target.value))} />
              </div>
           </div>

           {/* Insights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-rose-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Optik</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                 Saat cahaya berpindah dari medium rapat (n1 besar) ke renggang (n1 kecil), cahaya akan menjauhi normal. Jika sudut θ₁ &gt; θc, terjadi <strong className="text-rose-400">Pemantulan Internal Total</strong>.
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setShowNormal(!showNormal)} className={`flex-1 py-3 rounded-xl border text-[9px] font-bold transition-all ${showNormal ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                 {showNormal ? "Hide Normal" : "Show Normal"}
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
