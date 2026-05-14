"use client";

import { useState } from "react";

export default function TeksGenre() {
  const [genre, setGenre] = useState<"narasi"|"deskripsi"|"eksposisi"|"argumentasi">("narasi");

  const texts = {
    narasi: {
      title: "Narasi (Cerita)",
      desc: "Menceritakan urutan kejadian atau peristiwa (kronologis). Punya tokoh, alur, dan latar waktu.",
      color: "bg-blue-600",
      content: "Malam itu hujan turun sangat deras. Budi berteduh di bawah halte bus yang sepi. Tiba-tiba, ia mendengar suara tangisan samar dari dalam kardus bekas di dekat tempat sampah. Budi memberanikan diri untuk membuka kardus itu perlahan, dan betapa terkejutnya ia melihat seekor anak kucing kecil yang menggigil kedinginan."
    },
    deskripsi: {
      title: "Deskripsi (Penggambaran)",
      desc: "Menggambarkan suatu objek dengan sangat rinci hingga pembaca seolah bisa melihat, mendengar, atau merasakannya.",
      color: "bg-emerald-600",
      content: "Pantai itu memiliki hamparan pasir putih yang sangat halus seperti tepung. Air lautnya bergradasi indah dari biru muda di dekat pantai menjadi biru tua di kejauhan. Di pinggiran, deretan pohon kelapa melambai tertiup angin sepoi-sepoi, membawa aroma garam laut yang menyegarkan hidung siapa saja yang datang."
    },
    eksposisi: {
      title: "Eksposisi (Penjelasan/Informasi)",
      desc: "Memaparkan informasi, pengetahuan, atau cara kerja sesuatu secara ringkas, padat, dan akurat (non-fiksi).",
      color: "bg-amber-600",
      content: "Hujan asam terjadi akibat pencemaran udara oleh gas sulfur dioksida (SO2) dan nitrogen oksida (NOx). Gas-gas yang umumnya berasal dari asap pabrik dan kendaraan ini naik ke atmosfer, bereaksi dengan air hujan, dan membuatnya menjadi asam. Hujan ini sangat berbahaya karena dapat merusak tanaman dan membuat korosi logam."
    },
    argumentasi: {
      title: "Argumentasi (Pendapat/Opini)",
      desc: "Berisi pendapat penulis yang disertai dengan fakta dan alasan logis untuk meyakinkan pembaca.",
      color: "bg-rose-600",
      content: "Penggunaan plastik sekali pakai sudah seharusnya dilarang secara total. Fakta menunjukkan bahwa sampah plastik membutuhkan waktu hingga 400 tahun untuk terurai. Jika kita terus membiarkan hal ini, laut kita akan dipenuhi mikroplastik yang meracuni ikan dan pada akhirnya meracuni tubuh kita sendiri saat mengonsumsinya."
    }
  };

  const active = texts[genre];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-3xl flex flex-col items-center">
           
           <h2 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-lg">Analisis Genre Teks</h2>

           <div className={`w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-8 animate-fade-in shadow-2xl relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-full h-2 ${active.color}`} />
              
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-white">{active.title}</h3>
                    <p className="text-zinc-400 mt-2 text-sm">{active.desc}</p>
                 </div>
              </div>

              {/* Text Sample */}
              <div className="relative">
                 <div className="absolute -top-4 -left-4 text-6xl text-white/5 font-serif">"</div>
                 <p className="text-zinc-300 text-lg leading-relaxed text-justify relative z-10 px-4 font-serif">
                    {active.content}
                 </p>
                 <div className="absolute -bottom-8 -right-4 text-6xl text-white/5 font-serif">"</div>
              </div>

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Jenis-Jenis Teks</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button onClick={()=>setGenre("narasi")} className={`w-full p-4 text-left rounded-xl border transition-all ${genre === 'narasi' ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             📖 Narasi
          </button>
          
          <button onClick={()=>setGenre("deskripsi")} className={`w-full p-4 text-left rounded-xl border transition-all ${genre === 'deskripsi' ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             👁️ Deskripsi
          </button>

          <button onClick={()=>setGenre("eksposisi")} className={`w-full p-4 text-left rounded-xl border transition-all ${genre === 'eksposisi' ? 'bg-amber-600 border-amber-400 text-white font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             📰 Eksposisi
          </button>

          <button onClick={()=>setGenre("argumentasi")} className={`w-full p-4 text-left rounded-xl border transition-all ${genre === 'argumentasi' ? 'bg-rose-600 border-rose-400 text-white font-bold shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             ⚖️ Argumentasi
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4 italic">
            <strong>Kunci Mengingat:</strong> Narasi itu Cerita. Deskripsi itu Melukis dengan kata. Eksposisi itu Penjelasan ilmiah. Argumentasi itu Pendapat.
          </div>

        </div>
      </div>
    </div>
  );
}
