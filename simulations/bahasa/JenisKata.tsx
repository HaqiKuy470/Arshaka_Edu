"use client";

import { useState } from "react";

export default function JenisKata() {
  const [activeCategory, setActiveCategory] = useState<string>("Benda");

  const categories = [
    { 
      id: "Benda", 
      name: "Kata Benda (Nomina)", 
      desc: "Menyatakan nama orang, tempat, benda, atau segala yang dibendakan.", 
      color: "bg-blue-600",
      examples: ["Meja", "Buku", "Jakarta", "Udara", "Keadilan"]
    },
    { 
      id: "Kerja", 
      name: "Kata Kerja (Verba)", 
      desc: "Menyatakan suatu tindakan, keberadaan, pengalaman, atau pengertian dinamis lainnya.", 
      color: "bg-red-600",
      examples: ["Membaca", "Berlari", "Tidur", "Memukul", "Terjatuh"]
    },
    { 
      id: "Sifat", 
      name: "Kata Sifat (Adjektiva)", 
      desc: "Menerangkan sifat, keadaan watak, atau ciri dari suatu kata benda.", 
      color: "bg-emerald-600",
      examples: ["Cantik", "Besar", "Pintar", "Kotor", "Ramah"]
    },
    { 
      id: "Keterangan", 
      name: "Kata Keterangan (Adverbia)", 
      desc: "Memberikan keterangan tambahan pada kata kerja, sifat, atau kalimat keseluruhan.", 
      color: "bg-amber-600",
      examples: ["Sangat", "Hanya", "Selalu", "Cepat", "Kemarin"]
    },
    { 
      id: "Ganti", 
      name: "Kata Ganti (Pronomina)", 
      desc: "Menggantikan kata benda atau kata orang agar tidak diulang-ulang.", 
      color: "bg-purple-600",
      examples: ["Saya", "Mereka", "Ini", "Itu", "Sesuatu"]
    }
  ];

  const activeData = categories.find(c => c.id === activeCategory);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Hexagon Layout or Grid */}
        <div className="w-full max-w-3xl flex flex-col items-center">
           
           <h2 className="text-3xl font-bold text-white mb-10 text-center drop-shadow-lg">Klasifikasi Kelas Kata</h2>

           <div className="flex flex-wrap justify-center gap-4 mb-12">
             {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${activeCategory === cat.id ? `${cat.color} border-white text-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]` : 'bg-black/50 border-zinc-800 text-zinc-400 hover:bg-white/10 hover:border-zinc-500'}`}
                >
                  {cat.id}
                </button>
             ))}
           </div>

           {/* Active Category Detail */}
           {activeData && (
              <div className="w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-8 animate-fade-in shadow-2xl relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-2 ${activeData.color}`} />
                 
                 <h3 className="text-2xl font-bold text-white mb-2">{activeData.name}</h3>
                 <p className="text-zinc-300 text-lg mb-8">{activeData.desc}</p>
                 
                 <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Contoh Penggunaan:</div>
                 <div className="flex flex-wrap gap-3">
                    {activeData.examples.map((ex, i) => (
                       <div key={i} className={`px-4 py-2 rounded-lg font-bold text-white ${activeData.color} bg-opacity-30 border border-white/20`}>
                          {ex}
                       </div>
                    ))}
                 </div>
                 
                 {/* Visual Hint */}
                 <div className="absolute right-[-40px] bottom-[-40px] text-9xl opacity-5 pointer-events-none font-serif">
                    {activeData.examples[0].charAt(0)}
                 </div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Jenis-Jenis Kata (Parts of Speech)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>Dalam bahasa Indonesia (dan bahasa lainnya), setiap kata yang kita ucapkan masuk ke dalam kategori tertentu yang disebut <strong>Kelas Kata</strong>.</p>
            <p>Memahami jenis kata sangat penting karena menentukan <strong>posisi dan fungsi</strong> kata tersebut dalam struktur kalimat (S-P-O-K).</p>
            <hr className="border-white/10 my-2"/>
            <p className="text-amber-400 font-bold">Tips Membedakan:</p>
            <ul className="list-disc pl-4 space-y-1">
               <li>Jika bisa diawali dengan "Bukan", itu biasanya <strong>Kata Benda</strong> (Bukan buku).</li>
               <li>Jika bisa diawali dengan "Tidak", itu biasanya <strong>Kata Kerja</strong> atau <strong>Sifat</strong> (Tidak berlari, Tidak cantik).</li>
               <li>Jika bisa diawali dengan "Sangat", itu pasti <strong>Kata Sifat</strong> (Sangat cantik, *Sangat berlari ➔ Salah).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
