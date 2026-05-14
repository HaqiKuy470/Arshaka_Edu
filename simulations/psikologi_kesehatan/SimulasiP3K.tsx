"use client";

import { useState } from "react";

export default function SimulasiP3K() {
  const [scenario, setScenario] = useState<"luka"|"tersedak"|"pingsan">("luka");
  const [step, setStep] = useState(0);

  const lukaSteps = [
     { title: "Cuci Tangan", desc: "Pastikan tangan Anda bersih sebelum menyentuh luka agar tidak terjadi infeksi." },
     { title: "Hentikan Pendarahan", desc: "Tekan luka dengan kasa steril atau kain bersih dengan lembut hingga darah berhenti." },
     { title: "Bersihkan Luka", desc: "Bilas luka di bawah air mengalir. Jangan gunakan alkohol atau hidrogen peroksida karena merusak jaringan." },
     { title: "Tutup Luka", desc: "Oleskan salep antibiotik (jika ada) dan tutup dengan plester atau perban bersih." }
  ];

  const tersedakSteps = [
     { title: "Tanya Korban", desc: "Tanyakan 'Apakah Anda tersedak?'. Jika ia bisa batuk atau bicara, biarkan ia batuk sendiri." },
     { title: "Pukulan Punggung", desc: "Berdiri di belakang korban, bungkukkan badannya, berikan 5 pukulan keras di antara tulang belikat menggunakan tumit telapak tangan." },
     { title: "Heimlich Maneuver", desc: "Peluk korban dari belakang, kepalkan satu tangan di atas pusar, tarik ke dalam dan ke atas secara menghentak 5 kali." },
     { title: "Panggil Bantuan", desc: "Jika benda belum keluar dan korban mulai kehilangan kesadaran, segera panggil ambulans (119)." }
  ];

  const pingsanSteps = [
     { title: "Amankan Lokasi", desc: "Bawa korban ke tempat teduh dan aman. Pastikan tidak ada kerumunan agar udara lancar." },
     { title: "Posisikan Tubuh", desc: "Baringkan korban telentang. Angkat kedua kakinya lebih tinggi dari jantung (sekitar 30 cm) agar darah mengalir ke otak." },
     { title: "Longgarkan Pakaian", desc: "Buka kancing kerah baju, longgarkan ikat pinggang atau aksesoris yang ketat." },
     { title: "Panggil / Sadarkan", desc: "Tepuk pundaknya dengan lembut 'Pak/Bu!'. Jangan menyiram dengan air. Jika tidak sadar > 1 menit, panggil bantuan medis." }
  ];

  const activeSteps = scenario === "luka" ? lukaSteps : scenario === "tersedak" ? tersedakSteps : pingsanSteps;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Pertolongan Pertama (P3K)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Langkah krusial menyelamatkan nyawa sebelum dokter tiba.
        </p>

        <div className="flex justify-center mb-8 w-full max-w-lg">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => {setScenario("luka"); setStep(0)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${scenario === 'luka' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'}`}>🩸 Luka Terbuka</button>
              <button onClick={() => {setScenario("tersedak"); setStep(0)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${scenario === 'tersedak' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'}`}>🦴 Tersedak</button>
              <button onClick={() => {setScenario("pingsan"); setStep(0)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${scenario === 'pingsan' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>😵 Pingsan</button>
           </div>
        </div>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
           
           {/* Visual Aid Area */}
           <div className="text-8xl mb-8">
              {scenario === "luka" ? "🩹" : scenario === "tersedak" ? "🙅‍♂️" : "🛌"}
           </div>

           <div className="w-full max-w-md bg-black border border-zinc-700 p-6 rounded-2xl relative">
              {/* Step indicator */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-zinc-900">
                 {step + 1}
              </div>

              <h3 className="text-2xl font-bold text-white text-center mt-2 mb-4">{activeSteps[step].title}</h3>
              <p className="text-zinc-300 text-center leading-relaxed">
                 {activeSteps[step].desc}
              </p>
           </div>

           {/* Controls */}
           <div className="flex gap-4 mt-8">
              <button 
                 onClick={() => setStep(Math.max(0, step - 1))}
                 disabled={step === 0}
                 className="px-6 py-2 bg-zinc-800 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-zinc-700"
              >
                 &larr; Sebelumnya
              </button>
              <button 
                 onClick={() => setStep(Math.min(activeSteps.length - 1, step + 1))}
                 disabled={step === activeSteps.length - 1}
                 className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-emerald-500"
              >
                 Selanjutnya &rarr;
              </button>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Prinsip Emas P3K</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/30 text-sm text-red-200 leading-relaxed">
             <h4 className="font-bold text-red-500 mb-2">Aturan D-R-A-B-C</h4>
             <ul className="space-y-2 text-xs">
                <li><strong className="text-white">D - Danger:</strong> Pastikan lingkungan aman untuk Anda dan korban.</li>
                <li><strong className="text-white">R - Response:</strong> Cek kesadaran korban (Panggil/tepuk).</li>
                <li><strong className="text-white">A - Airway:</strong> Buka jalan napas (Dongakkan kepala).</li>
                <li><strong className="text-white">B - Breathing:</strong> Cek apakah korban bernapas (Lihat dada, dengar hidung).</li>
                <li><strong className="text-white">C - CPR:</strong> Jika tidak bernapas, lakukan kompresi dada (RJP/CPR).</li>
             </ul>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed text-center">
             <div className="font-black text-xl text-white mb-1">📞 119</div>
             <div>Nomor Darurat Medis / Ambulans Indonesia</div>
          </div>

        </div>
      </div>
    </div>
  );
}
