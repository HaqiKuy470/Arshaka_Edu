"use client";

import { useState } from "react";

export default function StrukturBumi() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      id: 0,
      name: "Kerak Bumi (Crust)",
      depth: "0 - 70 km",
      temp: "~ 20°C hingga 400°C",
      desc: "Lapisan terluar, tertipis, dan paling keras tempat kita hidup. Terdiri dari Kerak Benua (granit) dan Kerak Samudra (basalt).",
      color: "bg-zinc-500",
      stroke: "#71717a",
      fill: "#a1a1aa",
      radius: 190
    },
    {
      id: 1,
      name: "Mantel (Mantle)",
      depth: "70 - 2,900 km",
      temp: "1,000°C hingga 3,700°C",
      desc: "Lapisan paling tebal (84% volume bumi). Terdiri dari batuan silikat padat namun sangat panas sehingga bisa bergerak lambat seperti plastisin (arus konveksi).",
      color: "bg-orange-600",
      stroke: "#c2410c",
      fill: "#ea580c",
      radius: 180
    },
    {
      id: 2,
      name: "Inti Luar (Outer Core)",
      depth: "2,900 - 5,150 km",
      temp: "4,000°C hingga 5,000°C",
      desc: "Berwujud cair! Terdiri dari lelehan besi dan nikel yang berputar sangat cepat. Perputarannya menciptakan Medan Magnet Bumi yang melindungi kita dari radiasi matahari.",
      color: "bg-amber-500",
      stroke: "#d97706",
      fill: "#f59e0b",
      radius: 100
    },
    {
      id: 3,
      name: "Inti Dalam (Inner Core)",
      depth: "5,150 - 6,371 km",
      temp: "~ 6,000°C (Sepanas permukaan matahari)",
      desc: "Berwujud padat keras meskipun sangat panas! Hal ini karena tekanan di pusat bumi sangat luar biasa tinggi sehingga besi dan nikel tidak bisa mencair.",
      color: "bg-yellow-300",
      stroke: "#eab308",
      fill: "#fde047",
      radius: 40
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
           <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              {/* Draw in reverse so outer is behind inner */}
              {[...layers].map((layer, index) => {
                 const isHovered = activeLayer === layer.id;
                 return (
                   <circle 
                     key={layer.id}
                     cx="200" cy="200" 
                     r={layer.radius} 
                     fill={layer.fill} 
                     stroke={layer.stroke} 
                     strokeWidth="2"
                     className="cursor-pointer transition-all duration-300"
                     style={{
                        transformOrigin: 'center',
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        opacity: activeLayer !== null && !isHovered ? 0.5 : 1
                     }}
                     onMouseEnter={() => setActiveLayer(layer.id)}
                     onMouseLeave={() => setActiveLayer(null)}
                   />
                 );
              })}
              
              {/* Highlight Cutout Section for visual effect */}
              <path 
                d="M 200 200 L 200 0 A 200 200 0 0 1 341 58 Z" 
                fill="rgba(0,0,0,0.3)" 
                pointerEvents="none"
              />
           </svg>

           {/* Floating info when hovered */}
           {activeLayer !== null && (
             <div className="absolute top-4 left-4 bg-black/80 p-4 rounded-xl border border-white/20 backdrop-blur-md max-w-[200px] pointer-events-none z-10 animate-fade-in">
                <div className="font-bold text-white mb-1">{layers[activeLayer].name}</div>
                <div className="text-xs text-amber-400 font-mono">{layers[activeLayer].temp}</div>
             </div>
           )}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Struktur Lapisan Bumi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {layers.map(layer => (
             <div 
               key={layer.id} 
               onMouseEnter={() => setActiveLayer(layer.id)}
               onMouseLeave={() => setActiveLayer(null)}
               className={`p-4 rounded-xl border transition-all cursor-pointer ${activeLayer === layer.id ? `${layer.color} border-white shadow-lg scale-105` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
             >
                <h4 className={`font-bold text-lg mb-2 ${activeLayer === layer.id ? 'text-white' : 'text-zinc-200'}`}>{layer.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3 bg-black/30 p-2 rounded">
                   <div>
                     <span className="block opacity-60 text-[9px] uppercase">Kedalaman</span>
                     {layer.depth}
                   </div>
                   <div>
                     <span className="block opacity-60 text-[9px] uppercase">Suhu</span>
                     {layer.temp}
                   </div>
                </div>
                <p className="text-xs leading-relaxed">{layer.desc}</p>
             </div>
          ))}

        </div>
      </div>
    </div>
  );
}
