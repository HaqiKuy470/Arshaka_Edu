"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet as MagnetIcon, Target, Sparkles, Lightbulb, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function InduksiFaraday() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [magnetX, setMagnetX] = useState(250); // Position relative to center
  const [isDragging, setIsDragging] = useState(false);
  const [showField, setShowField] = useState(true);
  const [numTurns, setNumTurns] = useState(4);
  const [emf, setEmf] = useState(0);

  // Velocity Calculation
  const lastXRef = useRef(magnetX);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef(0);

  useEffect(() => {
    // Calculate EMF based on Faraday's Law: ε = -N * dΦ/dt
    // Velocity v = dx/dt
    const dx = magnetX - lastXRef.current;
    const velocity = dx * 10; // Sensitivity
    lastXRef.current = magnetX;

    // Flux Φ(x) is modeled as a Gaussian curve centered at the coil (x=0)
    // Φ(x) = Φ0 * exp(-(x/σ)^2)
    // dΦ/dt = (dΦ/dx) * (dx/dt)
    // dΦ/dx = Φ0 * (-2x/σ^2) * exp(-(x/σ)^2)
    
    const x = magnetX;
    const sigma = 60;
    const dPhiDx = -2 * (x / (sigma * sigma)) * Math.exp(-Math.pow(x / sigma, 2)) * 1000;
    
    const inducedEmf = numTurns * dPhiDx * velocity;
    setEmf(inducedEmf);

    // Decay EMF back to 0 when movement stops
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setEmf(0);
    }, 50);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [magnetX, numTurns]);

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

      // --- Draw Circuitry ---
      ctx.strokeStyle = "#27272a"; // zinc-800
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy);
      ctx.lineTo(cx - 200, cy - 150);
      ctx.lineTo(cx + 200, cy - 150);
      ctx.lineTo(cx + 200, cy);
      ctx.stroke();

      // --- Draw Galvanometer ---
      const gx = cx + 50;
      const gy = cy - 150;
      ctx.fillStyle = "#09090b";
      ctx.beginPath(); ctx.arc(gx, gy, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#3f3f46"; ctx.lineWidth = 2; ctx.stroke();
      
      // Gauge Ticks
      ctx.strokeStyle = "#52525b"; ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) {
        const angle = -Math.PI/2 + (i * Math.PI/10);
        ctx.beginPath();
        ctx.moveTo(gx + Math.cos(angle)*30, gy + Math.sin(angle)*30);
        ctx.lineTo(gx + Math.cos(angle)*35, gy + Math.sin(angle)*35);
        ctx.stroke();
      }

      // Needle
      const needleAngle = -Math.PI/2 + (emf * 0.0005);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(needleAngle)*35, gy + Math.sin(needleAngle)*35); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI*2); ctx.fill();

      // --- Draw Lightbulb ---
      const lx = cx - 200;
      const ly = cy - 75;
      const intensity = Math.min(1, Math.abs(emf) * 0.0001);
      if (intensity > 0.1) {
        ctx.shadowBlur = 40 * intensity;
        ctx.shadowColor = "#fbbf24";
        ctx.fillStyle = `rgba(251, 191, 36, ${intensity})`;
        ctx.beginPath(); ctx.arc(lx, ly, 30, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(lx, ly, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText("LAMP", lx, ly + 50);

      // --- Draw Coil (Solenoid) ---
      const coilW = 140;
      const coilH = 100;
      ctx.strokeStyle = "#b45309"; // copper color
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      for (let i = 0; i < numTurns; i++) {
        const tx = cx - coilW/2 + (i + 0.5) * (coilW / numTurns);
        ctx.beginPath();
        ctx.ellipse(tx, cy, 20, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- Draw Magnet Field Lines ---
      const mx = cx + magnetX;
      if (showField) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
          const offset = i * 25;
          ctx.beginPath();
          ctx.ellipse(mx, cy + offset, 120, 50 + Math.abs(offset), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // --- Draw Magnet ---
      const mw = 140;
      const mh = 45;
      ctx.shadowBlur = isDragging ? 30 : 0;
      ctx.shadowColor = "#ef4444";
      
      // North (Red)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(mx - mw/2, cy - mh/2, mw/2, mh, [8, 0, 0, 8]);
      ctx.fill();
      
      // South (Blue)
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(mx, cy - mh/2, mw/2, mh, [0, 8, 8, 0]);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = "white";
      ctx.font = "black 18px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", mx - mw/4, cy);
      ctx.fillText("S", mx + mw/4, cy);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [magnetX, emf, showField, numTurns, isDragging]);

  const handlePointerDown = (e: any) => {
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const mx = clientX - cx;
    if (Math.abs(mx - magnetX) < 100) setIsDragging(true);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const clientX = e.clientX || e.touches?.[0].clientX;
    setMagnetX(clientX - cx);
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Induksi Elektromagnetik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Faraday • Flux Magnetik</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Live Reading Card */}
           <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Activity className="w-3 h-3" /> Reading (V)
              </div>
              <div className="text-4xl font-black text-white font-mono leading-none">
                {(Math.abs(emf) / 100).toFixed(2)}<span className="text-xl text-zinc-500 ml-1">mV</span>
              </div>
              <div className="mt-4 flex gap-1">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-75 ${Math.abs(emf) > i*1000 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-white/5'}`} />
                 ))}
              </div>
           </div>

           {/* Coil Config */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <RefreshCcw className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurasi Kumparan</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {[2, 4, 6, 8].map(n => (
                   <button key={n} onClick={() => setNumTurns(n)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${numTurns === n ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      {n} Lilitan
                   </button>
                 ))}
              </div>
           </div>

           {/* Visibility Toggle */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Opsi Tampilan</span>
              </div>
              <button onClick={() => setShowField(!showField)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${showField ? 'bg-white/5 border-white/20 shadow-inner' : 'bg-transparent border-white/5 opacity-40'}`}>
                 <div className="flex items-center gap-3">
                    <MagnetIcon className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Garis Gaya Magnet</span>
                 </div>
                 <div className={`w-2 h-2 rounded-full ${showField ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Laju Perubahan:</strong> Tegangan induksi (GGL) tidak bergantung pada seberapa dalam magnet berada, melainkan seberapa **cepat** fluks berubah ($d\Phi/dt$).
                 </p>
                 <p>
                    <strong className="text-zinc-300">Lilitan:</strong> Menambah jumlah lilitan (N) akan melipatgandakan tegangan yang dihasilkan karena setiap lilitan menangkap perubahan fluks yang sama.
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => { setMagnetX(250); setNumTurns(4); }} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
