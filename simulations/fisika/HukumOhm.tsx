"use client";

import { useState, useEffect, useRef } from "react";

export default function HukumOhm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [voltage, setVoltage] = useState(12); // V
  const [resistance, setResistance] = useState(10); // Ohm
  
  // Ohm's Law: I = V / R
  const current = voltage / resistance; // Ampere

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Circuit Wire Path
      const rw = 200; // rect width
      const rh = 150; // rect height
      
      ctx.strokeStyle = "#52525b"; // zinc-600
      ctx.lineWidth = 10;
      ctx.lineJoin = "round";
      ctx.strokeRect(cx - rw/2, cy - rh/2, rw, rh);

      // Draw Battery (Left side)
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.fillRect(cx - rw/2 - 20, cy - 30, 40, 60);
      ctx.fillStyle = "#ef4444"; // red +
      ctx.fillRect(cx - rw/2 - 20, cy - 30, 40, 15);
      
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, cx - rw/2 - 40, cy);
      ctx.fillText("+", cx - rw/2, cy - 35);
      ctx.fillText("-", cx - rw/2, cy + 45);

      // Draw Resistor (Right side)
      // The visual thickness of resistor is inversely proportional to resistance? Or zig zag.
      ctx.fillStyle = "#18181b";
      ctx.fillRect(cx + rw/2 - 15, cy - 40, 30, 80);
      
      // Zig zag lines
      ctx.beginPath();
      ctx.strokeStyle = "#fcd34d"; // amber-300
      ctx.lineWidth = 4;
      ctx.moveTo(cx + rw/2, cy - 40);
      for(let i=0; i<8; i++) {
        const xDir = i % 2 === 0 ? 15 : -15;
        ctx.lineTo(cx + rw/2 + xDir, cy - 40 + i*10 + 5);
      }
      ctx.lineTo(cx + rw/2, cy + 40);
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.fillText(`${resistance}Ω`, cx + rw/2 + 40, cy);

      // Ammeter (Top side)
      ctx.beginPath();
      ctx.arc(cx, cy - rh/2, 25, 0, Math.PI*2);
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.fill();
      ctx.strokeStyle = "#94a3b8"; // slate-400
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#38bdf8"; // sky-400
      ctx.fillText(`A`, cx, cy - rh/2 - 8);
      ctx.font = "12px monospace";
      ctx.fillText(`${current.toFixed(1)}A`, cx, cy - rh/2 + 10);


      // Draw Moving Electrons (Current)
      // Current moves from + to - (conventional) -> Clockwise
      // Electron visual (yellow dots)
      if (current > 0) {
        // Speed proportional to current
        offset += current * 2; 

        ctx.fillStyle = "#fbbf24"; // amber-400
        const perimeter = 2 * rw + 2 * rh;
        const numElectrons = 20;
        
        for (let i = 0; i < numElectrons; i++) {
          let dist = (offset + i * (perimeter / numElectrons)) % perimeter;
          
          let ex = 0, ey = 0;
          if (dist < rw) {
            // Top edge (L to R)
            ex = cx - rw/2 + dist; ey = cy - rh/2;
          } else if (dist < rw + rh) {
            // Right edge (T to B)
            ex = cx + rw/2; ey = cy - rh/2 + (dist - rw);
          } else if (dist < 2*rw + rh) {
            // Bottom edge (R to L)
            ex = cx + rw/2 - (dist - rw - rh); ey = cy + rh/2;
          } else {
            // Left edge (B to T)
            ex = cx - rw/2; ey = cy + rh/2 - (dist - 2*rw - rh);
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 6, 0, Math.PI*2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [voltage, resistance, current]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Ohm</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-sky-500/10 border border-sky-500/30 p-6 rounded-xl text-center shadow-inner">
            <div className="text-xs text-sky-400 font-bold mb-1 uppercase tracking-widest">Kuat Arus (I)</div>
            <div className="text-5xl font-mono text-white">{current.toFixed(1)} <span className="text-2xl text-zinc-400">A</span></div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-rose-400 font-bold">Tegangan (V)</label><span className="text-rose-400 font-mono">{voltage} Volt</span></div>
              <input type="range" className="w-full accent-rose-500" min="0" max="24" step="1" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500 leading-tight mt-1">Dorongan dari baterai. Semakin besar V, semakin banyak arus yang terdorong.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-amber-400 font-bold">Hambatan (R)</label><span className="text-amber-400 font-mono">{resistance} Ohm</span></div>
              <input type="range" className="w-full accent-amber-500" min="1" max="100" step="1" value={resistance} onChange={(e) => setResistance(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500 leading-tight mt-1">Resistensi pada kabel/lampu. Semakin besar R, semakin lambat arus mengalir.</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed mt-4">
            <p><strong>Hukum Ohm:</strong> Kuat arus dalam suatu rangkaian berbanding lurus dengan tegangan dan berbanding terbalik dengan hambatan.</p>
            <div className="text-xl text-center font-mono text-white mt-2 font-bold tracking-widest">I = V / R</div>
          </div>

        </div>
      </div>
    </div>
  );
}
