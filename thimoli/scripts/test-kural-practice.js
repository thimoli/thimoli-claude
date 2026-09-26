const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const path = require('node:path')
const root = fs.existsSync(path.resolve(__dirname, '../app.js')) ? path.resolve(__dirname, '..') : path.resolve(__dirname, '../dist')
const verses = fs.readFileSync(path.join(root, 'assets/data/thirukkural.txt'), 'utf8').split(/\r?\n/).filter(Boolean)
const state = {page:'kural',kuralView:'detail',kuralIndex:0,kuralPractice:null,kuralRecall:{}}
const c = vm.createContext({state,kuralVerses:verses,Math,Number,Set,
  saveState(){},render(){},stopTamilAudio(){},mascot(){return ''},
  kuralPhoneticFor(i,text){return text.split('$')},tamilToPhonetic(text){return text},kuralFrenchTitle(){return 'Chapitre'},
  openKuralView(view,{index}){state.kuralIndex=index;state.kuralView=view}
})
vm.runInContext(fs.readFileSync(path.join(root,'kural-practice.js'),'utf8'), c)
function click(dataset={},attributes=[]) { c.target={dataset,hasAttribute(name){return attributes.includes(name)}}; return vm.runInContext('kuralPracticeHandle(target)', c) }
const next=()=>click({},['data-kp-next'])
for(let index=0;index<verses.length;index++) {
  click({kpStart:String(index)})
  assert.equal(state.kuralPractice.step,0)
  next()
  const lines=verses[index].split('$').filter(line=>line.trim())
  assert.equal(lines.length,2)
  for(let line=0;line<2;line++) {
    const words=lines[line].trim().split(/\s+/)
    const run=state.kuralPractice
    c.verse=verses[index]
    assert.match(vm.runInContext('kuralPracticePanel(verse)', c),/kural-word-bank/)
    next();assert.equal(run.step,1,'Cannot skip unsolved line')
    words.forEach((_,id)=>click({kpWord:String(words.length-1-id)}))
    click({},['data-kp-check'])
    assert.equal(run.feedback,'wrong')
    next();assert.equal(run.line,line)
    run.order.slice().forEach(id=>click({kpRemove:String(id)}))
    words.forEach((_,id)=>click({kpWord:String(id)}))
    click({kpWord:'0'});assert.equal(run.order.length,words.length,'No duplicate selection')
    click({},['data-kp-check']);assert.equal(run.feedback,'correct')
    next()
  }
  assert.equal(state.kuralPractice.step,2)
  click({},['data-kp-reveal']);assert.equal(state.kuralPractice.reveal,true)
  click({kpResult:index%2 ? 'review':'recited'})
  assert.equal(state.kuralPractice.step,3)
  assert.equal(state.kuralRecall[index],index%2 ? 'review':'recited')
}
assert.equal(Object.keys(state.kuralRecall).length,1330)
assert.equal(vm.runInContext('restoreKuralPractice({index:-1})',c),null)
c.persisted={index:0,step:1,line:1,order:[1,0,1,-1],seed:4}
assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(restoreKuralPractice(persisted).order)',c)),[1,0])
console.log('Kural practice: 1,330 texts, wrong/correct answers, retry, duplicate words, gated steps and self-assessment passed.')
