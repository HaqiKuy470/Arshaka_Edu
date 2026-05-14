"use client";

import { useState, useEffect, useRef } from "react";

export default function SistemSaraf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trigger, setTrigger] = useState(0);

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

      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Draw Neuron 1 (Left)
      ctx.fillStyle = "#3b82f6"; // Blue soma
      ctx.beginPath(); ctx.arc(100, cy, 40, 0, Math.PI*2); ctx.fill();
      // Dendrites
      for(let i=0; i<5; i++) {
        ctx.beginPath(); ctx.moveTo(100, cy); 
        ctx.lineTo(100 - 60*Math.cos(i*Math.PI/4), cy - 60*Math.sin(i*Math.PI/4));
        ctx.strokeStyle="#3b82f6"; ctx.lineWidth=4; ctx.stroke();
      }
      ctx.fillStyle = "#1e3a8a"; ctx.beginPath(); ctx.arc(100, cy, 10, 0, Math.PI*2); ctx.fill(); // Nucleus

      // Axon
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(140, cy - 10, w - 300, 20);

      // Myelin Sheath
      ctx.fillStyle = "#fbbf24";
      for (let x = 160; x < w - 200; x += 60) {
        ctx.fillRect(x, cy - 15, 40, 30);
      }

      // Synapse / Axon Terminal
      ctx.beginPath(); ctx.moveTo(w - 160, cy); ctx.lineTo(w - 120, cy - 30); ctx.lineWidth=10; ctx.strokeStyle="#60a5fa"; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 160, cy); ctx.lineTo(w - 120, cy + 30); ctx.stroke();
      
      ctx.beginPath(); ctx.arc(w - 120, cy - 30, 15, 0, Math.PI*2); ctx.fillStyle="#3b82f6"; ctx.fill();
      ctx.beginPath(); ctx.arc(w - 120, cy + 30, 15, 0, Math.PI*2); ctx.fill();

      // Neuron 2 (Right - Target)
      ctx.fillStyle = "#10b981"; // Green target
      ctx.beginPath(); ctx.arc(w - 40, cy - 30, 30, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(w - 40, cy + 30, 30, 0, Math.PI*2); ctx.fill();

      // Action Potential Animation
      if (trigger > 0) {
        const speed = 10;
        const dist = (time - trigger) * speed;
        
        if (dist > 0 && dist < w - 240) {
          // Traveling down axon
          const px = 140 + dist;
          ctx.beginPath(); ctx.arc(px, cy, 15, 0, Math.PI*2);
          ctx.fillStyle = "white"; ctx.fill();
          ctx.shadowColor = "white"; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
        } 
        else if (dist >= w - 240 && dist < w - 100) {
          // Synaptic transmission (Neurotransmitters)
          for(let i=0; i<10; i++) {
             const tx = w - 120 + Math.random()*40;
             const ty1 = cy - 30 + (Math.random()-0.5)*20;
             const ty2 = cy + 30 + (Math.random()-0.5)*20;
             ctx.fillStyle = "#ef4444"; // Red neurotransmitters
             ctx.beginPath(); ctx.arc(tx, ty1, 3, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.arc(tx, ty2, 3, 0, Math.PI*2); ctx.fill();
          }
          // Target neuron glows
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.beginPath(); ctx.arc(w - 40, cy - 30, 30, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(w - 40, cy + 30, 30, 0, Math.PI*2); ctx.fill();
        }
      }

      // Labels
      ctx.fillStyle = "white"; ctx.font = "14px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Badan Sel", 100, cy + 60);
      ctx.fillText("Akson (Selubung Mielin)", w/2, cy + 40);
      ctx.fillText("Sinapsis", w - 100, cy);

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [trigger]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Saraf & Impuls</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button 
            onClick={() => setTrigger(Date.now() % 10000)} // random time id
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold text-lg uppercase tracking-widest transition-transform active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            ⚡ Berikan Stimulus
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-sm text-zinc-300 leading-relaxed mt-4">
            <h4 className="text-yellow-400 font-bold uppercase text-xs">Perjalanan Impuls</h4>
            <ol className="list-decimal pl-4 space-y-2 text-xs">
              <li><strong>Dendrit</strong> menerima rangsangan dari luar atau neuron lain.</li>
              <li>Sinyal listrik (Potensial Aksi) merambat cepat di sepanjang <strong>Akson</strong>.</li>
              <li><strong>Selubung Mielin</strong> (kuning) berfungsi sebagai isolator yang mempercepat loncatan impuls listrik.</li>
              <li>Sampai di ujung (<strong>Sinapsis</strong>), sinyal listrik memicu pelepasan bahan kimia (Neurotransmiter).</li>
              <li>Neurotransmiter menyeberangi celah sinapsis dan memicu sinyal listrik di neuron target berikutnya.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}
