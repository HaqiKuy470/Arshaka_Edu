"use client";

import { useState } from "react";

export default function PajakDasar() {
  const [penghasilanBulan, setPenghasilanBulan] = useState(10000000);
  const [statusPTKP, setStatusPTKP] = useState<"TK0"|"K0"|"K1">("TK0");

  // Tarif PTKP (Penghasilan Tidak Kena Pajak) per tahun - UU HPP (Simplifikasi kasar untuk edukasi)
  // TK/0 (Tidak Kawin, 0 Tanggungan) = 54.000.000
  // K/0 (Kawin, 0 Tanggungan) = 58.500.000
  // K/1 (Kawin, 1 Tanggungan/Anak) = 63.000.000
  const getPTKP = () => {
     if (statusPTKP === "TK0") return 54000000;
     if (statusPTKP === "K0") return 58500000;
     return 63000000;
  };

  const penghasilanTahun = penghasilanBulan * 12;
  const ptkp = getPTKP();
  const pkp = Math.max(0, penghasilanTahun - ptkp); // Penghasilan Kena Pajak

  // Menghitung PPh 21 (Tarif Progresif UU HPP)
  // 5% x 60jt pertama
  // 15% x (60jt sd 250jt)
  const hitungPPh = () => {
     if (pkp === 0) return 0;
     
     let sisaPKP = pkp;
     let totalPajak = 0;

     // Lapis 1: 0 - 60jt (5%)
     if (sisaPKP > 0) {
        const kenaPajak = Math.min(sisaPKP, 60000000);
        totalPajak += kenaPajak * 0.05;
        sisaPKP -= kenaPajak;
     }

     // Lapis 2: 60jt - 250jt (15%)
     if (sisaPKP > 0) {
        const kenaPajak = Math.min(sisaPKP, 190000000); // 250m - 60m
        totalPajak += kenaPajak * 0.15;
        sisaPKP -= kenaPajak;
     }

     // Lapis 3 (250jt - 500jt) 25% - Simplified for this edu tool to stop at lapis 2 logic for ease
     if (sisaPKP > 0) {
        totalPajak += sisaPKP * 0.25; 
     }

     return totalPajak;
  };

  const pphTahun = hitungPPh();
  const pphBulan = pphTahun / 12;

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Simulasi Kalkulator PPh 21 (Pajak Gaji)</h2>

        <div className="w-full max-w-3xl flex flex-col gap-6">
           
           {/* Penghasilan Setahun */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                 <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Gaji Setahun (Kotor)</div>
                 <div className="text-2xl font-mono text-emerald-400 font-bold">{formatRp(penghasilanBulan)} x 12</div>
              </div>
              <div className="text-3xl font-black text-white font-mono">{formatRp(penghasilanTahun)}</div>
           </div>

           {/* Dikurangi PTKP */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                 <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Dikurangi PTKP (Bebas Pajak)</div>
                 <div className="text-sm font-bold text-amber-400">Status: {statusPTKP}</div>
              </div>
              <div className="text-3xl font-black text-rose-400 font-mono">_ {formatRp(ptkp)}</div>
           </div>

           {/* Garis Total */}
           <div className="w-full border-t border-dashed border-zinc-700 relative">
              <div className="absolute right-8 -top-3 bg-zinc-950 px-2 text-zinc-500 font-bold text-xs">=</div >
           </div>

           {/* Penghasilan Kena Pajak (PKP) */}
           <div className="bg-blue-950/30 border border-blue-900/50 p-6 rounded-2xl flex justify-between items-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <div>
                 <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Penghasilan Kena Pajak (PKP)</div>
                 <div className="text-xs text-zinc-400">Inilah angka yang akan dikalikan dengan persentase pajak progresif.</div>
              </div>
              <div className="text-3xl font-black text-white font-mono">{formatRp(pkp)}</div>
           </div>

           {/* Hasil Pajak */}
           <div className="mt-4 bg-emerald-950/40 border border-emerald-500/50 p-8 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
              <div className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-4">Total PPh 21 yang Harus Dibayar</div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                 <div>
                    <div className="text-zinc-400 text-xs mb-1">Per Tahun</div>
                    <div className="text-3xl font-black text-white font-mono">{formatRp(pphTahun)}</div>
                 </div>
                 <div className="h-12 w-px bg-white/20 hidden md:block" />
                 <div>
                    <div className="text-zinc-400 text-xs mb-1">Per Bulan (Dipotong dari gaji)</div>
                    <div className="text-4xl font-black text-amber-400 font-mono">{formatRp(pphBulan)}</div>
                 </div>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Parameter Pajak</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div>
            <div className="text-xs font-bold text-emerald-400 mb-2 uppercase">Gaji Per Bulan (Kotor)</div>
            <input 
              type="range" min="3000000" max="30000000" step="500000" 
              value={penghasilanBulan} 
              onChange={e=>setPenghasilanBulan(parseInt(e.target.value))} 
              className="w-full accent-emerald-500" 
            />
            <div className="text-center font-bold text-white mt-2">{formatRp(penghasilanBulan)}</div>
          </div>

          <div>
             <div className="text-xs font-bold text-amber-400 mb-2 uppercase">Status Tanggungan (PTKP)</div>
             <div className="space-y-2">
                <button onClick={()=>setStatusPTKP("TK0")} className={`w-full p-2 rounded border text-sm ${statusPTKP === 'TK0' ? 'bg-amber-600 border-amber-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                   Lajang (Tidak Kawin/0)
                </button>
                <button onClick={()=>setStatusPTKP("K0")} className={`w-full p-2 rounded border text-sm ${statusPTKP === 'K0' ? 'bg-amber-600 border-amber-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                   Menikah Tanpa Anak
                </button>
                <button onClick={()=>setStatusPTKP("K1")} className={`w-full p-2 rounded border text-sm ${statusPTKP === 'K1' ? 'bg-amber-600 border-amber-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                   Menikah + 1 Anak
                </button>
             </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p><strong>PTKP</strong> adalah wujud keadilan negara. Pemerintah membebaskan pajak untuk penghasilan yang dipakai untuk kebutuhan pokok hidup dasar (makan, tempat tinggal, anak).</p>
            <p>Hanya "Kelebihan Uang" (PKP) setelah PTKP saja yang ditarik pajak untuk membantu negara.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
