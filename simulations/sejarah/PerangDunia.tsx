"use client";

import { useState } from "react";

export default function PerangDunia() {
  const [war, setWar] = useState<"ww1"|"ww2">("ww2");

  const data = {
    ww1: {
      title: "Perang Dunia I (1914 - 1918)",
      desc: "Disebut 'The Great War'. Perang parit berdarah di Eropa akibat sistem aliansi negara yang rumit, imperialisme, dan kebangkitan nasionalisme ekstrem.",
      trigger: "Pembunuhan Pangeran Franz Ferdinand (Pewaris takhta Austria-Hongaria) di Sarajevo oleh nasionalis Serbia.",
      alliesTitle: "Blok Sekutu (Entente)",
      allies: ["Inggris 🇬🇧", "Prancis 🇫🇷", "Rusia 🇷🇺", "Amerika Serikat 🇺🇸", "Italia 🇮🇹"],
      axisTitle: "Blok Sentral",
      axis: ["Jerman 🇩🇪", "Austria-Hongaria 🇦🇹", "Kekaisaran Ottoman 🇹🇷", "Bulgaria 🇧🇬"],
      tech: "Senjata mesin, Gas Beracun, Tank awal, Pesawat tempur awal, Kapal Selam (U-Boat).",
      aftermath: "Runtuhnya 4 Kekaisaran besar (Jerman, Rusia, Austria, Ottoman). Jerman dihukum berat lewat Perjanjian Versailles yang kelak memicu WW2.",
      color: "bg-amber-700"
    },
    ww2: {
      title: "Perang Dunia II (1939 - 1945)",
      desc: "Konflik paling mematikan dalam sejarah manusia yang melibatkan lebih dari 30 negara secara global (Eropa, Asia, Afrika).",
      trigger: "Invasi Nazi Jerman pimpinan Adolf Hitler ke Polandia pada 1 September 1939.",
      alliesTitle: "Blok Sekutu (Allies)",
      allies: ["Inggris 🇬🇧", "Uni Soviet 🇷🇺", "Amerika Serikat 🇺🇸", "Prancis 🇫🇷", "Tiongkok 🇨🇳"],
      axisTitle: "Blok Poros (Axis)",
      axis: ["Jerman Nazi 🇩🇪", "Kekaisaran Jepang 🇯🇵", "Fasis Italia 🇮🇹"],
      tech: "Blitzkrieg (Perang Kilat), Kapal Induk, Pesawat Pengebom berat, Radar, dan Senjata Pemusnah Massal (Bom Atom).",
      aftermath: "Jerman dan Jepang hancur. Lahirnya PBB (Perserikatan Bangsa-Bangsa). Dimulainya era Perang Dingin antara AS dan Uni Soviet.",
      color: "bg-rose-700"
    }
  };

  const active = data[war];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg text-center">Konflik Global</h2>

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
           
           {/* Header Info */}
           <div className={`w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-full h-2 ${active.color}`} />
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-3xl font-black text-white">{active.title}</h3>
                 <span className={`px-3 py-1 rounded text-xs font-bold text-white ${active.color}`}>Total War</span>
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed">{active.desc}</p>
           </div>

           {/* The Alliances (VS Board) */}
           <div className="w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black text-2xl w-12 h-12 flex items-center justify-center rounded-full border-4 border-zinc-900 z-10">VS</div>
              
              <div className="grid grid-cols-2 gap-12">
                 {/* Left Side (Allies) */}
                 <div>
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 border-b border-blue-900/50 pb-2 text-center md:text-left">{active.alliesTitle}</h4>
                    <ul className="space-y-2">
                       {active.allies.map((country, idx) => (
                          <li key={idx} className="bg-blue-950/30 border border-blue-900/50 p-2 rounded text-zinc-300 text-sm font-bold text-center md:text-left">
                             {country}
                          </li>
                       ))}
                    </ul>
                 </div>
                 
                 {/* Right Side (Axis) */}
                 <div>
                    <h4 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4 border-b border-rose-900/50 pb-2 text-center md:text-right">{active.axisTitle}</h4>
                    <ul className="space-y-2">
                       {active.axis.map((country, idx) => (
                          <li key={idx} className="bg-rose-950/30 border border-rose-900/50 p-2 rounded text-zinc-300 text-sm font-bold text-center md:text-right">
                             {country}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>

           {/* Details Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl shadow-xl">
                 <div className="text-2xl mb-2">🔥</div>
                 <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Pemicu Utama</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed">{active.trigger}</p>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl shadow-xl">
                 <div className="text-2xl mb-2">⚙️</div>
                 <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Teknologi Perang</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed">{active.tech}</p>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl shadow-xl">
                 <div className="text-2xl mb-2">🌍</div>
                 <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Dampak Pasca Perang</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed">{active.aftermath}</p>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pilih Perang</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setWar("ww1")} 
             className={`w-full p-4 text-left rounded-xl border transition-all ${war === 'ww1' ? 'bg-amber-700 border-amber-500 text-white font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="text-xs opacity-80 mb-1">1914 - 1918</div>
             <div>Perang Dunia I</div>
          </button>
          
          <button 
             onClick={()=>setWar("ww2")} 
             className={`w-full p-4 text-left rounded-xl border transition-all ${war === 'ww2' ? 'bg-rose-700 border-rose-500 text-white font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="text-xs opacity-80 mb-1">1939 - 1945</div>
             <div>Perang Dunia II</div>
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-8">
            <p><strong>Kenapa Perang Dunia sangat penting dipelajari?</strong></p>
            <p>Karena dua perang raksasa inilah yang membentuk peta dunia masa kini, menciptakan PBB, memicu dekolonisasi (kemerdekaan bangsa-bangsa terjajah termasuk Indonesia), serta memajukan teknologi secara masif (roket, komputer awal, nuklir).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
