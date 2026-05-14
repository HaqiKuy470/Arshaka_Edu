"use client";

import { useState, useEffect, useRef } from "react";

export default function KonfigurasiElektron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [atomicNumber, setAtomicNumber] = useState(11); // Sodium

  // Subshell capacities: s=2, p=6, d=10, f=14
  // Aufbau principle order
  const subshells = [
    { name: "1s", capacity: 2, n: 1, l: 0 },
    { name: "2s", capacity: 2, n: 2, l: 0 },
    { name: "2p", capacity: 6, n: 2, l: 1 },
    { name: "3s", capacity: 2, n: 3, l: 0 },
    { name: "3p", capacity: 6, n: 3, l: 1 },
    { name: "4s", capacity: 2, n: 4, l: 0 },
    { name: "3d", capacity: 10, n: 3, l: 2 },
    { name: "4p", capacity: 6, n: 4, l: 1 },
    { name: "5s", capacity: 2, n: 5, l: 0 },
    { name: "4d", capacity: 10, n: 4, l: 2 },
    { name: "5p", capacity: 6, n: 5, l: 1 },
    { name: "6s", capacity: 2, n: 6, l: 0 },
  ];

  // Calculate electron distribution
  let remainingE = atomicNumber;
  const config: { name: string, count: number, n: number }[] = [];
  
  for (const s of subshells) {
    if (remainingE <= 0) break;
    const count = Math.min(remainingE, s.capacity);
    config.push({ name: s.name, count, n: s.n });
    remainingE -= count;
  }

  // Calculate shell distribution (K, L, M, N...)
  const shells: number[] = [0, 0, 0, 0, 0, 0, 0];
  config.forEach(c => {
    shells[c.n] += c.count; // 1-indexed n
  });

  const configString = config.map(c => `${c.name}${c.count}`).join(" ");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI*2);
      ctx.fillStyle = "#ef4444"; // Red nucleus
      ctx.fill();
      ctx.fillStyle = "white"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(`${atomicNumber}+`, cx, cy);

      // Draw Shells & Electrons
      let maxN = 0;
      for (let i = 1; i <= 6; i++) {
        if (shells[i] > 0) maxN = i;
      }

      for (let n = 1; n <= maxN; n++) {
        const radius = 30 + n * 30; // Radius based on shell n
        
        // Orbit
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();

        const numElectrons = shells[n];
        for (let e = 0; e < numElectrons; e++) {
          const angle = (Math.PI * 2 * e) / numElectrons + (time * 0.01) / n;
          const ex = cx + Math.cos(angle) * radius;
          const ey = cy + Math.sin(angle) * radius;

          // Highlight valence shell (outermost)
          const isValence = n === maxN;
          
          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI*2);
          ctx.fillStyle = isValence ? "#fcd34d" : "#3b82f6"; // Valence = yellow, Core = blue
          ctx.fill();
        }
        
        // Shell label
        const labels = ["", "K", "L", "M", "N", "O", "P"];
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(labels[n], cx + radius, cy + 10);
      }

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [atomicNumber, shells]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Konfigurasi Elektron</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-sky-400">Nomor Atom (Z)</label>
              <span className="font-mono text-sky-400">{atomicNumber}</span>
            </div>
            <input 
              type="range" className="w-full accent-sky-500" 
              min="1" max="54" step="1" 
              value={atomicNumber} 
              onChange={(e) => setAtomicNumber(parseInt(e.target.value))} 
            />
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-xl shadow-inner mt-4 space-y-4">
            <div>
              <div className="text-[10px] uppercase text-zinc-500 mb-1">Konfigurasi Subkulit (Aufbau)</div>
              <div className="font-mono text-emerald-400 font-bold break-words leading-relaxed">
                {config.map((c, i) => (
                  <span key={i} className="mr-2 inline-block">
                    {c.name}<sup className="text-white ml-[1px]">{c.count}</sup>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-2 border-t border-zinc-800">
              <div className="text-[10px] uppercase text-zinc-500 mb-1">Jumlah Elektron per Kulit</div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">K L M N ...</span>
                <span className="font-mono text-white font-bold">
                  {shells.filter((s,i) => i>0 && (i<=config[config.length-1].n || s>0)).map(s => s).join(" - ")}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Prinsip Aufbau:</strong> Elektron menempati orbital dari tingkat energi terendah terlebih dahulu (1s, 2s, 2p, 3s, 3p, 4s, 3d...).</p>
            <p>Titik <span className="text-yellow-400 font-bold">Kuning</span> pada visualisasi menunjukkan <strong>Elektron Valensi</strong> (elektron pada kulit terluar) yang berperan penting dalam pembentukan ikatan kimia.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
