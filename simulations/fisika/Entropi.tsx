"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function Entropi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [barrierOpen, setBarrierOpen] = useState(false);
  
  const numParticles = 100; // 50 red, 50 blue
  
  const particlesRef = useRef(
    Array.from({ length: numParticles }).map((_, i) => ({
      id: i,
      color: i < 50 ? "#ef4444" : "#3b82f6", // Red on left, Blue on right initially
      x: i < 50 ? Math.random() * 140 + 10 : Math.random() * 140 + 160,
      y: Math.random() * 180 + 10,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }))
  );

  const animationRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const update = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = 300;
        const height = 200;

        particlesRef.current.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          // Outer walls
          if (p.x < 5) { p.x = 5; p.vx *= -1; }
          if (p.x > width - 5) { p.x = width - 5; p.vx *= -1; }
          if (p.y < 5) { p.y = 5; p.vy *= -1; }
          if (p.y > height - 5) { p.y = height - 5; p.vy *= -1; }

          // Barrier in the middle (x = 150)
          if (!barrierOpen) {
            if (p.color === "#ef4444" && p.x > 145) {
              p.x = 145; p.vx *= -1;
            }
            if (p.color === "#3b82f6" && p.x < 155) {
              p.x = 155; p.vx *= -1;
            }
          }
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, barrierOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = 300; // fixed internal resolution
      canvas.height = 200;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Container
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 300, 200);

      // Draw Barrier
      if (!barrierOpen) {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(148, 0, 4, 200);
      }

      // Draw Particles
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

    };

    if (isRunning) {
      let rAF = 0;
      const loop = () => {
        render();
        rAF = requestAnimationFrame(loop);
      }
      loop();
      return () => cancelAnimationFrame(rAF);
    } else {
      render();
    }
  }, [barrierOpen, isRunning]);

  const reset = () => {
    setIsRunning(false);
    setBarrierOpen(false);
    particlesRef.current = Array.from({ length: numParticles }).map((_, i) => ({
      id: i,
      color: i < 50 ? "#ef4444" : "#3b82f6",
      x: i < 50 ? Math.random() * 140 + 10 : Math.random() * 140 + 160,
      y: Math.random() * 180 + 10,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));
  };

  // Calculate "Entropy" (Mixing metric)
  // If reds are on right or blues are on left, entropy is high.
  let mixedCount = 0;
  particlesRef.current.forEach(p => {
    if (p.color === "#ef4444" && p.x > 150) mixedCount++;
    if (p.color === "#3b82f6" && p.x < 150) mixedCount++;
  });
  // Max mix is ~50. So percentage:
  const entropyPercent = Math.min(100, (mixedCount / 50) * 100);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 gap-6">
        
        <div className="relative w-[300px] h-[200px] shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <canvas ref={canvasRef} className="w-full h-full bg-zinc-900 rounded border border-white/10" />
        </div>

        <div className="w-[300px] bg-black/50 p-4 rounded-xl border border-white/10 text-center">
          <div className="text-xs text-zinc-400 mb-2">Tingkat Ketidakteraturan (Entropi)</div>
          <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-300" style={{ width: `${entropyPercent}%` }} />
          </div>
          <div className="mt-2 text-sm font-mono text-white">{entropyPercent.toFixed(0)}%</div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Entropi (Hukum II Termo)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4"/> {isRunning ? 'Jeda' : 'Mulai Gerak'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <button 
            onClick={() => { setBarrierOpen(true); setIsRunning(true); }}
            disabled={barrierOpen}
            className={`w-full py-4 rounded-xl font-bold border-2 transition-all ${barrierOpen ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-rose-500/20 border-rose-500 hover:bg-rose-500 hover:text-white text-rose-400'}`}
          >
            {barrierOpen ? 'Sekat Sudah Dibuka' : 'Buka Sekat Pemisah!'}
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 leading-relaxed mt-4">
            <p><strong>Entropi</strong> adalah ukuran ketidakteraturan sistem.</p>
            <p>Hukum ke-2 Termodinamika menyatakan bahwa Entropi semesta selalu bertambah.</p>
            <p className="text-yellow-400 mt-2">Gas yang sudah tercampur (entropi tinggi) tidak akan pernah secara spontan terpisah kembali ke ruangannya masing-masing.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
