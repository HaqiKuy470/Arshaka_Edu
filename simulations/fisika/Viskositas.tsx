"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function Viskositas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Fluid Types: Air (Low viscosity), Oli (Medium), Madu (High)
  const [fluid, setFluid] = useState<"air" | "oli" | "madu">("air");

  // Approximate relative viscosity (eta)
  const etaValues = {
    air: 1, // Water
    oli: 10, // Motor Oil
    madu: 50 // Honey
  };

  const eta = etaValues[fluid];
  
  // Terminal velocity is inversely proportional to viscosity (simplified for simulation)
  // v_t = (2/9) * r^2 * g * (rho_b - rho_f) / eta
  // We'll scale it for visual pleasure. High ETA = slow fall.
  const terminalVelocity = 150 / eta; 

  const [pos, setPos] = useState(0); // depth of ball
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning && pos < 400) { // 400 is tube bottom
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setPos(p => Math.min(400, p + terminalVelocity * dt));

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else if (pos >= 400) {
      setIsRunning(false);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, terminalVelocity, pos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = 50; // top of tube

      // Tube
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy);
      ctx.lineTo(cx - 40, cy + 420);
      ctx.lineTo(cx + 40, cy + 420);
      ctx.lineTo(cx + 40, cy);
      ctx.stroke();

      // Liquid
      let colorStr = "rgba(56, 189, 248, 0.4)"; // Water
      if (fluid === 'oli') colorStr = "rgba(234, 179, 8, 0.7)"; // Yellowish Oil
      if (fluid === 'madu') colorStr = "rgba(180, 83, 9, 0.9)"; // Amber/Dark Honey

      ctx.fillStyle = colorStr;
      ctx.fillRect(cx - 38, cy + 20, 76, 398);

      // Ball
      const ballY = cy + 20 + pos;
      ctx.beginPath();
      ctx.arc(cx, ballY, 15, 0, Math.PI*2);
      ctx.fillStyle = "#ef4444"; // red ball
      ctx.fill();

      // Velocity text
      ctx.fillStyle = "white";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      
      if (pos > 0 && pos < 400) {
        ctx.fillText(`v = ${terminalVelocity.toFixed(1)} m/s`, cx + 80, ballY);
      } else if (pos >= 400) {
        ctx.fillText("Dasar!", cx + 80, ballY);
      }
    };
    render();
  }, [fluid, pos, terminalVelocity]);

  const reset = () => {
    setIsRunning(false);
    setPos(0);
    lastTimeRef.current = 0;
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Viskositas (Kekentalan)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(true)} disabled={isRunning || pos >= 400} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${isRunning || pos >= 400 ? 'bg-zinc-700 text-zinc-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
              <Play className="w-4 h-4"/> Jatuhkan
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <h4 className="font-bold text-sm text-zinc-300">Jenis Fluida (η)</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => {setFluid("air"); reset();}} className={`py-2 rounded border ${fluid === 'air' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Air</button>
              <button onClick={() => {setFluid("oli"); reset();}} className={`py-2 rounded border ${fluid === 'oli' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Oli Mesin</button>
              <button onClick={() => {setFluid("madu"); reset();}} className={`py-2 rounded border ${fluid === 'madu' ? 'bg-amber-600/20 border-amber-600/50 text-amber-500' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Madu Murni</button>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 mt-4 leading-relaxed">
            <p><strong>Viskositas</strong> adalah ukuran kekentalan fluida yang menyatakan besar kecilnya gesekan di dalam fluida tersebut.</p>
            <p className="mt-2 text-rose-400 font-bold">Hukum Stokes:</p>
            <p>Semakin kental cairan (Madu), gaya gesek yang melawan pergerakan bola semakin besar, sehingga <strong>Kecepatan Terminal</strong> benda menjadi lebih lambat.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
