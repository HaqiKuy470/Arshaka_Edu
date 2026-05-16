"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Waves, 
  RotateCcw, 
  ChevronLeft, 
  ShieldAlert, 
  Play, 
  Pause,
  Thermometer,
  Zap,
  Wind,
  Info,
  Move
} from "lucide-react";
import Link from "next/link";

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
}

const INTERACTION_TYPES = [
  { id: "nonpolar", name: "Gaya London", strength: 0.05, radius: 60, color: "rgba(148, 163, 184, 0.4)", description: "Gaya tarik lemah akibat dipol sesaat (dispersi)." },
  { id: "polar", name: "Dipol-Dipol", strength: 0.15, radius: 100, color: "rgba(59, 130, 246, 0.5)", description: "Tarik-menarik antar kutub magnetik molekul polar." },
  { id: "hbond", name: "Ikatan Hidrogen", strength: 0.45, radius: 140, color: "rgba(239, 68, 68, 0.6)", description: "Interaksi sangat kuat antara atom H dengan N, O, atau F." },
];

export default function GayaAntarmolekul() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [temp, setTemp] = useState(30);
  const [typeIdx, setTypeIdx] = useState(1); // Default to Polar
  
  const currentType = INTERACTION_TYPES[typeIdx];
  const molecules = useRef<Molecule[]>([]);

  useEffect(() => {
    // Initialize molecules
    const count = 35;
    const initialMols: Molecule[] = [];
    for(let i=0; i<count; i++) {
      initialMols.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.1
      });
    }
    molecules.current = initialMols;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mols = molecules.current;
      const thermalEnergy = temp * 0.15;

      if (isRunning) {
        // Force calculation
        for (let i = 0; i < mols.length; i++) {
          const m1 = mols[i];

          // Thermal noise
          m1.vx += (Math.random() - 0.5) * thermalEnergy;
          m1.vy += (Math.random() - 0.5) * thermalEnergy;

          for (let j = i + 1; j < mols.length; j++) {
            const m2 = mols[j];
            const dx = m2.x - m1.x;
            const dy = m2.y - m1.y;
            const distSq = dx*dx + dy*dy;
            const dist = Math.sqrt(distSq);

            if (dist < currentType.radius && dist > 30) {
              // Intermolecular Attraction
              const force = (currentType.radius - dist) * currentType.strength * 0.005;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              m1.vx += fx; m1.vy += fy;
              m2.vx -= fx; m2.vy -= fy;

              // Draw Interaction Bonds
              ctx.setLineDash([4, 4]);
              ctx.strokeStyle = currentType.color;
              ctx.lineWidth = (currentType.strength * 5) * (1 - dist / currentType.radius);
              ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke();
              ctx.setLineDash([]);
            } else if (dist <= 30) {
              // Steric Repulsion (Hard Sphere)
              const force = (30 - dist) * 0.5;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              m1.vx -= fx; m1.vy -= fy;
              m2.vx += fx; m2.vy += fy;
            }
          }

          // Friction / Damping
          m1.vx *= 0.92;
          m1.vy *= 0.92;

          m1.x += m1.vx;
          m1.y += m1.vy;
          m1.angle += m1.vAngle;

          // Boundary bounce
          if (m1.x < 20 || m1.x > w - 20) m1.vx *= -1;
          if (m1.y < 20 || m1.y > h - 20) m1.vy *= -1;
        }
      }

      // Draw Molecules
      mols.forEach(m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        if (currentType.id === "nonpolar") {
          // Grey spheres
          ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fillStyle = "#64748b"; ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.stroke();
        } else if (currentType.id === "polar") {
          // Blue (-) and Red (+) Dipoles
          ctx.beginPath(); ctx.arc(-7, 0, 8, 0, Math.PI*2); ctx.fillStyle = "#3b82f6"; ctx.fill();
          ctx.beginPath(); ctx.arc(7, 0, 8, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill();
        } else if (currentType.id === "hbond") {
          // H2O style
          ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fillStyle = "#dc2626"; ctx.fill(); // Oxygen
          ctx.beginPath(); ctx.arc(-8, 8, 6, 0, Math.PI*2); ctx.fillStyle = "#f8fafc"; ctx.fill(); // Hydrogen
          ctx.beginPath(); ctx.arc(8, 8, 6, 0, Math.PI*2); ctx.fillStyle = "#f8fafc"; ctx.fill(); // Hydrogen
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, temp, currentType]);

  const reset = () => {
    setTemp(30);
    setTypeIdx(1);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full transition-colors duration-1000`} style={{ backgroundColor: currentType.color }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-4">
            <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none">Gaya Antarmolekul</h1>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Interaksi Van der Waals • Kimia</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Wind className={`w-3 h-3 ${temp > 70 ? 'text-orange-400' : 'text-blue-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                {temp > 80 ? "Zat Gas" : temp > 40 ? "Zat Cair" : "Zat Padat"}
              </span>
            </div>
          </div>
        </div>

        {/* State HUD */}
        <div className="absolute top-24 left-8 animate-in fade-in slide-in-from-left duration-700">
           <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-white/5 space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Tipe Interaksi</div>
              <h2 className="text-3xl font-black text-white leading-none">{currentType.name}</h2>
              <p className="text-[10px] text-zinc-400 pt-1 max-w-[200px] leading-relaxed italic">
                 "{currentType.description}"
              </p>
           </div>
        </div>

        {/* Interactive Canvas */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 flex gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Delta (+)</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Delta (-)</span>
           </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-8 pt-24">
          
          {/* Interaction Type Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Jenis Molekul</span>
            </div>
            
            <div className="space-y-2">
              {INTERACTION_TYPES.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTypeIdx(i)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all group ${typeIdx === i ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${typeIdx === i ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{t.name}</span>
                    <Zap className={`w-3 h-3 ${typeIdx === i ? 'text-yellow-400' : 'text-zinc-600'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Control */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Energi Termal (Suhu)</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Temperatur: {temp}%</label>
              </div>
              <input 
                type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500" 
                min="0" max="100" step="1" 
                value={temp} 
                onChange={(e) => setTemp(parseInt(e.target.value))} 
              />
              <p className="text-[9px] text-zinc-500 leading-relaxed">
                Energi termal berlawanan dengan gaya tarik. Suhu tinggi menyebabkan molekul bergerak acak dan memutus ikatan.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 space-y-3">
             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
             >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {isRunning ? "Jeda Simulasi" : "Lanjutkan"}
             </button>
             <button 
               onClick={reset}
               className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
             >
                <RotateCcw className="w-4 h-4" /> Reset Partikel
             </button>
          </div>

          {/* Chemistry Insight */}
          <div className="p-6 bg-red-500/10 rounded-[32px] border border-red-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-black text-red-300 uppercase tracking-widest">Wawasan Molekuler</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Gaya Van der Waals</h4>
              <p className="text-[10px] text-red-200/60 leading-relaxed italic">
                "Kekuatan relatif gaya antarmolekul menentukan wujud zat. Ikatan Hidrogen adalah yang terkuat, menjelaskan kenapa air berwujud cair pada suhu ruang sementara gas lain tidak."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
