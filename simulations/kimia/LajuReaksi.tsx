"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function LajuReaksi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Variables
  const [temperature, setTemperature] = useState(25); // Celsius (Speed)
  const [concentration, setConcentration] = useState(50); // Number of particles
  const [useCatalyst, setUseCatalyst] = useState(false); // Lower activation energy

  const totalParticles = concentration;
  const activationEnergy = useCatalyst ? 50 : 150; // Threshold for reaction collision

  const particlesRef = useRef<{x:number, y:number, vx:number, vy:number, type:'A'|'B'|'C'}[]>([]);
  const [productCount, setProductCount] = useState(0);

  const reset = () => {
    setIsRunning(false);
    const w = 800; // rough guess
    const h = 600;
    particlesRef.current = [];
    setProductCount(0);
    
    // Fill half A, half B
    for(let i=0; i<totalParticles; i++) {
      particlesRef.current.push({
        x: Math.random() * (w - 40) + 20,
        y: Math.random() * (h - 40) + 20,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        type: i % 2 === 0 ? 'A' : 'B'
      });
    }
  };

  useEffect(() => {
    reset();
  }, [concentration]);

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
      const parts = particlesRef.current;

      // Base speed multiplier based on temperature (Kinetic Energy)
      // Kelvin relative scaling
      const speedMult = Math.sqrt((temperature + 273) / 298);

      if (isRunning) {
        for (let i = 0; i < parts.length; i++) {
          const p1 = parts[i];
          
          if (p1.type === 'C') continue; // Products don't react further

          p1.x += p1.vx * speedMult;
          p1.y += p1.vy * speedMult;

          // Wall collision
          if (p1.x < 10) { p1.x = 10; p1.vx *= -1; }
          if (p1.x > w-10) { p1.x = w-10; p1.vx *= -1; }
          if (p1.y < 10) { p1.y = 10; p1.vy *= -1; }
          if (p1.y > h-10) { p1.y = h-10; p1.vy *= -1; }

          // Particle collision (Reaction check)
          for (let j = i + 1; j < parts.length; j++) {
            const p2 = parts[j];
            if (p2.type === 'C') continue;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 20) {
              // They collided
              // Check energy (relative velocity squared proxy)
              const relVx = p1.vx - p2.vx;
              const relVy = p1.vy - p2.vy;
              const collEnergy = (relVx*relVx + relVy*relVy) * speedMult * 10; // arbitrary scale

              if (p1.type !== p2.type && collEnergy > activationEnergy) {
                // Successful Reaction! A + B -> C
                p1.type = 'C';
                p2.type = 'C'; // Visually we make both C or merge them. Let's just make both C to keep array size same.
                
                // Visual flash
                ctx.beginPath(); ctx.arc((p1.x+p2.x)/2, (p1.y+p2.y)/2, 30, 0, Math.PI*2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; ctx.fill();
              } else {
                // Elastic bounce
                p1.vx *= -1; p1.vy *= -1;
                p2.vx *= -1; p2.vy *= -1;
              }
            }
          }
        }
      } else {
        // Draw static
      }

      // Render
      let cCount = 0;
      parts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
        if (p.type === 'A') ctx.fillStyle = "#3b82f6"; // Blue
        else if (p.type === 'B') ctx.fillStyle = "#ef4444"; // Red
        else {
          ctx.fillStyle = "#a855f7"; // Purple (Product)
          cCount++;
        }
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.stroke();
      });

      // Render Catalyst Background if active
      if (useCatalyst) {
        ctx.fillStyle = "rgba(34, 197, 94, 0.05)";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = "rgba(34, 197, 94, 0.3)"; ctx.font="bold 24px sans-serif";
        ctx.fillText("KATALIS AKTIF", 20, 40);
      }

      setProductCount(cCount);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, temperature, useCatalyst]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Laju Reaksi (Teori Tumbukan)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {isRunning ? 'Jeda' : 'Mulai'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-[10px] text-zinc-400 font-bold mb-1 uppercase tracking-wider">Produk Terbentuk</div>
            <div className="text-3xl font-mono text-purple-400 font-bold">{Math.floor(productCount/2)}</div>
            <div className="text-xs text-zinc-500 mt-1">Reaktan tersisa: {(totalParticles - productCount)/2}</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Suhu (°C)</label>
                <span className="font-mono text-amber-400">{temperature}°C</span>
              </div>
              <input 
                type="range" className="w-full accent-amber-500" 
                min="0" max="200" step="10" 
                value={temperature} 
                onChange={(e) => setTemperature(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500">Meningkatkan Energi Kinetik (kecepatan tumbukan).</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Konsentrasi (Jumlah)</label>
                <span className="font-mono text-blue-400">{concentration}</span>
              </div>
              <input 
                type="range" className="w-full accent-blue-500" 
                min="10" max="100" step="10" 
                value={concentration} 
                onChange={(e) => {setConcentration(parseInt(e.target.value));}} 
              />
              <p className="text-[10px] text-zinc-500">Meningkatkan frekuensi tumbukan total.</p>
            </div>

            <label className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl cursor-pointer transition-colors mt-4">
              <input type="checkbox" checked={useCatalyst} onChange={(e) => setUseCatalyst(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
              <span className="text-sm font-bold text-emerald-400">Gunakan Katalis</span>
            </label>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Teori Tumbukan:</strong> Reaksi hanya terjadi jika partikel bertumbukan dengan energi yang cukup (Energi Aktivasi).</p>
            <p className="text-emerald-400"><strong>Katalis</strong> mempercepat laju reaksi dengan cara menurunkan Energi Aktivasi, sehingga lebih banyak tumbukan yang berhasil menghasilkan produk!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
