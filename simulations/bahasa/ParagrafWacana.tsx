"use client";

import { useState } from "react";

export default function ParagrafWacana() {
  const [paragraphType, setParagraphType] = useState<"deduktif"|"induktif"|"campuran">("deduktif");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
           
           {/* Visual Diagram representing the paragraph structure */}
           <div className="flex justify-center mb-8 h-32">
              {paragraphType === "deduktif" && (
                 <div className="flex flex-col gap-2 w-48 animate-fade-in">
                    <div className="bg-emerald-500 h-10 w-full rounded shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center font-bold text-white text-xs">Ide Pokok (Umum)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 1 (Khusus)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 2 (Khusus)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 3 (Khusus)</div>
                 </div>
              )}
              {paragraphType === "induktif" && (
                 <div className="flex flex-col gap-2 w-48 animate-fade-in">
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 1 (Khusus)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 2 (Khusus)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 3 (Khusus)</div>
                    <div className="bg-blue-500 h-10 w-full rounded shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-white text-xs">Ide Pokok (Kesimpulan)</div>
                 </div>
              )}
              {paragraphType === "campuran" && (
                 <div className="flex flex-col gap-2 w-48 animate-fade-in">
                    <div className="bg-purple-500 h-8 w-full rounded shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center font-bold text-white text-[10px]">Ide Pokok (Awal)</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 1</div>
                    <div className="bg-zinc-700 h-6 w-full rounded flex items-center justify-center text-[10px] text-zinc-400">Penjelas 2</div>
                    <div className="bg-purple-500 h-8 w-full rounded shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center font-bold text-white text-[10px]">Penegasan Ide Pokok</div>
                 </div>
              )}
           </div>

           {/* Paragraph Text Content */}
           <div className="text-lg leading-relaxed animate-fade-in p-6 bg-black/50 border border-zinc-800 rounded-2xl">
              {paragraphType === "deduktif" && (
                 <p className="text-zinc-300 indent-8 text-justify">
                    <span className="bg-emerald-900/50 text-emerald-300 font-bold px-1 rounded inline-block mb-1 border-b-2 border-emerald-500">Membaca buku memberikan banyak manfaat bagi otak kita.</span> Hal ini karena saat membaca, sel-sel saraf otak kita akan saling terhubung dan aktif bekerja. Selain itu, membaca rutin dapat mencegah penyakit pikun di hari tua. Buku juga dapat menambah kosakata dan wawasan baru yang mungkin belum pernah kita ketahui sebelumnya.
                 </p>
              )}
              {paragraphType === "induktif" && (
                 <p className="text-zinc-300 indent-8 text-justify">
                    Saat membaca, sel-sel saraf otak kita akan saling terhubung dan aktif bekerja. Selain itu, membaca secara rutin terbukti secara medis dapat menunda penyakit Alzheimer atau pikun di hari tua. Terlebih lagi, kita mendapatkan asupan kosakata dan wawasan baru setiap membalik halamannya. <span className="bg-blue-900/50 text-blue-300 font-bold px-1 rounded inline-block mt-1 border-b-2 border-blue-500">Oleh karena itu, dapat disimpulkan bahwa membaca buku memberikan sangat banyak manfaat bagi kesehatan dan kecerdasan otak.</span>
                 </p>
              )}
              {paragraphType === "campuran" && (
                 <p className="text-zinc-300 indent-8 text-justify">
                    <span className="bg-purple-900/50 text-purple-300 font-bold px-1 rounded border-b-2 border-purple-500">Membaca buku memberikan banyak manfaat penting bagi otak.</span> Saat membaca, sel saraf aktif bekerja dan terhubung satu sama lain. Kegiatan ini juga diklaim dokter efektif menunda kepikunan di masa tua. Kosakata dan wawasan kita pun otomatis bertambah tanpa kita sadari. <span className="bg-purple-900/50 text-purple-300 font-bold px-1 rounded border-b-2 border-purple-500">Itulah sebabnya mengapa membaca buku sangat baik dan bermanfaat untuk merawat otak kita.</span>
                 </p>
              )}
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Struktur Paragraf</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={()=>setParagraphType("deduktif")} className={`w-full p-3 text-left rounded-xl border transition-all ${paragraphType === 'deduktif' ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                1. Paragraf Deduktif
             </button>
             <button onClick={()=>setParagraphType("induktif")} className={`w-full p-3 text-left rounded-xl border transition-all ${paragraphType === 'induktif' ? 'bg-blue-900/50 border-blue-500 text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                2. Paragraf Induktif
             </button>
             <button onClick={()=>setParagraphType("campuran")} className={`w-full p-3 text-left rounded-xl border transition-all ${paragraphType === 'campuran' ? 'bg-purple-900/50 border-purple-500 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                3. Campuran (Deduktif-Induktif)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Ide Pokok (Kalimat Utama)</strong> adalah inti pembicaraan dari seluruh isi paragraf.</p>
            <p>Berdasarkan letak ide pokoknya, paragraf dibagi 3:</p>
            <ul className="space-y-2 mt-2 opacity-80">
               <li><strong className="text-emerald-400">Deduktif:</strong> Ide pokok ada di AWAL. Menyampaikan kesimpulan duluan, baru dirinci.</li>
               <li><strong className="text-blue-400">Induktif:</strong> Ide pokok ada di AKHIR. Memberi bukti dan rincian dulu, ditutup dengan kesimpulan.</li>
               <li><strong className="text-purple-400">Campuran:</strong> Ide pokok di AWAL, lalu diulang (ditegaskan lagi) di AKHIR.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
