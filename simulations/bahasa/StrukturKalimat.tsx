"use client";

import { useState } from "react";

export default function StrukturKalimat() {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);

  // Example sentences with SPOK breakdown
  const sentences = [
    {
      text: "Budi membaca buku tebal di perpustakaan.",
      words: [
        { word: "Budi", type: "Subjek (S)", desc: "Pelaku atau orang yang melakukan tindakan.", color: "bg-blue-600" },
        { word: "membaca", type: "Predikat (P)", desc: "Kata kerja atau tindakan yang dilakukan oleh subjek.", color: "bg-red-600" },
        { word: "buku tebal", type: "Objek (O)", desc: "Sesuatu yang dikenai tindakan oleh subjek.", color: "bg-emerald-600" },
        { word: "di perpustakaan.", type: "Keterangan (K) Tempat", desc: "Menjelaskan di mana kejadian tersebut berlangsung.", color: "bg-amber-600" }
      ]
    },
    {
      text: "Ibu memasak nasi goreng lezat dengan cepat.",
      words: [
        { word: "Ibu", type: "Subjek (S)", desc: "Pelaku atau orang yang melakukan tindakan.", color: "bg-blue-600" },
        { word: "memasak", type: "Predikat (P)", desc: "Kata kerja atau tindakan yang dilakukan oleh subjek.", color: "bg-red-600" },
        { word: "nasi goreng lezat", type: "Objek (O)", desc: "Sesuatu yang dikenai tindakan oleh subjek.", color: "bg-emerald-600" },
        { word: "dengan cepat.", type: "Keterangan (K) Cara", desc: "Menjelaskan bagaimana kejadian tersebut berlangsung.", color: "bg-amber-600" }
      ]
    }
  ];

  const [activeSentence, setActiveSentence] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-3xl">
           <h2 className="text-center text-white/50 text-sm font-bold uppercase tracking-widest mb-8">Pembedahan Unsur Kalimat</h2>
           
           {/* Interactive Sentence */}
           <div className="flex flex-wrap justify-center gap-3 bg-zinc-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl">
              {sentences[activeSentence].words.map((w, idx) => (
                 <div 
                   key={idx}
                   onClick={() => setSelectedWord(idx)}
                   className={`px-4 py-3 rounded-xl text-2xl font-bold cursor-pointer transition-all duration-300 border-b-4 ${selectedWord === idx ? `${w.color} border-white text-white scale-110 shadow-lg` : 'bg-black border-zinc-700 text-zinc-300 hover:bg-zinc-800'}`}
                 >
                    {w.word}
                 </div>
              ))}
           </div>

           {/* Detail Box */}
           <div className="mt-8 h-40">
              {selectedWord !== null ? (
                 <div className={`p-6 rounded-2xl animate-fade-in ${sentences[activeSentence].words[selectedWord].color} bg-opacity-20 border border-white/20`}>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded text-sm font-bold text-white ${sentences[activeSentence].words[selectedWord].color}`}>
                          {sentences[activeSentence].words[selectedWord].type}
                       </span>
                    </div>
                    <p className="text-white text-lg">
                       "{sentences[activeSentence].words[selectedWord].word}" berfungsi sebagai <strong>{sentences[activeSentence].words[selectedWord].type}</strong>.
                    </p>
                    <p className="text-zinc-300 mt-2">
                       {sentences[activeSentence].words[selectedWord].desc}
                    </p>
                 </div>
              ) : (
                 <div className="h-full flex items-center justify-center text-zinc-500 font-bold border-2 border-dashed border-zinc-800 rounded-2xl">
                    Klik pada salah satu bagian kalimat di atas untuk membedah fungsinya.
                 </div>
              )}
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Struktur Kalimat (S-P-O-K)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
             <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Pilih Kalimat:</div>
             {sentences.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActiveSentence(idx); setSelectedWord(null); }}
                  className={`w-full p-3 text-left rounded-xl border text-sm transition-all ${activeSentence === idx ? 'bg-zinc-800 border-zinc-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                >
                  {s.text}
                </button>
             ))}
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>Sebuah kalimat sempurna dalam Bahasa Indonesia minimal harus memiliki <strong>Subjek (S)</strong> dan <strong>Predikat (P)</strong>.</p>
            <ul className="space-y-2 mt-2">
               <li><span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"/> <strong>Subjek:</strong> Siapa/Apa yang melakukan?</li>
               <li><span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"/> <strong>Predikat:</strong> Sedang melakukan apa?</li>
               <li><span className="inline-block w-3 h-3 bg-emerald-600 rounded-full mr-2"/> <strong>Objek:</strong> Siapa/Apa yang dikenai tindakan?</li>
               <li><span className="inline-block w-3 h-3 bg-amber-600 rounded-full mr-2"/> <strong>Keterangan:</strong> Di mana? Kapan? Bagaimana?</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
