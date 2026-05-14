"use client";

import { useState } from "react";

export default function StrukturData() {
  const [dataStruct, setDataStruct] = useState<"array"|"stack"|"queue">("array");
  const [items, setItems] = useState<number[]>([5, 12, 8]);
  const [inputValue, setInputValue] = useState("");

  const addNode = () => {
     if(!inputValue || items.length >= 8) return;
     const val = parseInt(inputValue);
     
     if (dataStruct === "array" || dataStruct === "queue" || dataStruct === "stack") {
        setItems([...items, val]);
     }
     setInputValue("");
  };

  const removeNode = () => {
     if(items.length === 0) return;
     const newItems = [...items];
     
     if (dataStruct === "stack") {
        newItems.pop(); // LIFO: Remove from end
     } else if (dataStruct === "queue") {
        newItems.shift(); // FIFO: Remove from start
     } else if (dataStruct === "array") {
        newItems.pop(); // Just removing last for simplicity
     }
     
     setItems(newItems);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Visualisasi Struktur Data</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">Bagaimana cara komputer menyimpan dan mengorganisir data di memori?</p>

        {/* Visualizer Area */}
        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-12 shadow-2xl relative min-h-[350px] flex items-center justify-center">
           
           {dataStruct === "array" && (
              <div className="flex flex-col items-center animate-fade-in w-full">
                 <h3 className="text-blue-400 font-bold mb-4">ARRAY (Indeks Tetap)</h3>
                 <div className="flex gap-1 overflow-x-auto w-full justify-center">
                    {items.map((item, idx) => (
                       <div key={idx} className="flex flex-col items-center">
                          <div className="text-[10px] text-zinc-500 mb-1">Index {idx}</div>
                          <div className="w-16 h-16 bg-blue-900/50 border-2 border-blue-500 flex items-center justify-center text-2xl font-black text-white shadow-lg animate-pop-in">
                             {item}
                          </div>
                       </div>
                    ))}
                    {items.length === 0 && <div className="text-zinc-600 italic">Array Kosong</div>}
                 </div>
                 <p className="text-zinc-400 text-sm mt-8 max-w-md text-center">Data disimpan berurutan di memori dan bisa diakses instan melalui indeks (0, 1, 2...).</p>
              </div>
           )}

           {dataStruct === "stack" && (
              <div className="flex flex-col items-center animate-fade-in">
                 <h3 className="text-rose-400 font-bold mb-4">STACK / Tumpukan (LIFO)</h3>
                 
                 <div className="flex gap-12 items-center">
                    {/* Animated arrow Push */}
                    <div className="text-rose-500 text-2xl animate-bounce hidden md:block">↓ Push</div>

                    {/* The Stack Container */}
                    <div className="w-32 h-64 border-x-4 border-b-4 border-zinc-600 bg-zinc-950/50 rounded-b-lg flex flex-col-reverse p-2 gap-2 relative overflow-hidden">
                       {items.map((item, idx) => (
                          <div key={idx} className="w-full h-12 bg-rose-600 border border-rose-400 flex items-center justify-center text-xl font-bold text-white rounded animate-slide-up shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                             {item}
                          </div>
                       ))}
                       {items.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-sm">Kosong</div>}
                    </div>

                    {/* Animated arrow Pop */}
                    <div className="text-rose-500 text-2xl hidden md:block" style={{animation: "bounce 1s infinite reverse"}}>↑ Pop</div>
                 </div>

                 <p className="text-zinc-400 text-sm mt-8 max-w-md text-center"><strong>LIFO (Last In, First Out).</strong> Data yang terakhir masuk adalah yang pertama kali keluar. (Contoh: Undo di Word, tumpukan piring).</p>
              </div>
           )}

           {dataStruct === "queue" && (
              <div className="flex flex-col items-center animate-fade-in w-full">
                 <h3 className="text-emerald-400 font-bold mb-4">QUEUE / Antrean (FIFO)</h3>
                 
                 <div className="flex items-center gap-4 w-full justify-center">
                    <div className="text-emerald-500 font-bold whitespace-nowrap">Masuk (Enqueue) ➔</div>
                    
                    {/* The Queue Container */}
                    <div className="flex-1 max-w-lg h-24 border-y-4 border-zinc-600 bg-zinc-950/50 flex items-center px-2 gap-2 relative overflow-hidden">
                       {/* Rendering in reverse to simulate moving left-to-right */}
                       {[...items].reverse().map((item, idx) => (
                          <div key={idx} className="w-16 h-16 shrink-0 bg-emerald-600 border border-emerald-400 flex items-center justify-center text-xl font-bold text-white rounded animate-slide-left shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                             {item}
                          </div>
                       ))}
                       {items.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-sm">Kosong</div>}
                    </div>

                    <div className="text-emerald-500 font-bold whitespace-nowrap">➔ Keluar (Dequeue)</div>
                 </div>

                 <p className="text-zinc-400 text-sm mt-8 max-w-md text-center"><strong>FIFO (First In, First Out).</strong> Data yang pertama kali masuk, dia yang pertama dilayani/keluar. (Contoh: Antrean kasir, download manager).</p>
              </div>
           )}

        </div>

        {/* Input Controls */}
        <div className="flex gap-4 mt-8 bg-black p-4 rounded-2xl border border-white/10">
           <input 
              type="number" 
              value={inputValue} 
              onChange={e=>setInputValue(e.target.value)} 
              placeholder="Angka..."
              className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl outline-none focus:border-blue-500 w-32"
           />
           <button 
              onClick={addNode}
              disabled={items.length >= 8}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl disabled:opacity-50"
           >
              ➕ Tambah (Insert)
           </button>
           <button 
              onClick={removeNode}
              disabled={items.length === 0}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2 rounded-xl disabled:opacity-50"
           >
              🗑️ Hapus (Delete)
           </button>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pilih Struktur</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setDataStruct("array")} 
             className={`w-full p-4 text-left rounded-xl border transition-all ${dataStruct === 'array' ? 'bg-blue-900 border-blue-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             📦 Array
          </button>
          
          <button 
             onClick={()=>setDataStruct("stack")} 
             className={`w-full p-4 text-left rounded-xl border transition-all ${dataStruct === 'stack' ? 'bg-rose-900 border-rose-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             📚 Stack (Tumpukan)
          </button>

          <button 
             onClick={()=>setDataStruct("queue")} 
             className={`w-full p-4 text-left rounded-xl border transition-all ${dataStruct === 'queue' ? 'bg-emerald-900 border-emerald-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             🚶 Queue (Antrean)
          </button>

        </div>
      </div>
    </div>
  );
}
