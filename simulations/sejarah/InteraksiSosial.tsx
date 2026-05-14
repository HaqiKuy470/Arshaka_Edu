"use client";

import { useState } from "react";

export default function InteraksiSosial() {
  const [activeInteraksi, setActiveInteraksi] = useState<number>(0);

  const interaksi = [
    {
      title: "Kerja Sama (Kooperasi)",
      type: "Asosiatif (+)",
      desc: "Usaha bersama antar individu atau kelompok untuk mencapai satu tujuan yang sama.",
      example: "Warga desa melakukan kerja bakti membersihkan selokan sebelum musim hujan.",
      icon: "🤝",
      color: "bg-emerald-600"
    },
    {
      title: "Akomodasi",
      type: "Asosiatif (+)",
      desc: "Upaya meredakan pertentangan/konflik agar tercipta kestabilan. (Contoh jenisnya: Mediasi, Kompromi).",
      example: "Ketua RT menjadi penengah (mediator) saat dua tetangga bertengkar soal batas tanah.",
      icon: "⚖️",
      color: "bg-teal-600"
    },
    {
      title: "Asimilasi",
      type: "Asosiatif (+)",
      desc: "Peleburan dua kebudayaan berbeda menjadi satu kebudayaan baru yang khas, hilangnya identitas asli.",
      example: "Pernikahan campur antar etnis yang menghasilkan budaya silang baru di suatu wilayah.",
      icon: "🧬",
      color: "bg-blue-600"
    },
    {
      title: "Persaingan (Kompetisi)",
      type: "Disosiatif (-)",
      desc: "Proses individu atau kelompok bersaing mencari keuntungan tanpa menggunakan ancaman atau kekerasan.",
      example: "Siswa-siswi di kelas berlomba-lomba belajar giat untuk mendapatkan peringkat pertama.",
      icon: "🏁",
      color: "bg-amber-600"
    },
    {
      title: "Kontravensi",
      type: "Disosiatif (-)",
      desc: "Perasaan tidak suka yang disembunyikan, keraguan, atau penolakan diam-diam sebelum memuncak jadi konflik.",
      example: "Karyawan diam-diam menyebarkan gosip atau memboikot bos yang otoriter.",
      icon: "😒",
      color: "bg-orange-600"
    },
    {
      title: "Pertentangan (Konflik)",
      type: "Disosiatif (-)",
      desc: "Interaksi ekstrem di mana satu pihak berusaha menjatuhkan, menghancurkan, atau menyakiti pihak lain.",
      example: "Tawuran antar pelajar beda sekolah, atau perang antar negara.",
      icon: "⚔️",
      color: "bg-rose-600"
    }
  ];

  const active = interaksi[activeInteraksi];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Bentuk Interaksi Sosial</h2>
           <p className="text-zinc-400 text-sm">Bagaimana manusia bertindak dan bereaksi terhadap manusia lain?</p>
        </div>

        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in flex flex-col md:flex-row gap-8 items-center">
           <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${active.color}`} />
           
           <div className={`text-8xl ${active.color.replace('bg-', 'text-')} drop-shadow-2xl`}>
              {active.icon}
           </div>

           <div className="flex-1">
              <div className="inline-block bg-white/10 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3 border border-white/20">
                 PROSES {active.type}
              </div>
              <h3 className="text-3xl font-black text-white mb-2">{active.title}</h3>
              <p className="text-zinc-300 leading-relaxed mb-4">{active.desc}</p>
              
              <div className="bg-black/50 p-4 rounded-xl border border-zinc-800">
                 <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Contoh Nyata:</div>
                 <div className="text-sm font-medium text-amber-300 italic">"{active.example}"</div>
              </div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Bentuk Interaksi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* Asosiatif Group */}
          <div>
             <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-widest">Asosiatif (Positif)</div>
             <div className="space-y-2">
                {interaksi.map((i, idx) => i.type.includes("+") && (
                   <button 
                     key={idx} onClick={()=>setActiveInteraksi(idx)}
                     className={`w-full p-3 text-left rounded-xl transition-all border ${activeInteraksi === idx ? `${i.color} border-transparent text-white font-bold` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                   >
                      <span className="mr-2">{i.icon}</span> {i.title}
                   </button>
                ))}
             </div>
          </div>

          {/* Disosiatif Group */}
          <div>
             <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-widest">Disosiatif (Negatif)</div>
             <div className="space-y-2">
                {interaksi.map((i, idx) => i.type.includes("-") && (
                   <button 
                     key={idx} onClick={()=>setActiveInteraksi(idx)}
                     className={`w-full p-3 text-left rounded-xl transition-all border ${activeInteraksi === idx ? `${i.color} border-transparent text-white font-bold` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                   >
                      <span className="mr-2">{i.icon}</span> {i.title}
                   </button>
                ))}
             </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>Manusia adalah <strong>Zoon Politicon</strong> (Makhluk Sosial). Kita tidak bisa hidup sendiri.</p>
            <p>Syarat mutlak terjadinya interaksi sosial ada dua: <strong>Kontak Sosial</strong> (saling sadar akan kehadiran pihak lain) dan <strong>Komunikasi</strong> (saling memahami pesan).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
