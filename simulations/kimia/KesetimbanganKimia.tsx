"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function KesetimbanganKimia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Reversible Reaction: N2(g) + 3H2(g) <-> 2NH3(g) (Haber Process, Exothermic)
  // simplified to: A <-> B (Exothermic forward)
  
  const [pressure, setPressure] = useState(1); // Volume proxy
  const [temp, setTemp] = useState(300); // Kelvin
  
  // Concentration state
  const concA = useRef(100); // Reactant
  const concB = useRef(0);   // Product

  // History for graph
  const historyRef = useRef<{a:number, b:number}[]>([]);

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

      if (isRunning) {
        // Simple kinetic model for A <-> B
        // k_forward = base * exp(-Ea / RT) * Pressure^coeff
        // Reaction is exothermic: high temp favors A (reverse reaction increases more than forward)
        
        const kf = 0.05 * pressure * Math.exp(-1000 / temp);
        const kr = 0.01 * (1/pressure) * Math.exp(-3000 / temp); // higher Ea for reverse, so it's more temp sensitive

        const rateF = kf * concA.current;
        const rateR = kr * concB.current;

        concA.current += (rateR - rateF);
        concB.current += (rateF - rateR);

        // Record history
        if (historyRef.current.length > w) historyRef.current.shift();
        historyRef.current.push({a: concA.current, b: concB.current});
      }

      // Draw Container Box (Simulating Pressure/Volume)
      const boxW = Math.max(100, 400 / pressure); // Volume decreases as pressure increases
      const boxH = 300;
      const boxX = w/2 - boxW/2;
      const boxY = 50;

      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Piston (Pressure visual)
      ctx.fillStyle = "#52525b"; ctx.fillRect(boxX, boxY - 20, boxW, 20);
      ctx.fillStyle = "white"; ctx.textAlign="center"; ctx.font="12px sans-serif";
      ctx.fillText(`${pressure.toFixed(1)} atm`, w/2, boxY - 30);

      // Draw random particles based on concentration inside box
      const aCount = Math.floor(concA.current);
      const bCount = Math.floor(concB.current);

      ctx.globalAlpha = 0.8;
      // Draw A (Blue dots)
      ctx.fillStyle = "#3b82f6";
      for(let i=0; i<aCount; i++) {
        // pseudo random deterministic based on index so they jitter
        const px = boxX + 10 + (Math.sin(i * 123 + historyRef.current.length*0.1) * 0.5 + 0.5) * (boxW - 20);
        const py = boxY + 10 + (Math.cos(i * 321 + historyRef.current.length*0.1) * 0.5 + 0.5) * (boxH - 20);
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fill();
      }

      // Draw B (Red dots)
      ctx.fillStyle = "#ef4444";
      for(let i=0; i<bCount; i++) {
        const px = boxX + 10 + (Math.cos(i * 111 + historyRef.current.length*0.1) * 0.5 + 0.5) * (boxW - 20);
        const py = boxY + 10 + (Math.sin(i * 222 + historyRef.current.length*0.1) * 0.5 + 0.5) * (boxH - 20);
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Graph (Concentration vs Time)
      const gY = h - 50;
      const gH = 100;
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.moveTo(0, gY); ctx.lineTo(w, gY); ctx.stroke();
      
      ctx.lineWidth = 3;
      // Graph A
      ctx.beginPath(); ctx.strokeStyle = "#3b82f6";
      historyRef.current.forEach((d, i) => {
        const x = w - historyRef.current.length + i;
        const y = gY - (d.a / 150) * gH;
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
      
      // Graph B
      ctx.beginPath(); ctx.strokeStyle = "#ef4444";
      historyRef.current.forEach((d, i) => {
        const x = w - historyRef.current.length + i;
        const y = gY - (d.b / 150) * gH;
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, pressure, temp]);

  const addReactant = () => { concA.current += 50; };
  const addProduct = () => { concB.current += 50; };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kesetimbangan (Asas Le Chatelier)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {isRunning ? 'Jeda' : 'Jalankan'}
          </button>

          <div className="bg-black/30 border border-white/10 p-3 rounded-xl text-center">
            <div className="text-white font-mono text-lg font-bold">A <span className="text-zinc-500">⇌</span> B</div>
            <div className="text-xs text-rose-400 mt-1">Reaksi ke Kanan (B) = Eksotermik</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-300">Aksi (Gangguan Sistem)</label>
              <div className="flex gap-2">
                <button onClick={addReactant} className="flex-1 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg text-xs font-bold hover:bg-blue-500/30">+ Tambah A</button>
                <button onClick={addProduct} className="flex-1 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg text-xs font-bold hover:bg-red-500/30">+ Tambah B</button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Suhu (T)</label>
                <span className="font-mono text-amber-400">{temp} K</span>
              </div>
              <input 
                type="range" className="w-full accent-amber-500" 
                min="200" max="600" step="10" 
                value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} 
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Tekanan (P)</label>
                <span className="font-mono text-emerald-400">{pressure.toFixed(1)} atm</span>
              </div>
              <input 
                type="range" className="w-full accent-emerald-500" 
                min="0.5" max="3.0" step="0.1" 
                value={pressure} onChange={(e) => setPressure(parseFloat(e.target.value))} 
              />
            </div>

          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Asas Le Chatelier:</strong> Jika sistem kesetimbangan diberikan aksi/gangguan, sistem akan bergeser untuk <em>meminimalkan</em> gangguan tersebut.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Ditambah A $\rightarrow$ Geser ke Kanan (Bentuk B).</li>
              <li>Suhu Dinaikkan $\rightarrow$ Geser ke arah Endoterm (Membentuk A).</li>
              <li>Tekanan Dinaikkan $\rightarrow$ Volume Mengecil.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
