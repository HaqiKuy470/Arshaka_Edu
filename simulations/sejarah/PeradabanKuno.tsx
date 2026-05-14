"use client";

import { useState } from "react";

export default function PeradabanKuno() {
  const [activeCiv, setActiveCiv] = useState(0);

  const civilizations = [
    {
      name: "Mesir Kuno",
      river: "Sungai Nil (Afrika Utara)",
      time: "± 3150 SM - 30 SM",
      icon: "🐪",
      color: "bg-amber-600",
      aspects: [
        { title: "Sistem Pemerintahan", desc: "Dipimpin oleh seorang Firaun (Raja) yang dianggap sebagai penjelmaan dewa di bumi." },
        { title: "Peninggalan Ikonik", desc: "Piramida (makam Firaun), Sphinx, dan kuil-kuil raksasa di Luxor & Karnak." },
        { title: "Sistem Tulisan", desc: "Hieroglif, tulisan gambar suci yang diukir di batu atau ditulis di atas kertas papirus." },
        { title: "Kepercayaan", desc: "Politeisme (banyak dewa). Dewa tertinggi adalah Ra (Dewa Matahari). Percaya pada kehidupan setelah mati (Mumi)." }
      ]
    },
    {
      name: "Mesopotamia",
      river: "Sungai Eufrat & Tigris (Timur Tengah/Irak)",
      time: "± 3500 SM - 539 SM",
      icon: "🏛️",
      color: "bg-stone-600",
      aspects: [
        { title: "Pusat Peradaban Pertama", desc: "Dikenal sebagai 'Cradle of Civilization'. Tempat lahirnya bangsa Sumeria, Akkadia, Babilonia, dan Asyur." },
        { title: "Peninggalan Ikonik", desc: "Ziggurat (kuil berundak), Taman Gantung Babilonia, dan penemuan roda pertama di dunia." },
        { title: "Sistem Tulisan", desc: "Cuneiform (Huruf Paku), tulisan tertua di dunia yang ditorehkan di atas lempeng tanah liat basah." },
        { title: "Hukum Tertulis", desc: "Kode Hammurabi: Kumpulan hukum tertulis pertama di dunia dengan prinsip 'Mata ganti mata, gigi ganti gigi'." }
      ]
    },
    {
      name: "Yunani Kuno",
      river: "Semenanjung Balkan & Laut Aegea",
      time: "± 800 SM - 146 SM",
      icon: "🏛️",
      color: "bg-sky-600",
      aspects: [
        { title: "Sistem Negara Kota", desc: "Tidak bersatu sebagai satu negara, melainkan terdiri dari banyak 'Polis' mandiri yang sering bersaing (contoh: Athena vs Sparta)." },
        { title: "Sumbangan Ilmu", desc: "Tempat lahirnya Demokrasi (di Athena), Filsafat (Socrates, Plato, Aristoteles), dan Olimpiade." },
        { title: "Peninggalan Ikonik", desc: "Kuil Parthenon di puncak Acropolis, teater terbuka, dan seni patung marmar yang sangat proporsional." },
        { title: "Kepercayaan", desc: "Mitologi dewa-dewi Gunung Olympus (Zeus, Poseidon, Athena, Ares) yang memiliki sifat mirip manusia." }
      ]
    },
    {
      name: "Romawi Kuno",
      river: "Semenanjung Italia (Sungai Tiber)",
      time: "± 753 SM - 476 M",
      icon: "⚔️",
      color: "bg-rose-700",
      aspects: [
        { title: "Ekspansi Militer", desc: "Kekaisaran terbesar yang pernah menguasai seluruh wilayah di sekeliling Laut Tengah (Mediterania), Eropa, hingga Afrika Utara." },
        { title: "Sistem Pemerintahan", desc: "Berubah dari Kerajaan, Republik (dipimpin Senat), hingga akhirnya menjadi Kekaisaran mutlak (Julius Caesar, Augustus)." },
        { title: "Peninggalan Ikonik", desc: "Colosseum (arena gladiator), Akuaduk (saluran air raksasa), dan jaringan jalan raya yang menyatukan Eropa." },
        { title: "Hukum & Bahasa", desc: "Bahasa Latin dan sistem hukum Romawi menjadi dasar bagi peradaban Eropa modern." }
      ]
    }
  ];

  const civ = civilizations[activeCiv];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-lg">Eksplorasi Peradaban Kuno</h2>
        <p className="text-zinc-400 mb-8 text-center">Menelusuri jejak peradaban-peradaban besar pembentuk dunia modern.</p>

        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
           
           {/* Top Info Header */}
           <div className={`w-full rounded-t-3xl p-8 relative overflow-hidden ${civ.color}`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
              
              <div className="relative z-10 flex items-center gap-6">
                 <div className="text-7xl bg-white/20 p-4 rounded-2xl shadow-xl backdrop-blur-sm">
                    {civ.icon}
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white drop-shadow-md mb-2">{civ.name}</h3>
                    <div className="flex flex-wrap gap-3 text-white/90 text-sm font-bold">
                       <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">📍 {civ.river}</span>
                       <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">⏳ {civ.time}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Grid */}
           <div className="bg-zinc-900 border-x border-b border-white/10 rounded-b-3xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {civ.aspects.map((aspect, idx) => (
                 <div key={idx} className="bg-black/50 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${civ.color.replace('bg-', 'text-')}`}>
                       {aspect.title}
                    </h4>
                    <p className="text-zinc-300 leading-relaxed text-sm">
                       {aspect.desc}
                    </p>
                 </div>
              ))}
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Mesin Waktu</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {civilizations.map((c, idx) => (
             <button
               key={idx}
               onClick={() => setActiveCiv(idx)}
               className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeCiv === idx ? `${c.color} border-transparent text-white font-bold shadow-lg scale-[1.02]` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
             >
               <span className="text-3xl">{c.icon}</span>
               <span>{c.name}</span>
             </button>
          ))}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-6">
            <p><strong>Fakta Menarik:</strong> Peradaban-peradaban kuno awal di dunia (seperti Mesir dan Mesopotamia) selalu muncul dan berkembang pesat di <strong>lembah sungai besar</strong>.</p>
            <p>Sungai memberikan air untuk minum, irigasi tanah pertanian yang subur, serta jalur transportasi perdagangan yang sangat vital di masa pra-modern.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
