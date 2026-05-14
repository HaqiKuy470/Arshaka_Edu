"use client";

import { useState } from "react";

export default function PersamaanAkuntansi() {
  const [asset, setAsset] = useState(10000000); // 10 juta
  const [liability, setLiability] = useState(4000000); // 4 juta
  const [equity, setEquity] = useState(6000000); // 6 juta
  const [history, setHistory] = useState<{desc:string, a:number, l:number, e:number}[]>([]);

  // Harta = Utang + Modal
  const isBalanced = asset === (liability + equity);

  const performTransaction = (type: string) => {
     let dA = 0; let dL = 0; let dE = 0;
     let desc = "";

     switch(type) {
        case "invest":
           dA = 5000000; dE = 5000000; desc = "Pemilik setor modal tunai Rp 5 Juta"; break;
        case "loan":
           dA = 10000000; dL = 10000000; desc = "Pinjam uang ke Bank Rp 10 Juta"; break;
        case "buy_equip":
           // Asset increases (equipment) but asset decreases (cash). Total asset = same.
           dA = 0; desc = "Beli peralatan Rp 2 Juta secara tunai"; break;
        case "buy_credit":
           dA = 3000000; dL = 3000000; desc = "Beli persediaan Rp 3 Juta secara kredit (Utang)"; break;
        case "pay_debt":
           dA = -2000000; dL = -2000000; desc = "Membayar cicilan utang Rp 2 Juta tunai"; break;
        case "revenue":
           dA = 4000000; dE = 4000000; desc = "Menerima pendapatan jasa Rp 4 Juta (Laba masuk modal)"; break;
        case "expense":
           dA = -1000000; dE = -1000000; desc = "Membayar beban listrik & gaji Rp 1 Juta (Rugi memotong modal)"; break;
     }

     setAsset(prev => prev + dA);
     setLiability(prev => prev + dL);
     setEquity(prev => prev + dE);
     
     setHistory(prev => [{desc, a:dA, l:dL, e:dE}, ...prev].slice(0, 5));
  };

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Persamaan Dasar Akuntansi</h2>

        {/* The Equation Display */}
        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative">
           
           {!isBalanced && (
              <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-xs font-bold py-1 rounded-t-3xl">
                 TIDAK SEIMBANG! TERJADI KESALAHAN!
              </div>
           )}

           <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
              
              {/* ASSET */}
              <div className="flex-1 w-full bg-blue-950/50 border-2 border-blue-500/50 p-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                 <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Harta (Aset)</div>
                 <div className="text-3xl font-black text-white font-mono">{formatRp(asset)}</div>
                 <div className="text-[10px] text-zinc-400 mt-2 text-center">Kas, Piutang, Peralatan, Gedung</div>
              </div>

              <div className="text-4xl font-black text-zinc-600">=</div>

              {/* LIABILITY */}
              <div className="flex-1 w-full bg-rose-950/50 border-2 border-rose-500/50 p-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                 <div className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">Utang (Liabilitas)</div>
                 <div className="text-3xl font-black text-white font-mono">{formatRp(liability)}</div>
                 <div className="text-[10px] text-zinc-400 mt-2 text-center">Utang Bank, Utang Usaha</div>
              </div>

              <div className="text-4xl font-black text-zinc-600">+</div>

              {/* EQUITY */}
              <div className="flex-1 w-full bg-emerald-950/50 border-2 border-emerald-500/50 p-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                 <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Modal (Ekuitas)</div>
                 <div className="text-3xl font-black text-white font-mono">{formatRp(equity)}</div>
                 <div className="text-[10px] text-zinc-400 mt-2 text-center">Modal Pemilik, Laba Ditahan</div>
              </div>

           </div>

           {/* Total Check Line */}
           <div className="mt-8 pt-6 border-t border-dashed border-zinc-700 flex justify-between items-center px-4">
              <div className="text-xl font-bold text-blue-400 font-mono">{formatRp(asset)}</div>
              <div className={`text-sm font-bold px-4 py-1 rounded-full ${isBalanced ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500' : 'bg-red-600/20 text-red-400 border border-red-500'}`}>
                 {isBalanced ? "⚖️ BALANCE" : "❌ UNBALANCED"}
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono">{formatRp(liability + equity)}</div>
           </div>

        </div>

        {/* History Log */}
        {history.length > 0 && (
           <div className="mt-8 w-full max-w-4xl bg-black/50 border border-white/5 p-6 rounded-2xl animate-fade-in">
              <div className="text-xs text-zinc-500 font-bold uppercase mb-4">Riwayat Transaksi Terakhir</div>
              <div className="space-y-3">
                 {history.map((h, i) => (
                    <div key={i} className={`flex justify-between items-center text-sm ${i === 0 ? 'text-white' : 'text-zinc-500'}`}>
                       <div className="flex-1 truncate pr-4">{h.desc}</div>
                       <div className="flex gap-4 font-mono text-xs w-64 justify-end">
                          <span className={h.a > 0 ? 'text-blue-400' : h.a < 0 ? 'text-rose-400' : 'text-zinc-600'}>A: {h.a > 0 ? '+' : ''}{h.a/1000000}M</span>
                          <span className={h.l > 0 ? 'text-rose-400' : h.l < 0 ? 'text-emerald-400' : 'text-zinc-600'}>U: {h.l > 0 ? '+' : ''}{h.l/1000000}M</span>
                          <span className={h.e > 0 ? 'text-emerald-400' : h.e < 0 ? 'text-rose-400' : 'text-zinc-600'}>M: {h.e > 0 ? '+' : ''}{h.e/1000000}M</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Buku Jurnal (Transaksi)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Klik Transaksi Bisnis:</div>
          
          <button onClick={()=>performTransaction("invest")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-white/10 text-emerald-300 hover:bg-emerald-900/30 text-sm">
             📥 Pemilik Setor Modal (A+, M+)
          </button>
          
          <button onClick={()=>performTransaction("loan")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-white/10 text-rose-300 hover:bg-rose-900/30 text-sm">
             🏦 Pinjam Uang Bank (A+, U+)
          </button>

          <button onClick={()=>performTransaction("buy_equip")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-white/10 text-blue-300 hover:bg-blue-900/30 text-sm">
             💻 Beli Aset Tunai (A+, A-)
          </button>

          <button onClick={()=>performTransaction("buy_credit")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-white/10 text-amber-300 hover:bg-amber-900/30 text-sm">
             📦 Beli Barang Ngutang (A+, U+)
          </button>

          <button onClick={()=>performTransaction("pay_debt")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-white/10 text-zinc-300 hover:bg-white/10 text-sm">
             💸 Bayar Utang Tunai (A-, U-)
          </button>

          <button onClick={()=>performTransaction("revenue")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30 text-sm font-bold">
             💰 Terima Pendapatan (A+, M+)
          </button>

          <button onClick={()=>performTransaction("expense")} className="w-full p-3 text-left rounded-xl bg-black/30 border border-rose-500/30 text-rose-400 hover:bg-rose-900/30 text-sm font-bold">
             🧾 Bayar Beban/Gaji (A-, M-)
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed mt-6 italic">
            <strong>Aturan Emas Akuntansi:</strong> Setiap transaksi bisnis pasti mempengaruhi setidaknya DUA akun. Kiri (Harta) dan Kanan (Utang+Modal) harus SELALU sama / Balance!
          </div>

        </div>
      </div>
    </div>
  );
}
