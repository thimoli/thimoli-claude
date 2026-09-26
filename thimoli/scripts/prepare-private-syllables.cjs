const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'output/audio-private-elevenlabs/syllables');
const consonants = [...'கஙசஞடணதநபமயரலவழளறன'];
const signs = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
const longIndices = new Set([1,3,5,7,10]);
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/audio/alphabet-index.js'), 'utf8'), context);
const batches = [];
for (let b = 0; b < 6; b++) {
  const rows = consonants.slice(b * 3, b * 3 + 3).map(c => signs.map(s => c + s));
  const prompt = rows.map(row => row.map((letter, i) => `${longIndices.has(i) ? '[drawn out]' : '[slowly]'} ${letter}${longIndices.has(i) ? '…' : '.'} [pause]`).join(' ')).join('\n[long pause]\n');
  batches.push({ id: b + 1, consonants: consonants.slice(b*3,b*3+3), letters: rows.flat(), prompt, status: 'prepared-not-verified' });
}
const letters = batches.flatMap(b => b.letters);
if (letters.length !== 216 || new Set(letters).size !== 216 || letters.some(l => !context.window.THIMOLI_ALPHABET_AUDIO[l])) throw new Error('Alphabet coverage mismatch');
fs.mkdirSync(out, { recursive: true });
for (const b of batches) fs.writeFileSync(path.join(out, `batch-${b.id}-prompt.txt`), b.prompt + '\n');
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ voice:'Nila - Warm, Clear and Conversational', model:'Eleven v3', privateOnly:true, phoneticValidation:false, integrated:false, batches }, null, 2));
console.log(JSON.stringify({ count:letters.length, unique:new Set(letters).size, characters:batches.map(b=>b.prompt.length), totalCharacters:batches.reduce((n,b)=>n+b.prompt.length,0) }));
