"use client";

import { useState, useEffect } from "react";

export default function TataSurya() {
  const [speed, setSpeed] = useState(1);
  const [activePlanet, setActivePlanet] = useState<string|null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
     let frame: number;
     const tick = () => {
        setTime(t => t + (0.01 * speed));
        frame = requestAnimationFrame(tick);
     };
     frame = requestAnimationFrame(tick);
     return () => cancelAnimationFrame(frame);
  }, [speed]);

  const planets = [
     { name: "Merkurius", color: "bg-zinc-400", dist: 40, size: 4, speed: 4.1, info: "Planet terkecil dan terdekat. Sangat panas di siang, sangat dingin di malam." },
     { name: "Venus", color: "bg-amber-600", dist: 65, size: 6, speed: 1.6, info: "Planet terpanas karena efek rumah kaca ekstrem. Berotasi terbalik." },
     { name: "Bumi", color: "bg-blue-500", dist: 95, size: 7, speed: 1, info: "Satu-satunya planet yang diketahui memiliki kehidupan dan air cair." },
     { name: "Mars", color: "bg-red-500", dist: 130, size: 5, speed: 0.5, info: "Planet Merah. Memiliki gunung tertinggi di tata surya (Olympus Mons)." },
     { name: "Jupiter", color: "bg-orange-300", dist: 180, size: 14, speed: 0.08, info: "Planet gas raksasa terbesar. Memiliki Bintik Merah Raksasa (badai abadi)." },
     { name: "Saturnus", color: "bg-yellow-200", dist: 230, size: 12, speed: 0.03, info: "Memiliki cincin spektakuler yang terbuat dari es dan debu." },
     { name: "Uranus", color: "bg-cyan-300", dist: 270, size: 9, speed: 0.01, info: "Planet es raksasa yang menggelinding (poros rotasinya miring ekstrem)." },
     { name: "Neptunus", color: "bg-blue-700", dist: 310, size: 8, speed: 0.006, info: "Planet terjauh. Sangat dingin dengan angin tercepat di tata surya." },
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-hidden">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center z-10">Sistem Tata Surya</h2>
        <p className="text-zinc-400 mb-4 text-center max-w-lg mx-auto z-10">
           Matahari dan 8 planet yang mengorbitnya (Skala jarak diperkecil).
        </p>

        <div className="flex-1 w-full bg-black border border-white/10 rounded-3xl shadow-2xl relative flex items-center justify-center overflow-hidden">
           
           {/* Stars Background */}
           <div className="absolute inset-0 opacity-50" style={{
              backgroundImage: 'radial-gradient(1px 1px at 10% 20%, white, transparent), radial-gradient(1px 1px at 40% 70%, white, transparent), radial-gradient(2px 2px at 80% 30%, white, transparent), radial-gradient(1px 1px at 60% 80%, white, transparent)',
              backgroundSize: '100px 100px'
           }} />

           {/* The Sun */}
           <div className="absolute w-16 h-16 bg-yellow-500 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.8)] z-10 flex items-center justify-center animate-[pulse_3s_infinite]">
              <div className="w-12 h-12 bg-yellow-300 rounded-full blur-sm" />
           </div>

           {/* Orbits and Planets */}
           {planets.map((p, i) => {
              const angle = time * p.speed;
              const x = Math.cos(angle) * p.dist;
              const y = Math.sin(angle) * p.dist;
              const isHovered = activePlanet === p.name;

              return (
                 <div key={p.name} className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
                    
                    {/* Orbit Ring */}
                    <div 
                      className={`absolute rounded-full border border-white/10 transition-colors ${isHovered ? 'border-white/50' : ''}`}
                      style={{ 
                         width: p.dist * 2, height: p.dist * 2, 
                         transform: 'translate(-50%, -50%)' 
                      }} 
                    />

                    {/* Planet */}
                    <div 
                      className={`absolute rounded-full cursor-pointer hover:scale-150 transition-transform ${p.color} ${isHovered ? 'shadow-[0_0_15px_white]' : ''}`}
                      style={{ 
                         width: p.size, height: p.size, 
                         transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                         zIndex: 20
                      }}
                      onMouseEnter={() => setActivePlanet(p.name)}
                      onMouseLeave={() => setActivePlanet(null)}
                    >
                       {/* Saturn's Ring */}
                       {p.name === "Saturnus" && (
                          <div className="absolute top-1/2 left-1/2 w-[250%] h-[5px] bg-yellow-100/50 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-12" />
                       )}
                    </div>

                    {/* Planet Label if Hovered */}
                    {isHovered && (
                       <div 
                         className="absolute bg-black/80 px-2 py-1 rounded text-xs text-white border border-white/20 whitespace-nowrap pointer-events-none z-30"
                         style={{ 
                            transform: `translate(calc(${x}px + 10px), calc(${y}px - 10px))` 
                         }}
                       >
                          {p.name}
                       </div>
                    )}
                 </div>
              );
           })}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Eksplorasi Planet</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kecepatan Orbit (Waktu)</div>
             <input type="range" min="0" max="10" step="0.1" value={speed} onChange={e=>setSpeed(parseFloat(e.target.value))} className="w-full accent-blue-500" />
             <div className="text-center text-sm font-bold text-white">{speed}x Normal</div>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Informasi Benda Langit</div>
             
             {activePlanet ? (
                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                   <h4 className="font-bold text-blue-400 text-lg mb-2">{activePlanet}</h4>
                   <p className="text-sm text-zinc-300 leading-relaxed">{planets.find(p => p.name === activePlanet)?.info}</p>
                </div>
             ) : (
                <div className="p-4 bg-zinc-900 rounded-xl text-zinc-500 text-sm text-center">
                   Arahkan kursor (hover) ke salah satu planet untuk melihat detailnya.
                </div>
             )}
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed space-y-2">
             <p><strong>Fakta Menarik:</strong></p>
             <ul className="list-disc pl-4 space-y-1">
                <li>Merkurius mengorbit paling cepat (88 hari bumi).</li>
                <li>Neptunus butuh 165 tahun bumi untuk sekali mengelilingi matahari!</li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
