"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function InterferensiGelombang() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [phaseDiff, setPhaseDiff] = useState(0); // 0 to 360 degrees
  const [freq, setFreq] = useState(5);

  const animationRef = useRef(0);
  const timeRef = useRef(0);

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
      const cy1 = canvas.height * 0.25; // Wave 1
      const cy2 = canvas.height * 0.50; // Wave 2
      const cy3 = canvas.height * 0.80; // Superposition

      const amplitude = 30;
      const k = freq * 0.05;
      const phaseRad = (phaseDiff * Math.PI) / 180;

      // Draw Axes
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath(); ctx.moveTo(0, cy1); ctx.lineTo(w, cy1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy2); ctx.lineTo(w, cy2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy3); ctx.lineTo(w, cy3); ctx.stroke();

      // Text Labels
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif";
      ctx.fillText("Gelombang 1", 10, cy1 - 40);
      ctx.fillText(`Gelombang 2 (Beda Fase: ${phaseDiff}°)`, 10, cy2 - 40);
      ctx.fillText("Hasil Superposisi (G1 + G2)", 10, cy3 - 70);

      ctx.lineWidth = 3;

      // Wave 1
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8"; // sky-400
      for (let x = 0; x < w; x++) {
        const y1 = Math.sin(k * x - timeRef.current * 0.1);
        if (x === 0) ctx.moveTo(x, cy1 - y1 * amplitude);
        else ctx.lineTo(x, cy1 - y1 * amplitude);
      }
      ctx.stroke();

      // Wave 2
      ctx.beginPath();
      ctx.strokeStyle = "#f43f5e"; // rose-500
      for (let x = 0; x < w; x++) {
        const y2 = Math.sin(k * x - timeRef.current * 0.1 + phaseRad);
        if (x === 0) ctx.moveTo(x, cy2 - y2 * amplitude);
        else ctx.lineTo(x, cy2 - y2 * amplitude);
      }
      ctx.stroke();

      // Superposition Wave
      ctx.beginPath();
      ctx.strokeStyle = "#a855f7"; // purple-500
      ctx.lineWidth = 4;
      
      let maxY = 0;

      for (let x = 0; x < w; x++) {
        const y1 = Math.sin(k * x - timeRef.current * 0.1);
        const y2 = Math.sin(k * x - timeRef.current * 0.1 + phaseRad);
        const yTotal = y1 + y2;
        
        if (Math.abs(yTotal) > maxY) maxY = Math.abs(yTotal);

        if (x === 0) ctx.moveTo(x, cy3 - yTotal * amplitude);
        else ctx.lineTo(x, cy3 - yTotal * amplitude);
      }
      ctx.stroke();

      // Status indicator based on max amplitude
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      if (maxY < 0.1) {
        ctx.fillStyle = "#ef4444";
        ctx.fillText("Interferensi DESTRUKTIF Total (Saling Menghilangkan)", 10, cy3 - 50);
      } else if (maxY > 1.9) {
        ctx.fillStyle = "#22c55e";
        ctx.fillText("Interferensi KONSTRUKTIF Total (Saling Menguatkan)", 10, cy3 - 50);
      } else {
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("Interferensi Sebagian", 10, cy3 - 50);
      }

      if (isRunning) timeRef.current += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, phaseDiff, freq]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Interferensi Gelombang</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda' : 'Jalankan'}
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-purple-400 font-bold">Beda Fase (Sudut °)</label>
                <span className="text-purple-400 font-mono">{phaseDiff}°</span>
              </div>
              <input 
                type="range" 
                className="w-full accent-purple-500" 
                min="0" max="360" step="15" 
                value={phaseDiff} 
                onChange={(e) => setPhaseDiff(parseInt(e.target.value))} 
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Konstruktif (0°)</span>
                <span>Destruktif (180°)</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm text-white font-bold">Frekuensi</label>
              </div>
              <input 
                type="range" 
                className="w-full accent-white" 
                min="1" max="15" step="1" 
                value={freq} 
                onChange={(e) => setFreq(parseInt(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Prinsip Superposisi:</strong> Jika dua gelombang bertemu, simpangan total adalah penjumlahan aljabar dari simpangan masing-masing gelombang.</p>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong className="text-green-400">Konstruktif:</strong> Fase sama (0°, 360°). Puncak bertemu puncak. Gelombang menjadi 2x lebih besar.</li>
              <li><strong className="text-red-400">Destruktif:</strong> Beda fase 180°. Puncak bertemu lembah. Gelombang saling membatalkan menjadi nol.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
