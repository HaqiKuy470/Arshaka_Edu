"use client";

import { useState, useEffect, useRef } from "react";

export default function GeometriInteraktif() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<"circle" | "rectangle" | "triangle">("circle");
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(150);

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

      ctx.fillStyle = "rgba(56, 189, 248, 0.2)"; // sky-400 with opacity
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.beginPath();

      if (shape === "circle") {
        ctx.arc(cx, cy, width / 2, 0, Math.PI * 2);
      } else if (shape === "rectangle") {
        ctx.rect(cx - width / 2, cy - height / 2, width, height);
      } else if (shape === "triangle") {
        ctx.moveTo(cx, cy - height / 2);
        ctx.lineTo(cx + width / 2, cy + height / 2);
        ctx.lineTo(cx - width / 2, cy + height / 2);
        ctx.closePath();
      }

      ctx.fill();
      ctx.stroke();

      // Draw dimensions
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      
      if (shape === "circle") {
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + width/2, cy); ctx.strokeStyle="white"; ctx.lineWidth=1; ctx.stroke();
        ctx.fillText(`r = ${width/2}`, cx + width/4, cy - 10);
      } else if (shape === "rectangle" || shape === "triangle") {
        ctx.fillText(`Alas = ${width}`, cx, cy + height/2 + 20);
        ctx.fillText(`Tinggi = ${height}`, cx + width/2 + 30, cy);
      }
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [shape, width, height]);

  let area = 0;
  let perimeter = 0;

  if (shape === "circle") {
    const r = width / 2;
    area = Math.PI * r * r;
    perimeter = 2 * Math.PI * r;
  } else if (shape === "rectangle") {
    area = width * height;
    perimeter = 2 * (width + height);
  } else if (shape === "triangle") {
    area = 0.5 * width * height;
    const side = Math.sqrt((width/2)**2 + height**2);
    perimeter = width + 2 * side;
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 left-6 glass-card p-6 rounded-xl border border-white/10 w-64 space-y-4">
          <div>
            <div className="text-zinc-400 text-sm">Luas (Area)</div>
            <div className="text-3xl font-bold text-sky-400 font-mono">{Math.round(area)}</div>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div>
            <div className="text-zinc-400 text-sm">Keliling (Perimeter)</div>
            <div className="text-3xl font-bold text-pink-400 font-mono">{Math.round(perimeter)}</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Geometri 2D</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setShape("circle")} className={`py-2 rounded-lg text-sm transition-colors ${shape === "circle" ? "bg-sky-600 text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"}`}>Lingkaran</button>
            <button onClick={() => setShape("rectangle")} className={`py-2 rounded-lg text-sm transition-colors ${shape === "rectangle" ? "bg-sky-600 text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"}`}>Persegi</button>
            <button onClick={() => setShape("triangle")} className={`py-2 rounded-lg text-sm transition-colors ${shape === "triangle" ? "bg-sky-600 text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"}`}>Segitiga</button>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">{shape === 'circle' ? 'Diameter' : 'Alas (Lebar)'}</label><span className="text-white">{width}</span></div>
            <input type="range" className="w-full accent-sky-500" min="50" max="400" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} />
          </div>
          
          {shape !== "circle" && (
            <div className="space-y-3 pt-4">
              <div className="flex justify-between"><label className="text-sm text-zinc-300">Tinggi</label><span className="text-white">{height}</span></div>
              <input type="range" className="w-full accent-sky-500" min="50" max="400" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
