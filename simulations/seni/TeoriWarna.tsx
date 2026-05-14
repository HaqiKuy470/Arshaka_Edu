"use client";

import { useState } from "react";

export default function TeoriWarna() {
  const [activeTab, setActiveTab] = useState<"rgb"|"cmyk">("rgb");
  
  // RGB (Light / Screen)
  const [r, setR] = useState(255);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  // CMYK (Pigment / Print)
  const [c, setC] = useState(0);
  const [m, setM] = useState(100);
  const [y, setY] = useState(100);
  const [k, setK] = useState(0);

  // Derive CMYK to RGB for CSS display
  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
     const r = 255 * (1 - c/100) * (1 - k/100);
     const g = 255 * (1 - m/100) * (1 - k/100);
     const b = 255 * (1 - y/100) * (1 - k/100);
     return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const currentColor = activeTab === "rgb" ? `rgb(${r},${g},${b})` : cmykToRgb(c, m, y, k);

  const rgbPresets = [
     { name: "Merah (R)", r: 255, g: 0, b: 0 },
     { name: "Hijau (G)", r: 0, g: 255, b: 0 },
     { name: "Biru (B)", r: 0, g: 0, b: 255 },
     { name: "Kuning", r: 255, g: 255, b: 0 },
     { name: "Cyan", r: 0, g: 255, b: 255 },
     { name: "Magenta", r: 255, g: 0, b: 255 },
     { name: "Putih", r: 255, g: 255, b: 255 },
     { name: "Hitam", r: 0, g: 0, b: 0 },
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Teori Warna (Color Theory)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Eksplorasi percampuran warna cahaya (Layar) vs warna pigmen (Tinta/Cat).
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg">
              <button 
                 onClick={() => setActiveTab("rgb")}
                 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'rgb' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                 💡 RGB (Cahaya Layar)
              </button>
              <button 
                 onClick={() => setActiveTab("cmyk")}
                 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'cmyk' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                 🎨 CMYK (Tinta Cetak)
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">
           
           {/* Color Display Canvas */}
           <div className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
              
              <div 
                 className="w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-colors duration-200 border-4 border-zinc-800 relative overflow-hidden"
                 style={{ backgroundColor: currentColor }}
              >
                 {/* Shine effect */}
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
              </div>

              <div className="mt-8 bg-black px-6 py-2 rounded-xl border border-zinc-800 text-white font-mono font-bold text-xl tracking-widest shadow-inner">
                 {currentColor}
              </div>

           </div>

           {/* Sliders Control */}
           <div className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
              
              {activeTab === "rgb" && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-zinc-300 border-b border-zinc-800 pb-2 mb-4">Aditif (Cahaya ditambahkan)</h3>
                    
                    <div>
                       <div className="flex justify-between text-rose-500 font-bold mb-2"><span>Red (Merah)</span> <span>{r}</span></div>
                       <input type="range" min="0" max="255" value={r} onChange={e=>setR(parseInt(e.target.value))} className="w-full accent-rose-500" />
                    </div>
                    <div>
                       <div className="flex justify-between text-emerald-500 font-bold mb-2"><span>Green (Hijau)</span> <span>{g}</span></div>
                       <input type="range" min="0" max="255" value={g} onChange={e=>setG(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                    </div>
                    <div>
                       <div className="flex justify-between text-blue-500 font-bold mb-2"><span>Blue (Biru)</span> <span>{b}</span></div>
                       <input type="range" min="0" max="255" value={b} onChange={e=>setB(parseInt(e.target.value))} className="w-full accent-blue-500" />
                    </div>

                    <div className="pt-6">
                       <div className="text-xs text-zinc-500 mb-2 font-bold uppercase">Presets RGB:</div>
                       <div className="flex flex-wrap gap-2">
                          {rgbPresets.map(p => (
                             <button 
                                key={p.name}
                                onClick={()=>{setR(p.r); setG(p.g); setB(p.b);}}
                                className="px-3 py-1 bg-black border border-zinc-700 text-xs text-zinc-300 rounded hover:bg-zinc-800 transition-all"
                             >
                                {p.name}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === "cmyk" && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-zinc-300 border-b border-zinc-800 pb-2 mb-4">Subtraktif (Pigmen menyerap cahaya)</h3>
                    
                    <div>
                       <div className="flex justify-between text-cyan-400 font-bold mb-2"><span>Cyan (Biru Muda)</span> <span>{c}%</span></div>
                       <input type="range" min="0" max="100" value={c} onChange={e=>setC(parseInt(e.target.value))} className="w-full accent-cyan-400" />
                    </div>
                    <div>
                       <div className="flex justify-between text-fuchsia-500 font-bold mb-2"><span>Magenta (Merah Muda)</span> <span>{m}%</span></div>
                       <input type="range" min="0" max="100" value={m} onChange={e=>setM(parseInt(e.target.value))} className="w-full accent-fuchsia-500" />
                    </div>
                    <div>
                       <div className="flex justify-between text-yellow-400 font-bold mb-2"><span>Yellow (Kuning)</span> <span>{y}%</span></div>
                       <input type="range" min="0" max="100" value={y} onChange={e=>setY(parseInt(e.target.value))} className="w-full accent-yellow-400" />
                    </div>
                    <div className="border-t border-zinc-800 pt-4">
                       <div className="flex justify-between text-zinc-500 font-bold mb-2"><span>Key (Black / Hitam)</span> <span>{k}%</span></div>
                       <input type="range" min="0" max="100" value={k} onChange={e=>setK(parseInt(e.target.value))} className="w-full accent-zinc-500" />
                    </div>
                 </div>
              )}

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Konsep Warna</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="p-4 bg-blue-950/30 rounded-xl border border-blue-900/50">
                <h4 className="font-bold text-blue-400 text-sm mb-2">RGB (Aditif)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">Digunakan pada layar HP, TV, dan Monitor. Dasar warnanya adalah Gelap/Hitam. Cahaya Merah + Hijau + Biru jika dicampur maksimal (255) akan menghasilkan warna <strong>PUTIH</strong>.</p>
             </div>
             
             <div className="p-4 bg-fuchsia-950/30 rounded-xl border border-fuchsia-900/50">
                <h4 className="font-bold text-fuchsia-400 text-sm mb-2">CMYK (Subtraktif)</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">Digunakan pada printer dan seni lukis. Dasar warnanya adalah Putih (Kertas). Tinta Cyan + Magenta + Yellow jika dicampur akan menghasilkan warna Gelap. Warna K (Hitam) ditambahkan untuk menghemat tinta CMY.</p>
             </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 mt-4">
             <p><strong>Coba Eksperimen:</strong></p>
             <ul className="list-disc pl-4 space-y-1">
                <li>Di RGB, campur Red + Green maksimal. Kamu akan dapat Kuning Terang!</li>
                <li>Di CMYK, campur Cyan + Yellow. Kamu akan dapat Hijau!</li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
