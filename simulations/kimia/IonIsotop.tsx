"use client";

import { useState, useEffect, useRef } from "react";

export default function IonIsotop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [protons, setProtons] = useState(6); // Carbon
  const [neutrons, setNeutrons] = useState(6); // C-12
  const [electrons, setElectrons] = useState(6); // Neutral

  const charge = protons - electrons;
  const massNumber = protons + neutrons;
  
  // Element symbols
  const getSymbol = (p: number) => {
    const syms = ["", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne"];
    if (p > 0 && p < syms.length) return syms[p];
    return "?";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Pre-calculate positions for nucleus particles
    const nucleusParticles: {x: number, y: number, type: 'p'|'n'}[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));  // golden angle
    
    for (let i = 0; i < protons; i++) {
      const r = Math.sqrt(i) * 3;
      const theta = i * phi;
      nucleusParticles.push({x: Math.cos(theta)*r, y: Math.sin(theta)*r, type: 'p'});
    }
    for (let i = 0; i < neutrons; i++) {
      const r = Math.sqrt(protons + i) * 3;
      const theta = (protons + i) * phi;
      nucleusParticles.push({x: Math.cos(theta)*r, y: Math.sin(theta)*r, type: 'n'});
    }

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Nucleus
      nucleusParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = p.type === 'p' ? "#ef4444" : "#94a3b8"; // Red for proton, Gray for neutron
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      });

      // Draw Electrons
      const shellCapacity = [2, 8, 18];
      let remainingE = electrons;
      let shellIdx = 0;

      while (remainingE > 0 && shellIdx < shellCapacity.length) {
        const nShell = Math.min(remainingE, shellCapacity[shellIdx]);
        const radius = 50 + shellIdx * 35;
        
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.stroke();

        for (let i = 0; i < nShell; i++) {
          const angle = (Math.PI * 2 * i) / nShell + (time * 0.01) / (shellIdx + 1);
          const ex = cx + Math.cos(angle) * radius;
          const ey = cy + Math.sin(angle) * radius;
          
          ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI*2);
          ctx.fillStyle = "#3b82f6"; // Blue
          ctx.fill();
          ctx.fillStyle = "white"; ctx.font="8px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("-", ex, ey);
        }
        
        remainingE -= nShell;
        shellIdx++;
      }

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [protons, neutrons, electrons]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Ion & Isotop</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex justify-center mb-6">
            <div className="relative text-white font-mono text-6xl">
              <span className="absolute -left-6 top-0 text-xl text-zinc-400">{massNumber}</span>
              <span className="absolute -left-4 bottom-0 text-xl text-zinc-400">{protons}</span>
              {getSymbol(protons)}
              {charge !== 0 && (
                <span className={`absolute -right-8 top-0 text-2xl font-bold ${charge > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {Math.abs(charge)}{charge > 0 ? '+' : '-'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-zinc-400">
            <div className="p-2 border border-white/10 rounded">
              <div className="text-white text-lg font-mono">{charge === 0 ? "Netral" : charge > 0 ? "Kation" : "Anion"}</div>
              Muatan
            </div>
            <div className="p-2 border border-white/10 rounded col-span-2 text-left px-4">
              {protons === 6 ? (
                <span>Isotop Karbon: <br/>{neutrons === 6 ? "C-12 (Stabil)" : neutrons === 7 ? "C-13 (Stabil)" : neutrons === 8 ? "C-14 (Radioaktif)" : "Tidak Stabil"}</span>
              ) : protons === 1 ? (
                <span>Isotop Hidrogen: <br/>{neutrons === 0 ? "Protium" : neutrons === 1 ? "Deuterium" : "Tritium"}</span>
              ) : (
                <span>Unsur {getSymbol(protons)}<br/>(Massa = {massNumber})</span>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-red-400">Proton (p⁺)</label>
                <span className="font-mono text-red-400">{protons}</span>
              </div>
              <input type="range" className="w-full accent-red-500" min="1" max="10" step="1" value={protons} onChange={(e) => setProtons(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Menentukan jenis unsur (Nomor Atom).</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-zinc-400">Neutron (n⁰)</label>
                <span className="font-mono text-zinc-400">{neutrons}</span>
              </div>
              <input type="range" className="w-full accent-zinc-500" min="0" max="12" step="1" value={neutrons} onChange={(e) => setNeutrons(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Menentukan Isotop & Massa Atom.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Elektron (e⁻)</label>
                <span className="font-mono text-blue-400">{electrons}</span>
              </div>
              <input type="range" className="w-full accent-blue-500" min="1" max="12" step="1" value={electrons} onChange={(e) => setElectrons(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Menentukan Muatan Ion.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
