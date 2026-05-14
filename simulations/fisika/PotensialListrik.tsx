"use client";

import { useState, useEffect, useRef } from "react";

export default function PotensialListrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [q, setQ] = useState(10); // microCoulombs
  const [showField, setShowField] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Equipotential Surfaces (Concentric Circles)
      // V = k * q / r
      // Equipotential means constant r.
      const numSurfaces = 8;
      for (let i = 1; i <= numSurfaces; i++) {
        const radius = i * 30; // 30, 60, 90...
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        
        // Voltage calculation for visual
        const vRaw = (9e9 * (q * 1e-6)) / (radius * 1e-2); // rough scaling
        const vDisplay = vRaw / 10000; // scale down for UI
        
        if (q > 0) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - i/10})`; // Red
        } else if (q < 0) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - i/10})`; // Blue
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, 0)`; 
        }

        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Label equipotential line on the right side
        if (q !== 0 && i % 2 === 0) { // label every 2nd circle to avoid clutter
          ctx.fillStyle = q > 0 ? "rgba(252, 165, 165, 0.8)" : "rgba(147, 197, 253, 0.8)";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(`${vDisplay > 0 ? '+' : ''}${vDisplay.toFixed(0)} V`, cx + radius + 2, cy - 2);
        }
      }

      // Optionally draw field lines (perpendicular to equipotential)
      if (showField && q !== 0) {
        ctx.lineWidth = 1;
        const numLines = 12;
        for (let i = 0; i < numLines; i++) {
          const angle = (i * Math.PI * 2) / numLines;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle)*15, cy + Math.sin(angle)*15);
          ctx.lineTo(cx + Math.cos(angle)*300, cy + Math.sin(angle)*300);
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.stroke();

          // Arrow indicator
          const aR = 100 + Math.sin(time*0.05)*10;
          ctx.beginPath();
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.translate(cx + Math.cos(angle)*aR, cy + Math.sin(angle)*aR);
          ctx.rotate(q > 0 ? angle : angle + Math.PI);
          ctx.moveTo(0, -4); ctx.lineTo(8, 0); ctx.lineTo(0, 4); ctx.fill();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }

      // Draw Point Charge
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI*2);
      ctx.fillStyle = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#71717a";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(q > 0 ? "+" : q < 0 ? "-" : "0", cx, cy);

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [q, showField]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Potensial Listrik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${q > 0 ? 'bg-red-500/10 border-red-500/30' : q < 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-800 border-zinc-700'}`}>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-2">
                <span>Nilai Muatan (Q)</span>
                <span className={q > 0 ? 'text-red-400' : q < 0 ? 'text-blue-400' : 'text-zinc-500'}>{q} μC</span>
              </div>
              <input type="range" className={`w-full ${q > 0 ? 'accent-red-500' : q < 0 ? 'accent-blue-500' : 'accent-zinc-500'}`} min="-20" max="20" step="1" value={q} onChange={(e) => setQ(parseInt(e.target.value))} />
            </div>

            <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
              <input type="checkbox" checked={showField} onChange={(e) => setShowField(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
              <span className="text-sm font-bold text-zinc-300">Tampilkan Garis Medan L.</span>
            </label>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed mt-4">
            <p><strong>Permukaan Ekipotensial</strong> (garis putus-putus) adalah titik-titik di sekitar muatan yang memiliki nilai potensial (Voltase) yang sama besar.</p>
            <p className="mt-2 text-yellow-400">Penting: Garis medan listrik (vektor gaya) selalu memotong tegak lurus (90°) terhadap permukaan ekipotensial.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
