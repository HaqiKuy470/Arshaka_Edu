"use client";

import { useState } from "react";

export default function TubuhManusia() {
  const [system, setSystem] = useState<"digestive" | "respiratory" | "circulatory">("digestive");

  const data = {
    digestive: {
      name: "Sistem Pencernaan",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      organs: [
        { name: "Mulut & Kerongkongan", desc: "Menghancurkan makanan secara mekanik dan mengalirkannya ke lambung." },
        { name: "Lambung", desc: "Mencerna makanan secara kimiawi dengan asam lambung (HCl) dan pepsin." },
        { name: "Usus Halus", desc: "Menyerap nutrisi utama dari makanan ke dalam darah." },
        { name: "Usus Besar", desc: "Menyerap air dan membentuk sisa makanan menjadi feses." }
      ]
    },
    respiratory: {
      name: "Sistem Pernapasan",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      organs: [
        { name: "Hidung & Trakea", desc: "Menyaring, menghangatkan udara, dan menjadi saluran menuju paru-paru." },
        { name: "Paru-paru", desc: "Organ utama pernapasan yang mengembang dan mengempis." },
        { name: "Alveolus", desc: "Kantung udara kecil tempat pertukaran O₂ masuk ke darah dan CO₂ keluar." },
        { name: "Diafragma", desc: "Otot yang membantu paru-paru memompa udara." }
      ]
    },
    circulatory: {
      name: "Sistem Peredaran Darah",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      organs: [
        { name: "Jantung", desc: "Memompa darah ke seluruh tubuh tanpa henti." },
        { name: "Arteri (Nadi)", desc: "Membawa darah kaya oksigen menjauhi jantung (kecuali arteri pulmonalis)." },
        { name: "Vena (Balik)", desc: "Membawa darah kotor miskin oksigen kembali ke jantung." },
        { name: "Kapiler", desc: "Pembuluh sangat kecil tempat pertukaran zat langsung dengan sel." }
      ]
    }
  };

  const current = data[system];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Silhouette / Representation */}
        <div className="relative w-48 h-96 border-2 border-white/20 rounded-[100px] overflow-hidden flex items-center justify-center bg-black/50">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {system === 'digestive' && (
            <div className="absolute flex flex-col items-center justify-center w-full h-full top-10">
              <div className="w-4 h-16 bg-amber-200/80 rounded-full" /> {/* Esophagus */}
              <div className="w-16 h-20 bg-amber-400/80 rounded-[40%_60%_70%_30%] -ml-8 -mt-2" /> {/* Stomach */}
              <div className="w-24 h-24 bg-amber-600/80 rounded-2xl mt-2 flex items-center justify-center p-2"> {/* Intestines */}
                 <div className="w-full h-full border-4 border-amber-300 border-dashed rounded-lg" />
              </div>
            </div>
          )}

          {system === 'respiratory' && (
            <div className="absolute flex flex-col items-center justify-center w-full h-full top-4">
              <div className="w-3 h-16 bg-sky-200/80 rounded-full" /> {/* Trachea */}
              <div className="flex gap-2">
                <div className="w-16 h-24 bg-sky-400/80 rounded-[40%_60%_40%_60%]" /> {/* L Lung */}
                <div className="w-16 h-24 bg-sky-400/80 rounded-[60%_40%_60%_40%]" /> {/* R Lung */}
              </div>
              <div className="w-32 h-4 bg-sky-600/80 rounded-full mt-2" /> {/* Diaphragm */}
            </div>
          )}

          {system === 'circulatory' && (
            <div className="absolute flex flex-col items-center justify-center w-full h-full">
              {/* Heart */}
              <div className="w-12 h-12 bg-rose-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)] z-10" /> 
              {/* Vessels */}
              <div className="absolute w-1 h-64 bg-rose-500/60 left-1/2 -ml-4" />
              <div className="absolute w-1 h-64 bg-blue-500/60 left-1/2 ml-4" />
              <div className="absolute w-32 h-1 bg-rose-500/60 top-1/2 -mt-10" />
              <div className="absolute w-32 h-1 bg-blue-500/60 top-1/2 -mt-6" />
            </div>
          )}

          {/* Head Shape */}
          <div className="absolute top-0 w-24 h-24 border-b-2 border-white/20 rounded-full bg-black/50" />
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Tubuh Manusia</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex flex-col gap-2">
            <button onClick={() => setSystem("digestive")} className={`py-2 rounded-lg font-medium transition-colors border ${system === 'digestive' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-transparent text-zinc-400 border-white/10 hover:bg-white/5'}`}>Pencernaan</button>
            <button onClick={() => setSystem("respiratory")} className={`py-2 rounded-lg font-medium transition-colors border ${system === 'respiratory' ? 'bg-sky-500/20 text-sky-400 border-sky-500/50' : 'bg-transparent text-zinc-400 border-white/10 hover:bg-white/5'}`}>Pernapasan</button>
            <button onClick={() => setSystem("circulatory")} className={`py-2 rounded-lg font-medium transition-colors border ${system === 'circulatory' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-transparent text-zinc-400 border-white/10 hover:bg-white/5'}`}>Peredaran Darah</button>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" key={system}>
            <h4 className={`text-xl font-bold ${current.color}`}>{current.name}</h4>
            
            <div className="space-y-3">
              {current.organs.map((org, i) => (
                <div key={i} className={`p-3 rounded-xl border ${current.bg} ${current.border}`}>
                  <div className="font-bold text-white mb-1 text-sm">{org.name}</div>
                  <div className="text-xs text-zinc-300 leading-relaxed">{org.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
