"use client";

import { useState } from "react";

export default function KebijakanFiskalMoneter() {
  const [fiscal, setFiscal] = useState<"ekspansif"|"kontraktif"|"netral">("netral");
  const [monetary, setMonetary] = useState<"ekspansif"|"kontraktif"|"netral">("netral");

  // Visual Logic mapping
  const getEconomyState = () => {
     let heat = 0; // -2 (Frozen/Recession) to +2 (Overheating/Inflation)
     
     if (fiscal === "ekspansif") heat += 1;
     if (fiscal === "kontraktif") heat -= 1;
     
     if (monetary === "ekspansif") heat += 1;
     if (monetary === "kontraktif") heat -= 1;

     if (heat >= 2) return { name: "Overheating (Inflasi Ekstrim)", color: "bg-rose-600", desc: "Pemerintah habis-habisan membelanjakan uang DAN Bank Sentral menurunkan suku bunga. Uang beredar gila-gilaan, harga barang meroket!" };
     if (heat === 1) return { name: "Tumbuh Cepat (Risiko Inflasi)", color: "bg-orange-500", desc: "Ekonomi dipacu. Banyak lapangan kerja terbuka, bisnis bergairah, tapi harga mulai pelan-pelan naik." };
     if (heat === 0) return { name: "Stabil / Seimbang", color: "bg-emerald-500", desc: "Pertumbuhan ekonomi stabil. Harga barang terjangkau. Ideal." };
     if (heat === -1) return { name: "Melambat (Risiko Deflasi)", color: "bg-blue-400", desc: "Ekonomi direm. Harga barang turun, tapi lapangan kerja mulai susah didapat. Bisnis lesu." };
     return { name: "Resesi / Beku", color: "bg-blue-700", desc: "Pemerintah pelit belanja, pajak tinggi, DAN Bank Sentral mematok bunga tinggi. Tidak ada yang mau meminjam uang. Ekonomi macet total!" };
  };

  const state = getEconomyState();

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg text-center">Roda Ekonomi Negara</h2>

        <div className="flex flex-col items-center max-w-2xl w-full">
           
           {/* Visual Thermometer / Gauge */}
           <div className="relative w-full h-8 bg-zinc-900 rounded-full border border-white/20 mb-12 overflow-hidden shadow-inner">
              {/* Heat gradient background */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 via-emerald-500 to-rose-600 opacity-50" />
              
              {/* Indicator Needle */}
              <div 
                className="absolute top-0 w-4 h-full bg-white shadow-[0_0_15px_white] transition-all duration-700 ease-in-out z-10"
                style={{ 
                   left: fiscal==='ekspansif'&&monetary==='ekspansif' ? '95%' :
                         fiscal==='kontraktif'&&monetary==='kontraktif' ? '5%' :
                         (fiscal==='ekspansif'&&monetary==='netral') || (fiscal==='netral'&&monetary==='ekspansif') ? '75%' :
                         (fiscal==='kontraktif'&&monetary==='netral') || (fiscal==='netral'&&monetary==='kontraktif') ? '25%' : '50%',
                   transform: 'translateX(-50%)'
                }}
              />

              {/* Labels */}
              <div className="absolute inset-0 flex justify-between items-center px-4 text-[10px] font-bold text-white/70 uppercase">
                 <span>Beku (Resesi)</span>
                 <span>Ideal</span>
                 <span>Mendidih (Inflasi)</span>
              </div>
           </div>

           {/* State Result Box */}
           <div className={`w-full p-8 rounded-3xl border-2 transition-all duration-500 shadow-2xl relative overflow-hidden ${state.color.replace('bg-', 'border-')} bg-black/60`}>
              <div className={`absolute top-0 left-0 w-full h-2 ${state.color}`} />
              <h3 className={`text-3xl font-black mb-4 ${state.color.replace('bg-', 'text-')}`}>{state.name}</h3>
              <p className="text-zinc-300 text-lg leading-relaxed">{state.desc}</p>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Tuas Kebijakan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          {/* FISKAL */}
          <div className="space-y-3">
             <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-900/50 pb-2">
                🏛️ Kebijakan Fiskal
                <div className="text-[10px] text-zinc-500 font-normal mt-1 normal-case tracking-normal">Diatur oleh Pemerintah (Menteri Keuangan). Meliputi Pajak dan Belanja Negara (APBN).</div>
             </div>
             
             <button onClick={()=>setFiscal("ekspansif")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${fiscal === 'ekspansif' ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                🔥 Ekspansif (Gas)
                <span className="block text-[10px] font-normal opacity-70 mt-1">Pajak diturunkan, Belanja negara (infrastruktur/Bansos) diperbesar.</span>
             </button>
             <button onClick={()=>setFiscal("netral")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${fiscal === 'netral' ? 'bg-zinc-800 border-zinc-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ⚖️ Netral
             </button>
             <button onClick={()=>setFiscal("kontraktif")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${fiscal === 'kontraktif' ? 'bg-blue-900/50 border-blue-500 text-blue-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ❄️ Kontraktif (Rem)
                <span className="block text-[10px] font-normal opacity-70 mt-1">Pajak dinaikkan, Belanja negara dihemat/dipotong.</span>
             </button>
          </div>

          {/* MONETER */}
          <div className="space-y-3">
             <div className="text-sm font-bold text-amber-400 uppercase tracking-widest border-b border-amber-900/50 pb-2">
                🏦 Kebijakan Moneter
                <div className="text-[10px] text-zinc-500 font-normal mt-1 normal-case tracking-normal">Diatur oleh Bank Sentral (Bank Indonesia). Meliputi Suku Bunga dan Cetak Uang.</div>
             </div>
             
             <button onClick={()=>setMonetary("ekspansif")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${monetary === 'ekspansif' ? 'bg-amber-900/50 border-amber-500 text-amber-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                🔥 Ekspansif (Gas)
                <span className="block text-[10px] font-normal opacity-70 mt-1">Suku bunga diturunkan (Kredit murah), mencetak lebih banyak uang.</span>
             </button>
             <button onClick={()=>setMonetary("netral")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${monetary === 'netral' ? 'bg-zinc-800 border-zinc-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ⚖️ Netral
             </button>
             <button onClick={()=>setMonetary("kontraktif")} className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${monetary === 'kontraktif' ? 'bg-blue-900/50 border-blue-500 text-blue-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ❄️ Kontraktif (Rem)
                <span className="block text-[10px] font-normal opacity-70 mt-1">Suku bunga dinaikkan (Nabung untung, Pinjam mahal), menarik uang dari peredaran.</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
