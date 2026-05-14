"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Tumbukan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(5);
  
  const [m2, setM2] = useState(2);
  const [v2, setV2] = useState(-3);

  const [elasticity, setElasticity] = useState(1); // 1 = elastic, 0 = inelastic

  // State for positions and velocities during animation
  const [pos1, setPos1] = useState(-150);
  const [pos2, setPos2] = useState(150);
  const [currV1, setCurrV1] = useState(v1);
  const [currV2, setCurrV2] = useState(v2);

  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Sync initial state if not running
    if (!isRunning) {
      setCurrV1(v1);
      setCurrV2(v2);
    }
  }, [v1, v2, isRunning]);

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setPos1(p1 => {
          let nextP1 = p1 + currV1 * dt * 20; // scale speed
          return nextP1;
        });

        setPos2(p2 => {
          let nextP2 = p2 + currV2 * dt * 20;
          return nextP2;
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, currV1, currV2]);

  // Collision detection
  useEffect(() => {
    const r1 = 15 + m1 * 2;
    const r2 = 15 + m2 * 2;
    
    if (pos2 - pos1 <= (r1 + r2) && isRunning) {
      // They collided!
      const e = elasticity;
      
      // Calculate new velocities (1D collision formulas)
      const newV1 = ((m1 - e*m2)*currV1 + (1+e)*m2*currV2) / (m1 + m2);
      const newV2 = ((m2 - e*m1)*currV2 + (1+e)*m1*currV1) / (m1 + m2);

      setCurrV1(newV1);
      setCurrV2(newV2);
      
      // Separate them slightly to prevent infinite sticking/overlap loop
      setPos1(p => p - 1);
      setPos2(p => p + 1);
    }
  }, [pos1, pos2, currV1, currV2, m1, m2, elasticity, isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Ground Line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy + 40);
      ctx.lineTo(canvas.width, cy + 40);
      ctx.stroke();

      const drawBall = (x: number, mass: number, v: number, color: string) => {
        const radius = 15 + mass * 2;
        const actualX = cx + x;
        const actualY = cy + 40 - radius;

        ctx.beginPath();
        ctx.arc(actualX, actualY, radius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${mass}kg`, actualX, actualY + 4);

        // Vector arrow
        if (Math.abs(v) > 0.1) {
          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.moveTo(actualX, actualY - radius - 10);
          const vLen = v * 10;
          ctx.lineTo(actualX + vLen, actualY - radius - 10);
          ctx.stroke();
          
          // arrowhead
          ctx.beginPath();
          ctx.fillStyle = "white";
          const dir = Math.sign(v);
          ctx.moveTo(actualX + vLen, actualY - radius - 14);
          ctx.lineTo(actualX + vLen, actualY - radius - 6);
          ctx.lineTo(actualX + vLen + dir * 6, actualY - radius - 10);
          ctx.fill();

          ctx.fillText(`${v.toFixed(1)} m/s`, actualX + vLen/2, actualY - radius - 20);
        }
      };

      drawBall(pos1, m1, currV1, "#3b82f6"); // Blue
      drawBall(pos2, m2, currV2, "#ef4444"); // Red

    };
    render();
  }, [pos1, pos2, m1, m2, currV1, currV2]);

  const reset = () => {
    setIsRunning(false);
    setPos1(-150);
    setPos2(150);
    setCurrV1(v1);
    setCurrV2(v2);
    lastTimeRef.current = 0;
  };

  const initialP = (m1 * v1) + (m2 * v2);
  const currentP = (m1 * currV1) + (m2 * currV2);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 left-6 right-6 flex gap-4">
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Total Momentum Awal (p₀)</div>
            <div className="text-xl font-mono text-white">{initialP.toFixed(1)} kg·m/s</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Total Momentum Saat Ini (p')</div>
            <div className="text-xl font-mono text-emerald-400">{currentP.toFixed(1)} kg·m/s</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Kekekalan Momentum</h3></div>
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

          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl space-y-3">
              <h4 className="font-bold text-blue-400 text-sm">Benda 1 (Kiri)</h4>
              <div>
                <div className="flex justify-between text-xs text-zinc-300"><span>Massa (m₁)</span><span>{m1} kg</span></div>
                <input type="range" className="w-full accent-blue-500" min="1" max="10" step="1" value={m1} onChange={(e) => setM1(parseInt(e.target.value))} disabled={isRunning}/>
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-300"><span>Kecepatan (v₁)</span><span>{v1} m/s</span></div>
                <input type="range" className="w-full accent-blue-500" min="-10" max="10" step="1" value={v1} onChange={(e) => {setV1(parseInt(e.target.value)); if(!isRunning) setCurrV1(parseInt(e.target.value));}} disabled={isRunning}/>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl space-y-3">
              <h4 className="font-bold text-red-400 text-sm">Benda 2 (Kanan)</h4>
              <div>
                <div className="flex justify-between text-xs text-zinc-300"><span>Massa (m₂)</span><span>{m2} kg</span></div>
                <input type="range" className="w-full accent-red-500" min="1" max="10" step="1" value={m2} onChange={(e) => setM2(parseInt(e.target.value))} disabled={isRunning}/>
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-300"><span>Kecepatan (v₂)</span><span>{v2} m/s</span></div>
                <input type="range" className="w-full accent-red-500" min="-10" max="10" step="1" value={v2} onChange={(e) => {setV2(parseInt(e.target.value)); if(!isRunning) setCurrV2(parseInt(e.target.value));}} disabled={isRunning}/>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Koefisien Restitusi (e)</label><span className="text-yellow-400 font-mono">{elasticity.toFixed(1)}</span></div>
              <input type="range" className="w-full accent-yellow-500" min="0" max="1" step="0.1" value={elasticity} onChange={(e) => setElasticity(parseFloat(e.target.value))} />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>0 (Tidak Lenting)</span>
                <span>1 (Lenting Sempurna)</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
