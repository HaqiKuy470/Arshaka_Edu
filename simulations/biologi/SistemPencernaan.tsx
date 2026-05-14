"use client";

import { useState } from "react";

export default function SistemPencernaan() {
  const [organ, setOrgan] = useState<"mulut"|"lambung"|"usus_halus"|"usus_besar">("mulut");

  const data = {
    mulut: {
      name: "Mulut & Kerongkongan",
      enzymes: "Amilase (Ptialin)",
      process: "Pencernaan Mekanik (Gigi) dan Kimiawi. Amilase memecah Karbohidrat kompleks menjadi gula sederhana. Makanan didorong ke lambung via gerak Peristaltik.",
      color: "from-pink-500 to-rose-500",
      ph: "pH ~7 (Netral)"
    },
    lambung: {
      name: "Lambung (Stomach)",
      enzymes: "Pepsin, Renin, Asam Klorida (HCl)",
      process: "Pencernaan Kimiawi ekstrim. Asam lambung membunuh kuman. Pepsin memecah Protein menjadi pepton. Makanan berubah menjadi bubur (Kime).",
      color: "from-amber-500 to-orange-600",
      ph: "pH 1.5 - 3.5 (Sangat Asam!)"
    },
    usus_halus: {
      name: "Usus Halus (Small Intestine)",
      enzymes: "Lipase, Tripsin, Amilase (dari Pankreas)",
      process: "Pusat penyerapan nutrisi! Lemak dicerna oleh Lipase & Empedu. Protein dan Karbohidrat dicerna habis. Sari makanan diserap oleh Vili ke pembuluh darah.",
      color: "from-emerald-500 to-teal-500",
      ph: "pH 7 - 8 (Basa)"
    },
    usus_besar: {
      name: "Usus Besar (Colon)",
      enzymes: "Bakteri E. coli",
      process: "Sisa makanan yang tidak diserap akan dibusukkan oleh bakteri menjadi Feses. Air diserap kembali agar feses padat.",
      color: "from-amber-700 to-orange-900",
      ph: "pH 5 - 7"
    }
  };

  const curr = data[organ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Abstract Digestive Tract Map */}
        <div className="w-full max-w-sm flex flex-col items-center gap-2">
           
           {/* Mouth */}
           <div 
             onClick={()=>setOrgan('mulut')}
             className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all border-4 ${organ === 'mulut' ? 'bg-pink-500 border-white scale-110 shadow-[0_0_20px_rgba(236,72,153,0.5)] z-10' : 'bg-pink-900 border-pink-500/50 opacity-60 hover:opacity-100'}`}
           >
             Mulut
           </div>
           
           <div className="w-4 h-16 bg-zinc-700 rounded-full" /> {/* Esophagus */}

           {/* Stomach */}
           <div 
             onClick={()=>setOrgan('lambung')}
             className={`w-32 h-24 rounded-[40px] rounded-tl-lg flex items-center justify-center text-white font-bold cursor-pointer transition-all border-4 ${organ === 'lambung' ? 'bg-amber-500 border-white scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10' : 'bg-amber-900 border-amber-500/50 opacity-60 hover:opacity-100'}`}
           >
             Lambung
           </div>

           <div className="w-4 h-8 bg-zinc-700 rounded-full" />

           {/* Small Intestine */}
           <div 
             onClick={()=>setOrgan('usus_halus')}
             className={`w-40 h-32 rounded-3xl flex items-center justify-center text-white font-bold cursor-pointer transition-all border-4 relative ${organ === 'usus_halus' ? 'bg-emerald-500 border-white scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10' : 'bg-emerald-900 border-emerald-500/50 opacity-60 hover:opacity-100'}`}
           >
             <svg className="absolute inset-2 w-full h-full opacity-30" viewBox="0 0 100 100">
                <path d="M 10 20 Q 30 0 50 30 T 90 20" fill="none" stroke="white" strokeWidth="4"/>
                <path d="M 10 50 Q 30 30 50 60 T 90 50" fill="none" stroke="white" strokeWidth="4"/>
             </svg>
             Usus Halus
           </div>

           {/* Large Intestine surrounds small, but we just list below for abstract */}
           <div className="w-4 h-8 bg-zinc-700 rounded-full" />

           {/* Large Intestine */}
           <div 
             onClick={()=>setOrgan('usus_besar')}
             className={`w-48 h-20 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-all border-4 ${organ === 'usus_besar' ? 'bg-amber-800 border-white scale-110 shadow-[0_0_20px_rgba(180,83,9,0.5)] z-10' : 'bg-amber-950 border-amber-800/50 opacity-60 hover:opacity-100'}`}
           >
             Usus Besar & Anus
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Pencernaan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${curr.color} text-white shadow-xl border border-white/20`}>
            <h4 className="text-xl font-bold mb-4">{curr.name}</h4>
            
            <div className="space-y-4 text-sm">
              <div className="bg-black/30 p-3 rounded-xl backdrop-blur-sm">
                <span className="block text-[10px] uppercase font-bold text-white/70 mb-1">Kondisi pH</span>
                <span className="font-mono bg-white/20 px-2 py-1 rounded">{curr.ph}</span>
              </div>
              
              <div className="bg-black/30 p-3 rounded-xl backdrop-blur-sm">
                <span className="block text-[10px] uppercase font-bold text-white/70 mb-1">Enzim / Zat Aktif</span>
                <span className="font-bold text-yellow-300">{curr.enzymes}</span>
              </div>

              <div className="bg-black/30 p-3 rounded-xl backdrop-blur-sm text-white/90 leading-relaxed">
                <span className="block text-[10px] uppercase font-bold text-white/70 mb-1">Proses Pencernaan</span>
                {curr.process}
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Pencernaan Mekanik:</strong> Menghancurkan makanan menjadi potongan kecil secara fisik (Gigi mengunyah, Lambung meremas).</p>
            <p><strong>Pencernaan Kimiawi:</strong> Mengurai molekul kompleks menjadi sederhana menggunakan <strong>Enzim</strong> agar bisa diserap darah.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
