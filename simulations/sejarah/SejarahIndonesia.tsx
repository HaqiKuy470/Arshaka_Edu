"use client";

import { useState } from "react";

export default function SejarahIndonesia() {
  const [activeEra, setActiveEra] = useState<number>(0);

  const eras = [
    {
      year: "Zaman Prasejarah",
      title: "Masa Praaksara",
      desc: "Masa di mana manusia purba (seperti Meganthropus dan Pithecanthropus Erectus) hidup nomaden berburu dan meramu sebelum mengenal tulisan.",
      icon: "🦴",
      color: "bg-amber-700"
    },
    {
      year: "Abad 4 - 15 M",
      title: "Masa Hindu-Buddha",
      desc: "Masuknya pengaruh India. Berdirinya kerajaan besar seperti Kutai, Tarumanegara, Sriwijaya (pusat maritim), hingga Majapahit (pemersatu Nusantara).",
      icon: "🛕",
      color: "bg-orange-600"
    },
    {
      year: "Abad 13 - 16 M",
      title: "Masa Kerajaan Islam",
      desc: "Islam menyebar lewat jalur perdagangan. Berdiri Kesultanan Samudera Pasai, Demak, Mataram Islam, hingga Ternate dan Tidore di wilayah timur.",
      icon: "🕌",
      color: "bg-emerald-600"
    },
    {
      year: "1596 - 1942",
      title: "Masa Penjajahan Belanda",
      desc: "Diawali kedatangan Cornelis de Houtman. Berdirinya VOC (Kongsi Dagang) untuk memonopoli rempah-rempah, berlanjut ke sistem Tanam Paksa (Cultuurstelsel).",
      icon: "⛵",
      color: "bg-blue-700"
    },
    {
      year: "1942 - 1945",
      title: "Pendudukan Jepang",
      desc: "Belanda menyerah di Kalijati. Jepang masuk membawa semboyan 'Nippon Pelindung Asia', namun berujung pada eksploitasi besar-besaran (Romusha).",
      icon: "☀️",
      color: "bg-red-600"
    },
    {
      year: "17 Agustus 1945",
      title: "Kemerdekaan Indonesia",
      desc: "Memanfaatkan kekosongan kekuasaan (Jepang menyerah pada Sekutu), Soekarno-Hatta memproklamasikan Kemerdekaan RI di Jalan Pegangsaan Timur No. 56.",
      icon: "🇮🇩",
      color: "bg-rose-500"
    },
    {
      year: "1945 - 1966",
      title: "Orde Lama (Soekarno)",
      desc: "Masa mempertahankan kemerdekaan, agresi militer Belanda, Demokrasi Terpimpin, hingga berakhirnya era Soekarno akibat peristiwa G30S/PKI 1965.",
      icon: "⚖️",
      color: "bg-purple-600"
    },
    {
      year: "1966 - 1998",
      title: "Orde Baru (Soeharto)",
      desc: "Fokus pada Pembangunan Nasional (Repelita) namun diwarnai KKN (Korupsi, Kolusi, Nepotisme) dan sentralisasi kekuasaan selama 32 tahun.",
      icon: "🏗️",
      color: "bg-sky-600"
    },
    {
      year: "1998 - Sekarang",
      title: "Era Reformasi",
      desc: "Jatuhnya Soeharto akibat krisis moneter dan demonstrasi mahasiswa. Ditandai dengan kebebasan pers, desentralisasi (otonomi daerah), dan pemilu langsung.",
      icon: "✊",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8">
        
        <div className="w-full max-w-4xl flex flex-col h-full">
           
           <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center flex-shrink-0">Linimasa Sejarah Indonesia</h2>

           {/* Main Display Area */}
           <div className={`flex-1 w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in overflow-hidden flex flex-col justify-center items-center text-center ${eras[activeEra].color.replace('bg-', 'border-')} min-h-[300px]`}>
              
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              <div className={`absolute top-0 left-0 w-full h-2 ${eras[activeEra].color}`} />
              
              <div className={`text-8xl mb-6 ${eras[activeEra].color.replace('bg-', 'text-')} drop-shadow-2xl z-10`}>
                 {eras[activeEra].icon}
              </div>
              
              <div className="bg-black/50 px-4 py-1 rounded-full text-zinc-300 font-mono font-bold text-sm mb-4 border border-white/10 z-10">
                 {eras[activeEra].year}
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 z-10">
                 {eras[activeEra].title}
              </h3>
              
              <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl z-10">
                 {eras[activeEra].desc}
              </p>

           </div>

           {/* Horizontal Timeline Scroller (Bottom) */}
           <div className="w-full mt-8 overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex gap-4 min-w-max px-2">
                 {eras.map((era, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEra(idx)}
                      className={`relative flex flex-col items-center p-4 rounded-xl transition-all w-32 shrink-0 ${activeEra === idx ? `${era.color} text-white shadow-lg scale-110 z-10` : 'bg-zinc-900/80 border border-white/5 text-zinc-500 hover:bg-zinc-800'}`}
                    >
                       <span className="text-3xl mb-2">{era.icon}</span>
                       <span className="text-[10px] font-bold text-center leading-tight">{era.title}</span>
                       
                       {/* Connector line */}
                       {idx < eras.length - 1 && (
                          <div className={`absolute top-1/2 -right-4 w-4 h-0.5 -translate-y-1/2 ${activeEra === idx ? 'bg-white' : 'bg-zinc-700'}`} />
                       )}
                    </button>
                 ))}
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Panduan Navigasi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p><strong>Linimasa (Timeline)</strong> ini merangkum ribuan tahun sejarah Nusantara hingga menjadi Negara Kesatuan Republik Indonesia (NKRI) saat ini.</p>
            <p className="text-amber-400 font-bold mt-2">Geser dan klik ikon di bagian bawah untuk melihat detail peristiwa pada setiap eranya.</p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
             <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Pintasan Cepat:</div>
             <button onClick={()=>setActiveEra(1)} className="w-full p-2 text-left text-xs bg-black/30 border border-white/5 rounded text-zinc-400 hover:text-white mb-2">🛕 Kerajaan Nusantara</button>
             <button onClick={()=>setActiveEra(3)} className="w-full p-2 text-left text-xs bg-black/30 border border-white/5 rounded text-zinc-400 hover:text-white mb-2">⛵ Era Kolonialisme VOC</button>
             <button onClick={()=>setActiveEra(5)} className="w-full p-2 text-left text-xs bg-black/30 border border-white/5 rounded text-rose-400 font-bold hover:text-rose-300 mb-2">🇮🇩 Proklamasi 1945</button>
             <button onClick={()=>setActiveEra(8)} className="w-full p-2 text-left text-xs bg-black/30 border border-white/5 rounded text-zinc-400 hover:text-white mb-2">✊ Era Reformasi</button>
          </div>

        </div>
      </div>
    </div>
  );
}
