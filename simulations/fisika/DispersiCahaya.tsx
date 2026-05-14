"use client";

import { useState, useEffect, useRef } from "react";

export default function DispersiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [angleIncident, setAngleIncident] = useState(45); // Degrees

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

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Prism (Triangle)
      const side = 200;
      const h = (Math.sqrt(3)/2) * side;
      
      const px1 = cx;
      const py1 = cy - h/2; // Top
      const px2 = cx - side/2;
      const py2 = cy + h/2; // Bot Left
      const px3 = cx + side/2;
      const py3 = cy + h/2; // Bot Right

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.lineTo(px3, py3); ctx.closePath();
      ctx.fill(); ctx.stroke();

      // We hit the left face (px1,py1) to (px2,py2)
      // Angle of face: 60 degrees from horizontal (actually it's 120deg inclination)
      // Let's just create a simplified visual approximation of dispersion.
      
      // Incident White Ray
      const hitX = cx - side/4;
      const hitY = cy; // roughly mid of left face
      const theta1 = (angleIncident * Math.PI) / 180;
      
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hitX - 300*Math.cos(theta1), hitY - 300*Math.sin(theta1));
      ctx.lineTo(hitX, hitY);
      ctx.stroke();

      // Dispersion (Red refracts least, Violet refracts most)
      // Visual approximation inside prism
      const colors = [
        { c: "#ef4444", rOffset: -0.05 }, // Red
        { c: "#f97316", rOffset: -0.03 }, // Orange
        { c: "#eab308", rOffset: -0.01 }, // Yellow
        { c: "#22c55e", rOffset: 0.01 },  // Green
        { c: "#3b82f6", rOffset: 0.03 },  // Blue
        { c: "#a855f7", rOffset: 0.05 },  // Violet
      ];

      colors.forEach((col, i) => {
        // First refraction (into prism)
        const inAngle = 0.2 + col.rOffset + theta1*0.2; // approx
        const hit2X = cx + side/4;
        const hit2Y = hitY + inAngle * 100;

        ctx.strokeStyle = col.c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hitX, hitY);
        ctx.lineTo(hit2X, hit2Y);
        ctx.stroke();

        // Second refraction (out of prism)
        const outAngle = inAngle * 2; // bending more
        ctx.beginPath();
        ctx.moveTo(hit2X, hit2Y);
        ctx.lineTo(hit2X + 300*Math.cos(outAngle), hit2Y + 300*Math.sin(outAngle));
        ctx.stroke();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [angleIncident]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Dispersi Cahaya (Prisma)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <label className="text-sm text-white font-bold">Sudut Datang Cahaya</label>
            </div>
            <input 
              type="range" className="w-full accent-white" 
              min="-20" max="60" step="1" 
              value={angleIncident} 
              onChange={(e) => setAngleIncident(parseInt(e.target.value))} 
            />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Dispersi Cahaya</strong> adalah peristiwa penguraian cahaya putih (polikromatik) menjadi warna-warna spektrum (monokromatik).</p>
            <p>Hal ini terjadi karena setiap warna memiliki <strong>panjang gelombang dan indeks bias</strong> yang berbeda-beda saat melewati medium padat seperti kaca (prisma).</p>
            <ul className="list-disc pl-4 space-y-1">
              <li className="text-red-400">Merah dibiaskan <strong>paling sedikit</strong>.</li>
              <li className="text-purple-400">Ungu dibiaskan <strong>paling tajam</strong>.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
