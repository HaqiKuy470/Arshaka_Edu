"use client";

import { useState } from "react";

export default function ArusLaut() {
  const [activeCurrent, setActiveCurrent] = useState<number | null>(null);

  // Simplified major ocean currents
  const currents = [
    { id: 1, name: "Arus Teluk (Gulf Stream)", temp: "panas", type: "Permukaan", desc: "Membawa air panas dari Karibia ke Eropa Barat. Membuat iklim Eropa menjadi lebih hangat dibanding wilayah lain di lintang yang sama.", x: 280, y: 150, rotate: -45 },
    { id: 2, name: "Arus Peru (Humboldt)", temp: "dingin", type: "Permukaan", desc: "Arus dingin dari Antartika menyusuri pesisir barat Amerika Selatan. Membawa banyak nutrisi dan membuat laut kaya ikan, namun menyebabkan pesisir menjadi gurun kering (Gurun Atacama).", x: 220, y: 280, rotate: -80 },
    { id: 3, name: "Arus Kuroshio", temp: "panas", type: "Permukaan", desc: "Arus panas di sebelah timur Jepang. Membawa air hangat ke utara dan sering memicu topan.", x: 70, y: 160, rotate: -30 },
    { id: 4, name: "Sabuk Konveyor Termohalin", temp: "dalam", type: "Dalam (Global)", desc: "Sirkulasi air laut dalam yang digerakkan oleh perbedaan Suhu (Termo) dan Salinitas/Garam (Halin). Perjalanan satu siklus penuh memakan waktu sekitar 1.000 tahun!", x: 200, y: 200, rotate: 0 }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="relative w-full max-w-[600px] aspect-[2/1] bg-[#0f172a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
           
           {/* Abstract World Map SVG */}
           <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              {/* Americas */}
              <path d="M 230 40 Q 200 80 230 110 Q 250 150 240 190 L 260 190 Q 280 150 250 110 Q 280 70 260 40 Z" fill="#64748b" />
              {/* Eurasia / Africa */}
              <path d="M 280 30 Q 320 80 300 130 Q 320 180 350 180 Q 370 140 330 100 Q 380 50 350 30 Z" fill="#64748b" />
              {/* Asia / Australia (left side, wrapping) */}
              <path d="M 0 40 Q 50 80 30 120 Q 80 140 50 180 Q 20 150 0 160 Z" fill="#64748b" />
           </svg>

           {/* Ocean Current Arrows */}
           <div className="absolute inset-0 p-4">
              {/* Gulf Stream (Red) */}
              <div 
                className={`absolute w-16 h-2 bg-gradient-to-r from-red-600/0 to-red-500 rounded-full cursor-pointer transition-all duration-300 ${activeCurrent === 1 ? 'scale-150 drop-shadow-[0_0_10px_red] z-10' : 'opacity-70 hover:opacity-100'}`}
                style={{ top: '30%', left: '60%', transform: 'rotate(-45deg)' }}
                onMouseEnter={()=>setActiveCurrent(1)} onMouseLeave={()=>setActiveCurrent(null)}
              >
                 <div className="absolute -right-2 -top-2 text-red-500 font-bold text-xs">▶</div>
              </div>

              {/* Peru Current (Blue) */}
              <div 
                className={`absolute w-16 h-2 bg-gradient-to-r from-blue-500 to-blue-600/0 rounded-full cursor-pointer transition-all duration-300 ${activeCurrent === 2 ? 'scale-150 drop-shadow-[0_0_10px_blue] z-10' : 'opacity-70 hover:opacity-100'}`}
                style={{ top: '70%', left: '55%', transform: 'rotate(-80deg)' }}
                onMouseEnter={()=>setActiveCurrent(2)} onMouseLeave={()=>setActiveCurrent(null)}
              >
                 <div className="absolute -left-2 -top-2 text-blue-500 font-bold text-xs rotate-180">▶</div>
              </div>

              {/* Kuroshio (Red) */}
              <div 
                className={`absolute w-12 h-2 bg-gradient-to-r from-red-600/0 to-red-500 rounded-full cursor-pointer transition-all duration-300 ${activeCurrent === 3 ? 'scale-150 drop-shadow-[0_0_10px_red] z-10' : 'opacity-70 hover:opacity-100'}`}
                style={{ top: '40%', left: '15%', transform: 'rotate(-30deg)' }}
                onMouseEnter={()=>setActiveCurrent(3)} onMouseLeave={()=>setActiveCurrent(null)}
              >
                 <div className="absolute -right-2 -top-2 text-red-500 font-bold text-xs">▶</div>
              </div>

              {/* Thermohaline visual (Deep purple ribbon) */}
              <div 
                className={`absolute w-full h-1/2 bottom-0 left-0 border-b-4 border-dashed border-purple-500/50 rounded-b-[100%] cursor-pointer transition-all duration-300 ${activeCurrent === 4 ? 'border-purple-400 shadow-[0_20px_20px_rgba(168,85,247,0.2)] z-10' : 'opacity-40 hover:opacity-100'}`}
                onMouseEnter={()=>setActiveCurrent(4)} onMouseLeave={()=>setActiveCurrent(null)}
              />
           </div>

           {/* Instruction Overlay */}
           <div className="absolute bottom-4 left-4 text-xs text-zinc-500 font-bold">Arahkan kursor ke panah arus laut di peta.</div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Arus Laut Global</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {currents.map(curr => (
             <div 
               key={curr.id}
               onMouseEnter={()=>setActiveCurrent(curr.id)}
               onMouseLeave={()=>setActiveCurrent(null)}
               className={`p-4 rounded-xl border transition-all cursor-pointer ${activeCurrent === curr.id ? `${curr.temp === 'panas' ? 'bg-red-950/50 border-red-500/50' : curr.temp === 'dingin' ? 'bg-blue-950/50 border-blue-500/50' : 'bg-purple-950/50 border-purple-500/50'} shadow-lg scale-105` : 'bg-black/30 border-white/10 opacity-70'}`}
             >
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-white text-sm">{curr.name}</h4>
                   <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${curr.temp === 'panas' ? 'bg-red-600' : curr.temp === 'dingin' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                      {curr.temp}
                   </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{curr.desc}</p>
             </div>
          ))}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed mt-4">
            <p><strong>Arus Permukaan</strong> digerakkan oleh <strong>Angin</strong> dan perputaran bumi (Efek Coriolis).</p>
            <p className="mt-2"><strong>Arus Dalam</strong> digerakkan oleh perbedaan kepadatan air (Suhu dingin dan kadar garam tinggi membuatnya tenggelam).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
