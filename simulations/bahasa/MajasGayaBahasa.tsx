"use client";

import { useState } from "react";

export default function MajasGayaBahasa() {
  const [activeMajas, setActiveMajas] = useState<number>(0);

  const majas = [
    {
      name: "Personifikasi",
      desc: "Mengibaratkan benda mati seolah-olah memiliki sifat seperti manusia (hidup).",
      literal: "Angin bertiup kencang sore ini.",
      figurative: "Angin sore ini berbisik dan menyapu wajahku dengan lembut.",
      icon: "🌬️👤",
      color: "bg-blue-600"
    },
    {
      name: "Metafora",
      desc: "Membandingkan dua hal yang berbeda secara langsung tanpa kata penghubung (seperti, bagaikan).",
      literal: "Dia adalah anak yang sangat berharga bagi keluarganya.",
      figurative: "Anak itu adalah permata hati keluarganya.",
      icon: "💎",
      color: "bg-emerald-600"
    },
    {
      name: "Hiperbola",
      desc: "Melebih-lebihkan sesuatu secara ekstrim hingga tidak masuk akal untuk memberikan kesan mendalam.",
      literal: "Aku sangat terkejut mendengar kabar itu.",
      figurative: "Jantungku hampir copot mendengar kabar itu!",
      icon: "🤯",
      color: "bg-red-600"
    },
    {
      name: "Sarkasme",
      desc: "Sindiran kasar atau langsung untuk menyakiti hati atau mengekspresikan kekesalan.",
      literal: "Tulisanmu sangat jelek dan tidak bisa dibaca.",
      figurative: "Bagus sekali tulisanmu, sampai-sampai mirip ceker ayam yang menari!",
      icon: "😒🐔",
      color: "bg-purple-600"
    },
    {
      name: "Eufemisme",
      desc: "Menggunakan kata yang lebih halus dan sopan untuk menggantikan kata yang dianggap kasar atau tabu.",
      literal: "Orang itu sudah mati kemarin.",
      figurative: "Orang itu telah berpulang ke rahmatullah kemarin.",
      icon: "🕊️",
      color: "bg-sky-600"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
           
           <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className={`text-5xl p-4 rounded-2xl ${majas[activeMajas].color} bg-opacity-20`}>
                 {majas[activeMajas].icon}
              </div>
              <div>
                 <h2 className="text-3xl font-bold text-white mb-1">Majas {majas[activeMajas].name}</h2>
                 <p className="text-zinc-400 text-sm">{majas[activeMajas].desc}</p>
              </div>
           </div>

           <div className="space-y-6 animate-fade-in">
              <div className="relative p-6 rounded-2xl bg-black/50 border border-zinc-800">
                 <div className="absolute top-0 left-6 -translate-y-1/2 bg-zinc-800 px-3 py-1 rounded text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Kalimat Biasa (Harfiah)
                 </div>
                 <p className="text-xl text-zinc-300 italic">
                    "{majas[activeMajas].literal}"
                 </p>
              </div>

              <div className="flex justify-center text-zinc-600">
                 <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </div>

              <div className={`relative p-6 rounded-2xl bg-opacity-10 border border-opacity-30 ${majas[activeMajas].color} border-${majas[activeMajas].color.split('-')[1]}-500`}>
                 <div className={`absolute top-0 left-6 -translate-y-1/2 px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-widest shadow-lg ${majas[activeMajas].color}`}>
                    Dengan Majas (Kiasan)
                 </div>
                 <p className="text-2xl font-bold text-white mt-2">
                    "{majas[activeMajas].figurative}"
                 </p>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Majas & Gaya Bahasa</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
             {majas.map((m, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMajas(idx)}
                  className={`w-full p-4 flex items-center gap-3 text-left rounded-xl border transition-all ${activeMajas === idx ? `${m.color} border-transparent text-white font-bold shadow-lg scale-[1.02]` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span>{m.name}</span>
                </button>
             ))}
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Majas</strong> adalah cara melukiskan sesuatu dengan jalan menyamakannya dengan sesuatu yang lain (kiasan/imajinatif).</p>
            <p>Penggunaan majas bertujuan untuk memberikan efek emosional, memperindah bahasa dalam puisi/novel, atau untuk menegaskan suatu makna agar lebih membekas di hati pembaca.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
