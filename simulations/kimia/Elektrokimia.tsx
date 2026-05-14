"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function Elektrokimia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Zinc - Copper Voltaic Cell
  // Zn(s) -> Zn2+(aq) + 2e- (Oxidation, Anode, -)
  // Cu2+(aq) + 2e- -> Cu(s) (Reduction, Cathode, +)
  
  const [electronFlow, setElectronFlow] = useState(0);

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

      // Draw Beakers
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      
      // Left Beaker (Anode - Zn)
      ctx.beginPath(); ctx.moveTo(cx - 150, cy - 50); ctx.lineTo(cx - 150, cy + 100); ctx.lineTo(cx - 50, cy + 100); ctx.lineTo(cx - 50, cy - 50); ctx.stroke();
      ctx.fillStyle = "rgba(161, 161, 170, 0.3)"; // ZnSO4 solution
      ctx.fillRect(cx - 148, cy, 96, 98);

      // Right Beaker (Cathode - Cu)
      ctx.beginPath(); ctx.moveTo(cx + 50, cy - 50); ctx.lineTo(cx + 50, cy + 100); ctx.lineTo(cx + 150, cy + 100); ctx.lineTo(cx + 150, cy - 50); ctx.stroke();
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"; // CuSO4 solution (blue)
      ctx.fillRect(cx + 52, cy, 96, 98);

      // Salt Bridge (Jembatan Garam)
      ctx.strokeStyle = "rgba(250, 204, 21, 0.6)"; // yellowish
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy + 50); 
      ctx.lineTo(cx - 100, cy - 20);
      ctx.lineTo(cx + 100, cy - 20);
      ctx.lineTo(cx + 100, cy + 50);
      ctx.stroke();
      ctx.fillStyle = "white"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Jembatan Garam (KNO₃)", cx, cy - 30);

      // Electrodes
      // Anode (Zn) - slowly dissolving
      const znWidth = Math.max(5, 30 - electronFlow*0.02);
      ctx.fillStyle = "#94a3b8"; // zinc color
      ctx.fillRect(cx - 115, cy - 60, znWidth, 120);
      ctx.fillStyle = "white"; ctx.fillText("Zn (-)", cx - 100, cy - 70);

      // Cathode (Cu) - slowly growing
      const cuWidth = Math.min(50, 30 + electronFlow*0.02);
      ctx.fillStyle = "#d97706"; // copper color
      ctx.fillRect(cx + 100 - cuWidth/2, cy - 60, cuWidth, 120);
      ctx.fillStyle = "white"; ctx.fillText("Cu (+)", cx + 100, cy - 70);

      // Wire
      ctx.strokeStyle = "white"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 100, cy - 60); ctx.lineTo(cx - 100, cy - 120); ctx.lineTo(cx + 100, cy - 120); ctx.lineTo(cx + 100, cy - 60); ctx.stroke();

      // Voltmeter
      ctx.fillStyle = "#18181b"; ctx.beginPath(); ctx.arc(cx, cy - 120, 25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#22c55e"; ctx.font="bold 12px sans-serif"; ctx.fillText("1.10 V", cx, cy - 115);

      if (isRunning) {
        setElectronFlow(f => f + 1);
        
        // Draw Electrons moving in wire (Left to Right)
        const ePos = (electronFlow % 200) / 200; // 0 to 1 along the wire path
        // path total length approx = 60 + 200 + 60 = 320
        ctx.fillStyle = "#fcd34d"; // electron color
        ctx.beginPath();
        if (ePos < 0.18) { // going up
          ctx.arc(cx - 100, cy - 60 - (ePos/0.18)*60, 4, 0, Math.PI*2);
        } else if (ePos < 0.82) { // going right
          ctx.arc(cx - 100 + ((ePos-0.18)/0.64)*200, cy - 120, 4, 0, Math.PI*2);
        } else { // going down
          ctx.arc(cx + 100, cy - 120 + ((ePos-0.82)/0.18)*60, 4, 0, Math.PI*2);
        }
        ctx.fill();

        // Ions in solution
        // Zn2+ going into solution (Left)
        if (electronFlow % 30 === 0) {
          // just a visual pulse
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, electronFlow]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Elektrokimia (Sel Volta)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {isRunning ? 'Jeda' : 'Jalankan Reaksi'}
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
              <h4 className="text-red-400 font-bold text-xs uppercase mb-2">Anoda (Oksidasi)</h4>
              <div className="font-mono text-sm text-white">Zn (s) ➔ Zn²⁺ (aq) + 2e⁻</div>
              <p className="text-[10px] text-zinc-400 mt-1">Logam Zinc larut, melepas elektron.</p>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
              <h4 className="text-blue-400 font-bold text-xs uppercase mb-2">Katoda (Reduksi)</h4>
              <div className="font-mono text-sm text-white">Cu²⁺ (aq) + 2e⁻ ➔ Cu (s)</div>
              <p className="text-[10px] text-zinc-400 mt-1">Ion Tembaga menangkap elektron, mengendap.</p>
            </div>

            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 text-center">
              <div className="text-emerald-400 font-bold text-xs uppercase mb-1">Potensial Sel Standar (E°sel)</div>
              <div className="font-mono text-2xl text-emerald-400 font-bold">+1.10 V</div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Sel Volta (Galvani)</strong> mengubah energi kimia dari reaksi redoks spontan menjadi energi listrik.</p>
            <p className="text-yellow-400">Elektron mengalir di kawat dari Anoda (-) ke Katoda (+).</p>
            <p>Jembatan garam berfungsi menetralkan muatan ion dalam larutan agar reaksi terus berjalan.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
