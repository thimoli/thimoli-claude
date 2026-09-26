// Interaction tests: learner associations, grading boundaries, retries, and meaning feedback.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const harness = fs.readFileSync(path.join(__dirname,'smoke-curriculum.js'),'utf8').split('const result = vm.runInContext')[0];
const shell = {require,__dirname,process,console,URL,URLSearchParams};
vm.runInNewContext(harness+'\nglobalThis.feedbackContext=context',shell);
const context = shell.feedbackContext;
const run = code => vm.runInContext(code,context);

run(`
var feedbackQuestion = {type:'match',id:'feedback-test',pairs:[{id:'0',ta:'அம்மா',fr:'maman'},{id:'1',ta:'அப்பா',fr:'papa'},{id:'2',ta:'தண்ணீர்',fr:'eau'}],order:['2','0','1']};
var feedbackResponse = {links:{'0':'1','1':'0','2':'2'},left:null};
`);
for (const lang of ['fr','en','de']) {
  run(`state.settings.language=${JSON.stringify(lang)}; state.feedback='correct';`);
  const ungraded = run(`activityBody(feedbackQuestion,feedbackResponse,'')`);
  assert(!ungraded.includes('learning-match-verdict'),`${lang}: leaked grading before verification`);
  assert(!ungraded.includes('is-pair-correct') && !ungraded.includes('is-pair-wrong'));
  const tiles = [...ungraded.matchAll(/<button\b[^>]*>.*?<\/button>/gs)].map(match=>match[0]);
  const left = id => tiles.find(tile=>tile.includes('data-activity="left"') && tile.includes(`data-value="${id}"`));
  const right = id => tiles.find(tile=>tile.includes('data-activity="right"') && tile.includes(`data-value="${id}"`));
  for (const [source,target] of [['0','1'],['1','0'],['2','2']]) {
    assert.equal(left(source).match(/data-association="(\d+)"/)[1],right(target).match(/data-association="(\d+)"/)[1]);
    assert.equal(left(source).match(/learning-match-number[^>]*>(\d+)</)[1],right(target).match(/learning-match-number[^>]*>(\d+)</)[1]);
  }
  const graded = run(`activityBody(feedbackQuestion,feedbackResponse,'disabled','wrong')`);
  assert.equal((graded.match(/is-pair-correct/g)||[]).length,2);
  assert.equal((graded.match(/is-pair-wrong/g)||[]).length,4);
  assert(graded.includes('✓') && graded.includes('×'));
  assert(graded.includes(({fr:'À corriger',en:'Try again',de:'Korrigieren'})[lang]));
  assert(graded.includes(({fr:'1/3 paires correctes',en:'1/3 pairs correct',de:'1/3 Paare richtig'})[lang]));
  const review = run(`activitySolutionMarkup(feedbackQuestion,feedbackResponse,'wrong')`);
  assert.equal((review.match(/is-pair-correct/g)||[]).length,1);
  assert.equal((review.match(/is-pair-wrong/g)||[]).length,2);
  assert(review.includes('✓') && review.includes('×'));
  assert(review.includes(({fr:'Bonne association',en:'Correct match',de:'Richtige Zuordnung'})[lang]));
  assert(!run(`activitySolutionMarkup(feedbackQuestion,feedbackResponse,null)`).includes('learning-match-verdict'));
  const selected = run(`activityBody(feedbackQuestion,{...feedbackResponse,left:'0'},'')`);
  assert.equal((selected.match(/aria-pressed="true"/g)||[]).length,2);
  assert(selected.includes(({fr:'Sélectionné',en:'Selected',de:'Ausgewählt'})[lang]));
  for (const type of ['build','gap','select','listen']) {
    const q = `{type:'${type}',meaning:'maman',target:'அம்மா'}`;
    assert.equal(run(`activityMeaningMarkup(${q},null)`),'');
    assert.equal(run(`activityMeaningMarkup(${q},'wrong')`),'');
    const markup = run(`activityMeaningMarkup(${q},'correct')`);
    assert(markup.includes(`lang="${lang}"`));
    assert(markup.includes(run(`translateUiText('maman')`)));
    assert(markup.includes(({fr:'Sens',en:'Meaning',de:'Bedeutung'})[lang]));
    assert(!markup.includes('lang="ta"'));
  }
}
assert.equal(run(`activityMeaningMarkup({type:'build'},'correct')`),'');
assert.equal(run(`activityMeaningMarkup({type:'match',meaning:'maman'},'correct')`),'');

// A visual pair keeps a translated accessible name and falls back if artwork is unavailable.
run(`var vocabularyPicture = ta => ta === 'அம்மா' ? '<svg data-picture="mother"></svg>' : ''; state.settings.language='en';`);
const visual = run(`activityBody({...feedbackQuestion,visual:true},feedbackResponse,'')`);
assert(visual.includes('data-picture="mother"'));
assert(visual.includes('aria-label="'+run(`translateUiText('maman')`)+', Pair 2"'));
assert(visual.includes('<span class="learning-match-label">'+run(`translateUiText('papa')`)+'</span>'));

// Exercise the actual village event handler, including replacement and retry reset.
run(`
state.settings.language='fr'; state.page='lesson'; state.lessonMode='Leçon'; state.currentVillage=0; state.activePathNode=0; state.examKind=null; state.examVillage=null;
state.lesson=0; state.feedback=null; state.activityResponse=null; state.questionAttempts=0;
var currentFeedbackQuestion=currentLessonQuestions()[0];
var currentFeedbackResponse=activityResponse(currentFeedbackQuestion);
currentFeedbackQuestion.pairs.forEach((pair,i)=>{currentFeedbackResponse.links[pair.id]=currentFeedbackQuestion.pairs[(i+1)%currentFeedbackQuestion.pairs.length].id});
activityHandle({dataset:{activity:'check'}});
`);
assert.equal(run('state.feedback'),'wrong');
run(`activityHandle({dataset:{activity:'retry'}});`);
assert.equal(run('state.feedback'),null);
assert.equal(run('Object.keys(state.activityResponse.links).length'),0);
assert(!run(`activityBody(currentFeedbackQuestion,state.activityResponse,'',state.feedback)`).includes('learning-match-verdict'));
run(`
var firstFeedbackId=currentFeedbackQuestion.pairs[0].id;
var secondFeedbackId=currentFeedbackQuestion.pairs[1].id;
activityHandle({dataset:{activity:'left',value:firstFeedbackId}});
activityHandle({dataset:{activity:'right',value:secondFeedbackId}});
activityHandle({dataset:{activity:'left',value:secondFeedbackId}});
activityHandle({dataset:{activity:'right',value:secondFeedbackId}});
`);
assert.equal(run('state.activityResponse.links[firstFeedbackId]'),undefined);
assert.equal(run('state.activityResponse.links[secondFeedbackId]'),run('secondFeedbackId'));
run(`
currentFeedbackQuestion.pairs.forEach(pair=>{
 activityHandle({dataset:{activity:'left',value:pair.id}});
 activityHandle({dataset:{activity:'right',value:pair.id}});
});
activityHandle({dataset:{activity:'check'}});
`);
assert.equal(run('state.feedback'),'correct');
assert.equal(run('state.questionAttempts'),2);
// Foundation verification must use its own feedback even if a village has saved feedback.
run(`
state.lessonMode='Quêtes'; state.foundationRun={id:'q1',phase:'play',index:1,seed:37,mistakes:0,response:{}};
state.feedback='correct';
var foundationFeedbackQuestion=foundationQuestions(foundationQuests()[0])[1];
var foundationFeedbackResponse=foundationResponse();
foundationFeedbackQuestion.pairs.forEach((pair,i)=>{foundationFeedbackResponse.links[pair.id]=foundationFeedbackQuestion.pairs[(i+1)%foundationFeedbackQuestion.pairs.length].id});
`);
assert(!run(`foundationQuestView()`).includes('learning-match-verdict'));
run(`foundationHandle({dataset:{quest:'check'}});`);
assert.equal(run('state.foundationRun.feedback'),'wrong');
assert(run(`foundationQuestView()`).includes('is-pair-wrong'));
run(`foundationHandle({dataset:{quest:'retry'}});`);
assert.equal(run('state.foundationRun.feedback'),null);
assert.equal(run('Object.keys(state.foundationRun.response.links).length'),0);
assert(!run(`foundationQuestView()`).includes('learning-match-verdict'));
console.log('PASS: independent matching feedback, numbered colour associations, FR/EN/DE verdicts, meaning translations, image fallback, and retry/relink interactions.');
