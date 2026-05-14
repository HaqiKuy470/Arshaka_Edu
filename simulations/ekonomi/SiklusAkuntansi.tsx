"use client";

import { useState } from "react";

export default function SiklusAkuntansi() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1, title: "Bukti Transaksi", icon: "🧾", color: "bg-zinc-600",
      desc: "Mengumpulkan struk, nota, kuitansi, atau faktur sebagai bukti sah telah terjadinya transaksi bisnis."
    },
    {
      id: 2, title: "Jurnal Umum", icon: "📓", color: "bg-blue-600",
      desc: "Mencatat transaksi secara kronologis (berdasarkan tanggal) ke dalam sistem Debit dan Kredit."
    },
    {
      id: 3, title: "Buku Besar (Ledger)", icon: "📘", color: "bg-emerald-600",
      desc: "Mengelompokkan catatan dari jurnal ke akun masing-masing (misal: semua tentang Kas dijadikan satu buku)."
    },
    {
      id: 4, title: "Neraca Saldo", icon: "⚖️", color: "bg-amber-600",
      desc: "Merekap total saldo setiap akun untuk memastikan total sisi Debit sama dengan total sisi Kredit."
    },
    {
      id: 5, title: "Jurnal Penyesuaian", icon: "✍️", color: "bg-orange-600",
      desc: "Memperbaiki/menyesuaikan saldo akun agar menunjukkan keadaan riil di akhir periode (misal: penyusutan alat)."
    },
    {
      id: 6, title: "Laporan Keuangan", icon: "📊", color: "bg-purple-600",
      desc: "Hasil akhir! Membuat Laba/Rugi, Perubahan Modal, dan Neraca untuk dilaporkan ke Bos/Investor."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg text-center">Siklus Akuntansi Perusahaan Jasa</h2>

        <div className="relative w-full max-w-4xl">
           
           {/* Connecting Line */}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 z-0 hidden md:block" />

           {/* Steps Path */}
           <div className="grid grid-cols-2 md:flex md:justify-between gap-6 relative z-10">
              {steps.map((s) => (
                 <div 
                   key={s.id} 
                   onClick={() => setStep(s.id)}
                   className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${step === s.id ? 'scale-125' : step > s.id ? 'opacity-70 hover:opacity-100 hover:scale-110' : 'opacity-40 grayscale hover:grayscale-0'}`}
                 >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 shadow-xl border-4 ${step === s.id ? `${s.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]` : 'bg-zinc-800 border-zinc-700'}`}>
                       {s.icon}
                    </div>
                    <div className={`text-xs font-bold text-center w-24 ${step === s.id ? 'text-white' : 'text-zinc-500'}`}>
                       {s.title}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Detail Box */}
        <div className="mt-20 w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in min-h-[200px]">
           <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${steps[step-1].color}`} />
           
           <div className="flex items-start gap-6">
              <div className={`text-6xl ${steps[step-1].color.replace('bg-', 'text-')}`}>
                 {steps[step-1].icon}
              </div>
              <div>
                 <div className="text-sm font-bold text-zinc-500 mb-1 uppercase tracking-widest">Langkah {step} dari 6</div>
                 <h3 className="text-2xl font-bold text-white mb-3">{steps[step-1].title}</h3>
                 <p className="text-zinc-300 text-lg leading-relaxed">{steps[step-1].desc}</p>
              </div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Akuntansi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between">
          
          <div className="space-y-4">
             <button 
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
             >
                ⬅️ Langkah Sebelumnya
             </button>
             
             <button 
                onClick={() => setStep(prev => Math.min(6, prev + 1))}
                disabled={step === 6}
                className={`w-full p-4 font-bold rounded-xl transition-all shadow-lg ${step === 6 ? 'opacity-50 bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
             >
                Langkah Berikutnya ➡️
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 leading-relaxed mt-8">
            <p><strong>Kenapa disebut Siklus?</strong> Karena proses ini berulang secara terus-menerus setiap bulan atau tahun di dalam perusahaan.</p>
            <p>Berkat siklus yang disiplin ini, ribuan struk/nota yang berantakan bisa disulap menjadi 1 lembar laporan keuangan cantik yang dipakai investor untuk mengambil keputusan.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
