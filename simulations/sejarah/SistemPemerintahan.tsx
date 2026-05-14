"use client";

import { useState } from "react";

export default function SistemPemerintahan() {
  const [system, setSystem] = useState<"presidensial"|"parlementer">("presidensial");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Sistem Pemerintahan Dunia</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg">
           Bagaimana kekuasaan negara didistribusikan?
        </p>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
           
           <div className="flex justify-center mb-8 gap-4">
              <button 
                onClick={()=>setSystem("presidensial")} 
                className={`px-6 py-2 rounded-xl font-bold transition-all border-2 ${system === 'presidensial' ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
              >
                 Presidensial (Ketat)
              </button>
              <button 
                onClick={()=>setSystem("parlementer")} 
                className={`px-6 py-2 rounded-xl font-bold transition-all border-2 ${system === 'parlementer' ? 'bg-sky-600 text-white border-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.5)]' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
              >
                 Parlementer (Baur)
              </button>
           </div>

           {/* Visualization Area */}
           <div className="relative min-h-[350px] animate-fade-in flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              
              {system === "presidensial" && (
                 <>
                    {/* Presidensial Diagram */}
                    {/* Eksekutif */}
                    <div className="flex flex-col items-center z-10">
                       <div className="bg-rose-600 text-white w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-4 border-rose-400 shadow-xl">
                          <span className="text-4xl mb-1">👔</span>
                          <span className="font-black">Presiden</span>
                       </div>
                       <div className="bg-black/50 mt-4 p-3 rounded-lg border border-zinc-800 text-center w-48">
                          <p className="text-xs text-rose-300 font-bold mb-1">Kepala Negara SEKALIGUS Kepala Pemerintahan</p>
                          <p className="text-[10px] text-zinc-400">Dipilih langsung oleh rakyat. Tidak bisa dijatuhkan oleh Parlemen (kecuali pemakzulan/kasus hukum berat).</p>
                       </div>
                    </div>

                    {/* Divider/Wall */}
                    <div className="h-64 w-2 bg-zinc-700 rounded-full relative shadow-[0_0_15px_black]">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-4 rounded rotate-180" style={{ writingMode: 'vertical-rl' }}>
                          PEMISAHAN KEKUASAAN TEGAS
                       </div>
                    </div>

                    {/* Legislatif */}
                    <div className="flex flex-col items-center z-10">
                       <div className="bg-emerald-600 text-white w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-4 border-emerald-400 shadow-xl">
                          <span className="text-4xl mb-1">🏛️</span>
                          <span className="font-black">Parlemen</span>
                       </div>
                       <div className="bg-black/50 mt-4 p-3 rounded-lg border border-zinc-800 text-center w-48">
                          <p className="text-xs text-emerald-300 font-bold mb-1">DPR / Kongres</p>
                          <p className="text-[10px] text-zinc-400">Dipilih langsung oleh rakyat. Mengawasi Presiden, tapi tidak bisa memecatnya karena beda kebijakan.</p>
                       </div>
                    </div>
                 </>
              )}

              {system === "parlementer" && (
                 <>
                    {/* Parlementer Diagram */}
                    {/* Kepala Negara (Simbol) */}
                    <div className="flex flex-col items-center absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-0 opacity-80">
                       <div className="bg-amber-600 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl">
                          <span className="text-3xl mb-1">👑</span>
                          <span className="font-bold text-[10px]">Raja/Presiden</span>
                       </div>
                       <div className="bg-black/80 mt-2 px-2 py-1 rounded text-center max-w-[120px]">
                          <p className="text-[8px] text-amber-300 font-bold">Hanya Kepala Negara (Simbolis)</p>
                       </div>
                    </div>

                    {/* Parlemen */}
                    <div className="flex flex-col items-center z-10 mt-16">
                       <div className="bg-emerald-600 text-white w-40 h-32 rounded-2xl flex flex-col items-center justify-center border-4 border-emerald-400 shadow-xl relative">
                          <span className="text-4xl mb-1">🏛️</span>
                          <span className="font-black">Parlemen</span>
                          
                          {/* Arrow pointing to PM */}
                          <svg className="absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                       </div>
                       <div className="bg-black/50 mt-4 p-3 rounded-lg border border-zinc-800 text-center w-56">
                          <p className="text-xs text-emerald-300 font-bold mb-1">Pusat Kekuasaan Asli</p>
                          <p className="text-[10px] text-zinc-400">Dipilih oleh rakyat. Partai mayoritas di Parlemen berhak menunjuk Perdana Menteri.</p>
                       </div>
                    </div>

                    {/* Perdana Menteri */}
                    <div className="flex flex-col items-center z-10 mt-16">
                       <div className="bg-sky-600 text-white w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-4 border-sky-400 shadow-xl">
                          <span className="text-4xl mb-1">👔</span>
                          <span className="font-black text-center leading-tight">Perdana<br/>Menteri</span>
                       </div>
                       <div className="bg-black/50 mt-4 p-3 rounded-lg border border-zinc-800 text-center w-48 relative">
                          <p className="text-xs text-sky-300 font-bold mb-1">Kepala Pemerintahan</p>
                          <p className="text-[10px] text-zinc-400">Bisa dijatuhkan (dipecat) kapan saja oleh Parlemen lewat "Mosi Tidak Percaya".</p>
                       </div>
                    </div>
                 </>
              )}

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Pemerintahan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            {system === "presidensial" ? (
               <>
                  <p className="text-rose-400 font-bold">Presidensial (Contoh: Indonesia, AS)</p>
                  <p>Kekuasaan eksekutif dan legislatif dipisah murni (Trias Politica). Rakyat mencoblos 2 kali: untuk milih Presiden dan milih wakil DPR.</p>
                  <p><strong>Kelebihan:</strong> Pemerintah stabil selama 5 tahun karena Presiden sulit dipecat.</p>
               </>
            ) : (
               <>
                  <p className="text-sky-400 font-bold">Parlementer (Contoh: Inggris, Jepang, Malaysia)</p>
                  <p>Eksekutif dan legislatif menyatu. Rakyat hanya mencoblos wakil DPR. Partai menang di DPR otomatis menunjuk ketuanya jadi Perdana Menteri (PM).</p>
                  <p><strong>Kekurangan:</strong> Jika koalisi di DPR pecah, PM bisa langsung digulingkan besok pagi, negara jadi sering ganti pemimpin.</p>
               </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
