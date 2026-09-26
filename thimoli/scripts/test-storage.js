// Exercise saveState with a full valid state from the existing smoke harness.
require('./smoke-curriculum.js')
const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const source = fs.readFileSync('app.js','utf8')
const save = source.slice(source.indexOf('function saveState()'),source.indexOf('function applyMotionPreference()'))
const notice = {hidden:true,textContent:''}
let shouldFail = false
let stored = null
const c = vm.createContext({
  state:{},learning:{version:3},storageSaveFailed:false,STORAGE_KEY:'test',
  document:{querySelector:()=>notice},fq:fr=>fr,
  localStorage:{setItem(key,value){if(shouldFail)throw new Error('quota');stored=JSON.parse(value)}}
})
vm.runInContext(save,c)
c.saveState()
assert.equal(c.storageSaveFailed,false)
assert.equal(notice.hidden,true)
assert.equal(stored.learningVersion,3)
shouldFail=true;c.saveState()
assert.equal(c.storageSaveFailed,true)
assert.equal(notice.hidden,false)
assert.match(notice.textContent,/ne peut pas être sauvegardée/)
shouldFail=false;c.saveState()
assert.equal(c.storageSaveFailed,false)
assert.equal(notice.hidden,true)
console.log('Storage: success, quota failure warning, and recovery passed.')
