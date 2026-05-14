"use client";

import { useState } from "react";

export default function Morfologi() {
  const [baseWord, setBaseWord] = useState("tulis");
  const [prefix, setPrefix] = useState<string | null>(null);
  const [suffix, setSuffix] = useState<string | null>(null);

  // Simple morphology dictionary
  const getResult = () => {
     let result = baseWord;
     
     // Handle Prefix (Awalan)
     if (prefix === "me-") {
        if (baseWord === "tulis") result = "menulis"; // me + t = men (t luluh)
        else if (baseWord === "baca") result = "membaca"; // me + b = mem
        else if (baseWord === "sapu") result = "menyapu"; // me + s = meny (s luluh)
     } else if (prefix === "pe-") {
        if (baseWord === "tulis") result = "penulis";
        else if (baseWord === "baca") result = "pembaca";
        else if (baseWord === "sapu") result = "penyapu";
     } else if (prefix === "di-") {
        result = "di" + baseWord;
     }

     // Handle Suffix (Akhiran)
     if (suffix === "-an") {
        result = result + "an";
     } else if (suffix === "-kan") {
        result = result + "kan";
     } else if (suffix === "-i") {
        result = result + "i";
     }

     return result;
  };

  const getMeaning = () => {
     if (prefix === "me-" && !suffix) return "Melakukan kegiatan " + baseWord + ". (Kata Kerja Aktif)";
     if (prefix === "di-" && !suffix) return "Dikenai tindakan " + baseWord + ". (Kata Kerja Pasif)";
     if (prefix === "pe-" && !suffix) return "Orang/alat yang melakukan " + baseWord + ". (Kata Benda)";
     if (!prefix && suffix === "-an") return "Hasil dari " + baseWord + " / Sesuatu yang di" + baseWord + ". (Kata Benda)";
     if (prefix === "me-" && suffix === "-kan") return "Melakukan kegiatan " + baseWord + " untuk orang lain. (Kata Kerja Aktif Transitif)";
     
     return "Variasi kata bentuk turunan.";
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg text-center">Mesin Pembuat Kata (Afiksasi)</h2>

        <div className="flex flex-col md:flex-row items-center gap-6 bg-zinc-900 border border-white/10 p-10 rounded-3xl shadow-2xl relative">
           
           {/* Conveyor Belt background */}
           <div className="absolute top-1/2 left-0 w-full h-8 bg-zinc-800 -translate-y-1/2 border-y-4 border-zinc-950 flex items-center justify-center opacity-50 z-0">
             <div className="w-full border-t border-dashed border-zinc-600" />
           </div>

           {/* Prefix Box */}
           <div className="z-10 flex flex-col items-center">
              <span className="text-xs font-bold text-sky-400 mb-2 uppercase">Awalan (Prefiks)</span>
              <div className="flex flex-col gap-2">
                 <button onClick={()=>setPrefix(prefix === "me-" ? null : "me-")} className={`px-4 py-2 font-bold rounded border ${prefix==='me-' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>me-</button>
                 <button onClick={()=>setPrefix(prefix === "pe-" ? null : "pe-")} className={`px-4 py-2 font-bold rounded border ${prefix==='pe-' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>pe-</button>
                 <button onClick={()=>setPrefix(prefix === "di-" ? null : "di-")} className={`px-4 py-2 font-bold rounded border ${prefix==='di-' ? 'bg-sky-600 border-sky-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>di-</button>
              </div>
           </div>

           <div className="text-3xl font-black text-zinc-600 z-10">+</div>

           {/* Root Word Box */}
           <div className="z-10 flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 mb-2 uppercase">Kata Dasar</span>
              <div className="flex flex-col gap-2">
                 <button onClick={()=>setBaseWord("tulis")} className={`px-6 py-4 text-xl font-bold rounded border ${baseWord==='tulis' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>tulis</button>
                 <button onClick={()=>setBaseWord("baca")} className={`px-6 py-4 text-xl font-bold rounded border ${baseWord==='baca' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>baca</button>
                 <button onClick={()=>setBaseWord("sapu")} className={`px-6 py-4 text-xl font-bold rounded border ${baseWord==='sapu' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>sapu</button>
              </div>
           </div>

           <div className="text-3xl font-black text-zinc-600 z-10">+</div>

           {/* Suffix Box */}
           <div className="z-10 flex flex-col items-center">
              <span className="text-xs font-bold text-amber-400 mb-2 uppercase">Akhiran (Sufiks)</span>
              <div className="flex flex-col gap-2">
                 <button onClick={()=>setSuffix(suffix === "-an" ? null : "-an")} className={`px-4 py-2 font-bold rounded border ${suffix==='-an' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>-an</button>
                 <button onClick={()=>setSuffix(suffix === "-kan" ? null : "-kan")} className={`px-4 py-2 font-bold rounded border ${suffix==='-kan' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>-kan</button>
                 <button onClick={()=>setSuffix(suffix === "-i" ? null : "-i")} className={`px-4 py-2 font-bold rounded border ${suffix==='-i' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-black text-zinc-400 border-zinc-700'}`}>-i</button>
              </div>
           </div>

        </div>

        {/* Result Area */}
        <div className="mt-12 text-center animate-fade-in">
           <div className="text-zinc-500 font-bold uppercase mb-2">Hasil Pembentukan Kata:</div>
           <div className="text-5xl font-black text-white bg-white/5 px-8 py-4 border border-white/20 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-block">
              {getResult()}
           </div>
           
           {(prefix || suffix) && (
              <div className="mt-6 bg-black/50 p-4 rounded-xl border border-zinc-800 text-zinc-300 max-w-lg">
                 Makna: <strong>{getMeaning()}</strong>
                 
                 {/* Special morphological rule hint */}
                 {prefix === "me-" && baseWord === "tulis" && (
                    <div className="mt-2 text-xs text-rose-400 font-bold bg-rose-950/50 p-2 rounded">Perhatikan: me + tulis ➔ huruf 't' luluh (hilang) menjadi menulis!</div>
                 )}
                 {prefix === "pe-" && baseWord === "sapu" && (
                    <div className="mt-2 text-xs text-rose-400 font-bold bg-rose-950/50 p-2 rounded">Perhatikan: pe + sapu ➔ huruf 's' luluh (hilang) menjadi penyapu!</div>
                 )}
              </div>
           )}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Morfologi (Pembentukan Kata)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p><strong>Morfologi</strong> adalah ilmu yang mempelajari seluk-beluk bentuk kata dan perubahannya.</p>
            <p>Dalam bahasa Indonesia, kita sangat sering mengubah makna sebuah kata dasar hanya dengan menempelkan <strong>Imbuhan (Afiks)</strong>.</p>
            
            <hr className="border-white/10 my-4" />
            <h4 className="font-bold text-white mb-2">Hukum K-P-T-S Luluh</h4>
            <p className="text-zinc-400">Jika awalan <strong>me-</strong> atau <strong>pe-</strong> bertemu dengan kata dasar yang diawali huruf K, P, T, atau S, maka huruf awal tersebut akan <strong>luluh (hilang)</strong> dilebur oleh sengau.</p>
            <ul className="space-y-1 mt-2 text-rose-300 font-mono">
               <li>me + sapu = me<span className="line-through text-zinc-600">s</span>nyapu (menyapu)</li>
               <li>me + tulis = me<span className="line-through text-zinc-600">t</span>nulis (menulis)</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
