"use client";

import { useState } from "react";

export default function KerajaanNusantara() {
  const [activeKingdom, setActiveKingdom] = useState<number>(0);

  const kingdoms = [
    {
      name: "Kerajaan Kutai",
      type: "Hindu",
      location: "Kalimantan Timur (Sungai Mahakam)",
      century: "Abad ke-4 M",
      key_figures: "Raja Mulawarman",
      desc: "Kerajaan tertua di Nusantara yang dibuktikan dengan penemuan 7 Yupa (tugu batu bertuliskan huruf Pallawa dan bahasa Sanskerta). Mulawarman terkenal sangat dermawan dengan menyumbangkan 20.000 ekor sapi kepada Brahmana.",
      color: "bg-amber-600",
      x: 60, y: 35 // map coords percentage
    },
    {
      name: "Kerajaan Tarumanegara",
      type: "Hindu",
      location: "Jawa Barat (Sungai Citarum)",
      century: "Abad ke-5 M",
      key_figures: "Raja Purnawarman",
      desc: "Kerajaan tertua di Pulau Jawa. Purnawarman terkenal dengan proyek penggalian Sungai Gomati sepanjang 11 km untuk irigasi dan mencegah banjir. Bukti peninggalannya berupa Prasasti Ciaruteun (tapak kaki dewa Wisnu).",
      color: "bg-amber-500",
      x: 35, y: 65
    },
    {
      name: "Kedatuan Sriwijaya",
      type: "Buddha",
      location: "Sumatra Selatan (Palembang)",
      century: "Abad ke-7 - 13 M",
      key_figures: "Balaputradewa",
      desc: "Kerajaan Maritim terbesar di Nusantara! Menguasai Selat Malaka, menjadi pusat perdagangan dan pusat pendidikan agama Buddha se-Asia Tenggara (dikunjungi pendeta I-Tsing dari Tiongkok).",
      color: "bg-emerald-500",
      x: 25, y: 55
    },
    {
      name: "Kerajaan Mataram Kuno",
      type: "Hindu-Buddha",
      location: "Jawa Tengah ➔ Jawa Timur",
      century: "Abad ke-8 - 10 M",
      key_figures: "Sanjaya & Syailendra",
      desc: "Dipimpin oleh dua wangsa besar: Sanjaya (Hindu) membangun Candi Prambanan, dan Syailendra (Buddha) membangun Candi Borobudur (Candi Buddha terbesar di dunia).",
      color: "bg-orange-500",
      x: 45, y: 70
    },
    {
      name: "Kerajaan Majapahit",
      type: "Hindu-Buddha",
      location: "Jawa Timur (Trowulan)",
      century: "Abad ke-13 - 15 M",
      key_figures: "Hayam Wuruk & Gajah Mada",
      desc: "Puncak kejayaan Nusantara! Gajah Mada mengucapkan 'Sumpah Palapa' untuk menyatukan seluruh Nusantara di bawah panji Majapahit. Wilayah kekuasaannya mencakup Indonesia modern, Malaysia, hingga sebagian Filipina.",
      color: "bg-red-600",
      x: 55, y: 72
    },
    {
      name: "Kesultanan Samudera Pasai",
      type: "Islam",
      location: "Aceh Utara",
      century: "Abad ke-13 M",
      key_figures: "Sultan Malik as-Saleh",
      desc: "Kerajaan Islam pertama di Nusantara. Menjadi pusat perdagangan lada dan pintu gerbang masuknya Islam ke Indonesia karena letaknya yang strategis di ujung Selat Malaka.",
      color: "bg-teal-600",
      x: 10, y: 30
    },
    {
      name: "Kesultanan Demak",
      type: "Islam",
      location: "Jawa Tengah (Demak)",
      century: "Abad ke-15 M",
      key_figures: "Raden Patah",
      desc: "Kerajaan Islam pertama di Pulau Jawa. Didirikan dengan dukungan Wali Songo, sekaligus menandai runtuhnya dominasi Kerajaan Majapahit. Masjid Agung Demak adalah peninggalan utamanya.",
      color: "bg-emerald-600",
      x: 48, y: 68
    },
    {
      name: "Kesultanan Ternate & Tidore",
      type: "Islam",
      location: "Maluku Utara",
      century: "Abad ke-15 M",
      key_figures: "Sultan Baabullah",
      desc: "Dikenal sebagai 'The Spice Islands' (Kepulauan Rempah-rempah) yang menjadi incaran bangsa Eropa (Portugis, Spanyol, Belanda). Ternate memimpin persekutuan Uli Lima, Tidore memimpin Uli Siwa.",
      color: "bg-indigo-500",
      x: 85, y: 45
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4">
        
        {/* Simple Abstract Map of Indonesia */}
        <div className="relative w-full max-w-4xl aspect-[2/1] bg-sky-950/20 border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-6">
           
           <h2 className="absolute top-4 left-6 text-2xl font-bold text-white z-10 drop-shadow-md">Peta Kerajaan Nusantara</h2>

           {/* Abstract Islands (SVG) */}
           <svg className="absolute inset-0 w-full h-full text-emerald-950/50" viewBox="0 0 1000 500" preserveAspectRatio="none">
              {/* Sumatra */}
              <path d="M 50 150 Q 150 200 250 350 Q 200 400 100 250 Z" fill="currentColor" />
              {/* Java */}
              <path d="M 280 380 Q 400 400 600 420 Q 550 450 300 420 Z" fill="currentColor" />
              {/* Kalimantan */}
              <path d="M 350 150 Q 500 50 650 200 Q 550 300 400 250 Z" fill="currentColor" />
              {/* Sulawesi */}
              <path d="M 680 200 L 750 150 L 780 250 L 700 350 Z" fill="currentColor" />
              {/* Papua (partial) */}
              <path d="M 850 300 Q 950 250 1000 350 Q 900 450 850 400 Z" fill="currentColor" />
           </svg>

           {/* Markers */}
           {kingdoms.map((k, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveKingdom(idx)}
                className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center cursor-pointer transition-all ${activeKingdom === idx ? `${k.color} text-white shadow-[0_0_20px_white] scale-125 z-20 animate-pulse` : 'bg-zinc-800 border-2 border-white/50 text-xs hover:scale-110 z-10'}`}
                style={{ left: `${k.x}%`, top: `${k.y}%` }}
              >
                 {k.type === "Hindu" ? "🛕" : k.type === "Hindu-Buddha" ? "🕉️" : k.type === "Buddha" ? "☸️" : "🕌"}
              </div>
           ))}
        </div>

        {/* Details Card */}
        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl relative animate-fade-in flex flex-col md:flex-row gap-6 items-center">
           <div className={`absolute top-0 left-0 w-2 h-full rounded-l-2xl ${kingdoms[activeKingdom].color}`} />
           
           <div className="flex-1 pl-4">
              <div className="flex items-center gap-3 mb-2">
                 <h3 className="text-3xl font-black text-white">{kingdoms[activeKingdom].name}</h3>
                 <span className={`px-2 py-1 text-xs font-bold rounded text-white ${kingdoms[activeKingdom].color}`}>
                    {kingdoms[activeKingdom].type}
                 </span>
              </div>
              <div className="text-zinc-400 text-sm mb-4 font-mono">
                 📍 {kingdoms[activeKingdom].location} | ⏳ {kingdoms[activeKingdom].century}
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                 {kingdoms[activeKingdom].desc}
              </p>
           </div>

           <div className="md:w-64 w-full bg-black/50 p-4 rounded-xl border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Tokoh Terkenal</div>
              <div className="text-lg font-bold text-amber-400">{kingdoms[activeKingdom].key_figures}</div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Daftar Kerajaan</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          
          {kingdoms.map((k, idx) => (
             <button
               key={idx}
               onClick={() => setActiveKingdom(idx)}
               className={`w-full p-3 text-left rounded-xl transition-all border ${activeKingdom === idx ? `${k.color} border-transparent text-white font-bold` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
             >
               <div className="text-sm">{k.name}</div>
               <div className="text-[10px] opacity-70 mt-1 truncate">{k.location}</div>
             </button>
          ))}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed mt-6">
            <p>Sejarah Nusantara sangat kaya! Jauh sebelum bangsa Eropa datang menjajah, wilayah Indonesia sudah dipenuhi oleh peradaban besar dan kerajaan maritim yang dihormati di kancah dunia.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
