const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const harness=fs.readFileSync(path.join(__dirname,'smoke-curriculum.js'),'utf8').split('const result = vm.runInContext')[0];
const shell={require,__dirname,process,console,URL,URLSearchParams};vm.runInNewContext(harness+'\nglobalThis.contextForTest=context',shell);const context=shell.contextForTest;
const results=vm.runInContext(`(() => {
 const out=[];
 for(const lang of ['en','de']){
  state.settings.language=lang;
  const before=JSON.stringify(curriculum);
  for(const [level,village] of curriculum.entries())for(const [stageIndex,stage] of village.stages.entries()){
   for(const text of [stage.title,stage.lesson,stage.objective,stage.note,...stage.items.map(item=>item.fr)].filter(Boolean)){
    out.push({kind:'curriculumCoverage',ok:Boolean(interfaceTranslations[lang][text])||['kaa','mi'].includes(text),text,lang});
   }
   const questions=[...learning.lessonQuestions(stage,level,stageIndex),...[0,1,2].flatMap(slot=>learning.exerciseQuestions(stage,level,stageIndex,slot))];
   for(const q of questions)for(const field of ['title','prompt','hint','explanation']){
    const text=q[field];out.push({kind:'activityCoverage',ok:Boolean(interfaceTranslations[lang][text])||translationPatterns[lang].some(([pattern])=>pattern.test(text)),id:q.id,field,text,lang});
   }
  }
  for(let level=0;level<12;level++){
   const p=learning.pack(level);
   for(const value of [p.title,p.rule,p.question,p.reason,p.sentence[1],p.writing].filter(Boolean))out.push({kind:'translated',ok:translateUiText(value)!==value,value,lang});
  }
  const q=learning.lessonQuestions(curriculum[0].stages[0],0,0)[0];
  const solution=activitySolutionMarkup(q);
  const build=activityBody({type:'build',tokens:[{id:'0',text:'அ'},{id:'1',text:'ம்'}]}, {order:[]}, '');
  out.push({kind:'buildPlaceholder',ok:!build.includes('Touche les blocs dans le bon ordre')&&build.includes('lang="'+lang+'"')&&build.includes('அ')});
  out.push({kind:'solution',ok:solution.includes('lang="ta"')&&!solution.includes('son a court')&&solution.includes(lang==='en'?'short a sound':'kurzer a-Laut')});
  out.push({kind:'interpolation',ok:translateUiText('Quel signe correspond à « son “a” court » ?').includes(lang==='en'?'short a sound':'kurzer a-Laut')});
  out.push({kind:'unchangedTamil',ok:translateUiText('அம்மா')==='அம்மா' && JSON.stringify(curriculum)===before});
  const response={links:Object.fromEntries(q.pairs.map(p=>[p.id,p.id]))};out.push({kind:'sameGrading',ok:learning.check(q,response)===true});
 }
 return out;
})()`,context);
for(const result of results)assert(result.ok,JSON.stringify(result));
console.log('PASS: twelve shared grammar lessons translated EN/DE, mixed Tamil feedback, dynamic prompts, unchanged answers and grading.');
