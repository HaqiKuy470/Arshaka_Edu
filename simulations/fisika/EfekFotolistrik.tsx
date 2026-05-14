"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function EfekFotolistrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [wavelength, setWavelength] = useState(400); // nm
  const [intensity, setIntensity] = useState(50); // %
  const [voltage, setVoltage] = useState(0); // V (Stopping potential)
  const [material, setMaterial] = useState("Sodium");

  // Work functions (eV)
  const workFunctions: Record<string, number> = {
    Sodium: 2.28,
    Zinc: 4.33,
    Copper: 4.70,
    Platinum: 6.35,
  };

  const wf = workFunctions[material];

  // Energy of photon E = hc / lambda (in eV)
  // hc = 1240 eV nm
  const photonEnergy = 1240 / wavelength;

  // Kinetic energy of emitted electrons: K_max = E - wf - V_stop
  // Note: stopping potential (voltage < 0) reduces kinetic energy
  // If voltage > 0, it accelerates them (no effect on K_max for emission, just speed later)
  const K_max = photonEnergy - wf + voltage;
  const isEmitting = photonEnergy > wf;
  const doesReachAnode = K_max > 0;

  const photonsRef = useRef<{x: number, y: number}[]>([]);
  const electronsRef = useRef<{x: number, y: number, v: number}[]>([]);

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
      const h = canvas.height;
      const cy = h / 2;

      // Color of light based on wavelength
      let rgb = "255, 255, 255";
      if (wavelength >= 650) rgb = "239, 68, 68"; // Red
      else if (wavelength >= 550) rgb = "234, 179, 8"; // Yellow
      else if (wavelength >= 450) rgb = "59, 130, 246"; // Blue
      else rgb = "168, 85, 247"; // Violet/UV

      // Draw Vacuum Tube
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(w/2, cy - 30, 200, 80, 0, 0, Math.PI*2);
      ctx.stroke();

      // Cathode (Left)
      const cathX = w/2 - 150;
      ctx.fillStyle = "#94a3b8"; // zinc-400
      ctx.fillRect(cathX, cy - 70, 20, 80);
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif"; ctx.fillText(material, cathX - 40, cy - 80);

      // Anode (Right)
      const anodeX = w/2 + 150;
      ctx.fillStyle = "#52525b"; // zinc-600
      ctx.fillRect(anodeX - 20, cy - 70, 20, 80);

      // Light Source emitting photons
      if (isRunning) {
        if (Math.random() < intensity / 100) {
          photonsRef.current.push({ x: w/2 - 50, y: cy - 180 + Math.random()*20 });
        }
      }

      // Draw and update Photons
      ctx.fillStyle = `rgba(${rgb}, 0.8)`;
      for (let i = photonsRef.current.length - 1; i >= 0; i--) {
        const p = photonsRef.current[i];
        p.x -= 3; // move diagonally towards cathode
        p.y += 3;
        
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
        
        // If hits cathode
        if (p.x <= cathX + 20 && p.y > cy - 70 && p.y < cy + 10) {
          photonsRef.current.splice(i, 1);
          // Emit electron?
          if (isEmitting && isRunning) {
            // Speed depends on K_max roughly
            let v = Math.max(0.1, K_max * 2);
            electronsRef.current.push({ x: cathX + 20, y: p.y, v: v });
          }
        } else if (p.y > cy + 100 || p.x < 0) {
          photonsRef.current.splice(i, 1);
        }
      }

      // Draw and update Electrons
      ctx.fillStyle = "#fcd34d"; // amber-300
      for (let i = electronsRef.current.length - 1; i >= 0; i--) {
        const e = electronsRef.current[i];
        
        // Acceleration / Deceleration due to voltage
        // E field = V / d. If V is negative, it pushes electrons back.
        e.v += (voltage * 0.05);
        e.x += e.v;

        ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI*2); ctx.fill();

        // If electron turns around due to stopping potential
        if (e.x <= cathX + 20 && e.v < 0) {
          electronsRef.current.splice(i, 1); // absorbed back
        } else if (e.x >= anodeX - 20) {
          electronsRef.current.splice(i, 1); // hits anode, creates current
        }
      }

      // Draw Circuit (bottom)
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cathX + 10, cy + 10); ctx.lineTo(cathX + 10, cy + 120); ctx.lineTo(w/2 - 20, cy + 120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(anodeX - 10, cy + 10); ctx.lineTo(anodeX - 10, cy + 120); ctx.lineTo(w/2 + 20, cy + 120); ctx.stroke();

      // Battery
      ctx.fillStyle = "#18181b"; ctx.fillRect(w/2 - 20, cy + 100, 40, 40);
      ctx.strokeStyle = "white"; ctx.strokeRect(w/2 - 20, cy + 100, 40, 40);
      ctx.fillStyle = "white"; ctx.textAlign="center"; ctx.fillText(`${voltage}V`, w/2, cy + 125);

      // Info
      ctx.fillStyle = "white"; ctx.textAlign="left";
      ctx.fillText(`Energi Foton: ${photonEnergy.toFixed(2)} eV`, 20, 20);
      ctx.fillText(`Fungsi Kerja: ${wf.toFixed(2)} eV`, 20, 40);
      ctx.fillText(`Max K.E.: ${Math.max(0, photonEnergy - wf).toFixed(2)} eV`, 20, 60);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, wavelength, intensity, voltage, material]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Efek Fotolistrik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className={`p-4 rounded-xl text-center border-2 transition-all ${isEmitting && doesReachAnode ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
            <div className="text-xs uppercase tracking-wider mb-1">Status Arus (Amperemeter)</div>
            <div className="text-2xl font-bold">{isEmitting && doesReachAnode ? "MENGALIR" : "NOL"}</div>
          </div>

          <div className="space-y-4 pt-4">
            
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-bold text-white">Logam Katoda (Fungsi Kerja)</label></div>
              <select 
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                value={material} onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="Sodium">Sodium (2.28 eV)</option>
                <option value="Zinc">Zinc (4.33 eV)</option>
                <option value="Copper">Tembaga (4.70 eV)</option>
                <option value="Platinum">Platinum (6.35 eV)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm text-sky-400 font-bold">Panjang Gelombang Cahaya (λ)</label>
                <span className="text-sky-400 font-mono">{wavelength} nm</span>
              </div>
              <input 
                type="range" className="w-full" style={{ accentColor: wavelength >= 650 ? 'red' : wavelength >= 550 ? 'yellow' : wavelength >= 450 ? 'blue' : 'purple' }}
                min="200" max="700" step="10" 
                value={wavelength} onChange={(e) => setWavelength(parseInt(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500">Makin pendek λ, makin besar energi foton.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm text-amber-400 font-bold">Intensitas Cahaya</label>
                <span className="text-amber-400 font-mono">{intensity}%</span>
              </div>
              <input type="range" className="w-full accent-amber-500" min="0" max="100" step="10" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm text-rose-400 font-bold">Voltase Baterai (V)</label>
                <span className="text-rose-400 font-mono">{voltage.toFixed(1)} V</span>
              </div>
              <input type="range" className="w-full accent-rose-500" min="-5" max="5" step="0.1" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Nilai negatif adalah *Stopping Potential* (menahan laju elektron).</p>
            </div>

          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Efek Fotolistrik (Einstein):</strong> Bukti bahwa cahaya adalah partikel (Foton).</p>
            <p>Elektron hanya akan lepas jika Energi Foton &gt; Fungsi Kerja logam, tidak peduli seberapa terang intensitas cahayanya!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
