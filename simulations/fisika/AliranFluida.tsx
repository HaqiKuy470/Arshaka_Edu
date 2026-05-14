"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function AliranFluida() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [v1, setV1] = useState(2); // m/s (Input velocity)
  const [d1, setD1] = useState(10); // cm (Input diameter)
  const [d2, setD2] = useState(5); // cm (Output diameter)

  // Continuity Equation: A1 * v1 = A2 * v2
  // (pi * (d1/2)^2) * v1 = (pi * (d2/2)^2) * v2
  // d1^2 * v1 = d2^2 * v2
  // v2 = (d1/d2)^2 * v1
  
  const v2 = Math.pow(d1 / d2, 2) * v1;

  const animationRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const update = () => {
        // We just need a visual offset for particles/flow lines
        // Base it on an average speed just to make water move
        offsetRef.current += 1;
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning]);

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
      
      const pipeLen = canvas.width / 2;
      
      // Visual scaling
      const h1 = d1 * 10; 
      const h2 = d2 * 10;

      // Draw Pipe
      ctx.beginPath();
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)"; // sky-400 water color
      ctx.strokeStyle = "#94a3b8"; // slate-400 pipe walls
      ctx.lineWidth = 6;

      // Pipe Top wall
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(cx - 50, cy - h1/2); // transition start
      ctx.lineTo(cx + 50, cy - h2/2); // transition end
      ctx.lineTo(canvas.width, cy - h2/2);
      ctx.stroke();

      // Pipe Bottom wall
      ctx.beginPath();
      ctx.moveTo(0, cy + h1/2);
      ctx.lineTo(cx - 50, cy + h1/2);
      ctx.lineTo(cx + 50, cy + h2/2);
      ctx.lineTo(canvas.width, cy + h2/2);
      ctx.stroke();

      // Fill Pipe Interior
      ctx.beginPath();
      ctx.moveTo(0, cy - h1/2);
      ctx.lineTo(cx - 50, cy - h1/2);
      ctx.lineTo(cx + 50, cy - h2/2);
      ctx.lineTo(canvas.width, cy - h2/2);
      ctx.lineTo(canvas.width, cy + h2/2);
      ctx.lineTo(cx + 50, cy + h2/2);
      ctx.lineTo(cx - 50, cy + h1/2);
      ctx.lineTo(0, cy + h1/2);
      ctx.fill();

      // Draw Flow Lines / Particles
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);

      // Calculate base offset so dash moves
      // We'll just draw horizontal lines that shift
      
      const drawStreamline = (yRatio: number) => {
        ctx.beginPath();
        
        const sy1 = cy + (yRatio * h1/2);
        const sy2 = cy + (yRatio * h2/2);

        // Calculate a speed ratio for the line dash animation
        // Actually, just using lineDashOffset is easiest
        
        ctx.moveTo(0, sy1);
        ctx.lineTo(cx - 50, sy1);
        ctx.lineTo(cx + 50, sy2);
        ctx.lineTo(canvas.width, sy2);
        ctx.stroke();
      };

      // Since speed differs, lineDashOffset should differ.
      // We will draw segment 1 and segment 2 separately for accurate visual speeds
      
      ctx.setLineDash([20, 20]);

      // Section 1 (Left)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, cx - 50, canvas.height);
      ctx.clip();
      ctx.lineDashOffset = -offsetRef.current * v1; // moving right
      for(let r=-0.6; r<=0.6; r+=0.4) drawStreamline(r);
      ctx.restore();

      // Section 2 (Right)
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx + 50, 0, canvas.width, canvas.height);
      ctx.clip();
      ctx.lineDashOffset = -offsetRef.current * v2; // moving right much faster
      for(let r=-0.6; r<=0.6; r+=0.4) drawStreamline(r);
      ctx.restore();

      // Transition Section (Middle)
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - 50, 0, 100, canvas.height);
      ctx.clip();
      ctx.lineDashOffset = -offsetRef.current * ((v1+v2)/2); 
      for(let r=-0.6; r<=0.6; r+=0.4) drawStreamline(r);
      ctx.restore();
      
      ctx.setLineDash([]);

      // Annotations
      ctx.fillStyle = "white";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      
      ctx.fillText(`v₁ = ${v1.toFixed(1)} m/s`, cx / 2, cy - h1/2 - 20);
      ctx.fillText(`d₁ = ${d1} cm`, cx / 2, cy + h1/2 + 20);
      
      ctx.fillText(`v₂ = ${v2.toFixed(1)} m/s`, cx + pipeLen/2, cy - h2/2 - 20);
      ctx.fillText(`d₂ = ${d2} cm`, cx + pipeLen/2, cy + h2/2 + 20);
    };

    if (isRunning) {
      // It's animated by the effect loop, but we need to hook into it
      // Let's just use requestAnimationFrame in the render loop itself for the canvas
      let rAF = 0;
      const loop = () => {
        render();
        rAF = requestAnimationFrame(loop);
      }
      loop();
      return () => cancelAnimationFrame(rAF);
    } else {
      render();
    }
  }, [d1, d2, v1, v2, isRunning]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Aliran Fluida (Pers. Kontinuitas)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Animasi' : 'Jalankan Animasi'}
          </button>

          <div className="space-y-4 pt-2">
            <div className="bg-sky-500/10 border border-sky-500/30 p-3 rounded-xl">
              <h4 className="font-bold text-sky-400 text-sm mb-2">Penampang 1 (Kiri)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-300"><span>Kecepatan (v₁)</span><span>{v1} m/s</span></div>
                <input type="range" className="w-full accent-sky-500" min="1" max="10" step="1" value={v1} onChange={(e) => setV1(parseInt(e.target.value))} />
                
                <div className="flex justify-between text-xs text-zinc-300 mt-2"><span>Diameter (d₁)</span><span>{d1} cm</span></div>
                <input type="range" className="w-full accent-sky-500" min="5" max="20" step="1" value={d1} onChange={(e) => setD1(parseInt(e.target.value))} />
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
              <h4 className="font-bold text-emerald-400 text-sm mb-2">Penampang 2 (Kanan)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-300 mt-2"><span>Diameter (d₂)</span><span>{d2} cm</span></div>
                <input type="range" className="w-full accent-emerald-500" min="2" max="20" step="1" value={d2} onChange={(e) => setD2(parseInt(e.target.value))} />
                
                <div className="flex justify-between text-xs text-zinc-300 mt-2"><span>Kecepatan Keluar (v₂)</span><span className="font-bold text-emerald-400">{v2.toFixed(1)} m/s</span></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400">
            <p><strong>Persamaan Kontinuitas:</strong> Debit fluida (Q) di setiap titik pada pipa selalu konstan.</p>
            <div className="font-mono text-white mt-2">A₁·v₁ = A₂·v₂</div>
            <p className="mt-2 text-yellow-400">Semakin sempit pipa, kecepatan air semakin tinggi.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
