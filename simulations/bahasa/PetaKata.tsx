"use client";

import { useState } from "react";

export default function PetaKata() {
  const [activeWord, setActiveWord] = useState<"sinonim"|"antonim"|"homonim"|"polisemi">("sinonim");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg">Relasi Makna Kata</h2>

        <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
           
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M 50 50 L 20 20 M 50 50 L 80 20 M 50 50 L 20 80 M 50 50 L 80 80" stroke="white" strokeWidth="0.5" />
           </svg>

           {activeWord === "sinonim" && (
              <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
                 {/* Center */}
                 <div className="absolute bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-xl z-10 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    Senang
                 </div>
                 {/* Branches */}
                 <div className="absolute top-[20%] left-[20%] bg-zinc-800 px-4 py-2 rounded-xl text-emerald-300 font-bold border border-emerald-900">Gembira</div>
                 <div className="absolute top-[20%] right-[20%] bg-zinc-800 px-4 py-2 rounded-xl text-emerald-300 font-bold border border-emerald-900">Bahagia</div>
                 <div className="absolute bottom-[20%] left-[20%] bg-zinc-800 px-4 py-2 rounded-xl text-emerald-300 font-bold border border-emerald-900">Suka Cita</div>
                 <div className="absolute bottom-[20%] right-[20%] bg-zinc-800 px-4 py-2 rounded-xl text-emerald-300 font-bold border border-emerald-900">Ria</div>
                 
                 <div className="absolute bottom-8 w-full text-center text-sm text-zinc-400 font-bold">Kata yang berbeda namun <span className="text-emerald-400">MAKNANYA SAMA</span>.</div>
              </div>
           )}

           {activeWord === "antonim" && (
              <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
                 {/* VS Line */}
                 <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-red-500/30" />
                 <div className="absolute bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm z-10 shadow-[0_0_20px_rgba(239,68,68,0.8)]">VS</div>
                 
                 {/* Left */}
                 <div className="absolute left-[15%] text-2xl font-black text-white">BESAR</div>
                 {/* Right */}
                 <div className="absolute right-[15%] text-xl font-bold text-zinc-500">KECIL</div>

                 {/* Examples */}
                 <div className="absolute top-[20%] left-[15%] text-lg font-bold text-white">PANAS</div>
                 <div className="absolute top-[20%] right-[15%] text-lg font-bold text-zinc-500">DINGIN</div>
                 
                 <div className="absolute bottom-[20%] left-[15%] text-lg font-bold text-white">TINGGI</div>
                 <div className="absolute bottom-[20%] right-[15%] text-lg font-bold text-zinc-500">PENDEK</div>
                 
                 <div className="absolute bottom-8 w-full text-center text-sm text-zinc-400 font-bold">Kata yang maknanya <span className="text-red-400">BERLAWANAN</span>.</div>
              </div>
           )}

           {activeWord === "homonim" && (
              <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
                 {/* Center */}
                 <div className="absolute bg-sky-600 text-white px-6 py-3 rounded-full font-bold text-2xl z-10 shadow-[0_0_20px_rgba(2,132,199,0.5)]">
                    BISA
                 </div>
                 
                 {/* Left meaning */}
                 <div className="absolute left-[10%] bg-zinc-800 p-4 rounded-xl border border-sky-900 w-40 text-center">
                    <span className="text-3xl block mb-2">🐍</span>
                    <span className="text-sm font-bold text-sky-300">Racun Ular</span>
                 </div>

                 {/* Right meaning */}
                 <div className="absolute right-[10%] bg-zinc-800 p-4 rounded-xl border border-sky-900 w-40 text-center">
                    <span className="text-3xl block mb-2">✅</span>
                    <span className="text-sm font-bold text-sky-300">Dapat / Mampu</span>
                 </div>
                 
                 <div className="absolute bottom-8 w-full text-center text-sm text-zinc-400 font-bold">Tulisannya <span className="text-sky-400">SAMA</span>, Bacanya <span className="text-sky-400">SAMA</span>, Maknanya <span className="text-rose-400">BEDA JAUH (Tidak berhubungan)</span>.</div>
              </div>
           )}

           {activeWord === "polisemi" && (
              <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
                 {/* Center */}
                 <div className="absolute bg-purple-600 text-white px-6 py-3 rounded-full font-bold text-2xl z-10 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                    KEPALA
                 </div>
                 
                 {/* Top */}
                 <div className="absolute top-[10%] bg-zinc-800 px-4 py-2 rounded-xl text-purple-300 font-bold border border-purple-900 text-sm">Bagian Tubuh (Harfiah)</div>
                 {/* Left */}
                 <div className="absolute left-[5%] bg-zinc-800 px-4 py-2 rounded-xl text-purple-300 font-bold border border-purple-900 text-sm">Kepala Sekolah (Pemimpin)</div>
                 {/* Right */}
                 <div className="absolute right-[5%] bg-zinc-800 px-4 py-2 rounded-xl text-purple-300 font-bold border border-purple-900 text-sm">Kepala Surat (Kop / Bagian Atas)</div>
                 {/* Bottom */}
                 <div className="absolute bottom-[20%] bg-zinc-800 px-4 py-2 rounded-xl text-purple-300 font-bold border border-purple-900 text-sm">Kepala Kereta (Gerbong paling depan)</div>
                 
                 <div className="absolute bottom-4 w-full text-center text-sm text-zinc-400 font-bold px-8">Satu kata punya banyak makna, tapi <span className="text-purple-400">MASIH SALING BERHUBUNGAN</span> (contoh: Kepala = Bagian teratas/utama).</div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Relasi Makna</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button onClick={()=>setActiveWord("sinonim")} className={`w-full p-4 text-left rounded-xl border transition-all ${activeWord === 'sinonim' ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             🔄 Sinonim (Persamaan)
          </button>
          
          <button onClick={()=>setActiveWord("antonim")} className={`w-full p-4 text-left rounded-xl border transition-all ${activeWord === 'antonim' ? 'bg-red-600 border-red-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             ⚔️ Antonim (Lawan Kata)
          </button>

          <button onClick={()=>setActiveWord("homonim")} className={`w-full p-4 text-left rounded-xl border transition-all ${activeWord === 'homonim' ? 'bg-sky-600 border-sky-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             👯 Homonim (Kata Kembar)
          </button>

          <button onClick={()=>setActiveWord("polisemi")} className={`w-full p-4 text-left rounded-xl border transition-all ${activeWord === 'polisemi' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             🌳 Polisemi (Makna Cabang)
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Tips Bedakan Homonim & Polisemi:</strong></p>
            <p className="text-sky-400">BISA (Racun) dan BISA (Mampu) itu <strong>Homonim</strong> karena asal muasal katanya beda total secara sejarah.</p>
            <p className="text-purple-400">KEPALA (Tubuh) dan KEPALA (Sekolah) itu <strong>Polisemi</strong> karena asal katanya sama, hanya maknanya diperluas mengibaratkan "pemimpin adalah kepala/otak dari sekolah".</p>
          </div>

        </div>
      </div>
    </div>
  );
}
