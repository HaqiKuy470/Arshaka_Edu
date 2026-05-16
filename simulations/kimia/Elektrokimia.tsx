"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  RotateCcw, 
  ChevronLeft, 
  ShieldAlert, 
  Play, 
  Pause,
  Waves,
  Battery,
  Gauge,
  Info,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Metal {
  id: string;
  name: string;
  symbol: string;
  potential: number; // Standard reduction potential E° in Volts
  color: string;
  solutionColor: string;
}

const METALS: Metal[] = [
  { id: "li", name: "Litium", symbol: "Li", potential: -3.04, color: "#d1d5db", solutionColor: "rgba(209, 213, 219, 0.2)" },
  { id: "al", name: "Aluminium", symbol: "Al", potential: -1.66, color: "#94a3b8", solutionColor: "rgba(148, 163, 184, 0.2)" },
  { id: "zn", name: "Seng", symbol: "Zn", potential: -0.76, color: "#cbd5e1", solutionColor: "rgba(203, 213, 225, 0.2)" },
  { id: "fe", name: "Besi", symbol: "Fe", potential: -0.44, color: "#78350f", solutionColor: "rgba(120, 53, 15, 0.2)" },
  { id: "pb", name: "Timbal", symbol: "Pb", potential: -0.13, color: "#475569", solutionColor: "rgba(71, 85, 105, 0.2)" },
  { id: "h", name: "Hidrogen", symbol: "H₂", potential: 0.00, color: "#ffffff", solutionColor: "rgba(255, 255, 255, 0.2)" },
  { id: "cu", name: "Tembaga", symbol: "Cu", potential: 0.34, color: "#b45309", solutionColor: "rgba(59, 130, 246, 0.3)" },
  { id: "ag", name: "Perak", symbol: "Ag", potential: 0.80, color: "#f8fafc", solutionColor: "rgba(248, 250, 252, 0.2)" },
  { id: "au", name: "Emas", symbol: "Au", potential: 1.50, color: "#fbbf24", solutionColor: "rgba(251, 191, 36, 0.2)" },
];

export default function Elektrokimia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [leftMetalIdx, setLeftMetalIdx] = useState(2); // Zn
  const [rightMetalIdx, setRightMetalIdx] = useState(6); // Cu
  const electronProgressRef = useRef(0);

  const leftMetal = METALS[leftMetalIdx];
  const rightMetal = METALS[rightMetalIdx];

  // Calculate E cell
  // Anode: more negative potential (Oxidation)
  // Cathode: more positive potential (Reduction)
  const isLeftAnode = leftMetal.potential < rightMetal.potential;
  const anode = isLeftAnode ? leftMetal : rightMetal;
  const cathode = isLeftAnode ? rightMetal : leftMetal;
  const eCell = Math.abs(rightMetal.potential - leftMetal.potential);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: {x:number, y:number, vx:number, vy:number, type: 'electron' | 'ion'}[] = [];

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const beakerW = 140;
      const beakerH = 160;
      const beakerY = cy - 20;

      // Draw Beakers
      const drawBeaker = (x: number, solColor: string, name: string) => {
        // Liquid
        ctx.fillStyle = solColor;
        ctx.beginPath();
        ctx.roundRect(x - beakerW/2, beakerY + 40, beakerW, beakerH - 40, [0, 0, 24, 24]);
        ctx.fill();
        
        // Glass
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - beakerW/2, beakerY);
        ctx.lineTo(x - beakerW/2, beakerY + beakerH - 24);
        ctx.quadraticCurveTo(x - beakerW/2, beakerY + beakerH, x - beakerW/2 + 24, beakerY + beakerH);
        ctx.lineTo(x + beakerW/2 - 24, beakerY + beakerH);
        ctx.quadraticCurveTo(x + beakerW/2, beakerY + beakerH, x + beakerW/2, beakerY + beakerH - 24);
        ctx.lineTo(x + beakerW/2, beakerY);
        ctx.stroke();

        // Label
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, x, beakerY + beakerH + 25);
      };

      drawBeaker(cx - 140, leftMetal.solutionColor, `Larutan ${leftMetal.symbol}ⁿ⁺`);
      drawBeaker(cx + 140, rightMetal.solutionColor, `Larutan ${rightMetal.symbol}ⁿ⁺`);

      // Salt Bridge
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 80, beakerY + 60);
      ctx.lineTo(cx - 80, beakerY + 20);
      ctx.lineTo(cx + 80, beakerY + 20);
      ctx.lineTo(cx + 80, beakerY + 60);
      ctx.stroke();
      
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("Jembatan Garam", cx, beakerY + 15);

      // Electrodes
      const drawElectrode = (x: number, metal: Metal, isAnode: boolean) => {
        ctx.fillStyle = metal.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = metal.color + '44';
        ctx.beginPath();
        ctx.roundRect(x - 15, beakerY - 40, 30, 150, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px font-mono";
        ctx.fillText(metal.symbol, x, beakerY - 50);
        ctx.fillStyle = isAnode ? "#f87171" : "#60a5fa";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(isAnode ? "ANODA (-)" : "KATODA (+)", x, beakerY + 130);
      };

      drawElectrode(cx - 140, leftMetal, isLeftAnode);
      drawElectrode(cx + 140, rightMetal, !isLeftAnode);

      // Wires and Voltmeter
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 140, beakerY - 40);
      ctx.lineTo(cx - 140, beakerY - 100);
      ctx.lineTo(cx + 140, beakerY - 100);
      ctx.lineTo(cx + 140, beakerY - 40);
      ctx.stroke();

      // Voltmeter Circle
      ctx.fillStyle = "#09090b";
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.arc(cx, beakerY - 100, 35, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = eCell > 0 ? "#10b981" : "#71717a";
      ctx.font = "bold 16px font-mono";
      ctx.fillText(`${eCell.toFixed(2)} V`, cx, beakerY - 95);
      ctx.font = "bold 8px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText("VOLTMETER", cx, beakerY - 115);

      // Animation logic
      if (isRunning && eCell > 0) {
        electronProgressRef.current = (electronProgressRef.current + 0.005) % 1;
        
        // Electrons in wire
        const electronX = isLeftAnode ? cx - 140 + electronProgressRef.current * 280 : cx + 140 - electronProgressRef.current * 280;
        const electronY = beakerY - 100;
        
        ctx.fillStyle = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#fbbf24";
        ctx.beginPath();
        ctx.arc(electronX, electronY, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ion particles in solution
        if (Math.random() < 0.1) {
          particles.push({
            x: isLeftAnode ? cx - 125 : cx + 125,
            y: beakerY + Math.random() * 80 + 40,
            vx: (Math.random() - 0.5) * 0.5,
            vy: Math.random() * 0.5,
            type: 'ion'
          });
        }
      }

      // Draw Ions
      particles = particles.filter(p => p.y < beakerY + beakerH);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, leftMetalIdx, rightMetalIdx, eCell]);

  const reset = () => {
    setLeftMetalIdx(2);
    setRightMetalIdx(6);
    electronProgressRef.current = 0;
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
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
              <h1 className="text-lg font-bold tracking-tight leading-none">Elektrokimia (Sel Volta)</h1>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Konversi Energi Kimia • Listrik</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Zap className={`w-3 h-3 ${isRunning && eCell > 0 ? 'text-yellow-400 animate-pulse' : 'text-zinc-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                {isRunning && eCell > 0 ? "Arus Mengalir" : "Terhenti"}
              </span>
            </div>
          </div>
        </div>

        {/* Potential Cell HUD */}
        <div className="absolute top-24 right-8 animate-in fade-in slide-in-from-right duration-700">
           <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Potensial Reduksi</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-8">
                  <span className="text-xs font-bold text-red-400">{leftMetal.symbol} / {leftMetal.symbol}ⁿ⁺</span>
                  <span className="text-sm font-mono font-bold">{leftMetal.potential.toFixed(2)} V</span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span className="text-xs font-bold text-blue-400">{rightMetal.symbol} / {rightMetal.symbol}ⁿ⁺</span>
                  <span className="text-sm font-mono font-bold">{rightMetal.potential.toFixed(2)} V</span>
                </div>
              </div>
           </div>
        </div>

        {/* Reaction HUD */}
        <div className="absolute top-24 left-8 max-w-xs animate-in fade-in slide-in-from-left duration-700">
          <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-white/5 space-y-4">
            <div className="space-y-3">
               <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                 <div className="text-[8px] font-black text-red-400 uppercase mb-1">Oksidasi (Anoda)</div>
                 <div className="text-xs font-bold font-mono">{anode.symbol} ➔ {anode.symbol}ⁿ⁺ + n.e⁻</div>
               </div>
               <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                 <div className="text-[8px] font-black text-blue-400 uppercase mb-1">Reduksi (Katoda)</div>
                 <div className="text-xs font-bold font-mono">{cathode.symbol}ⁿ⁺ + n.e⁻ ➔ {cathode.symbol}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-8 pt-24">
          
          {/* Electrode Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Konfigurasi Sel</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Logam Kiri (Elektroda 1)</label>
                <div className="grid grid-cols-3 gap-1">
                  {METALS.map((m, i) => (
                    <button
                      key={`l-${m.id}`}
                      onClick={() => setLeftMetalIdx(i)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${leftMetalIdx === i ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'}`}
                    >
                      {m.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Logam Kanan (Elektroda 2)</label>
                <div className="grid grid-cols-3 gap-1">
                  {METALS.map((m, i) => (
                    <button
                      key={`r-${m.id}`}
                      onClick={() => setRightMetalIdx(i)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${rightMetalIdx === i ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'}`}
                    >
                      {m.symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-4 space-y-3">
             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
             >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {isRunning ? "Hentikan Reaksi" : "Jalankan Reaksi"}
             </button>
             <button 
               onClick={reset}
               className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
             >
                <RotateCcw className="w-4 h-4" /> Reset Sel
             </button>
          </div>

          {/* Chemistry Insight */}
          <div className="p-6 bg-indigo-500/10 rounded-[32px] border border-indigo-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Wawasan Sel Volta</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Deret Volta</h4>
              <p className="text-[10px] text-indigo-200/60 leading-relaxed italic">
                "Logam yang berada lebih kiri dalam deret Volta memiliki E° lebih negatif dan bersifat lebih reaktif (mudah teroksidasi) sehingga bertindak sebagai Anoda."
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 overflow-x-auto">
                <code className="text-[9px] text-yellow-400 font-mono whitespace-nowrap">
                  Li-K-Ba-Ca-Na-Mg-Al-Zn-Fe-Pb-H-Cu-Ag-Au
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
