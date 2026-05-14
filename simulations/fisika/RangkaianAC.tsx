"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function RangkaianAC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [frequency, setFrequency] = useState(50); // Hz
  const [component, setComponent] = useState<"R" | "L" | "C">("R");

  const animationRef = useRef(0);
  const timeRef = useRef(0);

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

      // Angular frequency: w = 2 * PI * f. Visual scaling applied.
      const w = frequency * 0.05; 
      
      // V(t) = Vmax * sin(w*t)
      const vVal = Math.sin(timeRef.current * w);
      
      // I(t) Phase depends on component
      // R: I is in phase with V -> sin(w*t)
      // L: I lags V by 90 deg -> sin(w*t - PI/2) = -cos(w*t)
      // C: I leads V by 90 deg -> sin(w*t + PI/2) = cos(w*t)
      
      let iVal = 0;
      if (component === "R") iVal = Math.sin(timeRef.current * w);
      else if (component === "L") iVal = -Math.cos(timeRef.current * w);
      else if (component === "C") iVal = Math.cos(timeRef.current * w);

      // 1. Draw Graph V(t) and I(t)
      const gw = 300; // graph width
      const gh = 100; // graph height
      const gx = cx - gw/2;
      const gy = cy - 120; // top section

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.stroke(); // Y
      ctx.beginPath(); ctx.moveTo(gx, gy + gh/2); ctx.lineTo(gx + gw, gy + gh/2); ctx.stroke(); // X

      ctx.lineWidth = 3;
      // Draw historical waves
      ctx.beginPath(); ctx.strokeStyle = "#ef4444"; // Red = Voltage
      for (let x = 0; x < gw; x++) {
        // history time t = current - (gw - x)*scale
        const t = timeRef.current - (gw - x)*0.02;
        const v = Math.sin(t * w);
        ctx.lineTo(gx + x, gy + gh/2 - v * (gh/2 - 10));
      }
      ctx.stroke();

      ctx.beginPath(); ctx.strokeStyle = "#3b82f6"; // Blue = Current
      for (let x = 0; x < gw; x++) {
        const t = timeRef.current - (gw - x)*0.02;
        let c = 0;
        if (component === "R") c = Math.sin(t * w);
        else if (component === "L") c = -Math.cos(t * w);
        else if (component === "C") c = Math.cos(t * w);
        ctx.lineTo(gx + x, gy + gh/2 - c * (gh/2 - 20)); // current amplitude slightly smaller visually
      }
      ctx.stroke();

      // Legend
      ctx.fillStyle = "#ef4444"; ctx.fillText("Voltase (V)", gx + 10, gy + 15);
      ctx.fillStyle = "#3b82f6"; ctx.fillText("Arus (I)", gx + 10, gy + 30);


      // 2. Draw Circuit
      const cyCir = cy + 60; // bottom section
      const rw = 200, rh = 100;
      
      ctx.strokeStyle = "#52525b"; ctx.lineWidth = 6;
      ctx.strokeRect(cx - rw/2, cyCir - rh/2, rw, rh);

      // AC Source (Left)
      ctx.fillStyle = "#18181b"; ctx.fillRect(cx - rw/2 - 20, cyCir - 20, 40, 40);
      ctx.beginPath(); ctx.arc(cx - rw/2, cyCir, 20, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - rw/2 - 10, cyCir); ctx.bezierCurveTo(cx - rw/2 - 5, cyCir - 10, cx - rw/2 + 5, cyCir + 10, cx - rw/2 + 10, cyCir); ctx.stroke(); // Sine wave icon

      // Component (Right)
      ctx.fillStyle = "#18181b"; ctx.fillRect(cx + rw/2 - 25, cyCir - 40, 50, 80);
      ctx.fillStyle = "white"; ctx.textAlign = "center";
      
      if (component === "R") {
        ctx.beginPath(); ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 4;
        ctx.moveTo(cx + rw/2, cyCir - 30);
        for(let i=0; i<6; i++) ctx.lineTo(cx + rw/2 + (i%2===0?10:-10), cyCir - 30 + i*10 + 5);
        ctx.lineTo(cx + rw/2, cyCir + 30); ctx.stroke();
        ctx.fillText("Resistor", cx + rw/2 + 40, cyCir);
      } else if (component === "L") {
        ctx.beginPath(); ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 4;
        ctx.moveTo(cx + rw/2, cyCir - 30);
        for(let i=0; i<4; i++) { ctx.arc(cx + rw/2, cyCir - 20 + i*15, 8, -Math.PI/2, Math.PI/2, true); }
        ctx.lineTo(cx + rw/2, cyCir + 30); ctx.stroke();
        ctx.fillText("Induktor", cx + rw/2 + 40, cyCir);
      } else if (component === "C") {
        ctx.beginPath(); ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
        ctx.moveTo(cx + rw/2, cyCir - 30); ctx.lineTo(cx + rw/2, cyCir - 10);
        ctx.moveTo(cx + rw/2 - 15, cyCir - 10); ctx.lineTo(cx + rw/2 + 15, cyCir - 10); // top plate
        ctx.moveTo(cx + rw/2 - 15, cyCir + 10); ctx.lineTo(cx + rw/2 + 15, cyCir + 10); // bot plate
        ctx.moveTo(cx + rw/2, cyCir + 10); ctx.lineTo(cx + rw/2, cyCir + 30);
        ctx.stroke();
        ctx.fillText("Kapasitor", cx + rw/2 + 45, cyCir);
      }

      // Arrows indicating Current direction and magnitude
      const arrowLen = Math.abs(iVal) * 30;
      if (arrowLen > 2) {
        ctx.beginPath();
        ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 6;
        
        // top wire
        const dir = iVal > 0 ? 1 : -1;
        ctx.moveTo(cx - 50, cyCir - rh/2);
        ctx.lineTo(cx - 50 + dir*arrowLen, cyCir - rh/2);
        ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = "#3b82f6";
        ctx.moveTo(cx - 50 + dir*arrowLen, cyCir - rh/2 - 6); ctx.lineTo(cx - 50 + dir*arrowLen + dir*10, cyCir - rh/2); ctx.lineTo(cx - 50 + dir*arrowLen, cyCir - rh/2 + 6); ctx.fill();
      }

      if (isRunning) timeRef.current += 1;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, frequency, component]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Rangkaian Arus Bolak-Balik (AC)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
          </button>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm text-zinc-300">Pilih Komponen</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setComponent("R")} className={`py-2 rounded border font-bold ${component === 'R' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Resistor (R)</button>
              <button onClick={() => setComponent("L")} className={`py-2 rounded border font-bold ${component === 'L' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Induktor (L)</button>
              <button onClick={() => setComponent("C")} className={`py-2 rounded border font-bold ${component === 'C' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Kapasitor (C)</button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between"><label className="text-sm text-white font-bold">Frekuensi AC (Hz)</label><span className="text-white font-mono">{frequency} Hz</span></div>
            <input type="range" className="w-full accent-white" min="10" max="100" step="5" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            {component === "R" && <p><strong>Resistif Murni:</strong> Tegangan dan Arus sefase (berada pada titik puncak dan nol secara bersamaan).</p>}
            {component === "L" && <p><strong>Induktif Murni:</strong> Arus tertinggal (lagging) 90° terhadap Tegangan. Tegangan mencapai puncak mendahului arus.</p>}
            {component === "C" && <p><strong>Kapasitif Murni:</strong> Arus mendahului (leading) 90° terhadap Tegangan. Arus memuncak sebelum tegangan.</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
