"use client";

import { useState, useEffect, useRef } from "react";

export default function PolaritasMolekul() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [elecAtomA, setElecAtomA] = useState(2.1); // H
  const [elecAtomB, setElecAtomB] = useState(3.0); // Cl
  
  const diff = elecAtomB - elecAtomA;
  const isPolar = Math.abs(diff) > 0.4 && Math.abs(diff) < 1.7;
  const isIonic = Math.abs(diff) >= 1.7;
  const isNonPolar = Math.abs(diff) <= 0.4;

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

      // Atom A (Left)
      const ax = cx - 60;
      const ay = cy;
      
      // Atom B (Right)
      const bx = cx + 60;
      const by = cy;

      // Draw Electron Cloud
      // Density shifts towards more electronegative atom
      ctx.beginPath();
      // Use bezier curves to create a merged droplet shape
      const cloudShift = diff * 20; // max shift around 40px
      const midX = cx + cloudShift;

      if (!isIonic) {
        ctx.moveTo(ax, ay - 40);
        ctx.quadraticCurveTo(midX, cy - 60, bx, by - 40);
        ctx.arc(bx, by, 40, -Math.PI/2, Math.PI/2);
        ctx.quadraticCurveTo(midX, cy + 60, ax, ay + 40);
        ctx.arc(ax, ay, 40, Math.PI/2, -Math.PI/2);
        
        // Color gradient for electrostatic potential
        const grad = ctx.createLinearGradient(ax - 40, cy, bx + 40, cy);
        if (isPolar || isNonPolar) {
          if (diff > 0) {
            grad.addColorStop(0, "rgba(59, 130, 246, 0.4)"); // Blue (Positive end)
            grad.addColorStop(1, "rgba(239, 68, 68, 0.4)"); // Red (Negative end)
          } else if (diff < 0) {
            grad.addColorStop(0, "rgba(239, 68, 68, 0.4)"); // Red
            grad.addColorStop(1, "rgba(59, 130, 246, 0.4)"); // Blue
          } else {
            grad.addColorStop(0, "rgba(156, 163, 175, 0.3)"); // Gray
            grad.addColorStop(1, "rgba(156, 163, 175, 0.3)");
          }
        }
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();
      }

      // Draw Atoms
      ctx.beginPath(); ctx.arc(ax, ay, 20, 0, Math.PI*2); ctx.fillStyle = "#64748b"; ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI*2); ctx.fillStyle = "#64748b"; ctx.fill();

      ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("A", ax, ay);
      ctx.fillText("B", bx, by);

      // Draw Dipole Arrow
      if (isPolar) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const arrowStart = diff > 0 ? ax + 20 : bx - 20;
        const arrowEnd = diff > 0 ? bx - 20 : ax + 20;

        ctx.moveTo(arrowStart, cy + 60);
        ctx.lineTo(arrowEnd, cy + 60);
        
        // Arrow head
        const dir = diff > 0 ? 1 : -1;
        ctx.lineTo(arrowEnd - dir*10, cy + 60 - 10);
        ctx.moveTo(arrowEnd, cy + 60);
        ctx.lineTo(arrowEnd - dir*10, cy + 60 + 10);
        
        // Plus on tail
        ctx.moveTo(arrowStart + dir*5, cy + 60 - 5);
        ctx.lineTo(arrowStart + dir*5, cy + 60 + 5);

        ctx.stroke();

        // Delta signs
        ctx.font = "14px serif";
        ctx.fillStyle = diff > 0 ? "#60a5fa" : "#f87171";
        ctx.fillText(diff > 0 ? "δ+" : "δ-", ax, cy - 60);
        
        ctx.fillStyle = diff > 0 ? "#f87171" : "#60a5fa";
        ctx.fillText(diff > 0 ? "δ-" : "δ+", bx, cy - 60);
      }

      if (isIonic) {
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = diff > 0 ? "#60a5fa" : "#f87171";
        ctx.fillText(diff > 0 ? "+" : "-", ax, cy - 40);
        
        ctx.fillStyle = diff > 0 ? "#f87171" : "#60a5fa";
        ctx.fillText(diff > 0 ? "-" : "+", bx, cy - 40);

        ctx.font = "14px sans-serif"; ctx.fillStyle = "white";
        ctx.fillText("Elektron telah berpindah sepenuhnya!", cx, cy + 60);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [elecAtomA, elecAtomB, diff, isPolar, isIonic, isNonPolar]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Polaritas Molekul</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-zinc-400 mb-1">Selisih Elektronegativitas (ΔEN)</div>
            <div className="text-3xl font-mono text-white mb-2">{Math.abs(diff).toFixed(1)}</div>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${isNonPolar ? 'bg-zinc-500/20 text-zinc-300' : isPolar ? 'bg-indigo-500/20 text-indigo-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isNonPolar ? "Kovalen Non-Polar" : isPolar ? "Kovalen Polar" : "Ikatan Ionik"}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-sky-400">Elektronegativitas Atom A</label>
                <span className="font-mono text-sky-400">{elecAtomA.toFixed(1)}</span>
              </div>
              <input 
                type="range" className="w-full accent-sky-500" 
                min="0.7" max="4.0" step="0.1" 
                value={elecAtomA} 
                onChange={(e) => setElecAtomA(parseFloat(e.target.value))} 
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-rose-400">Elektronegativitas Atom B</label>
                <span className="font-mono text-rose-400">{elecAtomB.toFixed(1)}</span>
              </div>
              <input 
                type="range" className="w-full accent-rose-500" 
                min="0.7" max="4.0" step="0.1" 
                value={elecAtomB} 
                onChange={(e) => setElecAtomB(parseFloat(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Elektronegativitas</strong> adalah kemampuan atom untuk menarik awan elektron ikatan ke arahnya.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>0.0 - 0.4:</strong> Non-Polar (awan elektron seimbang).</li>
              <li><strong>0.5 - 1.6:</strong> Polar (awan tertarik ke satu sisi, membentuk kutub parsial <span className="font-serif">δ</span>).</li>
              <li><strong>≥ 1.7:</strong> Ionik (elektron sepenuhnya ditarik, membentuk ion).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
