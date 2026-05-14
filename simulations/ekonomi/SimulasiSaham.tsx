"use client";

import { useState, useEffect, useRef } from "react";

export default function SimulasiSaham() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [balance, setBalance] = useState(10000000); // 10 Juta IDR
  const [shares, setShares] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(5000);
  const [history, setHistory] = useState<number[]>([5000]);
  const [news, setNews] = useState<{text:string, impact:'up'|'down'|'neutral'}|null>(null);

  // Market Engine Simulation
  useEffect(() => {
    const timer = setInterval(() => {
       setCurrentPrice(prev => {
          let change = (Math.random() - 0.5) * 100; // random walk noise
          
          // Apply news impact if exists
          if (news) {
             if (news.impact === 'up') change += Math.random() * 200 + 50;
             if (news.impact === 'down') change -= Math.random() * 200 + 50;
          }

          // Return to mean a bit to prevent going to zero or infinity instantly
          if (prev > 15000) change -= 50;
          if (prev < 1000) change += 50;

          const newPrice = Math.max(100, prev + change); // Cannot be negative

          setHistory(h => {
             const newHist = [...h, newPrice];
             if (newHist.length > 50) newHist.shift(); // keep 50 points
             return newHist;
          });

          return newPrice;
       });
       
       // Clear news effect after some time
       if (Math.random() > 0.8) setNews(null);

    }, 1000); // Update every 1 second

    return () => clearInterval(timer);
  }, [news]);

  // Generate Random News
  useEffect(() => {
     const newsTimer = setInterval(() => {
        const events = [
           { text: "Laporan Keuangan Perusahaan Sangat Baik! Laba Naik 200%.", impact: 'up' as const },
           { text: "Skandal Korupsi Direktur Terbongkar! Investor Panik.", impact: 'down' as const },
           { text: "Perusahaan Meluncurkan Produk Baru yang Laris Manis.", impact: 'up' as const },
           { text: "Pabrik Terbakar, Produksi Terhenti Sementara.", impact: 'down' as const },
           { text: "Rumor Merger dengan Perusahaan Asing Beredar.", impact: 'up' as const },
           { text: "Kondisi Ekonomi Global Sedang Lesu.", impact: 'down' as const },
        ];
        setNews(events[Math.floor(Math.random() * events.length)]);
     }, 8000);

     return () => clearInterval(newsTimer);
  }, []);

  // Trading functions
  const buy = () => {
     const qty = 100; // 1 Lot = 100 shares
     const cost = qty * currentPrice;
     if (balance >= cost) {
        setBalance(prev => prev - cost);
        setShares(prev => prev + qty);
     }
  };

  const sell = () => {
     const qty = 100;
     if (shares >= qty) {
        setBalance(prev => prev + qty * currentPrice);
        setShares(prev => prev - qty);
     }
  };

  // Draw Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    
    // Find min max for scaling
    const minP = Math.min(...history) - 500;
    const maxP = Math.max(...history) + 500;
    const range = maxP - minP;

    const getX = (i: number) => (i / 49) * w;
    const getY = (val: number) => h - ((val - minP) / range) * h;

    // Draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for(let i=0; i<4; i++) {
       ctx.beginPath(); ctx.moveTo(0, h * (i/4)); ctx.lineTo(w, h * (i/4)); ctx.stroke();
    }

    // Draw Line
    if (history.length > 1) {
       ctx.beginPath();
       ctx.moveTo(getX(0), getY(history[0]));
       for (let i=1; i<history.length; i++) {
          ctx.lineTo(getX(i), getY(history[i]));
       }
       
       // Color based on overall trend
       const isUp = history[history.length-1] >= history[0];
       ctx.strokeStyle = isUp ? "#10b981" : "#ef4444"; // emerald or red
       ctx.lineWidth = 3;
       ctx.stroke();

       // Fill area
       ctx.lineTo(w, h);
       ctx.lineTo(0, h);
       ctx.fillStyle = isUp ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)";
       ctx.fill();

       // Draw current price dot
       ctx.fillStyle = "white";
       ctx.beginPath(); ctx.arc(getX(history.length-1), getY(history[history.length-1]), 5, 0, Math.PI*2); ctx.fill();
    }

  }, [history]);

  const totalAssetValue = balance + (shares * currentPrice);
  const profitLoss = totalAssetValue - 10000000;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4">
        
        <div className="w-full max-w-4xl flex justify-between items-end mb-4 px-4">
           <div>
              <h2 className="text-3xl font-black text-white">ARSHAKA Tbk (ARSH)</h2>
              <div className="text-zinc-400 font-bold">Simulasi Pasar Modal</div>
           </div>
           <div className="text-right">
              <div className={`text-4xl font-mono font-black ${history[history.length-1] >= (history[history.length-2]||0) ? 'text-emerald-400' : 'text-red-400'}`}>
                 Rp {Math.round(currentPrice).toLocaleString()}
              </div>
           </div>
        </div>

        {/* Chart Area */}
        <div className="relative w-full max-w-4xl aspect-[2/1] bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-6">
           <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
           
           {/* Breaking News Overlay */}
           {news && (
              <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg border flex items-center gap-3 animate-fade-in ${news.impact === 'up' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100' : 'bg-red-950/80 border-red-500 text-red-100'}`}>
                 <div className="text-2xl animate-pulse">📰</div>
                 <div className="font-bold text-sm">BREAKING NEWS: {news.text}</div>
              </div>
           )}
        </div>

        {/* Portfolio Stats */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Saldo Cash</div>
              <div className="text-lg font-mono text-white">Rp {Math.round(balance).toLocaleString()}</div>
           </div>
           <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Lot Dimiliki (1 Lot=100)</div>
              <div className="text-lg font-mono text-white">{shares/100} Lot ({shares} lbr)</div>
           </div>
           <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl">
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Total Aset</div>
              <div className="text-lg font-mono text-white">Rp {Math.round(totalAssetValue).toLocaleString()}</div>
           </div>
           <div className={`border p-4 rounded-xl ${profitLoss >= 0 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Untung/Rugi (Floating)</div>
              <div className={`text-lg font-mono font-bold ${profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                 {profitLoss >= 0 ? '+' : ''}Rp {Math.round(profitLoss).toLocaleString()}
              </div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Terminal Trading</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <button 
               onClick={buy} 
               disabled={balance < currentPrice * 100}
               className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-xl rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
             >
                BELI 1 LOT
                <div className="text-xs font-normal opacity-70">Butuh: Rp {(currentPrice * 100).toLocaleString()}</div>
             </button>

             <button 
               onClick={sell} 
               disabled={shares < 100}
               className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-xl rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
             >
                JUAL 1 LOT
                <div className="text-xs font-normal opacity-70">Dapat: Rp {(currentPrice * 100).toLocaleString()}</div>
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-8">
            <p><strong>Saham</strong> adalah bukti kepemilikan sebagian dari sebuah perusahaan.</p>
            <p>Harga saham bergerak naik turun (Fluktuatif) di bursa efek setiap detiknya berdasarkan <strong>Hukum Penawaran & Permintaan</strong> dan dipengaruhi oleh sentimen <strong>Berita (News)</strong>.</p>
            <hr className="border-white/10 my-2" />
            <p className="text-amber-400 font-bold">Prinsip Investasi Dasar:</p>
            <p>"Buy Low, Sell High" (Beli saat harga murah, jual saat harga tinggi). Awas jangan serakah dan jangan panik (Panic Selling)!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
