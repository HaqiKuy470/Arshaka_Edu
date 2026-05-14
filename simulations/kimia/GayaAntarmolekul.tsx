"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function GayaAntarmolekul() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [temp, setTemp] = useState(50); // Speed / Temperature
  const [moleculeType, setMoleculeType] = useState<"nonpolar"|"polar"|"hbond">("polar");

  // nonpolar: weak attraction (Van der Waals / London dispersion)
  // polar: medium attraction (Dipole-dipole)
  // hbond: strong attraction (Hydrogen Bonding)

  const numMolecules = 30;
  const moleculesRef = useRef<{x:number, y:number, vx:number, vy:number, angle:number, vAngle:number}[]>([]);

  useEffect(() => {
    // Init
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 600;

    moleculesRef.current = [];
    for(let i=0; i<numMolecules; i++) {
      moleculesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.1
      });
    }
  }, [moleculeType]); // Reset when type changes

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

      const w = canvas.width;
      const h = canvas.height;
      const mols = moleculesRef.current;

      const baseSpeed = temp * 0.05;
      
      let attractionRadius = 0;
      let attractionStrength = 0;

      if (moleculeType === "nonpolar") { attractionRadius = 40; attractionStrength = 0.01; }
      else if (moleculeType === "polar") { attractionRadius = 80; attractionStrength = 0.05; }
      else if (moleculeType === "hbond") { attractionRadius = 120; attractionStrength = 0.15; }

      if (isRunning) {
        // Physics update
        for (let i = 0; i < mols.length; i++) {
          const m1 = mols[i];
          
          // Random thermal motion
          m1.vx += (Math.random() - 0.5) * baseSpeed;
          m1.vy += (Math.random() - 0.5) * baseSpeed;
          m1.vAngle += (Math.random() - 0.5) * 0.05;

          // Intermolecular forces
          for (let j = i + 1; j < mols.length; j++) {
            const m2 = mols[j];
            const dx = m2.x - m1.x;
            const dy = m2.y - m1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < attractionRadius && dist > 20) {
              // Pull together
              const force = (attractionRadius - dist) * attractionStrength * 0.001;
              m1.vx += (dx / dist) * force;
              m1.vy += (dy / dist) * force;
              m2.vx -= (dx / dist) * force;
              m2.vy -= (dy / dist) * force;

              // Draw Interaction line
              ctx.strokeStyle = moleculeType === "hbond" ? "rgba(239, 68, 68, 0.4)" : 
                                moleculeType === "polar" ? "rgba(59, 130, 246, 0.3)" : 
                                "rgba(156, 163, 175, 0.2)";
              ctx.setLineDash([3, 3]);
              ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke();
              ctx.setLineDash([]);
            } else if (dist <= 20) {
              // Repulsion (Steric)
              m1.vx -= (dx / dist) * 0.5;
              m1.vy -= (dy / dist) * 0.5;
              m2.vx += (dx / dist) * 0.5;
              m2.vy += (dy / dist) * 0.5;
            }
          }

          // Damping to prevent explosion
          m1.vx *= 0.95;
          m1.vy *= 0.95;
          m1.vAngle *= 0.95;

          m1.x += m1.vx;
          m1.y += m1.vy;
          m1.angle += m1.vAngle;

          // Bounds
          if (m1.x < 0) { m1.x = 0; m1.vx *= -1; }
          if (m1.x > w) { m1.x = w; m1.vx *= -1; }
          if (m1.y < 0) { m1.y = 0; m1.vy *= -1; }
          if (m1.y > h) { m1.y = h; m1.vy *= -1; }
        }
      }

      // Render Molecules
      mols.forEach(m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        if (moleculeType === "nonpolar") {
          // Just a grey blob (O2 or CH4)
          ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fillStyle = "#64748b"; ctx.fill();
        } else if (moleculeType === "polar") {
          // HCl
          ctx.beginPath(); ctx.arc(-6, 0, 8, 0, Math.PI*2); ctx.fillStyle = "#60a5fa"; ctx.fill(); // Cl (delta -)
          ctx.beginPath(); ctx.arc(8, 0, 5, 0, Math.PI*2); ctx.fillStyle = "#f87171"; ctx.fill(); // H (delta +)
        } else if (moleculeType === "hbond") {
          // H2O
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill(); // O
          ctx.beginPath(); ctx.arc(-6, 6, 4, 0, Math.PI*2); ctx.fillStyle = "white"; ctx.fill(); // H
          ctx.beginPath(); ctx.arc(6, 6, 4, 0, Math.PI*2); ctx.fillStyle = "white"; ctx.fill(); // H
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, temp, moleculeType]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gaya Antarmolekul</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda' : 'Jalankan'}
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Jenis Interaksi / Molekul</label>
              <select 
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none"
                value={moleculeType} onChange={(e) => setMoleculeType(e.target.value as any)}
              >
                <option value="nonpolar">Gaya London / Dispersi (Non-Polar)</option>
                <option value="polar">Gaya Dipol-Dipol (Polar)</option>
                <option value="hbond">Ikatan Hidrogen (Sangat Polar)</option>
              </select>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Suhu (Energi Kinetik)</label>
              </div>
              <input 
                type="range" className="w-full accent-amber-500" 
                min="0" max="100" step="1" 
                value={temp} 
                onChange={(e) => setTemp(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500">Suhu tinggi merusak gaya antarmolekul sehingga zat menguap.</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {moleculeType === "nonpolar" && <p><strong>Gaya London:</strong> Sangat lemah, terjadi karena dipol sesaat. Zat umumnya berwujud gas pada suhu ruang (misal: O₂, CH₄).</p>}
            {moleculeType === "polar" && <p><strong>Dipol-Dipol:</strong> Sedang. Tarik-menarik antara kutub positif dan negatif molekul permanen (misal: HCl).</p>}
            {moleculeType === "hbond" && <p><strong>Ikatan Hidrogen:</strong> Paling kuat di antara gaya antarmolekul. Terjadi ketika H berikatan dengan N, O, atau F. Membuat titik didih air (H₂O) sangat tinggi!</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
