"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function PerubahanWujudZat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Starting temp: -20 C
  const [temp, setTemp] = useState(-20);
  const animationRef = useRef(0);

  // States:
  // -20 to 0: Es (Warming ice)
  // 0: Es -> Air (Melting) [Phase requires time without temp change]
  // 0 to 100: Air (Warming water)
  // 100: Air -> Uap (Boiling)
  // 100+: Uap (Warming steam)

  const [phaseProgress, setPhaseProgress] = useState(0); // 0 to 100 during a phase change

  useEffect(() => {
    if (isRunning && temp < 120) {
      const update = () => {
        if (temp === 0 && phaseProgress < 100) {
          // Melting phase
          setPhaseProgress(p => p + 0.5);
        } else if (temp === 100 && phaseProgress < 100) {
          // Boiling phase
          setPhaseProgress(p => p + 0.2); // Boils slower
        } else {
          // Heating phase
          setTemp(t => t + 0.5);
          setPhaseProgress(0); // reset phase progress for next stop
        }
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, temp, phaseProgress]);

  // Determine state
  let stateName = "Es Padat";
  let stateColor = "text-sky-400";
  if (temp === 0 && phaseProgress < 100) { stateName = "Mencair (Es ➔ Air)"; stateColor = "text-sky-200"; }
  else if (temp > 0 && temp < 100) { stateName = "Air Cair"; stateColor = "text-blue-500"; }
  else if (temp === 100 && phaseProgress < 100) { stateName = "Mendidih (Air ➔ Uap)"; stateColor = "text-zinc-300"; }
  else if (temp > 100) { stateName = "Uap Air (Gas)"; stateColor = "text-zinc-500"; }

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
      const cy = canvas.height / 2;

      // Draw Beaker
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy - 50);
      ctx.lineTo(cx - 80, cy + 100);
      ctx.lineTo(cx + 80, cy + 100);
      ctx.lineTo(cx + 80, cy - 50);
      ctx.stroke();

      // Fire underneath
      if (isRunning) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(cx, cy + 100);
        ctx.lineTo(cx - 20, cy + 140);
        ctx.lineTo(cx + 20, cy + 140);
        ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(cx, cy + 110);
        ctx.lineTo(cx - 10, cy + 140);
        ctx.lineTo(cx + 10, cy + 140);
        ctx.fill();
      }

      // Inside Beaker: Depends on temp & phase
      if (temp <= 0) {
        // Draw Ice Cubes
        ctx.fillStyle = "rgba(125, 211, 252, 0.8)"; // sky-300
        const meltRatio = temp === 0 ? phaseProgress / 100 : 0;
        const cubeSize = 40 * (1 - meltRatio * 0.5); // shrink slightly as it melts
        
        ctx.fillRect(cx - 50, cy + 100 - cubeSize, cubeSize, cubeSize);
        ctx.fillRect(cx + 10, cy + 100 - cubeSize, cubeSize, cubeSize);
        ctx.fillRect(cx - 20, cy + 100 - cubeSize*2, cubeSize, cubeSize);

        // Water pooling if melting
        if (temp === 0) {
          ctx.fillStyle = "rgba(59, 130, 246, 0.5)"; // blue-500
          ctx.fillRect(cx - 78, cy + 100 - (meltRatio * 50), 156, meltRatio * 50);
        }
      } 
      else if (temp > 0 && temp < 100) {
        // Just water
        ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
        ctx.fillRect(cx - 78, cy + 50, 156, 50);
        
        // Bubbles if getting close to 100
        if (temp > 80) {
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          for(let i=0; i<5; i++) {
             ctx.beginPath(); ctx.arc(cx - 50 + Math.random()*100, cy + 50 + Math.random()*40, 3, 0, Math.PI*2); ctx.fill();
          }
        }
      }
      else if (temp >= 100) {
        const boilRatio = temp === 100 ? phaseProgress / 100 : 1;
        // Water decreasing
        const waterLevel = 50 * (1 - boilRatio);
        ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
        ctx.fillRect(cx - 78, cy + 100 - waterLevel, 156, waterLevel);

        // Steam rising
        ctx.fillStyle = `rgba(200, 200, 200, ${boilRatio * 0.5})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 60 * boilRatio, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - 30, cy - 30, 40 * boilRatio, 0, Math.PI*2);
        ctx.fill();
      }

    };

    render();
  }, [temp, phaseProgress, isRunning]);

  const reset = () => {
    setIsRunning(false);
    setTemp(-20);
    setPhaseProgress(0);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Perubahan Wujud Zat & Grafik Suhu</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(true)} disabled={isRunning || temp >= 120} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${isRunning || temp >= 120 ? 'bg-zinc-700 text-zinc-400' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
              <Play className="w-4 h-4"/> Panaskan
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-center shadow-inner">
            <div className="text-xs text-zinc-400 font-bold mb-2 uppercase tracking-wider">Termometer</div>
            <div className={`text-5xl font-mono font-bold ${stateColor}`}>
              {Math.floor(temp)}°C
            </div>
            <div className={`text-sm mt-3 font-bold ${stateColor}`}>{stateName}</div>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p><strong>Kenapa suhu berhenti di 0°C dan 100°C?</strong></p>
            <p>Pada titik lebur dan titik didih, energi panas (kalor) digunakan sepenuhnya untuk memutus ikatan molekul (berubah wujud), bukan untuk menaikkan suhu. Ini disebut <strong>Kalor Laten</strong>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
