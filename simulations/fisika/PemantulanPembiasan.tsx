"use client";

import { useState, useEffect, useRef } from "react";

export default function PemantulanPembiasan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [n1, setN1] = useState(1.0); // Medium 1 (Top)
  const [n2, setN2] = useState(1.5); // Medium 2 (Bottom)
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
      const w = canvas.width;
      const h = canvas.height;

      // Draw Mediums
      // Top Medium (n1)
      ctx.fillStyle = `rgba(56, 189, 248, ${0.1 * n1})`; // Light blue tint
      ctx.fillRect(0, 0, w, cy);
      
      // Bottom Medium (n2)
      ctx.fillStyle = `rgba(59, 130, 246, ${0.1 * n2 + 0.1})`; // Deeper blue tint
      ctx.fillRect(0, cy, w, h/2);

      // Interface Line
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

      // Normal Line (Perpendicular)
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
      ctx.setLineDash([]);

      // Calculations
      const theta1 = (angleIncident * Math.PI) / 180; // Rads
      // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
      const sinTheta2 = (n1 * Math.sin(theta1)) / n2;
      
      let theta2 = 0;
      let totalInternalReflection = false;
      
      if (sinTheta2 > 1.0) {
        totalInternalReflection = true;
      } else {
        theta2 = Math.asin(sinTheta2);
      }

      // Ray Drawing
      const rayLen = Math.max(w, h);

      // 1. Incident Ray (Sinar Datang)
      ctx.strokeStyle = "#ef4444"; // red
      ctx.lineWidth = 4;
      ctx.beginPath();
      // angle is from normal (which is vertical, PI/2 on canvas math)
      // Normal top is (cx, 0), so vector is -PI/2.
      // Incident angle is to the left of normal.
      const incDir = -Math.PI/2 - theta1; 
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(incDir)*rayLen, cy + Math.sin(incDir)*rayLen);
      ctx.stroke();

      // Draw arrow on incident
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      const ax = cx + Math.cos(incDir)*100;
      const ay = cy + Math.sin(incDir)*100;
      ctx.translate(ax, ay); ctx.rotate(incDir + Math.PI);
      ctx.moveTo(0, -6); ctx.lineTo(12, 0); ctx.lineTo(0, 6); ctx.fill();
      ctx.setTransform(1,0,0,1,0,0);

      // 2. Reflected Ray (Pemantulan)
      // Angle is same as incident, but on right side.
      const refDir = -Math.PI/2 + theta1;
      ctx.strokeStyle = `rgba(239, 68, 68, ${totalInternalReflection ? 1.0 : 0.3})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(refDir)*rayLen, cy + Math.sin(refDir)*rayLen);
      ctx.stroke();

      // 3. Refracted Ray (Pembiasan)
      if (!totalInternalReflection) {
        const transDir = Math.PI/2 + theta2; // Bottom half
        ctx.strokeStyle = "#22c55e"; // green
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(transDir)*rayLen, cy + Math.sin(transDir)*rayLen);
        ctx.stroke();

        // Label theta2
        ctx.fillStyle = "#22c55e"; ctx.font = "14px sans-serif";
        ctx.fillText(`θ₂ = ${(theta2*180/Math.PI).toFixed(1)}°`, cx + 20, cy + 50);
      } else {
        ctx.fillStyle = "#ef4444"; ctx.font = "bold 16px sans-serif";
        ctx.fillText("Pemantulan Sempurna (Total Internal Reflection)", cx + 20, cy - 20);
      }

      // Label theta1
      ctx.fillStyle = "#ef4444"; ctx.font = "14px sans-serif";
      ctx.fillText(`θ₁ = ${angleIncident}°`, cx - 60, cy - 40);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [n1, n2, angleIncident]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pemantulan & Pembiasan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-red-400 font-bold">Sudut Datang (θ₁)</label>
                <span className="text-red-400 font-mono">{angleIncident}°</span>
              </div>
              <input 
                type="range" className="w-full accent-red-500" 
                min="0" max="89" step="1" 
                value={angleIncident} 
                onChange={(e) => setAngleIncident(parseInt(e.target.value))} 
              />
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm text-sky-400 font-bold">Indeks Bias Medium 1 (n₁)</label>
                <span className="text-sky-400 font-mono">{n1.toFixed(2)}</span>
              </div>
              <input 
                type="range" className="w-full accent-sky-500" 
                min="1.0" max="2.5" step="0.05" 
                value={n1} onChange={(e) => setN1(parseFloat(e.target.value))} 
              />
              <div className="flex justify-between text-[10px] text-zinc-500"><span>Udara (1.0)</span><span>Air (1.33)</span><span>Kaca (1.5)</span></div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm text-blue-400 font-bold">Indeks Bias Medium 2 (n₂)</label>
                <span className="text-blue-400 font-mono">{n2.toFixed(2)}</span>
              </div>
              <input 
                type="range" className="w-full accent-blue-500" 
                min="1.0" max="2.5" step="0.05" 
                value={n2} onChange={(e) => setN2(parseFloat(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Hukum Snellius:</strong> <br/><span className="font-mono">n₁ · sin(θ₁) = n₂ · sin(θ₂)</span></p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Jika cahaya masuk ke medium yang <strong>lebih rapat</strong> (n2 &gt; n1), cahaya dibiaskan <strong>mendekati</strong> garis normal.</li>
              <li>Jika cahaya masuk ke medium yang <strong>kurang rapat</strong> (n2 &lt; n1) dengan sudut besar, dapat terjadi <strong>Pemantulan Internal Total</strong> (tidak ada cahaya yang menembus).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
