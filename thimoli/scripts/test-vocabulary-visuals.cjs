const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const harness = fs.readFileSync('scripts/smoke-curriculum.js','utf8').split('const result = vm.runInContext')[0];
const shell = {require,__dirname,process,console,URL,URLSearchParams};
vm.runInNewContext(harness + '\nglobalThis.visualContext=context',shell);
const run = code => vm.runInContext(code,shell.visualContext);
const tiles = markup => [...markup.matchAll(/<button\b[^>]*>.*?<\/button>/gs)].map(match => match[0]);
const rightTile = (markup,id) => tiles(markup).find(tile => tile.includes('data-activity="right"') && tile.includes(`data-value="${id}"`));

// Use the actual village question, whose visual flag is deliberately unspecified.
run(`
var visualFamilyStage=curriculum[0].stages[7];
var visualVillageQuestion=learning.lessonQuestions(visualFamilyStage,0,7).find(question=>question.type==='match');
var visualResponse={links:{},left:null};
var visualVillageContext={stage:visualFamilyStage,villageIndex:0,node:{stage:7}};
`);
assert.equal(run('visualVillageQuestion.visual'),undefined);
for (const language of ['fr','en','de']) {
  run(`state.settings.language=${JSON.stringify(language)}`);
  const markup = run(`activityMatchBody(visualVillageQuestion,visualResponse,'',null)`);
  const pairs = JSON.parse(run('JSON.stringify(visualVillageQuestion.pairs)'));
  for (const pair of pairs) {
    const tile = rightTile(markup,pair.id);
    const meaning = run(`activityEscape(translateUiText(${JSON.stringify(pair.fr)}))`);
    assert(tile.includes(`aria-label="${meaning},`),`${language}: accessible translated meaning must remain`);
    if (run(`Boolean(vocabularyPicture(${JSON.stringify(pair.ta)}))`)) {
      assert(tile.includes('class="vocabulary-picture"'),`${language}: supported village word needs its picture`);
      assert(!tile.includes('class="learning-match-label"'),`${language}: picture question must not show its answer text`);
    } else {
      assert(!tile.includes('class="vocabulary-picture"'));
      assert(tile.includes(`<span class="learning-match-label">${meaning}</span>`),`${language}: unsupported word must retain translated text`);
    }
  }
  assert(tiles(markup).filter(tile => tile.includes('data-activity="left"')).every(tile => !tile.includes('class="vocabulary-picture"')));
  const textOnly = run(`activityMatchBody({...visualVillageQuestion,visual:false},visualResponse,'',null)`);
  assert(!textOnly.includes('class="vocabulary-picture"'),`${language}: explicit text-only questions must remain text-only`);
  for (const pair of pairs) assert(rightTile(textOnly,pair.id).includes('class="learning-match-label"'));
  const lesson = run('villageStudy(visualVillageContext)');
  assert.equal((lesson.match(/class="study-word-picture"/g)||[]).length,2);
  assert(lesson.includes('class="family-learning"'));
  assert(lesson.includes(({fr:'Moi',en:'Me',de:'Ich'})[language]));
  for (const pair of pairs) {
    assert(lesson.includes(`<strong lang="ta">${pair.ta}</strong>`));
    assert(lesson.includes(`data-speak="${pair.ta}"`),`${language}: the existing audio control must remain`);
    const audioName = run(`activityEscape(audioLabel(${JSON.stringify(pair.ta)}))`);
    assert(lesson.includes(`aria-label="${audioName}"`));
  }
}

// Every stage remains usable: add only supported pictures and only the relevant family panel.
const stages = JSON.parse(run(`JSON.stringify(curriculum.flatMap((village,villageIndex)=>village.stages.map((stage,stageIndex)=>({villageIndex,stageIndex,items:stage.items}))))`));
for (const {villageIndex,stageIndex,items} of stages) {
  const markup = run(`villageStudy({stage:curriculum[${villageIndex}].stages[${stageIndex}],villageIndex:${villageIndex},node:{stage:${stageIndex}}})`);
  const count = items.filter(item => run(`Boolean(vocabularyPicture(${JSON.stringify(item.ta)}))`)).length;
  assert.equal((markup.match(/class="study-word-picture"/g)||[]).length,count);
  assert.equal(markup.includes('class="family-learning"'),['அம்மா','அப்பா'].every(word => items.some(item => item.ta === word)));
  assert.equal((markup.match(/class="study-listen"/g)||[]).length,items.length);
}

// A missing optional art module must not prevent lessons or matching from rendering.
run(`var savedVocabularyPicture=vocabularyPicture; var savedFamilyDiagram=familyLearningDiagram; vocabularyPicture=undefined; familyLearningDiagram=undefined;`);
assert(!run(`activityMatchBody(visualVillageQuestion,visualResponse,'',null)`).includes('class="vocabulary-picture"'));
assert(!run('villageStudy(visualVillageContext)').includes('class="family-learning"'));
run('vocabularyPicture=savedVocabularyPicture; familyLearningDiagram=savedFamilyDiagram;');
assert.equal(run(`vocabularyPicture('unsupported')`),'');
assert.equal(run(`vocabularyPicture('__proto__')`),'');
console.log('PASS: village vocabulary pictures, explicit text fallback, localized accessible labels, all-stage lesson coverage, family panel and unchanged audio controls.');
