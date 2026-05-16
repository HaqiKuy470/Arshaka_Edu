const fs = require('fs');
let content = fs.readFileSync('simulations/kimia/TabelPeriodik.tsx', 'utf8');

const startMarker = '      {/* Main Container */}';
const endMarker = '      </div>\n\n      {/* Sidebar Details Panel */}';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker) + '      </div>'.length;

const newSection = `      {/* Main Container */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Fixed Top Bar: Header + Categories */}
        <div className="shrink-0 px-5 pt-4 pb-2 bg-[#050505]/90 backdrop-blur-xl z-40 border-b border-white/5">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3"
          >
            <div className="flex items-center gap-3">
              <Link href="/simulasi" className="group p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95">
                <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight text-white/90 leading-tight">Eksplorasi Unsur</h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em]">Museum Periodik Interaktif</span>
                </div>
              </div>
            </div>

            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="text"
                    placeholder="Cari unsur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-transparent text-[11px] focus:outline-none w-full md:w-56 placeholder:text-zinc-600 font-medium"
                  />
               </div>
            </div>
          </motion.div>

          {/* Categories Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
             <button 
               onClick={() => setFilter(null)}
               className={\`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border transition-all shrink-0 \${!filter ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}\`}
             >
               Semua
             </button>
             {Object.entries(CAT_COLORS).map(([id, cfg]) => (
               <button
                 key={id}
                 onClick={() => setFilter(id)}
                 className={\`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border transition-all shrink-0 \${filter === id ? 'bg-white/10' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}\`}
                 style={{ 
                   borderColor: filter === id ? cfg.color : 'rgba(255,255,255,0.05)',
                   color: filter === id ? cfg.color : ''
                 }}
               >
                 {cfg.label}
               </button>
             ))}
          </div>
        </div>

        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar p-4">
          <div className="flex items-start justify-center min-h-full">
            <div className="grid grid-cols-18 gap-[3px] w-full max-w-5xl">
               {Array.from({ length: 10 * 18 }).map((_, idx) => {
                  const r = Math.floor(idx / 18) + 1;
                  const c = (idx % 18) + 1;
                  
                  if (r === 8) return <div key={idx} className="aspect-square" />;
                  
                  const el = ELEMENTS.find(e => e.row === r && e.col === c);
                  
                  if (el) {
                    const isVisible = filteredElements.some(fe => fe.sym === el.sym);
                    const isSelected = selectedSym === el.sym;
                    const isHovered = hoveredSym === el.sym;
                    const cfg = CAT_COLORS[el.cat] || CAT_COLORS['unknown'];

                    return (
                      <motion.button
                        layoutId={\`element-\${el.sym}\`}
                        key={el.sym}
                        onMouseEnter={() => setHoveredSym(el.sym)}
                        onMouseLeave={() => setHoveredSym(null)}
                        onClick={() => setSelectedSym(el.sym)}
                        className={\`aspect-square relative flex flex-col items-center justify-center rounded-[4px] border transition-all duration-300 group \${isSelected ? 'z-30' : 'z-10'} \${!isVisible ? 'opacity-10 grayscale' : 'opacity-100'}\`}
                        style={{ 
                          borderColor: isSelected ? 'white' : (isHovered ? cfg.color : 'rgba(255,255,255,0.05)'),
                          backgroundColor: isSelected ? 'white' : (isHovered ? \`\${cfg.color}10\` : 'rgba(255,255,255,0.02)'),
                          boxShadow: isSelected ? \`0 0 20px \${cfg.color}40\` : ''
                        }}
                      >
                        <span className={\`text-[6px] font-mono absolute top-[2px] left-[3px] transition-colors \${isSelected ? 'text-black/40' : 'text-zinc-600'}\`}>
                          {el.n}
                        </span>
                        <span 
                          className={\`text-[10px] md:text-xs font-black tracking-tighter transition-colors \${isSelected ? 'text-black' : ''}\`}
                          style={{ color: isSelected ? '' : cfg.color }}
                        >
                          {el.sym}
                        </span>
                        
                        <div className="absolute bottom-[2px] right-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                           {el.state === 'gas' && <Wind className="w-[8px] h-[8px] text-blue-400/50" />}
                           {el.state === 'liquid' && <Waves className="w-[8px] h-[8px] text-cyan-400/50" />}
                           {el.state === 'solid' && <Box className="w-[8px] h-[8px] text-zinc-400/50" />}
                        </div>

                        {isSelected && (
                          <motion.div 
                            layoutId="selection-glow"
                            className="absolute inset-[-1px] border-2 border-white rounded-[6px] pointer-events-none"
                          />
                        )}
                      </motion.button>
                    );
                  }
                  
                  if (r === 6 && c === 3 && !el) return <div key={idx} className="flex items-center justify-center"><span className="text-[8px] text-pink-400 font-bold">*</span></div>;
                  if (r === 7 && c === 3 && !el) return <div key={idx} className="flex items-center justify-center"><span className="text-[8px] text-rose-400 font-bold">**</span></div>;
                  if (r === 9 && c === 2) return <div key={idx} className="flex items-center justify-end pr-1"><span className="text-[8px] text-pink-400 font-bold">*</span></div>;
                  if (r === 10 && c === 2) return <div key={idx} className="flex items-center justify-end pr-1"><span className="text-[8px] text-rose-400 font-bold">**</span></div>;

                  return <div key={idx} className="aspect-square" />;
               })}
            </div>
          </div>
        </div>
      </div>`;

content = content.slice(0, startIdx) + newSection + content.slice(endIdx);
fs.writeFileSync('simulations/kimia/TabelPeriodik.tsx', content);
console.log('done, new length:', content.length);
