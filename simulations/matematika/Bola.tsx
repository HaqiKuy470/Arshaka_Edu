"use client";

import { useState, useEffect, useRef } from "react";

export default function Bola() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(15); // Jari-jari
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angleY = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 12; // px per unit
      const rPx = r * scale;

      angleY += 0.01;

      ctx.strokeStyle = "#eab308"; // Yellow
      ctx.lineWidth = 3;

      // Draw Main outer circle
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI*2);
      ctx.stroke();

      // Draw equator (horizontal ellipse simulating 3D rotation)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(234, 179, 8, 0.4)";
      for (let i = 0; i <= 360; i += 5) {
        const rad = i * (Math.PI / 180);
        // Parametric equation of an ellipse rotated by angleX
        const x = cx + Math.cos(rad) * rPx;
        const y = cy + Math.sin(rad) * rPx * 0.3; // 0.3 flattens it to simulate perspective
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw meridian (vertical ellipse spinning)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(234, 179, 8, 0.8)";
      for (let i = 0; i <= 360; i += 5) {
        const rad = i * (Math.PI / 180);
        // The width of the vertical ellipse changes with Math.cos(angleY)
        const x = cx + Math.cos(rad) * rPx * Math.cos(angleY);
        const y = cy + Math.sin(rad) * rPx;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw center dot
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.fillStyle = "white"; ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [r]);

  const volume = (4/3) * Math.PI * Math.pow(r, 3);
  const area = 4 * Math.PI * Math.pow(r, 2);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-6 left-6 glass-card p-6 rounded-xl border border-white/10 w-64 space-y-4">
          <div><div className="text-zinc-400 text-sm">Volume (4/3πr³)</div><div className="text-3xl font-bold text-yellow-400 font-mono">{volume.toFixed(1)}</div></div>
          <div className="w-full h-px bg-white/10" />
          <div><div className="text-zinc-400 text-sm">Luas Permukaan (4πr²)</div><div className="text-3xl font-bold text-orange-400 font-mono">{area.toFixed(1)}</div></div>
        </div>
      </div>
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Geometri 3D: Bola</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 pt-8">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jari-jari (r)</label><span className="text-white font-mono">{r}</span></div>
            <input type="range" className="w-full accent-yellow-500" min="1" max="25" value={r} onChange={(e) => setR(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
