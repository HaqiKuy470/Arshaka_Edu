"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function PrinsipBernoulli() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [v1, setV1] = useState(2); // m/s
  const [d1, setD1] = useState(12); // cm
  const [d2, setD2] = useState(6); // cm
  const [rho, setRho] = useState(1000); // kg/m^3 (Water)

  // Atmospheric pressure base
  const P0 = 101325; // Pa
  
  // Continuity: v2 = v1 * (d1/d2)^2
  const v2 = v1 * Math.pow(d1 / d2, 2);

  // Bernoulli (horizontal pipe, h1 = h2):
  // P1 + 0.5 * rho * v1^2 = P2 + 0.5 * rho * v2^2
  // Let P1 = P0 (simplification for simulation reference point)
  const P1 = P0;
  // P2 = P1 + 0.5 * rho * (v1^2 - v2^2)
  const P2 = P1 + 0.5 * rho * (v1*v1 - v2*v2);

  // Convert to kPa
  const P1kPa = P1 / 1000;
  const P2kPa = P2 / 1000;

  const animationRef = useRef(0);
  const offsetRef = useRef(0);

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
      
      const h1 = d1 * 10; 
      const h2 = d2 * 10;

      // Draw Pipe
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 6;

      ctx.beginPath();
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(cx - 50, cy - h1/2);
      ctx.lineTo(cx + 50, cy - h2/2);
      ctx.lineTo(canvas.width, cy - h2/2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, cy + h1/2);
      ctx.lineTo(cx - 50, cy + h1/2);
      ctx.lineTo(cx + 50, cy + h2/2);
      ctx.lineTo(canvas.width, cy + h2/2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, cy - h1/2); ctx.lineTo(cx - 50, cy - h1/2); ctx.lineTo(cx + 50, cy - h2/2); ctx.lineTo(canvas.width, cy - h2/2);
      ctx.lineTo(canvas.width, cy + h2/2); ctx.lineTo(cx + 50, cy + h2/2); ctx.lineTo(cx - 50, cy + h1/2); ctx.lineTo(0, cy + h1/2);
      ctx.fill();

      // Flow Lines
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([15, 15]);

      const drawStreamline = (yRatio: number) => {
        ctx.beginPath();
        ctx.moveTo(0, cy + (yRatio * h1/2));
        ctx.lineTo(cx - 50, cy + (yRatio * h1/2));
        ctx.lineTo(cx + 50, cy + (yRatio * h2/2));
        ctx.lineTo(canvas.width, cy + (yRatio * h2/2));
        ctx.stroke();
      };

      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, cx - 50, canvas.height); ctx.clip();
      ctx.lineDashOffset = -offsetRef.current * v1;
      for(let r=-0.5; r<=0.5; r+=0.5) drawStreamline(r);
      ctx.restore();

      ctx.save();
      ctx.beginPath(); ctx.rect(cx + 50, 0, canvas.width, canvas.height); ctx.clip();
      ctx.lineDashOffset = -offsetRef.current * v2;
      for(let r=-0.5; r<=0.5; r+=0.5) drawStreamline(r);
      ctx.restore();

      ctx.setLineDash([]);

      // Draw Pressure Gauges
      const drawGauge = (x: number, y: number, pressure: number) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 50); ctx.strokeStyle = "#94a3b8"; ctx.stroke();
        
        ctx.beginPath(); ctx.arc(x, y - 80, 30, 0, Math.PI*2); ctx.fillStyle = "#18181b"; ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = "white"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("kPa", x, y - 65);
        ctx.font = "14px monospace";
        ctx.fillText(pressure.toFixed(1), x, y - 75);
      };

      drawGauge(cx - 150, cy - h1/2, P1kPa);
      drawGauge(cx + 150, cy - h2/2, P2kPa);

    };

    if (isRunning) {
      let rAF = 0;
      const loop = () => {
        offsetRef.current += 1;
        render();
        rAF = requestAnimationFrame(loop);
      }
      loop();
      return () => cancelAnimationFrame(rAF);
    } else {
      render();
    }
  }, [d1, d2, v1, v2, P1kPa, P2kPa, isRunning]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Prinsip Bernoulli</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Animasi' : 'Jalankan Animasi'}
          </button>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Kecepatan Masuk (v₁)</span><span>{v1} m/s</span></div>
              <input type="range" className="w-full accent-sky-500" min="1" max="10" step="1" value={v1} onChange={(e) => setV1(parseInt(e.target.value))} />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Diameter Pipa Kiri (d₁)</span><span>{d1} cm</span></div>
              <input type="range" className="w-full accent-sky-500" min="8" max="20" step="1" value={d1} onChange={(e) => setD1(parseInt(e.target.value))} />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Diameter Pipa Kanan (d₂)</span><span>{d2} cm</span></div>
              <input type="range" className="w-full accent-emerald-500" min="2" max="20" step="1" value={d2} onChange={(e) => setD2(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-sky-500/10 border border-sky-500/30 p-2 rounded-xl text-center">
              <div className="text-[10px] text-sky-400">P₁ (Kiri)</div>
              <div className="text-lg font-mono text-white">{P1kPa.toFixed(1)} <span className="text-[10px]">kPa</span></div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-center">
              <div className="text-[10px] text-emerald-400">P₂ (Kanan)</div>
              <div className="text-lg font-mono text-white">{P2kPa.toFixed(1)} <span className="text-[10px]">kPa</span></div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400">
            <p><strong>Prinsip Bernoulli:</strong> Pada pipa horizontal, bagian fluida yang bergerak lebih cepat (di area sempit) memiliki tekanan yang <strong>lebih rendah</strong>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
