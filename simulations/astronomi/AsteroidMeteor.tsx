"use client";

import { useState, useEffect } from "react";

export default function AsteroidMeteor() {
  const [meteors, setMeteors] = useState<{id:number, x:number, y:number, size:number, isAtmosphere:boolean, burned:boolean}[]>([]);

  const triggerMeteor = () => {
     const newMeteor = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: -10, // start above
        size: Math.random() * 4 + 2,
        isAtmosphere: false,
        burned: false
     };
     setMeteors(prev => [...prev, newMeteor]);
  };

  // Simple fall animation tick
  useEffect(() => {
     const interval = setInterval(() => {
        setMeteors(prev => prev.map(m => {
           if (m.burned) return m;
           
           const newY = m.y + 2; // fall speed
           const isAtmo = newY > 30; // Atmosphere boundary
           const willBurn = isAtmo && m.size < 4; // small ones burn up
           const burned = newY > 60 && willBurn;

           return { ...m, y: newY, isAtmosphere: isAtmo, burned };
        }).filter(m => m.y < 120)); // remove if off screen bottom
     }, 50);
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Meteoroid, Meteor & Meteorit</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Apa bedanya batuan luar angkasa ini?
        </p>

        <div className="w-full max-w-3xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px]">
           
           {/* Space (Top) */}
           <div className="absolute top-0 left-0 right-0 h-[30%] bg-zinc-950 border-b border-zinc-800 flex items-center justify-center">
              <span className="absolute left-4 top-4 text-xs font-bold text-zinc-500 uppercase">Luar Angkasa (Vakum)</span>
           </div>

           {/* Atmosphere (Middle) */}
           <div className="absolute top-[30%] left-0 right-0 h-[50%] bg-gradient-to-b from-blue-950 to-blue-500/20 border-b-4 border-blue-400/50 flex justify-center pt-4">
              <span className="text-xs font-bold text-blue-300 uppercase">Atmosfer Bumi (Mesosfer)</span>
           </div>

           {/* Ground (Bottom) */}
           <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-emerald-900 border-t-8 border-emerald-700 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-300 uppercase">Permukaan Bumi (Kawah)</span>
              
              {/* Crater illustration based on meteors hitting */}
              {meteors.filter(m => !m.burned && m.y > 80).map(m => (
                 <div key={m.id} className="absolute bottom-4 w-12 h-4 bg-black/50 rounded-[100%] border-t border-emerald-800" style={{ left: `${m.x}%`, transform: 'translateX(-50%)' }} />
              ))}
           </div>

           {/* The Meteors Rendering */}
           {meteors.map(m => {
              if (m.burned && m.y < 120) {
                 // Small poof animation
                 return <div key={m.id} className="absolute w-8 h-8 bg-orange-500/50 rounded-full blur-md animate-ping" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }} />;
              }

              return (
                 <div key={m.id} className="absolute" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }}>
                    {/* The rock */}
                    <div className="bg-zinc-400 rounded-sm rotate-45" style={{ width: m.size * 3, height: m.size * 3 }} />
                    
                    {/* Fire tail if in atmosphere */}
                    {m.isAtmosphere && (
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-t from-orange-500 to-transparent blur-[1px]" style={{ height: m.size * 15 }} />
                    )}
                    {/* Glow */}
                    {m.isAtmosphere && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-orange-500 rounded-full blur-sm scale-150 mix-blend-screen" />
                    )}
                 </div>
              );
           })}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Terminologi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button 
             onClick={triggerMeteor}
             className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-all active:scale-95"
          >
             ☄️ Jatuhkan Batuan
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
             <div className="bg-zinc-900 p-3 rounded border border-zinc-700">
                <span className="font-bold text-white block mb-1">1. Meteoroid (-OID)</span>
                <span className="text-zinc-400 text-xs">Batuan luar angkasa yang masih melayang bebas di ruang hampa (belum masuk bumi). Ukurannya lebih kecil dari Asteroid.</span>
             </div>
             
             <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30">
                <span className="font-bold text-orange-400 block mb-1">2. Meteor (Bintang Jatuh)</span>
                <span className="text-blue-200 text-xs">Meteoroid yang tertarik gravitasi dan masuk ke atmosfer Bumi. Gesekan dengan udara membuatnya sangat panas, terbakar, dan bercahaya. Mayoritas habis terbakar di sini.</span>
             </div>

             <div className="bg-emerald-900/30 p-3 rounded border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block mb-1">3. Meteorit (-IT)</span>
                <span className="text-emerald-200 text-xs">Sisa meteor besar yang tidak habis terbakar dan akhirnya menabrak permukaan Bumi (membentuk kawah).</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
