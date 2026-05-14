"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function ModelAtomBohr() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [nInitial, setNInitial] = useState(2);
  const [nFinal, setNFinal] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [photon, setPhoton] = useState<{x: number, y: number, color: string, active: boolean}>({x: 0, y: 0, color: "", active: false});

  // Energy levels in eV: E_n = -13.6 / n^2
  const energyLevel = (n: number) => -13.6 / (n * n);

  // Transition energy
  const deltaE = Math.abs(energyLevel(nFinal) - energyLevel(nInitial));
  
  // Wavelength lambda = 1240 / deltaE
  const wavelength = deltaE > 0 ? 1240 / deltaE : 0;
  
  // Determine color (Lyman series = UV, Balmer = Visible, Paschen = IR)
  let wColor = "white";
  if (nFinal === 1) wColor = "#d8b4fe"; // UV (Purple)
  else if (nFinal === 2) {
    if (nInitial === 3) wColor = "#ef4444"; // Red (656 nm)
    else if (nInitial === 4) wColor = "#2dd4bf"; // Teal (486 nm)
    else if (nInitial === 5) wColor = "#3b82f6"; // Blue (434 nm)
    else if (nInitial === 6) wColor = "#8b5cf6"; // Violet (410 nm)
  } else {
    wColor = "#ef4444"; // IR (Dark Red)
  }

  // Animation Refs
  const electronRadiusRef = useRef(nInitial * 30);
  const electronAngleRef = useRef(0);

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

      // Draw Nucleus
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill();
      ctx.fillStyle = "white"; ctx.font = "10px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("+", cx, cy);

      // Draw Orbits
      for (let n = 1; n <= 6; n++) {
        const r = n * 30; // visual scaling
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.stroke();
        
        // Label orbit
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(`n=${n}`, cx + r, cy + 10);
      }

      // Handle Transition Animation
      const targetRadius = nFinal * 30;
      if (isTransitioning) {
        if (Math.abs(electronRadiusRef.current - targetRadius) > 1) {
          // move radius smoothly
          electronRadiusRef.current += (targetRadius - electronRadiusRef.current) * 0.1;
        } else {
          electronRadiusRef.current = targetRadius;
          setIsTransitioning(false);
          setNInitial(nFinal); // commit change
          
          // Emit photon if dropping to lower energy level
          if (nFinal < nInitial) {
            setPhoton({
              x: cx + Math.cos(electronAngleRef.current)*targetRadius,
              y: cy + Math.sin(electronAngleRef.current)*targetRadius,
              color: wColor,
              active: true
            });
          }
        }
      }

      // Draw Electron
      electronAngleRef.current += 0.02 * (5 / (electronRadiusRef.current/30)); // speed depends on orbit
      const ex = cx + Math.cos(electronAngleRef.current) * electronRadiusRef.current;
      const ey = cy + Math.sin(electronAngleRef.current) * electronRadiusRef.current;
      
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI*2); ctx.fillStyle = "#3b82f6"; ctx.fill();
      ctx.fillStyle="white"; ctx.fillText("-", ex, ey);

      // Draw Photon
      if (photon.active) {
        photon.x += 4;
        photon.y -= 2;
        
        ctx.beginPath();
        ctx.moveTo(photon.x, photon.y);
        ctx.lineTo(photon.x - 10, photon.y + 5);
        ctx.lineTo(photon.x - 20, photon.y);
        ctx.strokeStyle = photon.color; ctx.lineWidth = 3; ctx.stroke();

        if (photon.x > canvas.width + 50) photon.active = false;
      }

      // Energy Level Diagram (Left side)
      const graphX = 30;
      const graphY = cy + 100;
      for (let n = 1; n <= 6; n++) {
        const E = energyLevel(n);
        // Map E (-13.6 to 0) to Y coords
        const gy = graphY - ((E + 14) / 14) * 200; // rough scale
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(graphX, gy); ctx.lineTo(graphX + 50, gy); ctx.stroke();
        ctx.fillStyle = "white"; ctx.fillText(`n=${n}`, graphX + 70, gy);
        ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillText(`${E.toFixed(2)} eV`, graphX + 110, gy);

        // Highlight current
        if (n === (isTransitioning ? nFinal : nInitial)) {
          ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(graphX, gy); ctx.lineTo(graphX + 50, gy); ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [nInitial, nFinal, isTransitioning, photon, wColor]);

  const triggerTransition = (target: number) => {
    if (target === nInitial || isTransitioning) return;
    setNFinal(target);
    setIsTransitioning(true);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Model Atom Bohr (Hidrogen)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-300">Pindahkan Elektron (Lompatan Kuantum)</h4>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(n => (
                <button 
                  key={n}
                  onClick={() => triggerTransition(n)}
                  disabled={isTransitioning}
                  className={`py-2 rounded-xl font-bold border text-sm transition-all ${n === nInitial && !isTransitioning ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
                >
                  n = {n}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-xl shadow-inner mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-zinc-400">
              <span>Transisi</span>
              <span>{nInitial} ➔ {nFinal}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-amber-400">
              <span>Energi Foton (ΔE)</span>
              <span>{deltaE.toFixed(2)} eV</span>
            </div>
            <div className="flex justify-between text-xs font-bold" style={{color: wColor}}>
              <span>Panjang Gelombang (λ)</span>
              <span>{wavelength > 0 ? `${wavelength.toFixed(0)} nm` : '-'}</span>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Postulat Bohr:</strong> Elektron mengelilingi inti pada orbit tertentu tanpa memancarkan energi (stasioner).</p>
            <ul className="list-disc pl-4 space-y-2">
              <li className="text-rose-400"><strong>Emisi:</strong> Pindah dari lintasan luar ke dalam memancarkan foton (cahaya).</li>
              <li className="text-sky-400"><strong>Absorpsi:</strong> Pindah dari dalam ke luar membutuhkan penyerapan energi.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
