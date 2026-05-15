"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Resonansi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [drivingFreq, setDrivingFreq] = useState(1.5); // Hz
  const [naturalFreq, setNaturalFreq] = useState(2.0); // Hz
  const [damping, setDamping] = useState(0.1);
  const [mass, setMass] = useState(1.0);

  const timeRef = useRef(0);
  const posRef = useRef(0);
  const velRef = useRef(0);
  const animationRef = useRef(0);
  const amplitudeHistoryRef = useRef<number[]>([]);

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

      const dt = 0.016; // 60fps
      if (isRunning) {
        timeRef.current += dt;
        
        // Physics: m*x'' + c*x' + k*x = F0 * cos(wd * t)
        const k = Math.pow(naturalFreq * 2 * Math.PI, 2) * mass;
        const c = damping * 10;
        const wd = drivingFreq * 2 * Math.PI;
        const F0 = 200; // Force magnitude

        const accel = (F0 * Math.cos(wd * timeRef.current) - c * velRef.current - k * posRef.current) / mass;
        velRef.current += accel * dt;
        posRef.current += velRef.current * dt;

        // Record amplitude history for the graph
        if (timeRef.current % 0.1 < 0.02) {
          amplitudeHistoryRef.current.push(Math.abs(posRef.current));
          if (amplitudeHistoryRef.current.length > 200) amplitudeHistoryRef.current.shift();
        }
      }

      const driveY = Math.cos(drivingFreq * 2 * Math.PI * timeRef.current) * 20;
      const massY = cy + posRef.current;

      // --- Draw Background Grid ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }

      // --- Draw Driver (Shaker) ---
      const shakerW = 100;
      const shakerH = 30;
      const sy = cy - 200 + driveY;
      
      const shakerGrad = ctx.createLinearGradient(cx - shakerW/2, sy, cx + shakerW/2, sy);
      shakerGrad.addColorStop(0, "#3f3f46");
      shakerGrad.addColorStop(0.5, "#71717a");
      shakerGrad.addColorStop(1, "#3f3f46");
      ctx.fillStyle = shakerGrad;
      ctx.roundRect(cx - shakerW/2, sy, shakerW, shakerH, 8);
      ctx.fill();
      ctx.strokeStyle = "#52525b"; ctx.stroke();

      // Energy Pulse from Shaker
      if (Math.abs(drivingFreq - naturalFreq) < 0.2) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#f43f5e";
        ctx.strokeStyle = "rgba(244, 63, 94, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, sy + shakerH, 20 + driveY, 0, Math.PI, false); ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // --- Draw Spring ---
      ctx.strokeStyle = "#a1a1aa";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, sy + shakerH);
      const springBottom = massY - 30;
      const numCoils = 15;
      const springLen = springBottom - (sy + shakerH);
      for (let i = 0; i <= numCoils; i++) {
        const x = cx + (i % 2 === 0 ? 15 : -15);
        const y = (sy + shakerH) + (i / numCoils) * springLen;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // --- Draw Mass ---
      const mSize = 60 + mass * 5;
      ctx.save();
      ctx.translate(cx, massY);
      
      // Glow based on energy
      const energyGlow = Math.min(60, Math.abs(posRef.current) * 0.5);
      ctx.shadowBlur = energyGlow;
      ctx.shadowColor = "#f43f5e";

      const massGrad = ctx.createRadialGradient(-10, -10, 5, 0, 0, 30);
      massGrad.addColorStop(0, "#fb7185");
      massGrad.addColorStop(1, "#e11d48");
      ctx.fillStyle = massGrad;
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
      
      ctx.fillStyle = "white"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText("M", 0, 5);
      ctx.restore();

      // --- Draw Resonance Curve Graph ---
      const gx = cx + 150;
      const gy = cy + 100;
      const gw = 200;
      const gh = 150;

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.roundRect(gx - 20, gy - gh - 20, gw + 40, gh + 40, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy - gh); ctx.stroke();

      // Theoretical Curve
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let f = 0.5; f < 4; f += 0.05) {
        // A = F0 / sqrt((k - m*w^2)^2 + (c*w)^2)
        const wVal = f * 2 * Math.PI;
        const kVal = Math.pow(naturalFreq * 2 * Math.PI, 2) * mass;
        const cVal = damping * 10;
        const denom = Math.sqrt(Math.pow(kVal - mass * wVal * wVal, 2) + Math.pow(cVal * wVal, 2));
        const amp = 5000 / denom;
        const px = gx + ((f - 0.5) / 3.5) * gw;
        const py = gy - Math.min(gh, amp * 1);
        if (f === 0.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current Point on Curve
      const curX = gx + ((drivingFreq - 0.5) / 3.5) * gw;
      const wCur = drivingFreq * 2 * Math.PI;
      const kCur = Math.pow(naturalFreq * 2 * Math.PI, 2) * mass;
      const cCur = damping * 10;
      const ampCur = 5000 / Math.sqrt(Math.pow(kCur - mass * wCur * wCur, 2) + Math.pow(cCur * wCur, 2));
      const curY = gy - Math.min(gh, ampCur * 1);
      
      ctx.fillStyle = "#f43f5e";
      ctx.shadowBlur = 10; ctx.shadowColor = "#f43f5e";
      ctx.beginPath(); ctx.arc(curX, curY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "bold 9px Inter";
      ctx.textAlign = "left";
      ctx.fillText("FREKUENSI (Hz)", gx + gw - 60, gy + 15);
      ctx.save();
      ctx.translate(gx - 10, gy); ctx.rotate(-Math.PI/2);
      ctx.fillText("AMPLITUDO", 10, 0);
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, drivingFreq, naturalFreq, damping, mass]);

  const reset = () => {
    posRef.current = 0;
    velRef.current = 0;
    timeRef.current = 0;
    setDrivingFreq(1.5);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Resonansi Mekanik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Osilasi Paksa • Amplitudo • Energi</span>
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
           
           {/* Resonance Status Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${Math.abs(drivingFreq - naturalFreq) < 0.1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Sinkronisasi Energi</div>
              <div className={`text-2xl font-black ${Math.abs(drivingFreq - naturalFreq) < 0.1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                 {Math.abs(drivingFreq - naturalFreq) < 0.1 ? 'RESONANSI' : 'OFF-PEAK'}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${Math.abs(drivingFreq - naturalFreq) < 0.1 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                   {Math.abs(drivingFreq - naturalFreq) < 0.1 ? 'Transfer Maksimal' : 'Energi Terhambat'}
                 </span>
              </div>
           </div>

           {/* Frequency Controls */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Frekuensi</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Penggetar (f_drive)</label>
                       <span className="text-xs font-mono text-sky-400">{drivingFreq.toFixed(2)} Hz</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" min="0.5" max="4" step="0.01" value={drivingFreq} onChange={(e) => setDrivingFreq(parseFloat(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Frekuensi Alami (f₀)</label>
                       <span className="text-xs font-mono text-emerald-400">{naturalFreq.toFixed(2)} Hz</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" min="1" max="3" step="0.1" value={naturalFreq} onChange={(e) => setNaturalFreq(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Damping Control */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <Droplets className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Redaman (Damping)</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="0.05" max="0.5" step="0.01" value={damping} onChange={(e) => setDamping(parseFloat(e.target.value))} />
                 <div className="flex justify-between mt-2">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase">Tajam (Low)</span>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase">Lebar (High)</span>
                 </div>
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-rose-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Resonansi:</strong> Terjadi saat f_drive ≈ f_0. Perhatikan bagaimana simpangan massa melonjak dan massa mulai berpendar merah karena energi yang terserap maksimal.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Damping:</strong> Redaman yang lebih tinggi akan menurunkan puncak amplitudo dan membuat kurva resonansi menjadi lebih lebar.
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
