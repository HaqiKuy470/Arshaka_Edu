"use client";

import { useState, useEffect, useRef } from "react";

export default function GayaGerakDasar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [leftForce, setLeftForce] = useState(50);
  const [rightForce, setRightForce] = useState(50);
  
  const [pos, setPos] = useState(0); // Cart position
  const [vel, setVel] = useState(0);
  const animationRef = useRef(0);

  const mass = 50; // kg

  useEffect(() => {
    const netForce = rightForce - leftForce;
    const accel = netForce / mass;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 50;

      // Update position
      setVel(v => v + accel * 0.1);
      setPos(p => {
        let nextP = p + vel * 0.1;
        // Keep within bounds visually
        if (Math.abs(nextP) > canvas.width/2 - 100) {
          nextP = Math.sign(nextP) * (canvas.width/2 - 100);
          setVel(0); // Crash stop
        }
        return nextP;
      });

      // Draw Ground
      ctx.beginPath();
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

      const cartX = cx + pos;

      // Draw Cart
      ctx.fillStyle = "#8b5cf6"; // Violet
      ctx.fillRect(cartX - 40, cy - 40, 80, 30);
      
      // Wheels
      ctx.fillStyle = "white";
      ctx.beginPath(); ctx.arc(cartX - 25, cy - 10, 10, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cartX + 25, cy - 10, 10, 0, Math.PI*2); ctx.fill();

      // Function to draw pushers (stick figures)
      const drawPusher = (x: number, isLeft: boolean, force: number) => {
        if (force === 0) return;
        ctx.strokeStyle = isLeft ? "#38bdf8" : "#fb7185"; // Sky (Left) or Rose (Right)
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        
        const dir = isLeft ? -1 : 1;
        // Head
        ctx.beginPath(); ctx.arc(x + dir * 30, cy - 60, 10, 0, Math.PI*2); ctx.stroke();
        // Body
        ctx.beginPath(); ctx.moveTo(x + dir * 30, cy - 50); ctx.lineTo(x + dir * 40, cy - 20); ctx.stroke();
        // Arms pushing
        ctx.beginPath(); ctx.moveTo(x + dir * 35, cy - 40); ctx.lineTo(x, cy - 25); ctx.stroke();
        // Legs
        ctx.beginPath(); ctx.moveTo(x + dir * 40, cy - 20); ctx.lineTo(x + dir * 50, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + dir * 40, cy - 20); ctx.lineTo(x + dir * 20, cy); ctx.stroke();
      };

      drawPusher(cartX - 40, true, rightForce); // Right pusher (pushing leftwards? Wait. Left pusher pushes right.)
      // Let's re-clarify: Left team pushes to the right. Right team pushes to the left.
      // Actually tug of war is pulling. Let's make it pulling ropes.
      
      // Left Team (Pulling left)
      if (leftForce > 0) {
        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath(); ctx.moveTo(cartX - 40, cy - 25); ctx.lineTo(cartX - 100, cy - 25); ctx.stroke();
        ctx.beginPath(); ctx.arc(cartX - 110, cy - 40, 10, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cartX - 110, cy - 30); ctx.lineTo(cartX - 110, cy - 10); ctx.stroke(); // body
      }

      // Right Team (Pulling right)
      if (rightForce > 0) {
        ctx.strokeStyle = "#fb7185";
        ctx.beginPath(); ctx.moveTo(cartX + 40, cy - 25); ctx.lineTo(cartX + 100, cy - 25); ctx.stroke();
        ctx.beginPath(); ctx.arc(cartX + 110, cy - 40, 10, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cartX + 110, cy - 30); ctx.lineTo(cartX + 110, cy - 10); ctx.stroke(); // body
      }

      // Draw Force Arrows Above
      if (leftForce > 0) {
        ctx.beginPath(); ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4;
        ctx.moveTo(cartX - 20, cy - 70); ctx.lineTo(cartX - 20 - leftForce, cy - 70); ctx.stroke();
      }
      if (rightForce > 0) {
        ctx.beginPath(); ctx.strokeStyle = "#fb7185"; ctx.lineWidth = 4;
        ctx.moveTo(cartX + 20, cy - 70); ctx.lineTo(cartX + 20 + rightForce, cy - 70); ctx.stroke();
      }

      // Net Force text
      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`Resultan Gaya: ${Math.abs(netForce)} N ${netForce > 0 ? 'Kanan ➡️' : netForce < 0 ? '⬅️ Kiri' : 'Seimbang'}`, cx, 50);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [leftForce, rightForce, pos, vel]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gaya & Gerak Dasar</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm text-sky-400 font-bold">Tim Kiri (Tarik ke Kiri)</label><span className="text-sky-400 font-mono">{leftForce} N</span></div>
            <input type="range" className="w-full accent-sky-500" min="0" max="250" step="10" value={leftForce} onChange={(e) => setLeftForce(parseInt(e.target.value))} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm text-rose-400 font-bold">Tim Kanan (Tarik ke Kanan)</label><span className="text-rose-400 font-mono">{rightForce} N</span></div>
            <input type="range" className="w-full accent-rose-500" min="0" max="250" step="10" value={rightForce} onChange={(e) => setRightForce(parseInt(e.target.value))} />
          </div>

          <button onClick={() => {setPos(0); setVel(0);}} className="w-full py-2.5 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 mt-4">Reset Posisi</button>

        </div>
      </div>
    </div>
  );
}
