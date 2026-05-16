const fs = require('fs');
let content = fs.readFileSync('simulations/kimia/TabelPeriodik.tsx', 'utf8');

const oldShells = `{/* Orbiting Shells */}
                     {selected.shells.map((count, i) => (
                       <motion.div 
                         key={i}
                         initial={{ scale: 0.5, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ delay: i * 0.1 }}
                         className="absolute rounded-full border border-white/10"
                         style={{ 
                           width: \`\${50 + (i+1)*40}px\`, 
                           height: \`\${50 + (i+1)*40}px\`,
                         }}
                       >
                         {/* Electrons */}
                         {Array.from({ length: count }).map((_, j) => (
                           <motion.div 
                             key={j}
                             animate={{ rotate: 360 }}
                             transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                             className="absolute w-full h-full top-0 left-0"
                             style={{ rotate: (j * 360) / count }}
                           >
                             <div 
                               className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] border border-emerald-300"
                             />
                           </motion.div>
                         ))}
                       </motion.div>
                     ))}`;

const newShells = `{/* Orbiting Shells */}
                     {selected.shells.map((count, i) => {
                       const isSimple = selected.n > 30;
                       const shellSize = 50 + (i+1)*40;
                       return (
                         <motion.div 
                           key={i}
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ delay: i * 0.1 }}
                           className="absolute rounded-full border border-white/10 flex items-start justify-center"
                           style={{ width: \`\${shellSize}px\`, height: \`\${shellSize}px\` }}
                         >
                           {isSimple ? (
                             // Simple mode: just show electron count as label
                             <span className="text-[9px] font-black text-emerald-400 -translate-y-2.5 bg-black/60 px-1 rounded">{count}e</span>
                           ) : (
                             // Full mode: render individual electrons
                             Array.from({ length: count }).map((_, j) => (
                               <motion.div 
                                 key={j}
                                 animate={{ rotate: 360 }}
                                 transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                                 className="absolute w-full h-full top-0 left-0"
                                 style={{ rotate: (j * 360) / count }}
                               >
                                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] border border-emerald-300" />
                               </motion.div>
                             ))
                           )}
                         </motion.div>
                       );
                     })}`;

if (!content.includes('{/* Orbiting Shells */}')) {
  console.error('Could not find target string!');
  process.exit(1);
}

content = content.replace(oldShells, newShells);
fs.writeFileSync('simulations/kimia/TabelPeriodik.tsx', content);
console.log('done');
