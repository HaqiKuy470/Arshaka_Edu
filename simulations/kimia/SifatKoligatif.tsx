"use client";

import { useState, useEffect, useRef } from "react";

export default function SifatKoligatif() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [soluteParticles, setSoluteParticles] = useState(0); // number of solute particles added
  const [temperature, setTemperature] = useState(25); // Celsius
  
  // Pure water: Boils at 100, Freezes at 0
  // Each 10 particles = 1 molal for visual purpose
  // Kb = 0.52, Kf = 1.86 (Water constants)
  const molal = soluteParticles / 10;
  const deltaTb = molal * 0.52;
  const deltaTf = molal * 1.86;

  const bp = 100 + deltaTb;
  const fp = 0 - deltaTf;

  const isBoiling = temperature >= bp;
  const isFreezing = temperature <= fp;

  const waterParticles = 100;
  const partsRef = useRef<{x:number, y:number, vx:number, vy:number, type:'W'|'S', phase:'L'|'G'|'S'}[]>([]);

  useEffect(() => {
    // initialize particles
    const w = 800; // fallback
    const h = 600;
    
    partsRef.current = [];
    
    // Water
    for(let i=0; i<waterParticles; i++) {
      partsRef.current.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        type: 'W', phase: 'L'
      });
    }
    
    // Solute
    for(let i=0; i<soluteParticles; i++) {
      partsRef.current.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        type: 'S', phase: 'L'
      });
    }
  }, [soluteParticles]); // reload particles when solute added

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
      
      const liquidLevel = h * 0.3; // top 30% is air, bottom 70% is liquid pool

      // Draw background
      ctx.fillStyle = isFreezing ? "rgba(186, 230, 253, 0.2)" : isBoiling ? "rgba(252, 165, 165, 0.1)" : "rgba(59, 130, 246, 0.1)";
      ctx.fillRect(0, liquidLevel, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(0, 0, w, liquidLevel); // air

      const parts = partsRef.current;
      
      // Speed multiplier based on temp (-20 to 120 -> scale 0.1 to 3)
      const baseSpeed = Math.max(0.1, (temperature + 20) / 40);

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // State machine
        if (isFreezing) {
          // Solid: lock into lattice, vibrate slightly
          p.phase = 'S';
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = (Math.random() - 0.5) * 0.5;
          
          // Pull towards lattice center (roughly organized)
          const targetX = (i % 20) * (w/20) + (w/40);
          const targetY = liquidLevel + Math.floor(i / 20) * (h/15) + (h/30);
          p.x += (targetX - p.x) * 0.05;
          p.y += (targetY - p.y) * 0.05;

        } else if (isBoiling) {
          // Gas: fly everywhere
          if (p.type === 'W') {
            p.phase = 'G';
            // if in liquid, go up fast
            if (p.y > liquidLevel) {
              p.vy -= 0.5; // buoyancy
            }
          } else {
            // Solute usually stays in liquid (non-volatile)
            p.phase = 'L';
            if (p.y < liquidLevel) {
              p.vy += 1; // fall down
            }
          }
        } else {
          // Liquid: wander within liquid bounds
          p.phase = 'L';
          if (p.y < liquidLevel) {
            p.vy += 0.5; // gravity if above
          }
        }

        if (p.phase !== 'S') {
          p.x += p.vx * baseSpeed;
          p.y += p.vy * baseSpeed;

          // Add random thermal motion
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
          // Dampen
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        // Constraints
        if (p.phase === 'L' || p.type === 'S') {
          if (p.x < 0) { p.x = 0; p.vx *= -1; }
          if (p.x > w) { p.x = w; p.vx *= -1; }
          if (p.y > h) { p.y = h; p.vy *= -1; }
          // bounce off liquid surface
          if (p.y < liquidLevel && p.phase === 'L') { p.y = liquidLevel; p.vy *= -1; }
        } else if (p.phase === 'G') {
          if (p.x < 0) { p.x = w; }
          if (p.x > w) { p.x = 0; }
          if (p.y < 0) { p.y = h; } // cycle back to bottom
          if (p.y > h) { p.y = 0; }
        }
      }

      // Render
      parts.forEach(p => {
        ctx.beginPath();
        if (p.type === 'W') {
          ctx.arc(p.x, p.y, isFreezing ? 8 : 6, 0, Math.PI*2);
          ctx.fillStyle = isFreezing ? "#e0f2fe" : "rgba(56, 189, 248, 0.6)"; // light blue
        } else {
          // Solute (bigger, red)
          ctx.arc(p.x, p.y, 10, 0, Math.PI*2);
          ctx.fillStyle = "#f87171"; 
        }
        ctx.fill();
      });

      // Overlay text
      ctx.fillStyle = "white"; ctx.font="bold 16px sans-serif";
      ctx.fillText(isFreezing ? "MEMBEKU (Padat)" : isBoiling ? "MENDIDIH (Gas)" : "CAIR", 20, 30);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [soluteParticles, temperature, isBoiling, isFreezing]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sifat Koligatif Larutan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl shadow-inner">
              <div className="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-wider">Titik Beku (Tf)</div>
              <div className="text-xl font-mono text-white font-bold">{fp.toFixed(2)} °C</div>
              <div className="text-[10px] text-blue-400 mt-1">ΔTf = {deltaTf.toFixed(2)} °C</div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl shadow-inner">
              <div className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-wider">Titik Didih (Tb)</div>
              <div className="text-xl font-mono text-white font-bold">{bp.toFixed(2)} °C</div>
              <div className="text-[10px] text-red-400 mt-1">ΔTb = {deltaTb.toFixed(2)} °C</div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Jumlah Zat Terlarut (Molalitas)</label>
                <span className="font-mono text-emerald-400">{soluteParticles} / {molal.toFixed(1)} m</span>
              </div>
              <input 
                type="range" className="w-full accent-emerald-500" 
                min="0" max="100" step="10" 
                value={soluteParticles} 
                onChange={(e) => setSoluteParticles(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500">Mewakili partikel zat warna merah yang menghalangi air.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Suhu Lingkungan (°C)</label>
                <span className="font-mono text-amber-400">{temperature} °C</span>
              </div>
              <input 
                type="range" className="w-full accent-amber-500" 
                min="-20" max="120" step="1" 
                value={temperature} 
                onChange={(e) => setTemperature(parseInt(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Sifat Koligatif:</strong> Sifat larutan yang hanya bergantung pada <em>jumlah</em> partikel zat terlarut, bukan jenisnya.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Penurunan Titik Beku (ΔTf):</strong> Zat terlarut menghalangi molekul air membentuk struktur kristal es padat. Butuh suhu lebih dingin untuk membeku.</li>
              <li><strong>Kenaikan Titik Didih (ΔTb):</strong> Zat terlarut menghalangi molekul air untuk lepas menjadi gas. Butuh panas ekstra untuk mendidih.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
