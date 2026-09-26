// Controller regression tests. Decoded-signal and browser checks are separate.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const root = fs.existsSync(path.resolve(__dirname,'../app.js')) ? path.resolve(__dirname,'..') : path.resolve(__dirname,'../dist')
const code = fs.readFileSync(path.join(root,'app.js'),'utf8')
const playerCode = code.slice(code.indexOf('function audioNotice('),code.indexOf('\nif ("speechSynthesis" in window)',code.indexOf('function audioNotice(')))
let timerId = 0
const timers = new Map()
const classes = new Set()
const notice = {textContent:''}
const player = {dataset:{},paused:true,muted:false,currentTime:0,playbackRate:1,pause(){this.paused=true},play(){this.paused=false;this.onplaying?.();return Promise.resolve()}}
const c = vm.createContext({
  console, audioRequestId:0, audioLoadTimer:null, audioNoticeText:'', activeTamilAudio:null,
  audioPlayback:{status:'idle',text:'',source:''}, fq:fr=>fr,
  document:{querySelector:()=>player,documentElement:{classList:{toggle(name,on){on?classes.add(name):classes.delete(name)}}}},
  app:{querySelector:()=>notice,querySelectorAll:()=>[]},
  window:{setTimeout(fn){const id=++timerId;timers.set(id,fn);return id},clearTimeout(id){timers.delete(id)},speechSynthesis:{cancel(){}}}
})
vm.runInContext(fs.readFileSync(path.join(root,'assets/audio/alphabet-index.js'),'utf8'),c)
const pedagogicalIndex = path.join(root,'assets/audio/pedagogical-index.js')
if(fs.existsSync(pedagogicalIndex)) vm.runInContext(fs.readFileSync(pedagogicalIndex,'utf8'),c)
vm.runInContext(fs.readFileSync(path.join(root,'assets/audio/speech-index.js'),'utf8'),c)
c.naturalAudioItems={...c.window.THIMOLI_SPEECH_AUDIO,...c.window.THIMOLI_ALPHABET_AUDIO}
vm.runInContext(playerCode,c)

async function test(){
  for(const [text,source] of Object.entries(c.window.THIMOLI_ALPHABET_AUDIO)){
    assert(fs.existsSync(path.join(root,source)),`recording exists: ${text}`)
    c.speakTamil(text,'obsolete-file.mp3')
    assert.equal(player.src,source,`canonical recording wins: ${text}`)
    assert.equal(player.dataset.status,'playing',`playing: ${text}`)
    assert.equal(player.volume,1)
    assert.equal(player.muted,false)
    player.onended()
    assert.equal(player.dataset.status,'ended',`ended: ${text}`)
    assert(!classes.has('voice-is-playing'))
  }
  let rejectOld
  player.play=()=>new Promise((_,reject)=>{rejectOld=reject})
  c.speakTamil('அ')
  const oldFailure=rejectOld
  player.play=()=>{player.onplaying();return Promise.resolve()}
  c.speakTamil('ஆ')
  oldFailure(Object.assign(new Error('old request'),{name:'NotAllowedError'}))
  await Promise.resolve()
  assert.equal(player.dataset.text,'ஆ')
  assert.equal(player.dataset.status,'playing','stale rejection cannot break the next sound')
  c.stopTamilAudio()
  assert.equal(player.dataset.status,'idle')
  assert(player.paused)

  player.play=()=>Promise.reject(Object.assign(new Error('gesture needed'),{name:'NotAllowedError'}))
  c.speakTamil('இ')
  await Promise.resolve()
  assert.equal(player.dataset.status,'error')
  assert(notice.textContent.includes('autoriser'))
  player.play=()=>new Promise(()=>{})
  c.speakTamil('உ')
  timers.get(c.audioLoadTimer)()
  assert.equal(player.dataset.status,'error','loading timeout exposes a retryable error')
  c.speakTamil('not recorded')
  assert.equal(player.dataset.status,'unavailable')
  assert(!notice.textContent.includes('charge encore'),'never pretend an absent recording is loading')
  console.log(JSON.stringify({controller:'passed',letters:247,checks:['canonical mapping','ended','repeat','rapid replacement','stale errors','gesture rejection','loading timeout','missing recording']},null,2))
}
test().catch(error=>{console.error(error);process.exitCode=1})
