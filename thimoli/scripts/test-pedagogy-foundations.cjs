// Structural reference checks, not a linguistic certification or audio review.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const harness=fs.readFileSync('scripts/smoke-curriculum.js','utf8').split('const result = vm.runInContext')[0];
const shell={require,__dirname,process,console,URL,URLSearchParams};
vm.runInNewContext(harness+'\nglobalThis.auditContext=context',shell);
const data=JSON.parse(vm.runInContext(`JSON.stringify((()=>{
 const vowels=alphabetGroups.vowels.map(x=>x.letter),consonants=alphabetGroups.consonants.map(x=>x.letter);
 const combos=consonants.flatMap(c=>vowels.map((v,i)=>uyirmeiCombo(c,i)));
 const quests=foundationQuests();
 const vowelQuests=quests.filter(q=>q.kind==='vowels').flatMap(q=>q.items.map(x=>x.ta));
 const consonantQuests=quests.filter(q=>q.kind==='consonants').flatMap(q=>q.items.map(x=>x.ta));
 const questions=curriculum[0].stages.flatMap((s,i)=>[...learning.lessonQuestions(s,0,i),...[0,1,2].flatMap(slot=>learning.exerciseQuestions(s,0,i,slot))]);
 return {vowels,consonants,combos,vowelQuests,consonantQuests,special:alphabetGroups.special.map(x=>x.letter),sort:learning.pack(0).groups,gaps:questions.filter(q=>q.type==='gap'&&!q.words).map(q=>q.explanation),normalization:[learning.normalize('அ')!==learning.normalize('ஆ'),learning.normalize('க')!==learning.normalize('க்')],questCount:quests.length};
})())`,shell.auditContext));
assert.deepEqual(data.vowels,'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ'.split(' '));
assert.deepEqual(data.consonants,'க் ங் ச் ஞ் ட் ண் த் ந் ப் ம் ய் ர் ல் வ் ழ் ள் ற் ன்'.split(' '));
assert.deepEqual(data.special,['ஃ']);assert.equal(new Set(data.combos).size,216);
assert.deepEqual(data.vowelQuests,data.vowels);assert.deepEqual(data.consonantQuests,data.consonants);
assert(data.combos.includes('கா')&&data.combos.includes('மி')&&data.combos.includes('பூ'));
assert(data.normalization.every(Boolean));assert.equal(data.questCount,18);
assert(data.gaps.length>0);assert(data.gaps.every(text=>text.includes('pulli')));
for(const [letter,category] of data.sort)assert.equal(category,'அஇஉஎஒ'.includes(letter)?0:1);
console.log('PASS: base inventory, 216 unique combinations, complete level-zero letter coverage, vowel/pulli distinctions and relevant gap feedback.');
