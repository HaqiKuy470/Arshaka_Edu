"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter } from "lucide-react";
import Link from "next/link";

type PrismMaterial = { name: string; nBase: number; dispersion: number };
const PRISM_MATERIALS: PrismMaterial[] = [
  { name: "Kaca Mahkota (Crown)", nBase: 1.51, dispersion: 0.02 },
  { name: "Kaca Kerak (Flint)", nBase: 1.62, dispersion: 0.05 },
  { name: "Berlian", nBase: 2.42, dispersion: 0.12 },
];

const SPECTRUM = [
  { color: "#ef4444", lambda: 700, name: "Merah" },    // 700nm
  { color: "#f97316", lambda: 610, name: "Jingga" },
  { color: "#eab308", lambda: 580, name: "Kuning" },
  { color: "#22c55e", lambda: 540, name: "Hijau" },
  { color: "#3b82f6", lambda: 480, name: "Biru" },
  { color: "#6366f1", lambda: 440, name: "Nila" },
  { color: "#a855f7", lambda: 400, name: "Ungu" },    // 400nm
];

export default function DispersiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [angleIncident, setAngleIncident] = useState(45);
  const [material, setMaterial] = useState(PRISM_MATERIALS[1]); // Flint Glass as default
  const [apexAngle, setApexAngle] = useState(60);

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
      
      // --- Draw Prism Geometry ---
      const apexRad = (apexAngle * Math.PI) / 180;
      const side = 240;
      const h = side * Math.cos(apexRad/2);
      
      // Points
      const pTop = { x: cx, y: cy - h/2 };
      const pLeft = { x: cx - side/2, y: cy + h/2 };
      const pRight = { x: cx + side/2, y: cy + h/2 };

      // Glass effect
      const prismGrad = ctx.createLinearGradient(cx - side/2, cy, cx + side/2, cy);
      prismGrad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
      prismGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
      prismGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.fillStyle = prismGrad;
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y); ctx.lineTo(pLeft.x, pLeft.y); ctx.lineTo(pRight.x, pRight.y); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 2; ctx.stroke();

      // --- Ray Tracing ---
      const theta1 = (angleIncident * Math.PI) / 180;
      const faceAngle = Math.PI/2 - apexRad/2; // Angle of left face relative to vertical? No, let's use normals.
      
      // Left Face Normal is at -Math.PI/2 - apexRad/2 ?
      const leftFaceNormal = -Math.PI/2 - (Math.PI/2 - apexRad/2); 
      // Simplified: Just assume the beam hits the center of the left face.
      const hitX = cx - side/4;
      const hitY = cy;

      // Incident White Beam
      ctx.shadowBlur = 20;
      ctx.shadowColor = "white";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(hitX - Math.cos(theta1) * 400, hitY - Math.sin(theta1) * 400);
      ctx.lineTo(hitX, hitY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dispersion Loop
      SPECTRUM.forEach((col, idx) => {
        // Cauchy-like dispersion: n = nBase + C / lambda^2
        // We simulate this by adjusting index per color
        const colorIndex = material.nBase + (material.dispersion * (700 - col.lambda) / 300);
        
        // 1st Refraction (Air -> Prism)
        // This is a complex geometric calculation. 
        // For educational clarity, we simulate the 'fanning' effect realistically.
        const angleInPrism = (theta1 / colorIndex) * 0.7; // simplified refraction
        const ray2X = cx + side/4;
        const ray2Y = hitY + angleInPrism * 120;

        ctx.strokeStyle = col.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hitX, hitY);
        ctx.lineTo(ray2X, ray2Y);
        ctx.stroke();

        // 2nd Refraction (Prism -> Air)
        const angleOut = angleInPrism * colorIndex * 1.8;
        ctx.beginPath();
        ctx.moveTo(ray2X, ray2Y);
        ctx.lineTo(ray2X + Math.cos(angleOut) * 500, ray2Y + Math.sin(angleOut) * 500);
        ctx.stroke();
        
        // Glow on exit rays
        ctx.shadowBlur = 10;
        ctx.shadowColor = col.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // --- Draw Emitter ---
      const ex = hitX - Math.cos(theta1) * 350;
      const ey = hitY - Math.sin(theta1) * 350;
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(theta1);
      ctx.fillStyle = "#18181b";
      ctx.roundRect(-30, -15, 60, 30, 6);
      ctx.fill();
      ctx.strokeStyle = "white"; ctx.stroke();
      ctx.restore();
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, angleIncident, material, apexAngle]);

  const reset = () => {
    setAngleIncident(45);
    setApexAngle(60);
    setMaterial(PRISM_MATERIALS[1]);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Dispersi Cahaya</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Prisma • Spektrum • Optik Fisis</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Material HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Indeks Bias Dasar (n₀)</span>
                    <span className="text-xl font-black text-white">{material.nBase}</span>
                 </div>
                 <Box className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Koefisien Dispersi</span>
                    <span className="text-xl font-black text-purple-400">{material.dispersion.toFixed(2)}</span>
                 </div>
                 <Activity className="w-4 h-4 text-purple-400" />
              </div>
           </div>

           {/* Material Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Filter className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Bahan Prisma</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {PRISM_MATERIALS.map(m => (
                   <button key={m.name} onClick={() => setMaterial(m)} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border flex justify-between items-center ${material.name === m.name ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      {m.name}
                      <ChevronRight className="w-3 h-3 opacity-50" />
                   </button>
                 ))}
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Geometri & Cahaya</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Sudut Datang</label>
                       <span className="text-xs font-mono text-white">{angleIncident}°</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0" max="80" value={angleIncident} onChange={(e) => setAngleIncident(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Sudut Puncak Prisma</label>
                       <span className="text-xs font-mono text-white">{apexAngle}°</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500" min="30" max="90" value={apexAngle} onChange={(e) => setApexAngle(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Insights */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-purple-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fisika Dispersi</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Indeks Bias Variabel:</strong> Cahaya putih terdiri dari berbagai warna. Warna <span className="text-rose-400">Merah</span> memiliki indeks bias terkecil, sementara <span className="text-purple-400">Ungu</span> memiliki indeks bias terbesar dan paling tajam dibelokkan.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Efek Pelangi:</strong> Inilah alasan mengapa pelangi terbentuk saat sinar matahari melewati butiran air hujan.
                 </p>
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Cahaya putih terdiri dari berbagai panjang gelombang. Saat melewati prisma, setiap warna dibiaskan dengan sudut berbeda karena indeks bias yang bergantung pada warna."
              </p>
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
