"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Ekosistem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Populations
  const [grass, setGrass] = useState(100);
  const [rabbits, setRabbits] = useState(20);
  const [wolves, setWolves] = useState(5);

  const reqRef = useRef(0);
  const dataHistory = useRef<{g:number, r:number, w:number}[]>([]);

  useEffect(() => {
    if (isRunning) {
      const update = () => {
        setGrass(g => {
          let nextG = g + 2; // Growth rate
          nextG -= rabbits * 0.1; // Eaten by rabbits
          return Math.max(0, Math.min(200, nextG));
        });

        setRabbits(r => {
          let nextR = r;
          if (grass > 10) nextR += r * 0.05; // Growth if food exists
          else nextR -= r * 0.1; // Starve
          nextR -= wolves * 0.2; // Eaten by wolves
          return Math.max(0, nextR);
        });

        setWolves(w => {
          let nextW = w;
          if (rabbits > 5) nextW += w * 0.02; // Growth if food exists
          else nextW -= w * 0.05; // Starve
          return Math.max(0, nextW);
        });

        reqRef.current = requestAnimationFrame(update);
      };
      
      // We throttle it by running update inside setTimeout, but requestAnimationFrame is fine for smooth chart.
      // Wait, direct state update in rAF will freeze browser. Better use a 100ms interval.
      const interval = setInterval(() => {
        setGrass(g => Math.max(0, Math.min(200, g + 2 - rabbits * 0.1)));
        setRabbits(r => Math.max(0, r + (grass > 10 ? r * 0.05 : -r * 0.1) - wolves * 0.2));
        setWolves(w => Math.max(0, w + (rabbits > 5 ? w * 0.02 : -w * 0.05)));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning, grass, rabbits, wolves]);

  // Update history
  useEffect(() => {
    if (isRunning) {
      dataHistory.current.push({ g: grass, r: rabbits, w: wolves });
      if (dataHistory.current.length > 100) dataHistory.current.shift();
    }
  }, [grass, rabbits, wolves, isRunning]);

  // Render Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const history = dataHistory.current;
    if (history.length === 0) return;

    const w = canvas.width / 100; // 100 data points max
    const h = canvas.height;

    const drawLine = (key: 'g'|'r'|'w', color: string, scale: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      history.forEach((point, i) => {
        const x = i * w;
        const y = h - (point[key] * scale);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawLine('g', '#22c55e', h / 200); // Grass (max 200)
    drawLine('r', '#38bdf8', h / 100); // Rabbit (max ~100)
    drawLine('w', '#ef4444', h / 50);  // Wolf (max ~50)

  }, [grass, rabbits, wolves]);

  const reset = () => {
    setIsRunning(false);
    setGrass(100);
    setRabbits(20);
    setWolves(5);
    dataHistory.current = [];
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Visual representation */}
        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl h-48 mb-6 relative overflow-hidden flex items-end">
          {/* Grass */}
          <div className="w-full bg-emerald-500/20 absolute bottom-0 transition-all duration-300" style={{ height: `${(grass/200)*100}%` }} />
          
          <div className="w-full h-full absolute inset-0 flex justify-around items-end p-4 z-10 opacity-70 text-4xl">
            {rabbits > 0 && <div>🐇</div>}
            {wolves > 0 && <div>🐺</div>}
            {rabbits > 20 && <div>🐇</div>}
            {wolves > 10 && <div>🐺</div>}
            {grass > 100 && <div>🌿</div>}
          </div>
          
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-xs text-white">Animasi Ekosistem</div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full max-w-2xl bg-black border border-white/10 rounded-2xl h-64 relative p-4">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Keseimbangan Ekosistem</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div><div className="text-emerald-400 font-bold">Rumput (Produsen)</div></div>
              <div className="text-xl font-mono text-white">{Math.floor(grass)}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl">
              <div><div className="text-sky-400 font-bold">Kelinci (Konsumen 1)</div></div>
              <div className="text-xl font-mono text-white">{Math.floor(rabbits)}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div><div className="text-red-400 font-bold">Serigala (Konsumen 2)</div></div>
              <div className="text-xl font-mono text-white">{Math.floor(wolves)}</div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Model Lotka-Volterra: Populasi mangsa (kelinci) dan pemangsa (serigala) akan berfluktuasi secara siklis. Jika serigala terlalu banyak, kelinci habis, lalu serigala kelaparan.
          </p>

        </div>
      </div>
    </div>
  );
}
