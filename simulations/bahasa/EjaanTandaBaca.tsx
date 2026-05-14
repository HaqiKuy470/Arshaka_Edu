"use client";

import { useState } from "react";

export default function EjaanTandaBaca() {
  const [activeRule, setActiveRule] = useState<number>(0);

  const rules = [
    {
      title: "Huruf Kapital",
      desc: "Digunakan di awal kalimat, nama orang, hari, bulan, bangsa, dan tempat.",
      wrong: "budi pergi ke jakarta pada hari senin bulan agustus.",
      correct: "Budi pergi ke Jakarta pada hari Senin bulan Agustus.",
      highlights: [0, 14, 30, 42],
      color: "bg-red-500"
    },
    {
      title: "Tanda Titik (.)",
      desc: "Mengakhiri kalimat yang bukan pertanyaan atau seruan. Juga untuk singkatan umum (misal: a.n.).",
      wrong: "Saya suka makan nasi goreng",
      correct: "Saya suka makan nasi goreng.",
      highlights: [27],
      color: "bg-blue-500"
    },
    {
      title: "Tanda Koma (,)",
      desc: "Memisahkan rincian, memisahkan anak kalimat yang mendahului induk kalimat, dan sesudah kata seru.",
      wrong: "Ibu membeli apel jeruk dan mangga.",
      correct: "Ibu membeli apel, jeruk, dan mangga.",
      highlights: [16, 24],
      color: "bg-amber-500"
    },
    {
      title: "Penulisan Di/Ke (Dipisah vs Digabung)",
      desc: "'di' dan 'ke' dipisah jika menunjukkan TEMPAT. Digabung jika merupakan IMBUHAN kata kerja pasif.",
      wrong: "Buku itu di simpan di laci meja.",
      correct: "Buku itu disimpan di laci meja.",
      highlights: [10],
      color: "bg-emerald-500"
    },
    {
      title: "Tanda Petik Ganda (\")",
      desc: "Digunakan untuk mengapit petikan langsung dari pembicaraan atau tulisan.",
      wrong: "Tolong ambilkan buku itu, kata ayah.",
      correct: "\"Tolong ambilkan buku itu,\" kata ayah.",
      highlights: [0, 26],
      color: "bg-purple-500"
    }
  ];

  const active = rules[activeRule];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-2xl">
           <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow-lg">Klinik Ejaan (PUEBI/EYD)</h2>

           <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-3xl shadow-2xl relative animate-fade-in">
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${active.color}`} />
              
              <div className="text-center mb-8">
                 <h3 className="text-xl font-bold text-white">{active.title}</h3>
                 <p className="text-zinc-400 mt-2">{active.desc}</p>
              </div>

              {/* Before/After Container */}
              <div className="space-y-6">
                 {/* Wrong */}
                 <div className="relative">
                    <span className="absolute -top-3 left-4 bg-zinc-800 text-zinc-500 px-2 text-xs font-bold rounded">SALAH / KURANG TEPAT</span>
                    <div className="bg-rose-950/30 border border-rose-900/50 p-6 rounded-xl text-zinc-400 text-lg line-through decoration-rose-500/50 decoration-2">
                       {active.wrong}
                    </div>
                 </div>

                 {/* Arrow */}
                 <div className="flex justify-center text-zinc-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                 </div>

                 {/* Correct */}
                 <div className="relative">
                    <span className="absolute -top-3 left-4 bg-zinc-800 text-emerald-400 px-2 text-xs font-bold rounded">BENAR (Sesuai PUEBI)</span>
                    <div className="bg-emerald-950/30 border border-emerald-900/50 p-6 rounded-xl text-white text-lg font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                       {active.correct.split("").map((char, index) => {
                          // Check if this index is highlighted
                          const isHighlighted = active.highlights.includes(index) || 
                                              // simple logic: if previous char was highlighted and we're looking at a word (for Capital letters)
                                              (char !== ' ' && char !== ',' && char !== '.' && char !== '"' && active.title === "Huruf Kapital" && active.highlights.some(h => index > h && index < h+3 && active.correct[h] === char.toUpperCase()));
                          
                          // For exact index match
                          const exactMatch = active.highlights.includes(index);

                          return (
                             <span key={index} className={`transition-all duration-500 ${exactMatch ? `${active.color.replace('bg-', 'text-')} font-black text-2xl` : ''}`}>
                                {char}
                             </span>
                          );
                       })}
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Ejaan & Tanda Baca</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Pilih Aturan:</div>
          
          {rules.map((rule, idx) => (
             <button
               key={idx}
               onClick={() => setActiveRule(idx)}
               className={`w-full p-3 text-left rounded-xl transition-all border ${activeRule === idx ? `${rule.color} text-white font-bold border-transparent` : 'bg-black/30 text-zinc-400 border-white/10 hover:bg-white/5'}`}
             >
               {rule.title}
             </button>
          ))}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-300 leading-relaxed mt-6">
            <p><strong>PUEBI</strong> (Pedoman Umum Ejaan Bahasa Indonesia) dulunya dikenal dengan <strong>EYD</strong> (Ejaan Yang Disempurnakan).</p>
            <p className="mt-2">Penggunaan tanda baca dan huruf kapital yang tepat tidak hanya agar tulisan rapi, tetapi untuk mencegah <strong>kesalahpahaman makna</strong> saat kalimat tersebut dibaca oleh orang lain.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
