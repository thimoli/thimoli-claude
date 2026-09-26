const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const harness=fs.readFileSync('scripts/smoke-curriculum.js','utf8').split('const result = vm.runInContext')[0];
const shell={require,__dirname,process,console,URL,URLSearchParams};
vm.runInNewContext(harness+'\nglobalThis.ctx=context',shell);
const result=JSON.parse(vm.runInContext(`JSON.stringify((()=>{
 state.foundationProgress={};
 const locked=foundationNextQuestId('q1');
 startFoundationQuest('q1');state.foundationRun.index=3;finishFoundationQuest();
 const next=foundationNextQuestId('q1'),markup=foundationQuestView(),count=state.sessions.length;
 foundationHandle({dataset:{questStart:next}});
 const continued=state.foundationRun.id==='q2'&&state.foundationRun.phase==='intro'&&state.sessions.length===count;
 const last=foundationQuests().at(-1);state.foundationProgress[last.id]={stars:1};
 const end=foundationNextQuestId(last.id),invalid=foundationNextQuestId('missing');
 const visual=foundationQuests().filter(q=>q.kind==='words').every(q=>foundationQuestions(q)[1].visual===true);
 return {locked,next,continued,end,invalid,visual,button:markup.includes('Étape suivante')};
})())`,shell.ctx));
assert.equal(result.locked,null);assert.equal(result.next,'q2');assert(result.continued&&result.visual&&result.button);
assert.equal(result.end,null);assert.equal(result.invalid,null);
console.log('PASS: foundation next quest, prerequisite guard, final boundary, no extra reward, visual vocabulary matching.');
