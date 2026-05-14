"use client";

import { useState } from "react";

export default function PerjuanganKemerdekaan() {
  const [activeStep, setActiveStep] = useState(0);

  const events = [
    {
      date: "6 Agustus 1945",
      title: "Bom Atom Hiroshima",
      desc: "Amerika Serikat menjatuhkan bom atom 'Little Boy' di kota Hiroshima, Jepang. Ini adalah pukulan telak pertama yang melumpuhkan militer Jepang dalam Perang Dunia II.",
      image: "💣",
      color: "bg-rose-700"
    },
    {
      date: "9 Agustus 1945",
      title: "Bom Atom Nagasaki",
      desc: "Bom atom kedua 'Fat Man' dijatuhkan di Nagasaki. Jepang benar-benar hancur dan menyerah tanpa syarat kepada Sekutu.",
      image: "☢️",
      color: "bg-red-600"
    },
    {
      date: "14-15 Agustus 1945",
      title: "Kabar Kekalahan Jepang",
      desc: "Golongan Pemuda (Sutan Sjahrir, Chaerul Saleh) mendengar berita kekalahan Jepang melalui radio gelap. Mereka mendesak Soekarno-Hatta segera memproklamasikan kemerdekaan agar tidak dianggap 'hadiah' dari Jepang.",
      image: "📻",
      color: "bg-amber-600"
    },
    {
      date: "16 Agustus 1945",
      title: "Peristiwa Rengasdengklok",
      desc: "Terjadi ketegangan. Golongan Pemuda 'menculik' Soekarno-Hatta ke Rengasdengklok, Karawang, untuk menjauhkan mereka dari pengaruh militer Jepang dan memaksa proklamasi disegerakan.",
      image: "🚙",
      color: "bg-blue-600"
    },
    {
      date: "16 Agustus 1945 (Malam)",
      title: "Perumusan Naskah",
      desc: "Di rumah Laksamana Maeda (perwira Jepang yang bersimpati pada Indonesia), Soekarno, Hatta, dan Ahmad Soebardjo merumuskan naskah proklamasi. Naskah kemudian diketik oleh Sayuti Melik.",
      image: "✍️",
      color: "bg-emerald-600"
    },
    {
      date: "17 Agustus 1945 (10:00 WIB)",
      title: "Proklamasi Kemerdekaan",
      desc: "Bertempat di Jalan Pegangsaan Timur No. 56, Jakarta. Soekarno membacakan teks Proklamasi didampingi Hatta. Bendera Merah Putih (jahitan Ibu Fatmawati) dikibarkan, lagu Indonesia Raya dikumandangkan. INDONESIA MERDEKA!",
      image: "🇮🇩",
      color: "bg-rose-500"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-4xl">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg uppercase tracking-wider">Detik-Detik Proklamasi</h2>
              <p className="text-zinc-400 mt-2 font-mono">Agustus 1945</p>
           </div>

           {/* Stepper Visualization */}
           <div className="relative flex justify-between items-center mb-12 px-4 md:px-12">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-800 -translate-y-1/2 z-0" />
              
              {events.map((e, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setActiveStep(idx)}
                   className="relative z-10 flex flex-col items-center cursor-pointer group"
                 >
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all duration-300 border-4 ${activeStep === idx ? `${e.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-125` : activeStep > idx ? 'bg-zinc-700 border-zinc-500' : 'bg-black border-zinc-800 group-hover:border-zinc-500'}`}>
                       {e.image}
                    </div>
                    {/* Tooltip on hover for larger screens */}
                    <div className="absolute -bottom-8 whitespace-nowrap text-[10px] text-zinc-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                       {e.date}
                    </div>
                 </div>
              ))}
           </div>

           {/* Event Detail Card */}
           <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[250px] animate-fade-in flex flex-col justify-center overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full ${events[activeStep].color}`} />
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className={`text-8xl ${events[activeStep].color.replace('bg-', 'text-')} drop-shadow-2xl`}>
                    {events[activeStep].image}
                 </div>
                 
                 <div>
                    <div className="inline-block bg-white/10 text-white px-3 py-1 rounded text-xs font-bold font-mono border border-white/20 mb-3">
                       {events[activeStep].date}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">{events[activeStep].title}</h3>
                    <p className="text-zinc-300 text-lg leading-relaxed">{events[activeStep].desc}</p>
                 </div>
              </div>
           </div>

           {/* Navigation Buttons bottom */}
           <div className="flex justify-between mt-8">
              <button 
                 onClick={() => setActiveStep(p => Math.max(0, p - 1))}
                 className={`px-6 py-3 rounded-xl font-bold transition-all ${activeStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                 ⬅️ Mundur
              </button>
              <button 
                 onClick={() => setActiveStep(p => Math.min(events.length - 1, p + 1))}
                 className={`px-6 py-3 rounded-xl font-bold transition-all ${activeStep === events.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg'}`}
              >
                 Maju ➡️
              </button>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kronologi Agustus 1945</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {events.map((e, idx) => (
             <div 
               key={idx}
               onClick={() => setActiveStep(idx)}
               className={`p-3 rounded-xl border cursor-pointer transition-all ${activeStep === idx ? `${e.color} border-transparent text-white` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
             >
                <div className="text-[10px] font-mono opacity-80 mb-1">{e.date}</div>
                <div className="text-sm font-bold">{e.title}</div>
             </div>
          ))}

          <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-900/50 text-xs text-rose-200 leading-relaxed mt-6">
            <p><strong>Kenapa Rengasdengklok terjadi?</strong></p>
            <p className="mt-1">Golongan Tua (Soekarno-Hatta) ingin proklamasi disahkan dulu oleh PPKI (bentukan Jepang) agar tidak terjadi pertumpahan darah. Golongan Muda menolak keras karena ingin proklamasi murni hasil jerih payah bangsa sendiri, bukan hadiah Jepang!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
