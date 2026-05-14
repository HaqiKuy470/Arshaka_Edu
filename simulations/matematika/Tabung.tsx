"use client";

import { useState, useEffect, useRef } from "react";

export default function Tabung() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(10); // Jari-jari
  const [t, setT] = useState(15); // Tinggi
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
      const hPx = t * scale;
      const halfH = hPx / 2;

      const angleX = 0.5;
      angleY += 0.01;

      const project = (x: number, y: number, z: number) => {
        let rx = x * Math.cos(angleY) - z * Math.sin(angleY);
        let rz = x * Math.sin(angleY) + z * Math.cos(angleY);
        let ry = y * Math.cos(angleX) - rz * Math.sin(angleX);
        return { px: cx + rx, py: cy + ry };
      };

      ctx.strokeStyle = "#8b5cf6"; // Violet
      ctx.lineWidth = 3;

      // Draw top and bottom circles
      const segments = 30;
      const drawCircle = (yPos: number) => {
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const x = Math.cos(theta) * rPx;
          const z = Math.sin(theta) * rPx;
          const p = project(x, yPos, z);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      };

      drawCircle(-halfH); // Top
      drawCircle(halfH);  // Bottom

      // Draw side connecting lines (at specific angles for 3D effect)
      const sideAngles = [0, Math.PI]; // Left and right edges from perspective
      sideAngles.forEach(ang => {
        const x = Math.cos(ang - angleY) * rPx;
        const z = Math.sin(ang - angleY) * rPx;
        const pTop = project(x, -halfH, z);
        const pBot = project(x, halfH, z);
        ctx.beginPath(); ctx.moveTo(pTop.px, pTop.py); ctx.lineTo(pBot.px, pBot.py); ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [r, t]);

  const volume = Math.PI * r * r * t;
  const area = 2 * Math.PI * r * (r + t);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-6 left-6 glass-card p-6 rounded-xl border border-white/10 w-64 space-y-4">
          <div><div className="text-zinc-400 text-sm">Volume (πr²t)</div><div className="text-3xl font-bold text-violet-400 font-mono">{volume.toFixed(1)}</div></div>
          <div className="w-full h-px bg-white/10" />
          <div><div className="text-zinc-400 text-sm">Luas (2πr(r+t))</div><div className="text-3xl font-bold text-pink-400 font-mono">{area.toFixed(1)}</div></div>
        </div>
      </div>
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Geometri 3D: Tabung</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 pt-8">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jari-jari (r)</label><span className="text-white font-mono">{r}</span></div>
            <input type="range" className="w-full accent-violet-500" min="1" max="20" value={r} onChange={(e) => setR(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Tinggi (t)</label><span className="text-white font-mono">{t}</span></div>
            <input type="range" className="w-full accent-violet-500" min="1" max="30" value={t} onChange={(e) => setT(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
