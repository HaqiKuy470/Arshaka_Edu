"use client";

import { useState } from "react";

export default function ModelOSI() {
  const [activeLayer, setActiveLayer] = useState<number>(7);

  const layers = [
    { id: 7, name: "Application Layer", desc: "Tempat interaksi langsung dengan user/manusia. Aplikasi browser (Chrome, WA) beroperasi di sini menggunakan protokol seperti HTTP, FTP, SMTP.", icon: "🌐", color: "bg-purple-600" },
    { id: 6, name: "Presentation Layer", desc: "Penerjemah data. Mengubah data dari aplikasi menjadi format standar jaringan. Juga melakukan Enkripsi (SSL/TLS) dan Kompresi gambar (JPG/PNG).", icon: "🔒", color: "bg-fuchsia-600" },
    { id: 5, name: "Session Layer", desc: "Membuka, menjaga, dan menutup koneksi (sesi) percakapan antar dua komputer. Jika download putus, dia yang mengatur untuk 'resume'.", icon: "⏱️", color: "bg-pink-600" },
    { id: 4, name: "Transport Layer", desc: "Membelah data besar menjadi segmen-segmen kecil. Menjamin data sampai utuh (TCP) atau kirim cepat tanpa peduli hilang (UDP untuk streaming/game).", icon: "📦", color: "bg-rose-600" },
    { id: 3, name: "Network Layer", desc: "Menambahkan IP Address pengirim & tujuan. Menentukan rute jalan terbaik (Routing) melewati router-router di seluruh dunia.", icon: "🗺️", color: "bg-orange-600" },
    { id: 2, name: "Data Link Layer", desc: "Mendeteksi error dari layer fisik. Menambahkan MAC Address (alamat perangkat keras). Perangkat Switch beroperasi di layer ini.", icon: "🔗", color: "bg-amber-600" },
    { id: 1, name: "Physical Layer", desc: "Level paling bawah. Mengubah data digital (0 dan 1) menjadi sinyal fisik seperti aliran listrik (kabel tembaga), cahaya (fiber optik), atau gelombang radio (WiFi).", icon: "⚡", color: "bg-yellow-600" }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Model OSI (Open Systems Interconnection)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-2xl mx-auto">
           Konsep abstrak 7 lapis yang menjelaskan bagaimana data berjalan dari aplikasi di komputer pengirim, turun ke kabel, lalu naik lagi ke layar komputer penerima.
        </p>

        <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-center gap-8 lg:gap-16 w-full max-w-5xl mx-auto">
           
           {/* The 7 Layers Stack */}
           <div className="flex flex-col w-full max-w-[250px] shrink-0 border-x-4 border-b-4 border-zinc-700 bg-black/50 rounded-b-xl overflow-hidden pb-1 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {layers.map((layer) => (
                 <div 
                   key={layer.id}
                   onMouseEnter={() => setActiveLayer(layer.id)}
                   className={`flex items-center gap-3 p-3 cursor-pointer border-b border-zinc-800 transition-all ${activeLayer === layer.id ? `${layer.color} text-white font-bold translate-x-2` : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                 >
                    <span className="font-mono font-bold w-6 text-center">{layer.id}</span>
                    <span className="text-xl">{layer.icon}</span>
                    <span className="text-sm">{layer.name}</span>
                 </div>
              ))}
              <div className="text-center py-2 text-[10px] text-zinc-500 font-bold tracking-widest bg-zinc-900 border-t border-zinc-700">KABEL / WIFI</div>
           </div>

           {/* Description Card */}
           <div className="flex-1 w-full relative">
              <div className="sticky top-8">
                 {layers.filter(l => l.id === activeLayer).map(active => (
                    <div key={active.id} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in min-h-[300px] flex flex-col justify-center">
                       <div className={`absolute top-0 left-0 w-2 h-full ${active.color}`} />
                       
                       <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${active.color}`}>
                             {active.icon}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Layer {active.id}</div>
                             <h3 className="text-3xl font-black text-white">{active.name}</h3>
                          </div>
                       </div>
                       
                       <p className="text-zinc-300 text-lg leading-relaxed">{active.desc}</p>
                    </div>
                 ))}
                 
                 {/* Animation Visualization Concept */}
                 <div className="mt-8 flex items-center justify-between text-zinc-500 text-sm font-bold px-4">
                    <div className="flex flex-col items-center">
                       <span className="mb-2">Arah Kirim (Encapsulation)</span>
                       <span className="text-2xl animate-bounce">↓</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="mb-2">Arah Terima (Decapsulation)</span>
                       <span className="text-2xl animate-bounce" style={{animationDirection: "reverse"}}>↑</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Panduan Belajar</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-900/50 space-y-2 text-xs text-rose-200">
            <h4 className="font-bold text-sm text-rose-400 mb-2">Jembatan Keledai (Mnemonics)</h4>
            <p>Untuk menghafal 7 Layer dari bawah ke atas (1 ke 7):</p>
            <ul className="list-disc pl-4 space-y-1 font-bold">
               <li><span className="text-white">P</span>lease (Physical)</li>
               <li><span className="text-white">D</span>o (Data Link)</li>
               <li><span className="text-white">N</span>ot (Network)</li>
               <li><span className="text-white">T</span>hrow (Transport)</li>
               <li><span className="text-white">S</span>ausage (Session)</li>
               <li><span className="text-white">P</span>izza (Presentation)</li>
               <li><span className="text-white">A</span>way (Application)</li>
            </ul>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 leading-relaxed mt-4">
            <p>Model OSI hanyalah teori referensi. Di dunia nyata (internet aktual), sistem yang dipakai adalah <strong>TCP/IP Model</strong> yang memadatkan 7 layer ini menjadi hanya 4 layer saja (Application, Transport, Internet, Network Access).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
