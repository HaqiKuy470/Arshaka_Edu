"use client";

import { useState } from "react";

export default function OperasiBilangan() {
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(2);
  const [operation, setOperation] = useState<"+"|"-"|"x"|"÷">("+");

  let result = 0;
  if (operation === "+") result = num1 + num2;
  if (operation === "-") result = num1 - num2;
  if (operation === "x") result = num1 * num2;
  if (operation === "÷") result = num2 !== 0 ? Math.floor(num1 / num2) : 0;
  const remainder = operation === "÷" && num2 !== 0 ? num1 % num2 : 0;

  // Generate visual items
  const renderItems = (count: number, color: string) => {
    return Array.from({ length: Math.max(0, count) }).map((_, i) => (
      <div key={i} className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shadow-lg border-2 border-black/20 m-1 transform transition-transform hover:scale-110`}>
        <div className="w-3 h-3 bg-white/30 rounded-full absolute top-1 left-1" />
      </div>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="text-4xl md:text-6xl font-bold font-mono text-white mb-12 flex items-center gap-6">
          <div className="text-blue-400">{num1}</div>
          <div className="text-zinc-500 bg-zinc-800 w-16 h-16 rounded-xl flex items-center justify-center pb-2">{operation}</div>
          <div className="text-rose-400">{num2}</div>
          <div className="text-zinc-500">=</div>
          <div className="text-emerald-400">
            {result} {remainder > 0 && <span className="text-xl text-amber-400 ml-2">Sisa {remainder}</span>}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 w-full max-w-3xl">
          
          {operation === "+" && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {renderItems(num1, "bg-blue-500")}
              </div>
              <div className="text-2xl text-zinc-500 font-bold">+</div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {renderItems(num2, "bg-rose-500")}
              </div>
              <div className="w-full h-px bg-white/20 my-2" />
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {renderItems(num1, "bg-blue-500")}
                {renderItems(num2, "bg-rose-500")}
              </div>
              <div className="text-emerald-400 font-bold mt-2">Total: {result} item</div>
            </div>
          )}

          {operation === "-" && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-zinc-400 text-sm">Mulai dengan {num1} item:</div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg relative">
                {renderItems(num1 - num2, "bg-emerald-500")}
                
                {/* Items to be removed */}
                {Array.from({ length: Math.min(num1, num2) }).map((_, i) => (
                  <div key={`rm-${i}`} className="relative m-1">
                    <div className="w-8 h-8 rounded-full bg-blue-500 opacity-30 flex items-center justify-center"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-1 bg-red-500 rotate-45 absolute" />
                      <div className="w-10 h-1 bg-red-500 -rotate-45 absolute" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-emerald-400 font-bold mt-2">Sisa: {result} item</div>
            </div>
          )}

          {operation === "x" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-zinc-400 text-sm">{num1} Kelompok, Masing-masing isi {num2}:</div>
              <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
                {Array.from({ length: num1 }).map((_, g) => (
                  <div key={g} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-1">
                    {renderItems(num2, "bg-purple-500")}
                  </div>
                ))}
              </div>
              <div className="text-emerald-400 font-bold mt-4">Total: {result} item</div>
            </div>
          )}

          {operation === "÷" && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-zinc-400 text-sm">Membagi {num1} item ke dalam {num2} kelompok:</div>
              {num2 > 0 ? (
                <>
                  <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
                    {Array.from({ length: num2 }).map((_, g) => (
                      <div key={g} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="text-xs text-zinc-500">Kel. {g+1}</div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {renderItems(result, "bg-sky-500")}
                        </div>
                      </div>
                    ))}
                  </div>
                  {remainder > 0 && (
                    <div className="mt-4 p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl flex flex-col items-center">
                      <div className="text-xs text-amber-400 mb-2">Sisa (Tidak bisa dibagi rata)</div>
                      <div className="flex gap-1">
                        {renderItems(remainder, "bg-amber-500")}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-red-500 font-bold p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                  Tidak dapat membagi dengan Nol!
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Visualisasi Operasi Bilangan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-4 gap-2">
            <button onClick={()=>setOperation('+')} className={`py-3 rounded-xl font-bold text-xl ${operation==='+'?'bg-emerald-500 text-white':'bg-zinc-800 text-zinc-400'}`}>+</button>
            <button onClick={()=>setOperation('-')} className={`py-3 rounded-xl font-bold text-xl ${operation==='-'?'bg-emerald-500 text-white':'bg-zinc-800 text-zinc-400'}`}>-</button>
            <button onClick={()=>setOperation('x')} className={`py-3 rounded-xl font-bold text-xl ${operation==='x'?'bg-emerald-500 text-white':'bg-zinc-800 text-zinc-400'}`}>×</button>
            <button onClick={()=>setOperation('÷')} className={`py-3 rounded-xl font-bold text-xl ${operation==='÷'?'bg-emerald-500 text-white':'bg-zinc-800 text-zinc-400'}`}>÷</button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Angka Pertama (a)</label>
                <span className="font-mono text-blue-400">{num1}</span>
              </div>
              <input type="range" className="w-full accent-blue-500" min="0" max={operation === "x" ? 10 : 20} step="1" value={num1} onChange={(e) => setNum1(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-rose-400">Angka Kedua (b)</label>
                <span className="font-mono text-rose-400">{num2}</span>
              </div>
              <input type="range" className="w-full accent-rose-500" min={operation === "÷" ? 1 : 0} max={operation === "x" ? 10 : 20} step="1" value={num2} onChange={(e) => setNum2(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Operasi Dasar Matematika:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Tambah:</strong> Menggabungkan dua kelompok.</li>
              <li><strong>Kurang:</strong> Mengambil sebagian dari kelompok.</li>
              <li><strong>Kali:</strong> Menjumlahkan kelompok secara berulang.</li>
              <li><strong>Bagi:</strong> Membagi rata ke dalam beberapa kelompok.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
