"use client";

import { useState, useEffect, useRef } from "react";

export default function EksponenLogaritma() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [base, setBase] = useState(2);
  const [showLog, setShowLog] = useState(true);

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
      const cx = w / 3; // Shifted left to show more positive x
      const cy = h / 2 + 100; // Shifted down to show more positive y
      const scale = 50; // 50px per unit

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for(let i=cx; i<w; i+=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=cx; i>0; i-=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=cy; i<h; i+=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      for(let i=cy; i>0; i-=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); // Y
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px sans-serif";
      ctx.fillText("X", w - 15, cy + 15); ctx.fillText("Y", cx + 10, 15);

      // Line y = x (Reflection axis)
      ctx.beginPath(); ctx.moveTo(0, cy + cx); ctx.lineTo(w, cy - (w-cx));
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.setLineDash([5,5]); ctx.lineWidth=1; ctx.stroke(); ctx.setLineDash([]);
      ctx.fillText("y = x", cx + 100, cy - 100 + 15);

      // Plot Exponential: y = base^x
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6"; // Blue
      ctx.lineWidth = 3;
      let startPoint = true;
      for(let px=0; px<w; px++) {
        const mathX = (px - cx) / scale;
        const mathY = Math.pow(base, mathX);
        const py = cy - mathY * scale;
        
        if (py < 0 || py > h) { startPoint=true; continue; } // clip
        if (startPoint) { ctx.moveTo(px, py); startPoint=false; } 
        else { ctx.lineTo(px, py); }
      }
      ctx.stroke();

      // Plot Logarithm: y = log_base(x)
      if (showLog) {
        ctx.beginPath();
        ctx.strokeStyle = "#ec4899"; // Pink
        ctx.lineWidth = 3;
        startPoint = true;
        for(let px=cx+1; px<w; px++) { // x > 0
          const mathX = (px - cx) / scale;
          const mathY = Math.log(mathX) / Math.log(base);
          const py = cy - mathY * scale;
          
          if (py < 0 || py > h) { startPoint=true; continue; } // clip
          if (startPoint) { ctx.moveTo(px, py); startPoint=false; } 
          else { ctx.lineTo(px, py); }
        }
        ctx.stroke();
      }

      // Intersects at (0,1) for Exp and (1,0) for Log
      ctx.beginPath(); ctx.arc(cx, cy - scale, 5, 0, Math.PI*2); ctx.fillStyle="#3b82f6"; ctx.fill();
      ctx.fillText("(0, 1)", cx - 40, cy - scale);

      if (showLog) {
        ctx.beginPath(); ctx.arc(cx + scale, cy, 5, 0, Math.PI*2); ctx.fillStyle="#ec4899"; ctx.fill();
        ctx.fillText("(1, 0)", cx + scale, cy + 20);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [base, showLog]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Eksponen & Logaritma</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner space-y-3">
            <div className="text-xl font-mono text-blue-400 font-bold">
              y = {base.toFixed(1)}<sup className="text-sm">x</sup>
            </div>
            {showLog && (
              <div className="text-xl font-mono text-pink-400 font-bold">
                y = <sup>{base.toFixed(1)}</sup>log(x)
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Basis (a)</label>
                <span className="font-mono text-emerald-400">{base.toFixed(1)}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="0.1" max="10" step="0.1" value={base} onChange={(e) => setBase(parseFloat(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Jika 0 &lt; a &lt; 1, grafik eksponen menurun (Peluruhan).</p>
            </div>

            <label className="flex items-center gap-3 p-4 border border-pink-500/30 bg-pink-500/10 rounded-xl cursor-pointer transition-colors mt-4">
              <input type="checkbox" checked={showLog} onChange={(e) => setShowLog(e.target.checked)} className="w-4 h-4 accent-pink-500" />
              <span className="text-sm font-bold text-pink-400">Tampilkan Logaritma</span>
            </label>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Fungsi Logaritma</strong> adalah kebalikan (invers) dari Fungsi Eksponensial.</p>
            <p>Oleh karena itu, secara grafis, kurva logaritma adalah hasil pencerminan kurva eksponen terhadap garis diagonal <span className="font-mono">y = x</span>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
