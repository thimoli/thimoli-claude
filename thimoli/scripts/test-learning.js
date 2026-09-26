const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const root = fs.existsSync(path.resolve(__dirname,'../curriculum.js')) ? path.resolve(__dirname,'..') : path.resolve(__dirname,'../dist')
process.chdir(root)
const engine = require(path.join(root,'learning-engine.js'))
const sandbox = {window:{}}
vm.runInNewContext(fs.readFileSync('curriculum.js','utf8'),sandbox)
const curriculum = sandbox.window.THIMOLI_CURRICULUM
vm.runInNewContext(fs.readFileSync('assets/audio/alphabet-index.js','utf8'),sandbox)
vm.runInNewContext(fs.readFileSync('assets/audio/speech-index.js','utf8'),sandbox)
const audio = {...sandbox.window.THIMOLI_SPEECH_AUDIO,...sandbox.window.THIMOLI_ALPHABET_AUDIO}
const counts = {}
let total = 0
function correctResponse(q) {
  if(q.type==='memory') return {matched:q.pairs.map(p=>p.id)}
  if(q.type==='match') return {links:Object.fromEntries(q.pairs.map(p=>[p.id,p.id]))}
  if(q.type==='sort') return {groups:Object.fromEntries(q.cards.map(p=>[p.id,p.category]))}
  if(q.type==='build' || q.type==='listen' && q.tokens) return {order:q.tokens.slice().sort((a,b)=>Number(a.id)-Number(b.id)).map(t=>t.id)}
  if(q.type==='write') return {text:'நான் தமிழ் படிக்கிறேன்.',checks:[0,1,2]}
  return {text:q.target}
}
for(let level=0;level<12;level++) {
  for(let stageIndex=0;stageIndex<10;stageIndex++) {
    const stage = curriculum[level].stages[stageIndex]
    const questions = [
      ...engine.lessonQuestions(stage,level,stageIndex),
      ...[0,1,2].flatMap(slot=>engine.exerciseQuestions(stage,level,stageIndex,slot))
    ]
    for(const q of questions) {
      total++; counts[q.type]=(counts[q.type]||0)+1
      assert.ok(q.id && q.prompt && q.explanation)
      assert.equal(engine.ready(q,{}),false,`${q.id} empty cannot pass`)
      const answer=correctResponse(q)
      assert.equal(engine.ready(q,answer),true,q.id)
      assert.equal(engine.check(q,answer),q.type==='write'?null:true,`${q.id} intended answer`)
      assert.equal(engine.check(q,{text:'nonsense',value:'nonsense',order:['x'],links:{x:'y'},groups:{x:99}}),false,`${q.id} nonsense fails`)
      if(q.type==='match') {
        assert.notDeepEqual(q.order,q.pairs.map(p=>p.id),`${q.id} right column shuffled`)
        const wrong={links:Object.fromEntries(q.pairs.map((p,i)=>[p.id,q.pairs[(i+1)%q.pairs.length].id]))}
        assert.equal(engine.check(q,wrong),false)
      }
      if(q.type==='sort') assert.equal(engine.check(q,{groups:Object.fromEntries(q.cards.map(p=>[p.id,1-p.category]))}),false)
      if(q.type==='gap') assert.ok(q.options.includes(q.target))
      if(q.type==='memory') {
        assert.equal(q.cards.length,q.pairs.length*2)
        assert.equal(new Set(q.cards.map(c=>c.id)).size,q.cards.length)
        assert.equal(engine.ready(q,{matched:[q.pairs[0].id]}),false)
      }
      if(q.type==='listen') {
        assert.ok(audio[q.audio],`Missing recording: ${q.audio}`)
        assert.ok(fs.existsSync(audio[q.audio]),`Missing audio file: ${q.audio}`)
      }
      if(q.type==='read') assert.ok(engine.normalize(q.passage).includes(q.target))
      if(q.type==='write') { assert.equal(engine.ready(q,{text:'abc',checks:[0,1,2]}),false); assert.equal(engine.ready(q,{text:'்',checks:[0,1,2]}),false) }
      if(q.type==='build') {
        assert.equal(engine.check(q,{order:answer.order.slice().reverse()}), engine.normalize(q.tokens.slice().sort((a,b)=>Number(b.id)-Number(a.id)).map(t=>t.text).join(q.words?' ':''))===q.target)
        assert.ok(q.tokens.every(t=>!/^\p{M}/u.test(t.text)),`no detached marks: ${q.id}`)
      }
    }
  }
  assert.equal(engine.examQuestions(curriculum[level].stages,level,'mock').length,10)
  assert.equal(engine.examQuestions(curriculum[level].stages,level,'final').length,12)
}
assert.deepEqual(engine.letters('அம்மா'),['அ','ம்','மா'])
assert.deepEqual(engine.letters('கொ'),['கொ'])
assert.notEqual(engine.normalize('கல்'),engine.normalize('கால்'))
assert.equal(engine.normalize('  தமிழ். '),'தமிழ்')
console.log(JSON.stringify({total,counts,levels:curriculum.length,assertions:'all passed'},null,2))
