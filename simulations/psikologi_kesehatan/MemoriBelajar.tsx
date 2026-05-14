"use client";

import { useState, useEffect } from "react";

export default function MemoriBelajar() {
  const [words, setWords] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle"|"memorize"|"distract"|"recall">("idle");
  const [timeLeft, setTimeLeft] = useState(10);
  const [inputWord, setInputWord] = useState("");
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  
  const wordList = ["Apel", "Buku", "Meja", "Kucing", "Kipas", "Jendela", "Sepatu", "Awan", "Pintu", "Kaca"];

  const startTest = () => {
     setWords(wordList.sort(() => 0.5 - Math.random()).slice(0, 7)); // Pick 7 random words
     setPhase("memorize");
     setTimeLeft(10); // 10 seconds to memorize
     setRecalledWords([]);
  };

  useEffect(() => {
     let timer: NodeJS.Timeout;
     if (phase === "memorize" && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
     } else if (phase === "memorize" && timeLeft === 0) {
        setPhase("distract");
        setTimeLeft(5); // 5 seconds distraction
     } else if (phase === "distract" && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
     } else if (phase === "distract" && timeLeft === 0) {
        setPhase("recall");
     }
     return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleRecall = (e: React.FormEvent) => {
     e.preventDefault();
     if (inputWord.trim() !== "" && !recalledWords.includes(inputWord.trim().toLowerCase())) {
        setRecalledWords([...recalledWords, inputWord.trim().toLowerCase()]);
        setInputWord("");
     }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Uji Memori Jangka Pendek</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Berapa banyak informasi yang bisa disimpan otak dalam waktu singkat?
        </p>

        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center">
           
           {phase === "idle" && (
              <div className="text-center animate-fade-in">
                 <div className="text-6xl mb-6">🧠</div>
                 <h3 className="text-2xl font-bold text-white mb-4">Tes Memori Kerja</h3>
                 <p className="text-zinc-400 mb-8">Anda akan melihat 7 kata selama 10 detik. Hafalkan sebanyak-banyaknya!</p>
                 <button 
                    onClick={startTest}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                 >
                    Mulai Tes
                 </button>
              </div>
           )}

           {phase === "memorize" && (
              <div className="w-full text-center animate-fade-in">
                 <div className="text-rose-500 font-bold text-2xl mb-8 animate-pulse">Waktu Menghafal: {timeLeft}s</div>
                 <div className="flex flex-wrap justify-center gap-4">
                    {words.map((w, i) => (
                       <div key={i} className="px-6 py-3 bg-white text-black font-black text-xl rounded shadow-lg">
                          {w}
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {phase === "distract" && (
              <div className="w-full text-center animate-fade-in">
                 <div className="text-amber-500 font-bold text-xl mb-4">Gangguan (Distraksi)!</div>
                 <p className="text-zinc-300 text-3xl font-black italic mb-8">27 + 15 = ?</p>
                 <p className="text-zinc-500 text-sm">Cepat hitung ini di kepalamu!</p>
              </div>
           )}

           {phase === "recall" && (
              <div className="w-full text-center animate-fade-in">
                 <h3 className="text-xl font-bold text-emerald-400 mb-4">Tuliskan kata-kata yang Anda ingat!</h3>
                 
                 <form onSubmit={handleRecall} className="flex gap-2 justify-center mb-8">
                    <input 
                      type="text" 
                      value={inputWord} 
                      onChange={e=>setInputWord(e.target.value)}
                      placeholder="Ketik kata di sini..."
                      className="px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white outline-none focus:border-emerald-500"
                      autoFocus
                    />
                    <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all">
                       Input
                    </button>
                 </form>

                 <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {recalledWords.map((rw, i) => {
                       const isCorrect = words.map(w=>w.toLowerCase()).includes(rw);
                       return (
                          <div key={i} className={`px-4 py-2 rounded text-sm font-bold shadow ${isCorrect ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-red-900/50 text-red-300 border border-red-500/30 line-through'}`}>
                             {rw}
                          </div>
                       )
                    })}
                 </div>

                 <button 
                    onClick={() => setPhase("idle")}
                    className="text-zinc-500 hover:text-white underline text-sm"
                 >
                    Coba Lagi
                 </button>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Memori Manusia</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="p-3 border-l-4 border-blue-500 bg-blue-900/10 text-sm text-zinc-300">
                <strong className="text-blue-400 block mb-1">1. Encoding (Memasukkan)</strong>
                Proses mengubah informasi dari mata/telinga menjadi kode yang dipahami otak. (Fase membaca kata).
             </div>
             
             <div className="p-3 border-l-4 border-amber-500 bg-amber-900/10 text-sm text-zinc-300">
                <strong className="text-amber-400 block mb-1">2. Storage (Menyimpan)</strong>
                <p className="mb-2"><strong>Short-Term Memory:</strong> Hanya bisa menyimpan 5-9 item selama 15-30 detik. Sangat mudah hilang jika ada distraksi (seperti disuruh menghitung tadi).</p>
                <p><strong>Long-Term Memory:</strong> Penyimpanan permanen yang tak terbatas kapasitasnya.</p>
             </div>

             <div className="p-3 border-l-4 border-emerald-500 bg-emerald-900/10 text-sm text-zinc-300">
                <strong className="text-emerald-400 block mb-1">3. Retrieval (Memanggil Ulang)</strong>
                Proses mengingat kembali informasi yang tersimpan. Jika gagal, itu yang kita sebut "Lupa".
             </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed">
             <p><strong>Tips Belajar:</strong></p>
             <p>Agar memori jangka pendek pindah ke memori jangka panjang, lakukan <em>Pengulangan (Rehearsal)</em> dan <em>Kaitkan dengan emosi atau visual (Mnemonic)</em>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
