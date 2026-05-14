"use client";

import { useState, useEffect, useRef } from "react";

export default function DifraksiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [slits, setSlits] = useState<1 | 2>(2); // Single or Double slit
  const [wavelength, setWavelength] = useState(500); // nm (color)
  const [slitDistance, setSlitDistance] = useState(20); // d or a

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
      const cx = w / 2;
      const cy = h / 2;

      // Color based on wavelength (approx)
      let rgb = "255, 255, 255";
      if (wavelength >= 650) rgb = "239, 68, 68"; // Red
      else if (wavelength >= 550) rgb = "234, 179, 8"; // Yellow/Green
      else if (wavelength >= 450) rgb = "59, 130, 246"; // Blue
      else rgb = "168, 85, 247"; // Violet

      // Draw Screen (Right side)
      ctx.fillStyle = "#18181b"; // Screen background
      ctx.fillRect(w - 100, 0, 100, h);

      // Draw Slit Wall (Left side)
      ctx.fillStyle = "#52525b";
      ctx.fillRect(100, 0, 10, h);
      
      // Cut holes
      ctx.fillStyle = "black";
      if (slits === 1) {
        ctx.clearRect(100, cy - slitDistance/2, 10, slitDistance);
      } else {
        ctx.clearRect(100, cy - slitDistance/2 - 5, 10, 10);
        ctx.clearRect(100, cy + slitDistance/2 - 5, 10, 10);
      }

      // Draw Interference Pattern on Screen (Right Edge)
      // I(theta) = I0 * cos^2(pi*d*sin(theta)/lambda) * sinc^2(pi*a*sin(theta)/lambda)
      // Simplified visual equation for the pattern
      
      for (let y = 0; y < h; y++) {
        // angle theta approx Y / Distance
        const Y = y - cy;
        const theta = Y * 0.05; // scaling
        
        let intensity = 0;
        
        // Single slit diffraction envelope (sinc function)
        const a = slits === 1 ? slitDistance : 5; // slit width
        const alpha = (Math.PI * a * theta) / (wavelength * 0.1); 
        const sinc = alpha === 0 ? 1 : Math.sin(alpha)/alpha;
        let env = sinc * sinc;

        if (slits === 2) {
          // Double slit interference
          const beta = (Math.PI * slitDistance * theta) / (wavelength * 0.1);
          intensity = Math.pow(Math.cos(beta), 2) * env;
        } else {
          intensity = env;
        }

        ctx.fillStyle = `rgba(${rgb}, ${intensity})`;
        ctx.fillRect(w - 100, y, 100, 1);
      }

      // Draw Waves Traveling (Left to Right)
      ctx.strokeStyle = `rgba(${rgb}, 0.2)`;
      ctx.lineWidth = 1;
      // Before slit
      for (let x = (time % 20); x < 100; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }

      // After slit (Circular ripples)
      if (slits === 1) {
        for (let r = (time % 20); r < w - 100; r += 20) {
          ctx.beginPath(); ctx.arc(105, cy, r, -Math.PI/2, Math.PI/2); ctx.stroke();
        }
      } else {
        for (let r = (time % 20); r < w - 100; r += 20) {
          ctx.beginPath(); ctx.arc(105, cy - slitDistance/2, r, -Math.PI/2, Math.PI/2); ctx.stroke();
          ctx.beginPath(); ctx.arc(105, cy + slitDistance/2, r, -Math.PI/2, Math.PI/2); ctx.stroke();
        }
      }

      time += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [slits, wavelength, slitDistance]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Difraksi & Interferensi Cahaya</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-300">Jenis Eksperimen</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setSlits(1)} 
                className={`flex-1 py-2 rounded-xl font-bold border text-sm ${slits === 1 ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Celah Tunggal
              </button>
              <button 
                onClick={() => setSlits(2)} 
                className={`flex-1 py-2 rounded-xl font-bold border text-sm ${slits === 2 ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Celah Ganda (Young)
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between"><label className="text-sm font-bold text-white">Panjang Gelombang (λ)</label><span className="font-mono text-zinc-400">{wavelength} nm</span></div>
            {/* Range 400 to 700 nm for visible light */}
            <input 
              type="range" 
              className="w-full" 
              style={{ accentColor: wavelength >= 650 ? 'red' : wavelength >= 550 ? 'yellow' : wavelength >= 450 ? 'blue' : 'purple' }}
              min="400" max="700" step="10" 
              value={wavelength} 
              onChange={(e) => setWavelength(parseInt(e.target.value))} 
            />
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between"><label className="text-sm font-bold text-white">Jarak/Lebar Celah (d/a)</label></div>
            <input 
              type="range" 
              className="w-full accent-white" 
              min="10" max="60" step="2" 
              value={slitDistance} 
              onChange={(e) => setSlitDistance(parseInt(e.target.value))} 
            />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {slits === 1 ? (
              <p><strong>Difraksi Celah Tunggal:</strong> Cahaya melentur saat melewati celah sempit, menghasilkan pola terang besar di tengah (Pita Pusat Utama) yang diapit oleh pola gelap-terang kecil.</p>
            ) : (
              <p><strong>Eksperimen Celah Ganda Young:</strong> Bukti kuat bahwa cahaya adalah Gelombang. Gelombang dari kedua celah akan bertabrakan dan menghasilkan pola interferensi bergaris-garis tegas (Fringe) pada layar.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
