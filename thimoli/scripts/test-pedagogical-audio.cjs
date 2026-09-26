const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={window:{}};
for(const name of ['alphabet-index','speech-index'])vm.runInNewContext(fs.readFileSync(`assets/audio/${name}.js`,'utf8'),c);
const original={...c.window.THIMOLI_ALPHABET_AUDIO};
const words=JSON.stringify(c.window.THIMOLI_SPEECH_AUDIO);
vm.runInNewContext(fs.readFileSync('assets/audio/pedagogical-index.js','utf8'),c);
const current=c.window.THIMOLI_ALPHABET_AUDIO;
assert.equal(Object.keys(current).length,247);
let changed=0;
for(const [letter,file] of Object.entries(current)){
 assert(fs.existsSync(file),letter);
 if(file!==original[letter]){
  changed++;
  const bytes=fs.readFileSync(file);assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.readUInt32LE(40),bytes.length-44);assert(bytes.length>14000,letter);
  assert.equal(bytes.readUInt32LE(24),44100);assert.equal(bytes.readUInt16LE(22),1);
 }
}
assert.equal(changed,211);
assert.equal(JSON.stringify(c.window.THIMOLI_SPEECH_AUDIO),words);
for(const l of ['ள','ளா','ற','றா','ன','னா'])assert.equal(current[l],original[l]);
const report=JSON.parse(fs.readFileSync('output/audio-private-elevenlabs/integration-report.json'));
assert.equal(report.letters.length,211);
console.log('PASS: 211 new recordings; 36 original fallback recordings; 247 playable paths; word index untouched.');
