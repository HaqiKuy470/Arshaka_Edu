"use client";

import { useState, useEffect, useRef } from "react";

export default function Kerucut() {
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
      const baseCy = hPx / 2; // Move base down
      const topCy = -hPx / 2; // Tip up

      const angleX = 0.5;
      angleY += 0.01;

      const project = (x: number, y: number, z: number) => {
        let rx = x * Math.cos(angleY) - z * Math.sin(angleY);
        let rz = x * Math.sin(angleY) + z * Math.cos(angleY);
        let ry = y * Math.cos(angleX) - rz * Math.sin(angleX);
        return { px: cx + rx, py: cy + ry };
      };

      ctx.strokeStyle = "#fb7185"; // Rose
      ctx.lineWidth = 3;

      // Draw base circle
      const segments = 30;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = Math.cos(theta) * rPx;
        const z = Math.sin(theta) * rPx;
        const p = project(x, baseCy, z);
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();

      // Draw side lines from tip to base edges
      const tip = project(0, topCy, 0);
      
      const sideAngles = [0, Math.PI]; // Left and right edges
      sideAngles.forEach(ang => {
        const x = Math.cos(ang - angleY) * rPx;
        const z = Math.sin(ang - angleY) * rPx;
        const pBot = project(x, baseCy, z);
        ctx.beginPath(); ctx.moveTo(tip.px, tip.py); ctx.lineTo(pBot.px, pBot.py); ctx.stroke();
      });

      // Draw Tip node
      ctx.beginPath(); ctx.arc(tip.px, tip.py, 4, 0, Math.PI*2); ctx.fillStyle = "white"; ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [r, t]);

  const s = Math.sqrt(r*r + t*t);
  const volume = (1/3) * Math.PI * r * r * t;
  const area = Math.PI * r * (r + s);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-6 left-6 glass-card p-6 rounded-xl border border-white/10 w-64 space-y-4">
          <div><div className="text-zinc-400 text-sm">Volume (⅓πr²t)</div><div className="text-3xl font-bold text-rose-400 font-mono">{volume.toFixed(1)}</div></div>
          <div className="w-full h-px bg-white/10" />
          <div><div className="text-zinc-400 text-sm">Luas (πr(r+s))</div><div className="text-3xl font-bold text-orange-400 font-mono">{area.toFixed(1)}</div></div>
        </div>
      </div>
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Geometri 3D: Kerucut</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 pt-8">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jari-jari (r)</label><span className="text-white font-mono">{r}</span></div>
            <input type="range" className="w-full accent-rose-500" min="1" max="20" value={r} onChange={(e) => setR(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Tinggi (t)</label><span className="text-white font-mono">{t}</span></div>
            <input type="range" className="w-full accent-rose-500" min="1" max="30" value={t} onChange={(e) => setT(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
