"use client";

import { useState, useEffect, useRef } from "react";

export default function HukumCoulomb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [q1, setQ1] = useState(5); // microCoulombs (uC)
  const [q2, setQ2] = useState(-5); // microCoulombs
  const [distance, setDistance] = useState(10); // cm

  // Coulomb's Law: F = k * |q1 * q2| / r^2
  // k = 9 * 10^9
  // F is in Newtons. 
  // Let's just calculate a scaled relative force for UI display.
  // F = 9e9 * (q1*1e-6) * (q2*1e-6) / (distance*1e-2)^2
  
  const k = 9e9;
  const F = (k * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / Math.pow(distance * 1e-2, 2);

  const isAttract = (q1 * q2) < 0;

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

      // Distance maps visually (e.g. 10cm = 200px)
      const pxDist = distance * 20; 
      
      const p1x = cx - pxDist / 2;
      const p2x = cx + pxDist / 2;

      // Draw ruler/distance line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(p1x, cy + 50);
      ctx.lineTo(p2x, cy + 50);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`r = ${distance} cm`, cx, cy + 70);

      // Draw Force Arrows
      const drawArrow = (fromX: number, toX: number, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.moveTo(fromX, cy);
        ctx.lineTo(toX, cy);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        const dir = toX > fromX ? 1 : -1;
        ctx.moveTo(toX, cy - 8);
        ctx.lineTo(toX, cy + 8);
        ctx.lineTo(toX + dir * 12, cy);
        ctx.fill();
      };

      // Vector lengths based on force (cap for visual)
      const vLen = Math.min(100, Math.max(20, F / 5));

      if (F > 0) {
        if (isAttract) {
          // Pointing towards each other
          drawArrow(p1x + 30, p1x + 30 + vLen, "#22c55e");
          drawArrow(p2x - 30, p2x - 30 - vLen, "#22c55e");
          ctx.fillStyle = "#22c55e";
          ctx.fillText("Tarik-Menarik", cx, cy - 30);
        } else {
          // Pointing away
          drawArrow(p1x - 30, p1x - 30 - vLen, "#ef4444");
          drawArrow(p2x + 30, p2x + 30 + vLen, "#ef4444");
          ctx.fillStyle = "#ef4444";
          ctx.fillText("Tolak-Menolak", cx, cy - 30);
        }
      }

      // Draw Charges
      const drawCharge = (x: number, q: number) => {
        ctx.beginPath();
        ctx.arc(x, cy, 25, 0, Math.PI*2);
        ctx.fillStyle = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#71717a";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(q > 0 ? "+" : q < 0 ? "-" : "0", x, cy);
        
        ctx.font = "12px sans-serif";
        ctx.fillText(`${q} μC`, x, cy - 40);
      };

      drawCharge(p1x, q1);
      drawCharge(p2x, q2);

    };
    render();
  }, [q1, q2, distance, F, isAttract]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Coulomb</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/40 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-xs text-zinc-400 font-bold mb-1">Gaya Coulomb (F)</div>
            <div className="text-3xl font-mono font-bold text-white">
              {F.toFixed(0)} <span className="text-lg text-zinc-500">N</span>
            </div>
            <div className={`text-[10px] mt-2 font-bold uppercase ${isAttract ? 'text-emerald-400' : 'text-red-400'}`}>
              {F === 0 ? "Tidak Ada Gaya" : isAttract ? "Tarik Menarik" : "Tolak Menolak"}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-2"><span>Muatan 1 (q₁)</span><span>{q1} μC</span></div>
              <input type="range" className="w-full accent-red-500" min="-10" max="10" step="1" value={q1} onChange={(e) => setQ1(parseInt(e.target.value))} />
            </div>

            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/30">
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-2"><span>Muatan 2 (q₂)</span><span>{q2} μC</span></div>
              <input type="range" className="w-full accent-blue-500" min="-10" max="10" step="1" value={q2} onChange={(e) => setQ2(parseInt(e.target.value))} />
            </div>

            <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-2"><span>Jarak (r)</span><span>{distance} cm</span></div>
              <input type="range" className="w-full accent-white" min="5" max="20" step="1" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed mt-4">
            <p><strong>Hukum Coulomb:</strong> Besarnya gaya tarik-menarik atau tolak-menolak antara dua benda bermuatan listrik berbanding lurus dengan besar muatan dan berbanding terbalik dengan kuadrat jarak.</p>
            <div className="font-mono text-white mt-2 text-center">F = k · |q₁·q₂| / r²</div>
          </div>

        </div>
      </div>
    </div>
  );
}
