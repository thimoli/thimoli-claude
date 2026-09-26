const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('legal.js','utf8');
for(const lang of ['fr','en','de'])for(const view of ['privacy','terms','notice']){
 const elements={'#legal':{innerHTML:''},'#message':{textContent:''}};const events={};const storage=new Map([['thimoli-v1.1-premium-state','{"settings":{"language":"fr"}}'],['unrelated','keep']]);
 const c={URLSearchParams,location:{search:`?lang=${lang}&view=${view}`},document:{documentElement:{},querySelector:s=>elements[s]||(elements[s]={addEventListener:(type,fn)=>events[s]=fn}),createElement:()=>({click(){}})},localStorage:{getItem:k=>storage.get(k),removeItem:k=>storage.delete(k)},confirm:()=>false};
 vm.runInNewContext(script,c);assert.equal(c.document.documentElement.lang,lang);assert(elements['#legal'].innerHTML.includes('class="draft"'));assert(!elements['#legal'].innerHTML.includes('undefined'));
 events['#erase']();assert(storage.has('thimoli-v1.1-premium-state'));c.confirm=()=>true;events['#erase']();assert(!storage.has('thimoli-v1.1-premium-state'));assert.equal(storage.get('unrelated'),'keep');
}
console.log('PASS: legal pages render in FR/EN/DE; cancellation preserves data; confirmed deletion targets only the Thimoli key (mock storage).');
