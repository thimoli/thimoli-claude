const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dir = path.resolve(__dirname, '../output/audio-private-elevenlabs/syllables');
const manifest = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
const downloads = JSON.parse(fs.readFileSync(path.join(dir,'downloads.json')));
if (downloads.records.length !== 6) throw Error('Missing batches');
const seen = new Set();
const results = downloads.records.map(r => {
  const data = fs.readFileSync(path.join(dir,r.file));
  if(data.length !== r.bytes) throw Error('Incomplete download '+r.file);
  if(data.subarray(0,3).toString() !== 'ID3' && !(data[0]===255 && (data[1]&224)===224)) throw Error('Not MP3 '+r.file);
  const b = manifest.batches.find(b => b.id === r.batch);
  if(b.letters.length !== 36) throw Error('Incorrect coverage');
  for(const l of b.letters) { if(seen.has(l)) throw Error('Duplicate '+l); seen.add(l); }
  return {...r, sha256:crypto.createHash('sha256').update(data).digest('hex')};
});
if(seen.size!==216) throw Error('Missing syllables in prompts');
fs.writeFileSync(path.join(dir,'file-check.json'),JSON.stringify({files:results,promptCoverage:seen.size,check:'File size, MP3 signature and prompt coverage only; no auditory validation',wordsChanged:false},null,2));
console.log(JSON.stringify({downloaded:results.length,promptCoverage:seen.size,totalBytes:results.reduce((n,r)=>n+r.bytes,0),phoneticValidation:false}));
