"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function Entropi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [barrierOpen, setBarrierOpen] = useState(false);
  
  // HUD Data
  const [entropyLevel, setEntropyLevel] = useState(0);
  const [simTime, setSimTime] = useState(0);

  const particles = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  const initParticles = () => {
    const p: Particle[] = [];
    const count = 100;
    const cx = 300; // Center of 600px canvas
    const width = 500;
    const padding = 40;
    
    for (let i = 0; i < count; i++) {
      const isRed = i < count / 2;
      // Left chamber: 50 to 300. Right chamber: 300 to 550.
      p.push({
        x: isRed 
          ? Math.random() * (width/2 - padding) + (cx - width/2 + padding/2) 
          : Math.random() * (width/2 - padding) + (cx + padding/2),
        y: Math.random() * (300 - padding) + (200 - 300/2 + padding/2),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: isRed ? "#ef4444" : "#3b82f6"
      });
    }
    particles.current = p;
    setEntropyLevel(0);
    setSimTime(0);
    setBarrierOpen(false);
  };

  useEffect(() => {
    initParticles();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = 600;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const width = 500;
      const height = 300;

      // Draw Container
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - width/2, cy - height/2, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(cx - width/2, cy - height/2, width, height);

      // Draw Laser Barrier
      if (!barrierOpen) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(239, 68, 68, 0.5)";
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - height/2);
        ctx.lineTo(cx, cy + height/2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Update & Draw Particles
      let mixScore = 0;
      particles.current.forEach(p => {
        if (isRunning) {
          p.x += p.vx;
          p.y += p.vy;

          // Wall Collisions
          if (p.x < cx - width/2 + 5 || p.x > cx + width/2 - 5) { p.vx *= -1; p.x = Math.max(cx - width/2 + 5, Math.min(cx + width/2 - 5, p.x)); }
          if (p.y < cy - height/2 + 5 || p.y > cy + height/2 - 5) { p.vy *= -1; p.y = Math.max(cy - height/2 + 5, Math.min(cy + height/2 - 5, p.y)); }

          // Barrier Collision (Corrected: No teleportation, just bouncing from current side)
          if (!barrierOpen) {
            const buffer = 8;
            // If particle is on the left side of barrier and hits it
            if (p.x < cx && p.x > cx - buffer) {
               p.vx = -Math.abs(p.vx);
               p.x = cx - buffer;
            } 
            // If particle is on the right side of barrier and hits it
            else if (p.x > cx && p.x < cx + buffer) {
               p.vx = Math.abs(p.vx);
               p.x = cx + buffer;
            }
          }
        }

        // Calculate Entropy Contribution
        if (p.color === "#ef4444" && p.x > cx) mixScore++;
        if (p.color === "#3b82f6" && p.x < cx) mixScore++;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow
        ctx.fillStyle = p.color + "33";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      setEntropyLevel(Math.min(100, (mixScore / 50) * 100));
      if (isRunning) {
        setSimTime(t => t + 0.016);
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, barrierOpen]);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Entropi & Probabilitas</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Kedua Termodinamika • Keteraturan</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-8 bg-black/20">
         
         {/* Floating Entropy HUD */}
         <div className="absolute top-24 left-8 w-64 glass-card p-6 rounded-3xl border border-white/10 bg-black/40 z-10 hidden md:block">
            <div className="flex items-center justify-between mb-6">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tingkat Ketidakteraturan</span>
               <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div className="relative flex flex-col items-center">
               <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-rose-500 transition-all duration-300"
                    style={{ clipPath: `inset(${100 - entropyLevel}% 0 0 0)` }}
                  />
                  <div className="flex flex-col items-center leading-none">
                     <span className="text-3xl font-black text-white">{entropyLevel.toFixed(0)}%</span>
                     <span className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Disorder</span>
                  </div>
               </div>
               <div className="mt-6 w-full space-y-2">
                  <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500">
                     <span>Teratur</span>
                     <span>Acak</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-300" style={{ width: `${entropyLevel}%` }} />
                  </div>
               </div>
            </div>
            <div className="mt-8 text-[10px] font-mono text-zinc-500 italic text-center">
               S = k . ln Ω
            </div>
         </div>

         {/* Chamber Scene */}
         <div className="relative animate-in zoom-in duration-700">
            <canvas ref={canvasRef} className="w-[600px] h-[400px]" />
            
            {/* Legend Labels */}
            {!barrierOpen && (
               <>
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-500/50 uppercase tracking-widest -rotate-90">Entropi Rendah</div>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-sky-500/50 uppercase tracking-widest rotate-90">Entropi Rendah</div>
               </>
            )}
            {barrierOpen && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-black text-white/5 uppercase tracking-[0.5em]">Ketidakteraturan Meningkat</div>
            )}
         </div>

      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Action Buttons */}
           <div className="space-y-3">
              <button 
                onClick={() => {
                  setBarrierOpen(!barrierOpen);
                  if (!barrierOpen) setIsRunning(true);
                }}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl border-2 ${!barrierOpen ? 'bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
              >
                {barrierOpen ? <Unlock className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}
                {barrierOpen ? 'Tutup Sekat Laser' : 'Buka Sekat Laser'}
              </button>
           </div>

           {/* Analysis Card */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Probabilitas</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Waktu Difusi</span>
                       <span className="text-xl font-black text-white">{simTime.toFixed(2)} <span className="text-[10px] text-zinc-500">detik</span></span>
                    </div>
                    <Timer className="w-5 h-5 text-zinc-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Prob. Reversibilitas</span>
                       <span className="text-xl font-black text-rose-400">
                          {barrierOpen ? (entropyLevel > 80 ? "≈ 10⁻²³" : "< 1%") : "100%"}
                       </span>
                    </div>
                    <Share2 className="w-5 h-5 text-rose-500/50" />
                 </div>
              </div>
           </div>

           {/* Info Section */}
           <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <Box className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Informasi Teoretis</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic text-center">
                 "Entropi sistem yang terisolasi tidak pernah berkurang; ia hanya bisa tetap atau bertambah." 
                 <br/><br/>
                 Partikel-partikel ini tidak akan pernah kembali secara spontan ke posisi teratur semula setelah tercampur.
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
                {isRunning ? 'Jeda Simulasi' : 'Mulai Gerak'}
              </button>
              <button onClick={() => { initParticles(); setIsRunning(false); }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset ke Teratur
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
