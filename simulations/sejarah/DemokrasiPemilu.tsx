"use client";

import { useState } from "react";

export default function DemokrasiPemilu() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1, title: "Pendaftaran Pemilih", icon: "📋",
      desc: "Warga negara yang sudah cukup umur (di Indonesia 17 tahun atau sudah menikah) didata menjadi Daftar Pemilih Tetap (DPT). Ini untuk mencegah orang mencoblos ganda atau orang mati ikut nyoblos."
    },
    {
      id: 2, title: "Kampanye", icon: "📢",
      desc: "Para kandidat/partai beradu gagasan, visi, misi, dan janji politik untuk meyakinkan rakyat. Sering diwarnai debat publik, baliho, dan kampanye medsos."
    },
    {
      id: 3, title: "Masa Tenang", icon: "🤫",
      desc: "Biasanya 3 hari sebelum pemungutan suara. Semua atribut kampanye dibersihkan dan dilarang ada aktivitas politik agar rakyat bisa berpikir jernih tanpa tekanan."
    },
    {
      id: 4, title: "Pemungutan Suara (Voting)", icon: "🗳️",
      desc: "Rakyat datang ke TPS (Tempat Pemungutan Suara). Memilih secara LUBER JURDIL (Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil) ke dalam bilik suara."
    },
    {
      id: 5, title: "Penghitungan Suara", icon: "🧮",
      desc: "Kertas suara dihitung secara terbuka di TPS disaksikan saksi partai, panitia, dan warga. Hasil direkapitulasi secara berjenjang hingga tingkat nasional."
    },
    {
      id: 6, title: "Penetapan Pemenang", icon: "🏆",
      desc: "KPU (Komisi Pemilihan Umum) mengumumkan pemenang resmi. Pemenang yang mendapat suara terbanyak mendapat mandat (kuasa) dari rakyat untuk memimpin."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Pesta Demokrasi (Pemilu)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg">
           Dari rakyat, oleh rakyat, untuk rakyat.
        </p>

        <div className="w-full max-w-4xl relative">
           
           {/* Progress Line */}
           <div className="absolute top-1/2 left-0 w-full h-2 bg-zinc-800 -translate-y-1/2 rounded-full overflow-hidden hidden md:block">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${((step - 1) / 5) * 100}%` }} 
              />
           </div>

           {/* Nodes */}
           <div className="grid grid-cols-2 md:flex md:justify-between gap-6 relative z-10">
              {steps.map((s) => (
                 <div 
                   key={s.id} 
                   onClick={() => setStep(s.id)}
                   className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${step === s.id ? 'scale-110' : step > s.id ? 'opacity-100 hover:scale-105' : 'opacity-40 grayscale hover:grayscale-0'}`}
                 >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-all border-4 ${step === s.id ? 'bg-blue-600 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)]' : step > s.id ? 'bg-emerald-600 border-emerald-400' : 'bg-zinc-800 border-zinc-700'}`}>
                       {step > s.id ? "✅" : s.icon}
                    </div>
                    <div className={`text-xs font-bold text-center w-24 ${step === s.id ? 'text-white' : 'text-zinc-500'}`}>
                       {s.title}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Detail View */}
        <div className="mt-16 w-full max-w-2xl bg-zinc-900 border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative animate-fade-in flex flex-col md:flex-row gap-8 items-center text-center md:text-left min-h-[200px]">
           <div className="text-8xl drop-shadow-2xl">{steps[step-1].icon}</div>
           <div>
              <h3 className="text-2xl font-black text-white mb-2 text-blue-400">{steps[step-1].title}</h3>
              <p className="text-zinc-300 leading-relaxed">{steps[step-1].desc}</p>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Demokrasi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between">
          
          <div className="space-y-4">
             <button 
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
             >
                Langkah Mundur
             </button>
             
             <button 
                onClick={() => setStep(prev => Math.min(6, prev + 1))}
                disabled={step === 6}
                className={`w-full p-4 font-bold rounded-xl transition-all shadow-lg ${step === 6 ? 'opacity-50 bg-zinc-800' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
             >
                Langkah Lanjut
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 leading-relaxed mt-8">
            <p><strong>Demokrasi</strong> adalah sistem dimana kekuasaan tertinggi dipegang oleh rakyat.</p>
            <p>Karena tidak mungkin 270 juta rakyat Indonesia mengatur negara bersama-sama tiap hari, maka diadakan <strong>Pemilu</strong> untuk menunjuk wakil-wakil yang bisa dipercaya memegang kuasa tersebut selama 5 tahun.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
