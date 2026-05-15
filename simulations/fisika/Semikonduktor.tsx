"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Layers } from "lucide-react";
import Link from "next/link";

type Mode = "diode" | "transistor";

interface Particle {
  id: number;
  x: number;
  y: number;
  type: "hole" | "electron";
  vx: number;
}

export default function Semikonduktor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("diode");
  const [voltage, setVoltage] = useState(0.5); // Bias voltage
  const [isReverse, setIsReverse] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  // Constants
  const threshold = 0.7; // Si diode threshold
  const isConducting = !isReverse && voltage >= threshold;

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 100 - 50,
        type: Math.random() > 0.5 ? "hole" : "electron",
        vx: 0
      });
    }
    particlesRef.current = initialParticles;
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

      // Depletion logic
      const dBase = 40;
      const dWidth = isReverse ? dBase + voltage * 40 : Math.max(0, dBase - (voltage / threshold) * dBase);

      // --- Draw P and N Regions ---
      const regionW = 200;
      const regionH = 120;

      // P-Type Region (Reddish)
      ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
      ctx.fillRect(cx - regionW, cy - regionH / 2, regionW, regionH);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.2)";
      ctx.strokeRect(cx - regionW, cy - regionH / 2, regionW, regionH);

      // N-Type Region (Bluish)
      ctx.fillStyle = "rgba(59, 130, 246, 0.05)";
      ctx.fillRect(cx, cy - regionH / 2, regionW, regionH);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.strokeRect(cx, cy - regionH / 2, regionW, regionH);

      // --- Draw Depletion Region ---
      const grad = ctx.createLinearGradient(cx - dWidth / 2, 0, cx + dWidth / 2, 0);
      grad.addColorStop(0, "rgba(239, 68, 68, 0)");
      grad.addColorStop(0.5, "rgba(39, 39, 42, 0.4)"); // zinc-800
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - dWidth / 2, cy - regionH / 2, dWidth, regionH);

      // Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText("TIPE P (ANODE)", cx - regionW / 2, cy + regionH / 2 + 20);
      ctx.fillText("TIPE N (CATHODE)", cx + regionW / 2, cy + regionH / 2 + 20);
      if (dWidth > 10) ctx.fillText("DEPLETION", cx, cy - regionH / 2 - 10);

      // --- Draw Circuitry ---
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - regionW, cy); ctx.lineTo(cx - regionW - 50, cy);
      ctx.lineTo(cx - regionW - 50, cy + 150);
      ctx.lineTo(cx + regionW + 50, cy + 150);
      ctx.lineTo(cx + regionW + 50, cy);
      ctx.lineTo(cx + regionW, cy);
      ctx.stroke();

      // Battery
      const bx = cx;
      const by = cy + 150;
      ctx.fillStyle = "#09090b";
      ctx.fillRect(bx - 30, by - 15, 60, 30);
      ctx.strokeStyle = isReverse ? "#3b82f6" : "#ef4444";
      ctx.strokeRect(bx - 30, by - 15, 60, 30);
      ctx.fillStyle = isReverse ? "#3b82f6" : "#ef4444";
      ctx.fillRect(isReverse ? bx + 15 : bx - 30, by - 15, 15, 30);

      // Status Glow
      if (isConducting) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#34d399";
        ctx.strokeStyle = "#34d399";
        ctx.strokeRect(cx - regionW, cy - regionH / 2, regionW * 2, regionH);
        ctx.shadowBlur = 0;
      }

      // --- Particles ---
      particlesRef.current.forEach(p => {
        // Movement Logic
        const force = isReverse ? -voltage * 2 : (voltage / threshold) * 5;
        if (p.type === "hole") {
          // Holes move with field
          p.vx = force * 0.2;
          if (p.x > 0 && !isConducting) p.x = -Math.random() * 10; // Keep in P region if blocked
        } else {
          // Electrons move against field
          p.vx = -force * 0.2;
          if (p.x < 0 && !isConducting) p.x = Math.random() * 10; // Keep in N region if blocked
        }

        p.x += p.vx;

        // Reset if out of bounds
        if (p.x < -regionW) p.x = -10;
        if (p.x > regionW) p.x = 10;

        // Draw
        ctx.beginPath();
        if (p.type === "hole") {
          ctx.strokeStyle = "#f87171"; // red-400
          ctx.lineWidth = 2;
          ctx.arc(cx + p.x, cy + p.y, 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#60a5fa"; // blue-400
          ctx.arc(cx + p.x, cy + p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Recombination Sparks if conducting
        if (isConducting && Math.abs(p.x) < 5) {
          ctx.fillStyle = "white";
          ctx.beginPath(); ctx.arc(cx + p.x, cy + p.y, 6, 0, Math.PI * 2); ctx.fill();
        }
      });
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [voltage, isReverse, mode, isConducting]);

  const reset = () => {
    setVoltage(0.5);
    setIsReverse(false);
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
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">Semikonduktor (P-N Junction)</h1>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dioda • Area Deplesi • Carrier Physics</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">

          {/* Current Status Card */}
          <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${isConducting ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Konduktivitas</div>
            <div className={`text-2xl font-black ${isConducting ? 'text-emerald-400' : 'text-rose-500'}`}>
              {isConducting ? 'CONDUCTING' : 'BLOCKING'}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConducting ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {isConducting ? 'Arus Mengalir' : 'Arus Terhenti'}
              </span>
            </div>
          </div>

          {/* Bias Switch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCcw className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Arah Baterai</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setIsReverse(false)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${!isReverse ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                Forward Bias
              </button>
              <button onClick={() => setIsReverse(true)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-center gap-2 ${isReverse ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                Reverse Bias
              </button>
            </div>
          </div>

          {/* Parameter Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Tegangan</span>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Voltage (V)</span>
                  <span className="text-3xl font-black text-white">{voltage.toFixed(1)}<span className="text-sm ml-1 text-zinc-500">V</span></span>
                </div>
                <Zap className={`w-6 h-6 ${isConducting ? 'text-amber-400 animate-pulse' : 'text-zinc-700'}`} />
              </div>
              <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0" max="5" step="0.1" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} />
            </div>
          </div>

          {/* Theory Highlights */}
          <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
            </div>
            <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
              <p>
                <strong className="text-zinc-300">Depletion Region:</strong> Perhatikan bagaimana area gelap di tengah melebar saat <span className="text-orange-400">Reverse Bias</span>, menciptakan barier yang tak bisa dilewati elektron.
              </p>
              <p>
                <strong className="text-zinc-300">Threshold:</strong> Pada silikon, arus baru mulai mengalir deras saat tegangan mencapai <span className="text-emerald-400 font-bold">~0.7V</span>.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all text-xs font-bold flex items-center justify-center gap-2">
              <RotateCcw className="w-3 h-3" /> Reset Simulasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
