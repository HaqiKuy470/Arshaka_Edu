"use client";

import { useState, useEffect, useRef } from "react";

export default function MedanListrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [q, setQ] = useState(1); // Point charge (+ or -)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Field Lines
      if (q !== 0) {
        ctx.lineWidth = 2;
        const numLines = 16;
        for (let i = 0; i < numLines; i++) {
          const angle = (i * Math.PI * 2) / numLines;
          
          ctx.beginPath();
          // Fade out as it goes further away
          const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 300);
          grad.addColorStop(0, q > 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(59, 130, 246, 0.8)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;

          ctx.moveTo(cx + Math.cos(angle)*25, cy + Math.sin(angle)*25);
          ctx.lineTo(cx + Math.cos(angle)*300, cy + Math.sin(angle)*300);
          ctx.stroke();

          // Draw animated arrows along the line indicating direction
          const arrowDist = (offset % 100) + 50; // loop arrow from 50 to 150 radius
          
          ctx.beginPath();
          ctx.fillStyle = q > 0 ? "#ef4444" : "#3b82f6";
          
          const ax = cx + Math.cos(angle) * arrowDist;
          const ay = cy + Math.sin(angle) * arrowDist;
          
          ctx.translate(ax, ay);
          // If positive, point outwards (angle). If negative, point inwards (angle + PI).
          ctx.rotate(q > 0 ? angle : angle + Math.PI);
          
          ctx.moveTo(0, -5);
          ctx.lineTo(10, 0);
          ctx.lineTo(0, 5);
          ctx.fill();
          
          ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        }
      }

      // Draw Point Charge
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI*2);
      ctx.fillStyle = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#71717a";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(q > 0 ? "+" : q < 0 ? "-" : "0", cx, cy);

      offset += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [q]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Medan Listrik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-zinc-300">Ubah Jenis Muatan (Q)</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setQ(1)} 
                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${q > 0 ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-transparent border-white/10 text-zinc-500 hover:border-red-500/50'}`}
              >
                Positif (+)
              </button>
              <button 
                onClick={() => setQ(-1)} 
                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${q < 0 ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-transparent border-white/10 text-zinc-500 hover:border-blue-500/50'}`}
              >
                Negatif (-)
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-8">
            <p><strong>Garis Medan Listrik</strong> memvisualisasikan arah gaya yang akan dialami oleh muatan uji positif kecil jika diletakkan di sekitarnya.</p>
            <ul className="list-disc pl-4 space-y-2">
              <li className="text-red-400">Muatan Positif: Garis medan menyebar <strong>keluar</strong> (menjauhi muatan).</li>
              <li className="text-blue-400">Muatan Negatif: Garis medan berkumpul ke <strong>dalam</strong> (menuju muatan).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
