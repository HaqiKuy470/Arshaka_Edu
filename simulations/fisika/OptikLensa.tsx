"use client";

import { useState, useEffect, useRef } from "react";

export default function OptikLensa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [focalLength, setFocalLength] = useState(100); // px
  const [objectDist, setObjectDist] = useState(200); // px
  const [objectHeight, setObjectHeight] = useState(60); // px

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

      // Optical Axis
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy);
      ctx.lineTo(canvas.width, cy);
      ctx.stroke();

      // Lens (Convex if f > 0, Concave if f < 0)
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.moveTo(cx, cy - 150);
      ctx.lineTo(cx, cy + 150);
      ctx.stroke();
      
      // Focal points
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(cx - focalLength, cy, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + focalLength, cy, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px sans-serif";
      ctx.fillText("F", cx - focalLength - 4, cy + 15);
      ctx.fillText("F'", cx + focalLength - 4, cy + 15);

      // Object
      const objX = cx - objectDist;
      const objY = cy - objectHeight;
      ctx.beginPath();
      ctx.strokeStyle = "#22c55e"; // Green arrow
      ctx.lineWidth = 4;
      ctx.moveTo(objX, cy);
      ctx.lineTo(objX, objY);
      ctx.lineTo(objX - 5, objY + 10);
      ctx.moveTo(objX, objY);
      ctx.lineTo(objX + 5, objY + 10);
      ctx.stroke();

      // Calculate Image (1/f = 1/do + 1/di)
      // di = 1 / (1/f - 1/do)
      let imageDist = 0;
      let imageHeight = 0;
      
      if (objectDist === focalLength) {
        // Infinity
      } else {
        imageDist = 1 / ((1 / focalLength) - (1 / objectDist));
        const mag = -imageDist / objectDist;
        imageHeight = objectHeight * mag;
        
        const imgX = cx + imageDist;
        const imgY = cy - imageHeight;

        // Draw Rays
        ctx.strokeStyle = "rgba(250, 204, 21, 0.6)"; // Yellow rays
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Ray 1: Parallel to focal
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(cx, objY);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();

        // Ray 2: Through center
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(cx, cy);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw Image
        ctx.beginPath();
        ctx.strokeStyle = "#ec4899"; // Pink image
        ctx.lineWidth = 4;
        ctx.moveTo(imgX, cy);
        ctx.lineTo(imgX, imgY);
        // arrow head
        const dir = Math.sign(imageHeight);
        ctx.lineTo(imgX - 5, imgY + 10*dir);
        ctx.moveTo(imgX, imgY);
        ctx.lineTo(imgX + 5, imgY + 10*dir);
        ctx.stroke();
      }
    };
    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [focalLength, objectDist, objectHeight]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Optik & Lensa</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jarak Fokus Lensa (f)</label><span className="text-sky-400">{focalLength}</span></div>
            <input type="range" className="w-full accent-sky-500" min="-200" max="200" value={focalLength} onChange={(e) => setFocalLength(parseInt(e.target.value))} />
            <p className="text-[10px] text-zinc-500">+ Cembung, - Cekung</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Jarak Benda (do)</label><span className="text-green-400">{objectDist}</span></div>
            <input type="range" className="w-full accent-green-500" min="50" max="400" value={objectDist} onChange={(e) => setObjectDist(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Tinggi Benda</label></div>
            <input type="range" className="w-full accent-white" min="10" max="150" value={objectHeight} onChange={(e) => setObjectHeight(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
