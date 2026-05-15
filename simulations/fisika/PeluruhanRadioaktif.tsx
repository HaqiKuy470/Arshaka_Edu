"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Radio, Skull } from "lucide-react";
import Link from "next/link";

type Isotope = { name: string; tHalf: number; color: string; desc: string };
const ISOTOPES: Isotope[] = [
  { name: "Karbon-14", tHalf: 10, color: "#4ade80", desc: "Digunakan untuk penanggalan arkeologi (radiocarbon dating)." },
  { name: "Iodium-131", tHalf: 4, color: "#f43f5e", desc: "Isotop medis untuk terapi tiroid, meluruh sangat cepat." },
  { name: "Uranium-238", tHalf: 20, color: "#eab308", desc: "Waktu paruh sangat lama di alam (disimulasikan skala relatif)." },
];

interface Particle {
  x: number;
  y: number;
  state: "parent" | "daughter";
  decayTime: number; // Time in seconds when it decays
}

export default function PeluruhanRadioaktif() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Parameters
  const [isotope, setIsotope] = useState(ISOTOPES[0]);
  const [timeScale, setTimeScale] = useState(1);
  const [totalAtoms] = useState(500);

  const particlesRef = useRef<Particle[]>([]);
  const decayEventsRef = useRef<{x: number, y: number, t: number}[]>([]); // For flashes
  const animationRef = useRef(0);
  const timeRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  // Count decayed
  const [parentCount, setParentCount] = useState(totalAtoms);

  const initParticles = () => {
     const p: Particle[] = [];
     const lambda = Math.log(2) / isotope.tHalf;
     for (let i = 0; i < totalAtoms; i++) {
        // Random decay time based on exponential distribution: t = -ln(U)/lambda
        const decayT = -Math.log(Math.random()) / lambda;
        p.push({
           x: Math.random(),
           y: Math.random(),
           state: "parent",
           decayTime: decayT
        });
     }
     particlesRef.current = p;
     timeRef.current = 0;
     setParentCount(totalAtoms);
  };

  useEffect(() => {
    initParticles();
  }, [isotope]);

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
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      const padding = 100;
      const drawAreaW = arenaW - padding * 2;
      const drawAreaH = arenaH - 250;
      const drawAreaX = padding;
      const drawAreaY = 100;

      if (isRunning) {
         timeRef.current += (1/60) * timeScale;
      }
      const t = timeRef.current;

      // --- Draw Grid/Container ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeRect(drawAreaX, drawAreaY, drawAreaW, drawAreaH);

      // --- Process Particles ---
      let currentParents = 0;
      particlesRef.current.forEach(p => {
         const px = drawAreaX + p.x * drawAreaW;
         const py = drawAreaY + p.y * drawAreaH;

         if (p.state === "parent" && t >= p.decayTime) {
            p.state = "daughter";
            // Flash event
            decayEventsRef.current.push({ x: px, y: py, t: 1.0 });
         }

         if (p.state === "parent") {
            currentParents++;
            ctx.fillStyle = isotope.color;
            ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
         } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
         }
      });
      setParentCount(currentParents);

      // --- Draw Flash Events (Particles Emitted) ---
      decayEventsRef.current = decayEventsRef.current.filter(e => {
         e.t -= 0.05;
         ctx.strokeStyle = `rgba(255, 255, 255, ${e.t})`;
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(e.x, e.y, (1 - e.t) * 20, 0, Math.PI * 2);
         ctx.stroke();
         
         // Particle streak
         ctx.beginPath();
         ctx.moveTo(e.x, e.y);
         ctx.lineTo(e.x + (1-e.t)*50, e.y - (1-e.t)*50);
         ctx.stroke();

         return e.t > 0;
      });

      // --- Draw Decay Curve Graph ---
      const gx = drawAreaX;
      const gy = arenaH - 120;
      const gw = drawAreaW;
      const gh = 80;

      // Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy - gh); ctx.stroke();

      // Plot
      ctx.strokeStyle = isotope.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < gw; x++) {
         const tx = (x / gw) * (isotope.tHalf * 3);
         const ny = totalAtoms * Math.exp(-(Math.log(2) / isotope.tHalf) * tx);
         const px = gx + x;
         const py = gy - (ny / totalAtoms) * gh;
         if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current Point
      const currentX = gx + (t / (isotope.tHalf * 3)) * gw;
      if (currentX < gx + gw) {
         ctx.fillStyle = "white";
         ctx.beginPath(); ctx.arc(currentX, gy - (currentParents / totalAtoms) * gh, 4, 0, Math.PI * 2); ctx.fill();
      }

      // Labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter";
      ctx.textAlign = "center";
      ctx.fillText(`PROGRES WAKTU: ${t.toFixed(1)} s`, gx + gw/2, gy + 25);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, isotope, timeScale]);

  const reset = () => {
    initParticles();
    setIsRunning(false);
  };

  const percentage = Math.round((parentCount / totalAtoms) * 100);

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Peluruhan Radioaktif</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Waktu Paruh • Eksponensial • Fisika Inti</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Percentage Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden bg-black/40 border-white/10`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Sisa Inti Induk</div>
              <div className="text-4xl font-black text-white">
                 {percentage}%
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <Radio className={`w-4 h-4 ${percentage > 50 ? 'text-emerald-400' : 'text-rose-500'} animate-spin-slow`} />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                   {parentCount} / {totalAtoms} Atom
                 </span>
              </div>
           </div>

           {/* Isotope Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Filter className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Isotop</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {ISOTOPES.map(iso => (
                   <button key={iso.name} onClick={() => setIsotope(iso)} className={`py-4 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border flex flex-col items-start gap-1 ${isotope.name === iso.name ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      <div className="flex items-center justify-between w-full">
                         <span>{iso.name}</span>
                         <span className="text-[8px] font-normal opacity-60">T½ = {iso.tHalf}s</span>
                      </div>
                      <p className="text-[8px] font-normal lowercase italic opacity-40 leading-tight">{iso.desc}</p>
                   </button>
                 ))}
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Waktu</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Kecepatan Simulasi</label>
                       <span className="text-xs font-mono text-white">{timeScale}x</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white" min="0.1" max="5" step="0.1" value={timeScale} onChange={(e) => setTimeScale(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hukum Peluruhan</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Statistik Murni:</strong> Kita tidak bisa memprediksi kapan satu atom tertentu akan meluruh, namun kita bisa memprediksi perilaku rata-rata dari ribuan atom secara akurat.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Waktu Paruh:</strong> Setiap interval {isotope.tHalf} detik, jumlah atom sisa akan berkurang menjadi separuhnya.
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "PAUSE" : "START"}
              </button>
              <button onClick={reset} className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl border border-white/5 transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
