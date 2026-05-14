"use client";

import { useState, useEffect, useRef } from "react";

export default function Trigonometri() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [degree, setDegree] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 3; // Circle center
      const cy = canvas.height / 2;
      const radius = 150; // Unit circle radius

      const radian = degree * (Math.PI / 180);
      const px = cx + Math.cos(radian) * radius;
      const py = cy - Math.sin(radian) * radius;

      // Draw Grid / Axes
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();

      // Draw Unit Circle
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.arc(cx, cy, radius, 0, Math.PI*2);
      ctx.stroke();

      // Draw Angle Arc
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 30, 0, -radian, radian > 0);
      ctx.fill();

      // Draw Cosine Line (Horizontal)
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8"; // Sky (Cos)
      ctx.lineWidth = 4;
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, cy);
      ctx.stroke();

      // Draw Sine Line (Vertical)
      ctx.beginPath();
      ctx.strokeStyle = "#fb7185"; // Rose (Sin)
      ctx.lineWidth = 4;
      ctx.moveTo(px, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Draw Hypotenuse (Radius)
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Point
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();

      // --- Draw Sine Graph to the right ---
      const graphStartX = cx + radius + 50;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.moveTo(graphStartX, 0); ctx.lineTo(graphStartX, canvas.height); ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 2;
      for (let d = 0; d <= 360; d += 2) {
        const rad = d * (Math.PI / 180);
        const gx = graphStartX + d;
        const gy = cy - Math.sin(rad) * radius;
        if (d === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // Plot point on sine wave
      const waveX = graphStartX + degree;
      ctx.beginPath();
      ctx.arc(waveX, py, 5, 0, Math.PI*2);
      ctx.fillStyle = "#fb7185";
      ctx.fill();

      // Dashed line connecting circle to wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(251, 113, 133, 0.5)";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(px, py);
      ctx.lineTo(waveX, py);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [degree]);

  const radianVal = (degree * Math.PI / 180).toFixed(2);
  const sinVal = Math.sin(degree * Math.PI / 180).toFixed(3);
  const cosVal = Math.cos(degree * Math.PI / 180).toFixed(3);
  const tanVal = Math.abs(degree) === 90 || Math.abs(degree) === 270 ? "∞" : Math.tan(degree * Math.PI / 180).toFixed(3);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Trigonometri (Lingkaran Satuan)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Sudut (Derajat)</label><span className="text-white">{degree}°</span></div>
            <input type="range" className="w-full accent-white" min="0" max="360" value={degree} onChange={(e) => setDegree(parseInt(e.target.value))} />
            <p className="text-xs text-zinc-500">Radian: {radianVal} π</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="glass-card p-3 rounded-xl border border-rose-500/30 text-center">
              <div className="text-xs text-rose-400 mb-1">Sin(θ)</div>
              <div className="text-xl font-mono text-white">{sinVal}</div>
            </div>
            <div className="glass-card p-3 rounded-xl border border-sky-500/30 text-center">
              <div className="text-xs text-sky-400 mb-1">Cos(θ)</div>
              <div className="text-xl font-mono text-white">{cosVal}</div>
            </div>
            <div className="glass-card p-3 rounded-xl border border-emerald-500/30 text-center col-span-2">
              <div className="text-xs text-emerald-400 mb-1">Tan(θ) = Sin/Cos</div>
              <div className="text-xl font-mono text-white">{tanVal}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
