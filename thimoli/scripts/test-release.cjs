const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),cp=require('node:child_process');
const harness=fs.readFileSync(path.join(__dirname,'smoke-curriculum.js'),'utf8').split('const result = vm.runInContext')[0];
for(const unlockAll of [false,true]){
 const source=harness.replace("THIMOLI_RELEASE: { mode: 'prototype', unlockAll: true }",`THIMOLI_RELEASE:{mode:'test',unlockAll:${unlockAll}}`);
 const shell={require,__dirname,process,console,URL,URLSearchParams};vm.runInNewContext(source+'\nglobalThis.testContext=context',shell);
 const result=vm.runInContext(`(() => {state.pathProgress=Array(12).fill(0);const initial=Array.from({length:12},(_,i)=>isVillageUnlocked(i));state.pathProgress[0]=PATH_NODE_COUNT-1;const beforeFinal=isVillageUnlocked(1);state.pathProgress[0]=PATH_NODE_COUNT;return {initial,beforeFinal,afterFinal:isVillageUnlocked(1),invalid:isVillageUnlocked(-1)||isVillageUnlocked(12),profile:profile()};})()`,shell.testContext);
 assert.equal(result.initial.filter(Boolean).length,unlockAll?12:1);assert.equal(result.beforeFinal,unlockAll);assert.equal(result.afterFinal,true);assert.equal(result.invalid,false);assert(!result.profile.includes('<h2>Abinash</h2>'));
}
const check=cp.spawnSync(process.execPath,['scripts/check-release.cjs'],{encoding:'utf8'});
const status=JSON.parse(check.stdout);assert.equal(check.status,status.ready?0:1);
console.log('PASS: prototype/production progression, final assessment gate, neutral profile, release preflight.');
