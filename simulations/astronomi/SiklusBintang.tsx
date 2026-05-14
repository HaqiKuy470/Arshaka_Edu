"use client";

import { useState } from "react";

export default function SiklusBintang() {
  const [massType, setMassType] = useState<"rendah"|"tinggi">("rendah");
  const [stage, setStage] = useState<0|1|2|3|4>(0);

  const lowMassStages = [
     { name: "Nebula Bintang", icon: "🌌", color: "text-indigo-300", desc: "Awan raksasa debu dan gas hidrogen di luar angkasa mulai runtuh karena gravitasinya sendiri." },
     { name: "Protobintang & Bintang Deret Utama", icon: "⭐", color: "text-yellow-400", desc: "Suhu inti cukup panas untuk fusi nuklir (Hidrogen menjadi Helium). Bintang stabil seperti Matahari kita (akan bertahan milyaran tahun)." },
     { name: "Raksasa Merah", icon: "🔴", color: "text-red-500", desc: "Kehabisan hidrogen di inti. Bintang membengkak membesar dan mendingin permukaannya, menelan planet-planet terdekat." },
     { name: "Nebula Planeter", icon: "🫧", color: "text-cyan-400", desc: "Lapisan luar bintang terlepas dan mengembang ke luar angkasa membentuk awan gas yang indah." },
     { name: "Katai Putih", icon: "⚪", color: "text-white", desc: "Sisa inti bintang yang sangat padat, seukuran Bumi tetapi sangat berat. Bercahaya redup hingga akhirnya mati." }
  ];

  const highMassStages = [
     { name: "Nebula Bintang", icon: "🌌", color: "text-indigo-300", desc: "Awan debu dan gas yang sangat masif runtuh dengan cepat." },
     { name: "Bintang Raksasa Biru", icon: "🔵", color: "text-blue-400", desc: "Bintang super masif, sangat panas, dan boros bahan bakar. Hanya hidup beberapa juta tahun (sangat singkat untuk ukuran bintang)." },
     { name: "Super raksasa Merah", icon: "⭕", color: "text-red-600", desc: "Membengkak menjadi ukuran yang sangat mengerikan. Di intinya mulai membentuk elemen berat seperti besi." },
     { name: "Supernova", icon: "💥", color: "text-amber-500", desc: "Ledakan paling dahsyat di alam semesta. Inti runtuh dalam hitungan detik lalu memantul menghancurkan seluruh bintang." },
     { name: "Bintang Neutron / Lubang Hitam", icon: "⚫", color: "text-zinc-500", desc: "Jika sangat padat menjadi Bintang Neutron (berputar super cepat/Pulsar). Jika terlalu masif, gravitasi menang dan menjadi Lubang Hitam (Black Hole)." }
  ];

  const currentStages = massType === "rendah" ? lowMassStages : highMassStages;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Siklus Hidup Bintang</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bintang dilahirkan, hidup, dan mati. Takdir mereka ditentukan oleh massa awalnya.
        </p>

        <div className="flex justify-center mb-8 w-full max-w-sm">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => {setMassType("rendah"); setStage(0)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${massType === 'rendah' ? 'bg-yellow-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Massa Rendah/Sedang (Matahari)</button>
              <button onClick={() => {setMassType("tinggi"); setStage(0)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${massType === 'tinggi' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Massa Tinggi (Raksasa)</button>
           </div>
        </div>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[350px] flex flex-col items-center justify-center">
           
           <div className="text-8xl mb-8 animate-[pulse_2s_infinite]">
              {currentStages[stage].icon}
           </div>
           
           <div className="text-center max-w-lg">
              <h3 className={`text-3xl font-black mb-4 ${currentStages[stage].color}`}>{currentStages[stage].name}</h3>
              <p className="text-zinc-300 text-lg leading-relaxed">{currentStages[stage].desc}</p>
           </div>

        </div>

        {/* Timeline Navigation */}
        <div className="w-full max-w-3xl mt-8 flex justify-between relative px-4">
           {/* Connecting Line */}
           <div className="absolute top-4 left-8 right-8 h-1 bg-zinc-800 -z-10" />
           <div className="absolute top-4 left-8 h-1 bg-emerald-500 -z-10 transition-all duration-500" style={{ width: `calc(${(stage / 4) * 100}% - 40px)` }} />
           
           {currentStages.map((s, i) => (
              <button 
                key={i}
                onClick={() => setStage(i as any)}
                className={`flex flex-col items-center gap-2 group`}
              >
                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${stage >= i ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500 group-hover:border-zinc-500'}`}>
                    {i + 1}
                 </div>
                 <div className={`text-[10px] md:text-xs font-bold max-w-[60px] text-center ${stage === i ? 'text-white' : 'text-zinc-500'}`}>
                    Tahap {i+1}
                 </div>
              </button>
           ))}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fisika Bintang</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4 text-sm text-zinc-300 leading-relaxed">
             <h4 className="font-bold text-white border-b border-zinc-700 pb-2">Keseimbangan Hidrostatik</h4>
             <p>Selama hidupnya, bintang mengalami tarik-menarik 2 kekuatan ekstrim:</p>
             <ul className="list-disc pl-4 space-y-1 text-xs">
                <li><strong className="text-rose-400">Gravitasi:</strong> Menarik semua materi ke dalam (ingin menghancurkan bintang).</li>
                <li><strong className="text-blue-400">Fusi Nuklir:</strong> Mendorong ledakan panas ke luar.</li>
             </ul>
             <p>Saat bahan bakar (Hidrogen/Helium) habis, fusi berhenti, gravitasi menang mutlak, dan bintang pun mati runtuh ke intinya sendiri.</p>
          </div>

          <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-500/30 text-xs text-amber-200/80 leading-relaxed">
             <p className="font-bold text-amber-400 mb-1">Kita Berasal dari Bintang</p>
             <p>Hampir semua unsur berat di tubuh kita (Besi di darah, Kalsium di tulang, Karbon) ditempa di dalam inti bintang raksasa dan disebarkan ke alam semesta saat ledakan <strong>Supernova</strong>!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
