const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const language of ['fr','en','de']){
 const events={},nodes=[],navigator={onLine:true},root={lang:language};let observe;
 const context={navigator,window:{addEventListener:(name,fn)=>events[name]=fn},document:{documentElement:root,body:{append:node=>nodes.push(node)},createElement:()=>({setAttribute(){}})},MutationObserver:class{constructor(fn){observe=fn}observe(){}}};
 vm.runInNewContext(fs.readFileSync('connectivity.js','utf8'),context);
 events.DOMContentLoaded();assert.equal(nodes.length,1);assert.equal(nodes[0].hidden,true);
 navigator.onLine=false;events.offline();assert.equal(nodes[0].hidden,false);assert(nodes[0].textContent.length>50);
 root.lang='de';observe();assert(nodes[0].textContent.startsWith('Verbindung'));
 navigator.onLine=true;events.online();assert.equal(nodes[0].hidden,true);assert.equal(nodes.length,1);
}
console.log('PASS: offline/online status, three languages, live language change, no reload or storage mutation.');
