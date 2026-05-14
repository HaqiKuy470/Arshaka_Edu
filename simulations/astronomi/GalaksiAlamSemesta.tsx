"use client";

import { useState } from "react";

export default function GalaksiAlamSemesta() {
  const [scale, setScale] = useState(0); // 0 to 4

  const cosmicScales = [
     { level: "Sistem Tata Surya", size: "Bumi hingga Neptunus", img: "🪐", desc: "Rumah kecil kita. Jarak dari Bumi ke Neptunus sekitar 4.3 Milyar km. Cahaya butuh 4 jam untuk mencapainya." },
     { level: "Awan Oort & Tetangga", size: "Alpha Centauri", img: "✨", desc: "Sistem bintang terdekat adalah Alpha Centauri. Jaraknya 4.3 Tahun Cahaya (Cahaya butuh 4.3 tahun berjalan ke sana)." },
     { level: "Galaksi Bima Sakti (Milky Way)", size: "100.000 Tahun Cahaya", img: "🌌", desc: "Kumpulan 100-400 Milyar bintang, gas, dan debu yang disatukan oleh gravitasi Lubang Hitam Supermasif (Sagittarius A*) di pusatnya." },
     { level: "Grup Lokal & Supergugus Virgo", size: "Puluhan Juta Tahun Cahaya", img: "🕸️", desc: "Bima Sakti bertetangga dengan Galaksi Andromeda dalam Grup Lokal, yang merupakan bagian kecil dari Supergugus Laniakea raksasa." },
     { level: "Alam Semesta Teramati", size: "93 Milyar Tahun Cahaya", img: "👁️", desc: "Batas terjauh yang cahayanya punya cukup waktu sejak Big Bang (13.8 Milyar tahun lalu) untuk mencapai teleskop kita di Bumi." }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Skala Alam Semesta</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Memahami betapa kecilnya kita di tengah lautan kosmos yang tak bertepi.
        </p>

        <div className="w-full max-w-4xl bg-black border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[450px] flex flex-col items-center justify-center overflow-hidden">
           
           {/* Deep Space Background */}
           <div className="absolute inset-0 opacity-40 transition-all duration-1000" style={{
              backgroundImage: scale >= 2 ? 'radial-gradient(circle at center, #1e1b4b 0%, black 100%)' : 'none'
           }} />

           {/* Visualization based on scale */}
           <div className={`relative flex items-center justify-center w-64 h-64 transition-all duration-1000 ${scale >= 2 ? 'animate-[spin_60s_linear_infinite]' : ''}`}>
              
              {scale === 0 && (
                 <div className="relative w-full h-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full shadow-[0_0_20px_yellow]" />
                    <div className="absolute w-40 h-40 border border-blue-500/30 rounded-full" />
                    <div className="absolute w-60 h-60 border border-cyan-500/30 rounded-full" />
                 </div>
              )}

              {scale === 1 && (
                 <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_yellow] absolute" style={{ left: '40%', top: '40%' }} />
                    <div className="w-3 h-3 bg-red-400 rounded-full shadow-[0_0_10px_red] absolute" style={{ left: '70%', top: '60%' }} />
                    <div className="absolute w-full h-full border border-zinc-700/50 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                 </div>
              )}

              {scale === 2 && (
                 <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_50px_white] blur-md z-10" />
                    <svg className="absolute w-64 h-64 z-0 opacity-50" viewBox="0 0 100 100">
                       <path d="M50 50 Q80 20 90 50 Q80 80 50 50 Q20 80 10 50 Q20 20 50 50 Z" fill="none" stroke="#8b5cf6" strokeWidth="2" className="drop-shadow-[0_0_5px_#8b5cf6]" />
                       <path d="M50 50 Q20 20 50 10 Q80 20 50 50 Q80 80 50 90 Q20 80 50 50 Z" fill="none" stroke="#ec4899" strokeWidth="2" className="drop-shadow-[0_0_5px_#ec4899]" />
                    </svg>
                 </div>
              )}

              {scale === 3 && (
                 <div className="relative w-full h-full flex items-center justify-center opacity-80">
                    <div className="absolute w-4 h-4 bg-blue-300 rounded-full blur-sm" style={{ left: '30%', top: '30%' }} />
                    <div className="absolute w-6 h-6 bg-rose-300 rounded-full blur-sm" style={{ left: '60%', top: '40%' }} />
                    <div className="absolute w-8 h-8 bg-amber-300 rounded-full blur-sm" style={{ left: '40%', top: '70%' }} />
                    <div className="absolute w-3 h-3 bg-purple-300 rounded-full blur-sm" style={{ left: '70%', top: '80%' }} />
                 </div>
              )}

              {scale === 4 && (
                 <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2,2" />
                       <path d="M50 5 L50 95 M5 50 L95 50" stroke="#22d3ee" strokeWidth="0.5" />
                    </svg>
                    <div className="text-center font-mono text-[8px] text-cyan-500 absolute bg-black/50 px-2 py-1">Titik Pengamat (Bumi)</div>
                 </div>
              )}

           </div>

           <div className="mt-8 text-center z-20 bg-black/60 p-6 rounded-2xl border border-white/10 backdrop-blur-sm max-w-xl">
              <div className="text-4xl mb-2">{cosmicScales[scale].img}</div>
              <h3 className="text-2xl font-bold text-fuchsia-400 mb-1">{cosmicScales[scale].level}</h3>
              <div className="text-sm font-bold text-zinc-500 mb-4">{cosmicScales[scale].size}</div>
              <p className="text-zinc-300 text-sm leading-relaxed">{cosmicScales[scale].desc}</p>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Zoom Kosmik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col">
          
          <div className="flex-1 flex flex-col gap-2">
             {cosmicScales.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setScale(i)}
                  className={`w-full p-4 text-left rounded-xl transition-all border ${scale === i ? 'bg-fuchsia-900 border-fuchsia-500 text-white shadow-lg scale-105' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                >
                   <div className="font-bold text-sm">{s.level}</div>
                </button>
             ))}
          </div>

          <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed mt-6">
             <p className="font-bold mb-1">Tahun Cahaya (Light Year)</p>
             <p>Bukan satuan waktu, melainkan <strong>satuan jarak</strong>. 1 Tahun Cahaya = jarak yang ditempuh cahaya selama setahun penuh, yaitu sekitar <strong>9.4 Triliun Kilometer</strong>!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
