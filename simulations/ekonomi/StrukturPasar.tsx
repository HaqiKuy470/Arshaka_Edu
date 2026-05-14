"use client";

import { useState } from "react";

export default function StrukturPasar() {
  const [pasar, setPasar] = useState<"sempurna"|"monopoli"|"oligopoli"|"monopolistik">("sempurna");

  const data = {
    sempurna: {
      title: "Persaingan Sempurna",
      desc: "Banyak penjual, banyak pembeli, barang identik (sama persis). Penjual tidak bisa menentukan harga sendiri (Price Taker).",
      example: "Pasar Beras, Pasar Sayur Tradisional",
      color: "bg-emerald-600",
      sellers: 20,
      productVariant: "🌾",
      power: "Sangat Lemah"
    },
    monopoli: {
      title: "Monopoli",
      desc: "Hanya ada SATU penjual yang menguasai pasar tanpa pesaing. Penjual bebas menentukan harga semaunya (Price Maker).",
      example: "PLN (Listrik), PT KAI (Kereta Api)",
      color: "bg-rose-600",
      sellers: 1,
      productVariant: "⚡",
      power: "Sangat Kuat Mutlak"
    },
    oligopoli: {
      title: "Oligopoli",
      desc: "Dikuasai oleh BEBERAPA perusahaan besar saja (2-10). Sering terjadi perang harga atau justru kartel (kerjasama diam-diam).",
      example: "Operator Seluler (Telkomsel, Indosat, XL), Industri Semen",
      color: "bg-amber-600",
      sellers: 3,
      productVariant: "📱",
      power: "Kuat (Saling Ketergantungan)"
    },
    monopolistik: {
      title: "Persaingan Monopolistik",
      desc: "Banyak penjual, tetapi barang yang dijual memiliki DIFERENSIASI (berbeda merk/kualitas). Persaingan ketat di branding/iklan.",
      example: "Warung Kopi (Starbucks vs Kenangan), Sabun Mandi, Baju",
      color: "bg-purple-600",
      sellers: 8,
      productVariant: "☕",
      power: "Sedang (Bisa atur harga lewat Branding)"
    }
  };

  const active = data[pasar];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Struktur Pasar</h2>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in overflow-hidden">
           <div className={`absolute top-0 left-0 w-full h-2 ${active.color}`} />
           
           <div className="flex flex-col md:flex-row gap-8">
              
              {/* Visual Simulation of Sellers */}
              <div className="flex-1 border-r border-white/10 pr-8">
                 <div className="text-xs font-bold text-zinc-500 uppercase mb-4 text-center">Visualisasi Penjual</div>
                 
                 <div className="flex flex-wrap justify-center gap-4 min-h-[200px] content-center">
                    {Array.from({length: active.sellers}).map((_, i) => (
                       <div key={i} className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-black border ${active.color.replace('bg-', 'border-')} shadow-lg animate-fade-in`} style={{ animationDelay: `${i * 0.05}s` }}>
                          <span className="text-2xl">{active.productVariant}</span>
                          {pasar === "monopolistik" && (
                             <span className="text-[8px] text-white bg-purple-900 px-1 rounded absolute -bottom-2 border border-purple-500">Merk {i+1}</span>
                          )}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Data Details */}
              <div className="flex-1">
                 <h3 className={`text-2xl font-black mb-2 ${active.color.replace('bg-', 'text-')}`}>{active.title}</h3>
                 <p className="text-zinc-300 text-sm leading-relaxed mb-6">{active.desc}</p>
                 
                 <div className="space-y-4">
                    <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase">Kekuatan Penjual Atur Harga:</div>
                       <div className="text-lg font-bold text-white">{active.power}</div>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase">Contoh di Dunia Nyata:</div>
                       <div className="text-sm font-medium text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-900/50 mt-1">{active.example}</div>
                    </div>
                 </div>
              </div>

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pilih Jenis Pasar</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button onClick={()=>setPasar("sempurna")} className={`w-full p-4 text-left rounded-xl border transition-all text-sm ${pasar === 'sempurna' ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             🌾 Persaingan Sempurna
          </button>
          
          <button onClick={()=>setPasar("monopoli")} className={`w-full p-4 text-left rounded-xl border transition-all text-sm ${pasar === 'monopoli' ? 'bg-rose-600 border-rose-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             ⚡ Monopoli (Tunggal)
          </button>

          <button onClick={()=>setPasar("oligopoli")} className={`w-full p-4 text-left rounded-xl border transition-all text-sm ${pasar === 'oligopoli' ? 'bg-amber-600 border-amber-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             📱 Oligopoli (Raksasa)
          </button>

          <button onClick={()=>setPasar("monopolistik")} className={`w-full p-4 text-left rounded-xl border transition-all text-sm ${pasar === 'monopolistik' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}>
             ☕ Monopolistik (Branding)
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-400 leading-relaxed mt-4">
            Negara biasanya melarang keras <strong>Monopoli</strong> swasta karena sangat merugikan rakyat (harga bisa diperas seenaknya). Oleh karena itu, monopoli untuk kebutuhan hajat hidup orang banyak (Listrik, Air) dikuasai langsung oleh BUMN.
          </div>

        </div>
      </div>
    </div>
  );
}
