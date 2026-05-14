"use client";

import { useState, useEffect, useRef } from "react";

export default function GeneratorMotor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"generator" | "motor">("motor");
  
  // For Motor: Voltage drives speed. 
  // For Generator: Mechanical Speed drives Voltage.
  const [inputVal, setInputVal] = useState(50); // 0 to 100

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0; // Rotation angle of the coil

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Speed of rotation
      // Motor: input is Voltage, determines speed
      // Generator: input is crank speed, determines voltage
      const speed = inputVal * 0.002;
      angle += speed;

      // Draw Magnets
      ctx.fillStyle = "#ef4444"; // N Red
      ctx.fillRect(cx - 150, cy - 60, 40, 120);
      ctx.fillStyle = "white"; ctx.font = "bold 24px sans-serif"; ctx.textAlign="center"; ctx.fillText("N", cx - 130, cy + 8);
      
      ctx.fillStyle = "#3b82f6"; // S Blue
      ctx.fillRect(cx + 110, cy - 60, 40, 120);
      ctx.fillStyle = "white"; ctx.fillText("S", cx + 130, cy + 8);

      // Draw Magnetic Field Lines
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      for(let y = cy - 40; y <= cy + 40; y += 20) {
        ctx.beginPath(); ctx.moveTo(cx - 110, y); ctx.lineTo(cx + 110, y); ctx.stroke();
      }

      // Draw Coil (Rotor)
      // Projection of a rotating rectangle
      const coilWidth = 100;
      const coilHeight = 60;
      
      const p1x = cx + Math.cos(angle) * (coilWidth/2);
      const p1y = cy + Math.sin(angle) * (coilHeight/2); // pseudo 3D
      
      const p2x = cx - Math.cos(angle) * (coilWidth/2);
      const p2y = cy - Math.sin(angle) * (coilHeight/2);

      ctx.strokeStyle = "#f59e0b"; // copper wire
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Right edge
      ctx.moveTo(p1x, p1y - 30); ctx.lineTo(p1x, p1y + 30);
      // Bottom edge
      ctx.lineTo(p2x, p2y + 30);
      // Left edge
      ctx.lineTo(p2x, p2y - 30);
      // Top edge
      ctx.lineTo(p1x, p1y - 30);
      ctx.stroke();

      // Commutator / Slip Rings (simplified)
      ctx.fillStyle = "#d4d4d8"; // zinc-300
      ctx.fillRect(cx - 10, cy + 60, 20, 20);
      
      // Brushes
      ctx.fillStyle = "#3f3f46"; // zinc-700
      ctx.fillRect(cx - 20, cy + 65, 10, 10);
      ctx.fillRect(cx + 10, cy + 65, 10, 10);

      // Circuit lines
      ctx.strokeStyle = "white"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 20, cy + 70); ctx.lineTo(cx - 60, cy + 70); ctx.lineTo(cx - 60, cy + 120); ctx.lineTo(cx - 20, cy + 120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 20, cy + 70); ctx.lineTo(cx + 60, cy + 70); ctx.lineTo(cx + 60, cy + 120); ctx.lineTo(cx + 20, cy + 120); ctx.stroke();

      // Draw Component based on Mode
      if (mode === "motor") {
        // Battery
        ctx.fillStyle = "#18181b"; ctx.fillRect(cx - 20, cy + 100, 40, 40);
        ctx.strokeStyle = "white"; ctx.strokeRect(cx - 20, cy + 100, 40, 40);
        ctx.fillStyle = "#ef4444"; ctx.fillRect(cx - 20, cy + 100, 15, 40);
        ctx.fillStyle = "white"; ctx.font = "12px sans-serif"; ctx.fillText(`${inputVal}V`, cx, cy + 125);
      } else {
        // Galvanometer / Bulb
        const brightness = inputVal / 100;
        ctx.fillStyle = `rgba(250, 204, 21, ${brightness})`; // yellow light
        ctx.beginPath(); ctx.arc(cx, cy + 120, 20, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fcd34d"; ctx.stroke();
        
        // Hand cranking visually
        if (inputVal > 0) {
          ctx.beginPath();
          ctx.strokeStyle = "white"; ctx.lineWidth = 3;
          ctx.arc(cx, cy, 80, angle, angle + Math.PI/2);
          ctx.stroke();
          // Arrow
          ctx.beginPath(); ctx.fillStyle="white";
          const ax = cx + Math.cos(angle+Math.PI/2)*80;
          const ay = cy + Math.sin(angle+Math.PI/2)*80;
          ctx.translate(ax, ay); ctx.rotate(angle+Math.PI);
          ctx.moveTo(0, -5); ctx.lineTo(10, 0); ctx.lineTo(0, 5); ctx.fill();
          ctx.setTransform(1,0,0,1,0,0);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mode, inputVal]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Generator & Motor Listrik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-300">Mode Operasi</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => {setMode("motor"); setInputVal(50);}} 
                className={`flex-1 py-3 rounded-xl font-bold border transition-all ${mode === 'motor' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Motor Listrik
              </button>
              <button 
                onClick={() => {setMode("generator"); setInputVal(50);}} 
                className={`flex-1 py-3 rounded-xl font-bold border transition-all ${mode === 'generator' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Generator
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-white">
                {mode === "motor" ? "Tegangan Baterai (V)" : "Kecepatan Putar Engkol"}
              </label>
              <span className="font-mono text-zinc-400">{inputVal}%</span>
            </div>
            <input 
              type="range" 
              className={`w-full ${mode === "motor" ? "accent-rose-500" : "accent-sky-500"}`} 
              min="0" max="100" step="1" 
              value={inputVal} 
              onChange={(e) => setInputVal(parseInt(e.target.value))} 
            />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {mode === "motor" && (
              <>
                <p><strong className="text-rose-400">Motor Listrik:</strong> Mengubah Energi Listrik menjadi Energi Mekanik (Gerak).</p>
                <p>Arus dari baterai mengalir melalui kumparan yang berada di dalam medan magnet, menghasilkan <strong>Gaya Lorentz</strong> yang memutar kumparan.</p>
              </>
            )}
            {mode === "generator" && (
              <>
                <p><strong className="text-sky-400">Generator Listrik:</strong> Mengubah Energi Mekanik (Gerak) menjadi Energi Listrik.</p>
                <p>Memutar kumparan secara paksa di dalam medan magnet menyebabkan perubahan fluks magnetik, yang menghasilkan <strong>GGL Induksi</strong> (menyala lampu).</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
