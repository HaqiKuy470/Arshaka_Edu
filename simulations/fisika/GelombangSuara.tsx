"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function GelombangSuara() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [amplitude, setAmplitude] = useState(50); // Volume
  const [frequency, setFrequency] = useState(5);  // Pitch

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

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const w = canvas.width;

      // 1. Draw Longitudinal Wave (Particles / Air Molecules)
      // Sound is a longitudinal wave: compression and rarefaction
      ctx.fillStyle = "rgba(56, 189, 248, 0.8)"; // sky-400
      
      const numCols = 60;
      const numRows = 10;
      const colSpacing = w / numCols;
      
      for (let col = 0; col < numCols; col++) {
        // x position of the un-displaced column
        const base_x = col * colSpacing;
        
        // Sine wave displacement
        // displacement = A * sin(k*x - w*t)
        // frequency controls k (spatial frequency here)
        const k = frequency * 0.05; 
        const waveValue = Math.sin(k * col - timeRef.current * 0.1);
        
        // The actual x position oscillates around base_x
        const actual_x = base_x + waveValue * (amplitude * 0.2); 

        for (let row = 0; row < numRows; row++) {
          const actual_y = (cy - 100) + row * 15 + (Math.sin(col*row) * 5); // Add tiny random y-jitter for realism
          
          ctx.beginPath();
          ctx.arc(actual_x, actual_y, 2, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // 2. Draw Transverse Wave Graph representation below it
      const gy = cy + 100;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); // X axis

      ctx.beginPath();
      ctx.strokeStyle = "#fbbf24"; // amber-400
      ctx.lineWidth = 3;
      
      for (let x = 0; x < w; x++) {
        const colIndex = x / colSpacing;
        const waveValue = Math.sin(frequency * 0.05 * colIndex - timeRef.current * 0.1);
        const y = gy - waveValue * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif";
      ctx.fillText("Representasi Partikel Udara (Gelombang Longitudinal)", 20, cy - 120);
      ctx.fillText("Grafik Tekanan (Gelombang Transversal)", 20, cy + 30);


      if (isRunning) timeRef.current += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, amplitude, frequency]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gelombang Suara</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda' : 'Jalankan'}
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-amber-400 font-bold">Amplitudo (Volume)</label>
              </div>
              <input 
                type="range" 
                className="w-full accent-amber-500" 
                min="0" max="100" step="5" 
                value={amplitude} 
                onChange={(e) => setAmplitude(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500 leading-tight">Menentukan keras/lemahnya bunyi. Simpangan partikel udaranya makin jauh.</p>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm text-sky-400 font-bold">Frekuensi (Nada/Pitch)</label>
              </div>
              <input 
                type="range" 
                className="w-full accent-sky-500" 
                min="1" max="20" step="1" 
                value={frequency} 
                onChange={(e) => setFrequency(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500 leading-tight">Menentukan tinggi/rendahnya nada. Jarak antar rapatan makin sempit.</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Gelombang Suara</strong> adalah gelombang mekanik longitudinal. Suara merambat melalui rapatan (compression) dan renggangan (rarefaction) partikel udara.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
