"use client";

import { useState, useEffect, useRef } from "react";

export default function KalkulusVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointX, setPointX] = useState(2); // Current x evaluation point

  // The function f(x) = sin(x) + x/2
  const f = (x: number) => Math.sin(x) + x / 2;
  // Derivative f'(x) = cos(x) + 0.5
  const df = (x: number) => Math.cos(x) + 0.5;
  // Integral F(x) = -cos(x) + x^2/4 (Area from 0)
  const F = (x: number) => -Math.cos(x) + (x * x) / 4;
  const F_0 = F(0); // For definite integral from 0 to x: F(x) - F(0)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 4; // Shift origin left
      const cy = canvas.height / 2;
      const scale = 50; // pixels per unit

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();

      // Draw Area under curve (Integral)
      ctx.beginPath();
      ctx.fillStyle = "rgba(236, 72, 153, 0.3)"; // pink-500 opacity
      ctx.moveTo(cx, cy); // from (0,0)
      for (let px = cx; px <= cx + pointX * scale; px++) {
        const mx = (px - cx) / scale;
        const my = f(mx);
        const py = cy - (my * scale);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(cx + pointX * scale, cy);
      ctx.closePath();
      ctx.fill();

      // Draw Function f(x)
      ctx.beginPath();
      ctx.strokeStyle = "#10b981"; // emerald
      ctx.lineWidth = 3;
      for (let px = 0; px < canvas.width; px++) {
        const mx = (px - cx) / scale;
        const my = f(mx);
        const py = cy - (my * scale);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw Tangent Line (Derivative)
      const slope = df(pointX);
      const tangentY = f(pointX);
      // y - y1 = m(x - x1) => y = m(x - pointX) + tangentY
      ctx.beginPath();
      ctx.strokeStyle = "#facc15"; // yellow
      ctx.lineWidth = 2;
      for (let mx = pointX - 2; mx <= pointX + 2; mx += 0.5) {
        const my = slope * (mx - pointX) + tangentY;
        const px = cx + mx * scale;
        const py = cy - my * scale;
        if (mx === pointX - 2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw Point
      const ptX = cx + pointX * scale;
      const ptY = cy - tangentY * scale;
      ctx.beginPath();
      ctx.arc(ptX, ptY, 6, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [pointX]);

  const currentSlope = df(pointX).toFixed(2);
  const currentArea = (F(pointX) - F_0).toFixed(2);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 right-6 glass-card p-4 rounded-xl border border-white/10 space-y-4 w-64">
          <div className="border-l-4 border-yellow-400 pl-3">
            <div className="text-xs text-zinc-400 mb-1">Turunan (Kemiringan)</div>
            <div className="font-mono text-xl text-white">f'(x) = {currentSlope}</div>
          </div>
          <div className="border-l-4 border-pink-500 pl-3">
            <div className="text-xs text-zinc-400 mb-1">Integral (Luas Area)</div>
            <div className="font-mono text-xl text-white">∫ f(x) = {currentArea}</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kalkulus Visual</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <p className="text-sm text-zinc-400">Geser titik evaluasi x untuk melihat bagaimana garis singgung (turunan) dan luas area di bawah kurva (integral) berubah.</p>
          
          <div className="text-center font-mono text-emerald-400 py-3 bg-black/20 rounded-xl border border-white/5">
            f(x) = sin(x) + x/2
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Posisi x</label><span className="text-white font-mono">{pointX}</span></div>
            <input type="range" className="w-full accent-indigo-500" min="0" max="10" step="0.1" value={pointX} onChange={(e) => setPointX(parseFloat(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
