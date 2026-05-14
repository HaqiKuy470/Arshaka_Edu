"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function GelombangTali() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  const [amplitude, setAmplitude] = useState(5.0);
  const [frequency, setFrequency] = useState(2.5);
  const [playing, setPlaying] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const resetSimulation = () => {
    setAmplitude(5.0);
    setFrequency(2.5);
    setPlaying(true);
    setSlowMotion(false);
    setShowLabels(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      const centerY = canvas.height / 2;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const maxAmplitudePixels = (canvas.height / 2) * 0.8;
      const actualAmplitude = (amplitude / 10) * maxAmplitudePixels;
      const waveLength = canvas.width / (frequency || 0.1); 

      ctx.beginPath();
      ctx.strokeStyle = "#8b5cf6"; 
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const numParticles = Math.floor(canvas.width / 10);
      const particleSpacing = canvas.width / numParticles;

      for (let i = 0; i <= numParticles; i++) {
        const x = i * particleSpacing;
        const k = (Math.PI * 2) / waveLength;
        const phase = k * x - timeRef.current;
        const y = centerY + actualAmplitude * Math.sin(phase);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      for (let i = 0; i <= numParticles; i++) {
        const x = i * particleSpacing;
        const k = (Math.PI * 2) / waveLength;
        const phase = k * x - timeRef.current;
        const y = centerY + actualAmplitude * Math.sin(phase);

        ctx.beginPath();
        ctx.arc(x, y, i % 5 === 0 ? 5 : 3, 0, Math.PI * 2);
        if (i % 5 === 0) {
          ctx.fillStyle = "#6366f1"; 
        } else {
          ctx.fillStyle = "#ec4899";
        }
        ctx.fill();
        
        if (showLabels && i % 10 === 0 && i !== 0 && i !== numParticles) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "10px sans-serif";
          ctx.fillText(`P${i}`, x - 5, y - 10);
        }
      }

      const sourceY = centerY + actualAmplitude * Math.sin(-timeRef.current);
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(0, sourceY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 4;
      ctx.moveTo(-20, centerY);
      ctx.lineTo(0, sourceY);
      ctx.stroke();

      if (playing) {
        const speed = slowMotion ? 0.02 : 0.1;
        timeRef.current += speed * (frequency / 5 + 0.5); 
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationRef.current);
  }, [amplitude, frequency, playing, slowMotion, showLabels]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
        <button 
          onClick={() => setPlaying(!playing)}
          className="absolute bottom-6 left-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all z-20 hover:scale-105"
        >
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Panel Kontrol</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Amplitudo</label>
              <span className="text-xs text-indigo-400 font-mono">{amplitude.toFixed(1)} cm</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-indigo-500" 
              min="0" max="10" step="0.1" 
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Frekuensi</label>
              <span className="text-xs text-indigo-400 font-mono">{frequency.toFixed(1)} Hz</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-indigo-500" 
              min="0.1" max="10" step="0.1" 
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Tampilkan Penanda (Titik)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={slowMotion}
                  onChange={(e) => setSlowMotion(e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Gerakan Lambat (Slow-mo)</span>
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button 
            onClick={resetSimulation}
            className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset Simulasi
          </button>
        </div>
      </div>
    </div>
  );
}
