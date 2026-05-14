"use client";

import { useState, useEffect, useRef } from "react";

export default function KoloidSuspensi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mixtureType, setMixtureType] = useState<"larutan"|"koloid"|"suspensi">("koloid");
  const [laserOn, setLaserOn] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Generate particles
    const particles: {x:number, y:number, r:number, vx:number, vy:number}[] = [];
    const pCount = mixtureType === "larutan" ? 200 : mixtureType === "koloid" ? 100 : 50;
    
    for(let i=0; i<pCount; i++) {
      let r = 1;
      if (mixtureType === "koloid") r = 3 + Math.random()*2; // 3-5px
      if (mixtureType === "suspensi") r = 8 + Math.random()*6; // 8-14px

      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: r,
        vx: (Math.random() - 0.5) * (mixtureType==="suspensi"? 0.5 : 2),
        vy: mixtureType === "suspensi" ? Math.random() * 2 : (Math.random() - 0.5) * 2 // suspension falls
      });
    }

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Draw Beaker liquid background
      ctx.fillStyle = mixtureType === "larutan" ? "rgba(59, 130, 246, 0.1)" : 
                      mixtureType === "koloid" ? "rgba(234, 179, 8, 0.15)" : 
                      "rgba(139, 69, 19, 0.2)"; // brown mud
      ctx.fillRect(100, 100, w-200, h-100);

      // Beaker outline
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(100, 50); ctx.lineTo(100, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w-100, 50); ctx.lineTo(w-100, h); ctx.stroke();

      // Laser Beam (Efek Tyndall)
      if (laserOn) {
        // Laser from left
        ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        ctx.fillRect(20, cy - 10, 60, 20); // Laser pointer body

        // Beam in air (left)
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
        ctx.fillRect(80, cy - 5, 20, 10);

        // Beam inside beaker
        if (mixtureType === "larutan") {
          // Beam passes through almost invisibly, no scattering
          ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
          ctx.fillRect(100, cy - 5, w-200, 10);
        } else if (mixtureType === "koloid") {
          // Tyndall effect: beam is clearly visible and widened
          const grad = ctx.createLinearGradient(100, 0, w-100, 0);
          grad.addColorStop(0, "rgba(239, 68, 68, 0.6)"); // strong entry
          grad.addColorStop(1, "rgba(239, 68, 68, 0.2)"); // weaker exit
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(100, cy - 5);
          ctx.lineTo(w-100, cy - 20);
          ctx.lineTo(w-100, cy + 20);
          ctx.lineTo(100, cy + 5);
          ctx.fill();
        } else if (mixtureType === "suspensi") {
          // Beam is blocked/scattered randomly, doesn't pass through well
          ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
          ctx.beginPath();
          ctx.moveTo(100, cy - 5);
          ctx.lineTo(100 + (w-200)*0.4, cy - 40);
          ctx.lineTo(100 + (w-200)*0.4, cy + 40);
          ctx.lineTo(100, cy + 5);
          ctx.fill();
        }

        // Beam in air (right) - exits if not blocked
        if (mixtureType === "larutan") {
          ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
          ctx.fillRect(w-100, cy - 5, 100, 10);
        } else if (mixtureType === "koloid") {
          ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
          ctx.fillRect(w-100, cy - 20, 100, 40);
        }
      }

      // Update & Draw Particles
      particles.forEach(p => {
        if (mixtureType === "suspensi") {
          p.vy += 0.02; // gravity pulls big particles down (sedimentation)
        } else {
          // Brownian motion (jitter) for colloid and solution
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
          p.vx *= 0.95; p.vy *= 0.95;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Container bounds
        if (p.x < 100 + p.r) { p.x = 100 + p.r; p.vx *= -1; }
        if (p.x > w - 100 - p.r) { p.x = w - 100 - p.r; p.vx *= -1; }
        if (p.y < 100 + p.r) { p.y = 100 + p.r; p.vy *= -1; }
        if (p.y > h - p.r) { 
          p.y = h - p.r; 
          if (mixtureType === "suspensi") {
            p.vy *= -0.2; // stick to bottom mostly
            p.vx *= 0.8;
          } else {
            p.vy *= -1; 
          }
        }

        // Render
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        
        if (mixtureType === "larutan") {
          ctx.fillStyle = "rgba(255,255,255,0.4)";
        } else if (mixtureType === "koloid") {
          ctx.fillStyle = "rgba(250, 204, 21, 0.8)";
          // Highlight if in laser path
          if (laserOn && p.y > cy - 30 && p.y < cy + 30) {
            ctx.fillStyle = "#fecaca"; // bright red reflection
            ctx.shadowColor = "#f87171"; ctx.shadowBlur = 10;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = "#78350f"; // mud color
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mixtureType, laserOn]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Koloid & Efek Tyndall</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Jenis Campuran</label>
            <div className="grid grid-cols-1 gap-2">
              <button 
                className={`py-2 px-4 rounded-xl border ${mixtureType==='larutan' ? 'bg-blue-500/30 border-blue-400 text-blue-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'} transition-all`}
                onClick={() => setMixtureType('larutan')}
              >
                Larutan Sejati (Garam/Gula)
              </button>
              <button 
                className={`py-2 px-4 rounded-xl border ${mixtureType==='koloid' ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'} transition-all`}
                onClick={() => setMixtureType('koloid')}
              >
                Koloid (Susu/Santan)
              </button>
              <button 
                className={`py-2 px-4 rounded-xl border ${mixtureType==='suspensi' ? 'bg-orange-500/30 border-orange-400 text-orange-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'} transition-all`}
                onClick={() => setMixtureType('suspensi')}
              >
                Suspensi (Air Pasir/Lumpur)
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/10 rounded-xl cursor-pointer transition-colors mt-4">
            <input type="checkbox" checked={laserOn} onChange={(e) => setLaserOn(e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm font-bold text-red-400">Nyalakan Senter / Laser</span>
          </label>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Efek Tyndall</strong> adalah penghamburan cahaya oleh partikel koloid. Cahaya terlihat jelas melintas di dalam koloid, tetapi tidak pada larutan.</p>
            <table className="w-full text-left mt-2 border-t border-white/10 pt-2">
              <tbody>
                <tr><td className="text-blue-400 font-bold py-1">Larutan</td><td>&lt; 1 nm (Tembus Cahaya)</td></tr>
                <tr><td className="text-yellow-400 font-bold py-1">Koloid</td><td>1 - 100 nm (Efek Tyndall)</td></tr>
                <tr><td className="text-orange-400 font-bold py-1">Suspensi</td><td>&gt; 100 nm (Mengendap/Block)</td></tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
