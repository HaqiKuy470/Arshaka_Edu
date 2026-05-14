"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function Termodinamika() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [temp, setTemp] = useState(300); // Kelvin
  const [volume, setVolume] = useState(50); // %
  const [playing, setPlaying] = useState(true);
  
  const particles = useRef(Array.from({ length: 100 }, () => ({
    x: Math.random(), y: Math.random(), 
    vx: (Math.random() - 0.5), vy: (Math.random() - 0.5)
  })));

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

      // Draw Container
      const boxWidth = 300;
      const boxHeight = 200;
      const pistonX = (volume / 100) * boxWidth;

      const startX = cx - boxWidth/2;
      const startY = cy - boxHeight/2;

      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.strokeRect(startX, startY, boxWidth, boxHeight);
      
      // Draw Piston
      ctx.fillStyle = "#8b5cf6";
      ctx.fillRect(startX + pistonX - 10, startY, 20, boxHeight);

      // Speed multiplier based on temperature
      const speedMult = Math.sqrt(temp / 300) * 5;

      // Draw and update particles
      ctx.fillStyle = "#ec4899";
      particles.current.forEach(p => {
        if (playing) {
          p.x += p.vx * speedMult * 0.01;
          p.y += p.vy * speedMult * 0.01;

          // Bounce off walls (normalized coordinates 0 to 1)
          if (p.x <= 0) { p.x = 0; p.vx *= -1; }
          if (p.x >= (volume/100)) { p.x = (volume/100); p.vx *= -1; }
          if (p.y <= 0) { p.y = 0; p.vy *= -1; }
          if (p.y >= 1) { p.y = 1; p.vy *= -1; }
        }

        const px = startX + p.x * boxWidth;
        const py = startY + p.y * boxHeight;
        
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI*2);
        ctx.fill();
      });

      // Pressure calculation (P = T / V roughly for ideal gas)
      const pressure = (temp / Math.max(10, volume)).toFixed(1);

      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Tekanan (P): ${pressure} atm`, startX, startY - 20);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [temp, volume, playing]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <button onClick={() => setPlaying(!playing)} className="absolute bottom-6 left-6 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center z-20">
          {playing ? <Pause /> : <Play className="ml-1" />}
        </button>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Gas Ideal</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Suhu (T)</label><span className="text-red-400">{temp} K</span></div>
            <input type="range" className="w-full accent-red-500" min="50" max="1000" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Volume (V)</label><span className="text-blue-400">{volume} L</span></div>
            <input type="range" className="w-full accent-blue-500" min="10" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
