"use client";

import { useState } from "react";

export default function SistemBilangan() {
  const [decimal, setDecimal] = useState<number>(255);

  const handleDecimalChange = (val: string) => {
     let num = parseInt(val);
     if (isNaN(num)) num = 0;
     setDecimal(Math.min(999999, Math.max(0, num)));
  };

  // Conversions
  const binary = decimal.toString(2);
  const octal = decimal.toString(8);
  const hex = decimal.toString(16).toUpperCase();

  // Padding binary for visual chunks of 4 (nibbles)
  const paddedBinary = binary.padStart(Math.ceil(binary.length / 4) * 4, '0');
  const binaryChunks = paddedBinary.match(/.{1,4}/g) || [];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Sistem Bilangan Komputer</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana komputer membaca angka?
        </p>

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
           
           {/* DESIMAL (Basis 10) - Human */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
              <div className="w-20 h-20 bg-blue-900/30 rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-blue-500/50">
                 🧑‍💻
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Desimal (Basis 10)</h3>
                 <p className="text-xs text-zinc-400 mb-4">Bahasa manusia. Angka 0 sampai 9.</p>
                 <input 
                    type="number" 
                    value={decimal}
                    onChange={(e) => handleDecimalChange(e.target.value)}
                    className="w-full max-w-xs bg-black border border-zinc-700 text-white text-3xl font-black px-4 py-2 rounded-xl outline-none focus:border-blue-500"
                 />
              </div>
           </div>

           {/* BINER (Basis 2) - Machine */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="w-20 h-20 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-emerald-500/50">
                 🤖
              </div>
              <div className="flex-1 text-center md:text-left w-full overflow-hidden">
                 <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Biner (Basis 2)</h3>
                 <p className="text-xs text-zinc-400 mb-4">Bahasa mesin. Hanya angka 0 (Mati) dan 1 (Nyala).</p>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {binaryChunks.map((chunk, i) => (
                       <span key={i} className="bg-black text-emerald-400 font-mono text-2xl font-black px-3 py-1 rounded-lg border border-zinc-800 tracking-widest">
                          {chunk}
                       </span>
                    ))}
                 </div>
              </div>
           </div>

           {/* HEKSADESIMAL (Basis 16) - Programmer */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
              <div className="w-20 h-20 bg-purple-900/30 rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-purple-500/50">
                 💻
              </div>
              <div className="flex-1 text-center md:text-left w-full overflow-hidden">
                 <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-1">Heksadesimal (Basis 16)</h3>
                 <p className="text-xs text-zinc-400 mb-4">Bahasa programmer untuk menyingkat Biner. Angka 0-9 ditambah huruf A-F.</p>
                 <div className="bg-black text-purple-400 font-mono text-3xl font-black px-6 py-2 rounded-xl border border-zinc-800 inline-block">
                    0x{hex}
                 </div>
              </div>
           </div>

           {/* OKTAL (Basis 8) - Legacy */}
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden opacity-80">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
              <div className="w-20 h-20 bg-amber-900/30 rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-amber-500/50">
                 💾
              </div>
              <div className="flex-1 text-center md:text-left w-full overflow-hidden">
                 <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Oktal (Basis 8)</h3>
                 <p className="text-xs text-zinc-400 mb-4">Sistem lama (Unix permissions). Angka 0 sampai 7.</p>
                 <div className="bg-black text-amber-400 font-mono text-2xl font-black px-4 py-1 rounded-xl border border-zinc-800 inline-block">
                    {octal}
                 </div>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Panduan Bilangan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div>
            <div className="text-xs font-bold text-zinc-400 mb-4 uppercase">Geser Cepat (Slider)</div>
            <input 
              type="range" min="0" max="255" step="1" 
              value={decimal > 255 ? 255 : decimal} 
              onChange={e=>handleDecimalChange(e.target.value)} 
              className="w-full accent-blue-500" 
            />
            <div className="text-center mt-2 text-xs text-zinc-500">Batas slider: 255 (1 Byte)</div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
             <button onClick={()=>handleDecimalChange("10")} className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded font-bold">10</button>
             <button onClick={()=>handleDecimalChange("255")} className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded font-bold">255 (Maks 8-bit)</button>
             <button onClick={()=>handleDecimalChange("65535")} className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded font-bold">65535 (Maks 16-bit)</button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Kenapa Heksadesimal Penting?</strong></p>
            <p>Satu digit Hexadesimal persis mewakili 4 digit Biner (1 Nibble). Ini membuat programmer jauh lebih mudah membaca warna (contoh: <span className="text-blue-400">#0000FF</span>) atau memori daripada harus menulis deretan panjang 0 dan 1.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
