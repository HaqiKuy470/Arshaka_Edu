"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Droplet, CloudRain, Wind } from "lucide-react";

export default function Fotosintesis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [light, setLight] = useState(50);
  const [co2, setCo2] = useState(50);
  const animationRef = useRef(0);

  // Calculate photosynthesis rate (0 to 100)
  // Simplified limiting factor logic: rate is bottlenecked by the lowest resource
  const rate = Math.min(light, co2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bubbles: { x: number, y: number, speed: number, size: number }[] = [];
    let frame = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Environment Light based on Intensity
      const bgOpacity = light / 100;
      ctx.fillStyle = `rgba(253, 224, 71, ${bgOpacity * 0.1})`; // Yellow glow
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Sun
      ctx.beginPath();
      ctx.arc(80, 80, 40 + (light/5), 0, Math.PI*2);
      ctx.fillStyle = `rgba(253, 224, 71, ${0.5 + (light/200)})`;
      ctx.fill();

      // Draw Plant (Simple stem and leaf)
      ctx.strokeStyle = "#22c55e"; // Green
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, canvas.height);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.ellipse(cx + 40, cy + 40, 50, 20, Math.PI/4, 0, Math.PI*2);
      ctx.fill();

      // Generate Bubbles (O2) based on rate
      if (rate > 0 && frame % Math.max(2, Math.floor(100 / rate)) === 0) {
        bubbles.push({
          x: cx + 40 + (Math.random() * 40 - 20),
          y: cy + 40 + (Math.random() * 20 - 10),
          speed: 1 + Math.random() * 2,
          size: 2 + Math.random() * 3
        });
      }

      // Draw Bubbles
      ctx.fillStyle = "rgba(125, 211, 252, 0.8)"; // Light blue for O2
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
        ctx.fill();
        b.y -= b.speed;
        if (b.y < -10) bubbles.splice(i, 1);
      }

      frame++;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [light, co2, rate]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute bottom-6 left-6 right-6 lg:right-auto glass-card p-4 rounded-xl border border-white/10 flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-xs text-zinc-400 mb-1">Laju Fotosintesis (Produksi O₂)</div>
            <div className="text-2xl font-bold text-sky-400 font-mono">{rate}%</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fotosintesis</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm">Persamaan Reaksi:</h4>
            <p className="text-white font-mono text-xs">6CO₂ + 6H₂O + Cahaya → C₆H₁₂O₆ + 6O₂</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <Sun className="w-5 h-5" />
              <span className="font-semibold">Intensitas Cahaya</span>
            </div>
            <input type="range" className="w-full accent-yellow-500" min="0" max="100" value={light} onChange={(e) => setLight(parseInt(e.target.value))} />
            <div className="text-xs text-zinc-400 text-right">{light}%</div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Wind className="w-5 h-5" />
              <span className="font-semibold">Kadar Karbon Dioksida (CO₂)</span>
            </div>
            <input type="range" className="w-full accent-rose-500" min="0" max="100" value={co2} onChange={(e) => setCo2(parseInt(e.target.value))} />
            <div className="text-xs text-zinc-400 text-right">{co2}%</div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Hukum Faktor Pembatas: Laju fotosintesis akan dibatasi oleh faktor yang paling sedikit ketersediaannya. Jika cahaya tinggi tapi CO₂ rendah, laju tetap rendah (dan sebaliknya).
          </p>
        </div>
      </div>
    </div>
  );
}
