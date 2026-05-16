const fs = require('fs');
const elements = JSON.parse(fs.readFileSync('elements.json', 'utf8'));

let tsCode = 'const ELEMENTS: Element[] = [\n';
elements.forEach(e => {
  let name = e.name.replace(/`/g, '');
  let desc = e.desc.replace(/`/g, '').replace(/\n/g, ' ');
  let mass = e.mass || 0;
  let config = e.config || '';
  
  // ensure shells has no null
  let shellsStr = e.shells.map(s => s || 0).join(', ');

  tsCode += `  { n: ${e.n}, sym: '${e.sym}', name: \`${name}\`, cat: '${e.cat}', row: ${e.row}, col: ${e.col}, mass: ${mass}, config: '${config}', shells: [${shellsStr}], state: '${e.state}', desc: \`${desc}\` },\n`;
});
tsCode += '];';

let content = fs.readFileSync('simulations/kimia/TabelPeriodik.tsx', 'utf8');
content = content.replace(/const ELEMENTS: Element\[\] = \[[\s\S]*?\];/, tsCode);
fs.writeFileSync('simulations/kimia/TabelPeriodik.tsx', content);
console.log('done');
