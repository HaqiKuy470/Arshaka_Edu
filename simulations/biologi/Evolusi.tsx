"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";

export default function Evolusi() {
  // Background environment: 0 = light environment, 100 = dark environment
  const [environment, setEnvironment] = useState(50);
  
  // Bug populations (Light vs Dark bugs)
  const [generation, setGeneration] = useState(1);
  const [lightBugs, setLightBugs] = useState(50);
  const [darkBugs, setDarkBugs] = useState(50);

  const simulateGeneration = () => {
    // Survival probability based on camouflage
    // If environment is 0 (light), light bugs survive 90%, dark survive 10%
    // If environment is 100 (dark), dark bugs survive 90%, light survive 10%
    
    const lightSurvivalRate = 1 - (environment / 100) * 0.8; 
    const darkSurvivalRate = 0.2 + (environment / 100) * 0.8;

    let newLight = Math.floor(lightBugs * lightSurvivalRate * 1.5);
    let newDark = Math.floor(darkBugs * darkSurvivalRate * 1.5);

    // Carrying capacity cap to 100 total
    const total = newLight + newDark;
    if (total > 100) {
      newLight = Math.floor((newLight / total) * 100);
      newDark = Math.floor((newDark / total) * 100);
    }
    
    // Extinction prevention (min 0)
    if (newLight < 0) newLight = 0;
    if (newDark < 0) newDark = 0;

    setLightBugs(newLight);
    setDarkBugs(newDark);
    setGeneration(g => g + 1);
  };

  const reset = () => {
    setGeneration(1);
    setLightBugs(50);
    setDarkBugs(50);
    setEnvironment(50);
  };

  // Generate visual bugs array
  const visualBugs = [
    ...Array(Math.min(50, lightBugs)).fill('light'),
    ...Array(Math.min(50, darkBugs)).fill('dark')
  ].sort(() => Math.random() - 0.5);

  const bgLightness = 90 - (environment * 0.7); // 90% (light) to 20% (dark)

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Environment Canvas */}
        <div 
          className="w-full max-w-2xl h-80 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 transition-colors duration-500"
          style={{ backgroundColor: `hsl(120, 20%, ${bgLightness}%)` }} // Grassy tone
        >
          {/* Display Bugs */}
          <div className="absolute inset-0 p-4 flex flex-wrap gap-2 content-start">
            {visualBugs.map((type, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full ${type === 'light' ? 'bg-slate-200 border border-slate-400' : 'bg-slate-800 border border-black'} shadow-sm`}
                style={{ 
                  transform: `rotate(${Math.random() * 360}deg)`,
                  marginLeft: `${Math.random() * 10}px` 
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-bold px-3 py-1 bg-black/40 text-white rounded-lg backdrop-blur-sm">
            <span>Generasi: {generation}</span>
            <span>Total Serangga: {lightBugs + darkBugs}</span>
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Seleksi Alam & Evolusi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Warna Lingkungan (Pohon)</label></div>
            <input 
              type="range" 
              className="w-full accent-zinc-500" 
              min="0" max="100" 
              value={environment} 
              onChange={(e) => setEnvironment(parseInt(e.target.value))} 
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Terang</span>
              <span>Gelap</span>
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-200 text-black p-3 rounded-lg">
              <span className="font-bold">Serangga Terang</span>
              <span className="font-mono text-xl">{lightBugs}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-800 text-white border border-white/10 p-3 rounded-lg">
              <span className="font-bold">Serangga Gelap</span>
              <span className="font-mono text-xl">{darkBugs}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button onClick={simulateGeneration} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors text-white">
              Lanjut Generasi +1
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RefreshCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
            Burung pemangsa akan lebih mudah melihat dan memakan serangga yang warnanya kontras dengan lingkungan. Seiring waktu, populasi beradaptasi (Seleksi Alam).
          </p>

        </div>
      </div>
    </div>
  );
}
