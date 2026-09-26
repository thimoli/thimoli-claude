const fs = require("fs")
const vm = require("vm")
const path = require("path")
process.chdir(fs.existsSync(path.resolve(__dirname,"../curriculum.js")) ? path.resolve(__dirname,"..") : path.resolve(__dirname,"../dist"))

const appElement = {
  innerHTML: "",
  classList: { toggle() {} },
  querySelector() { return null },
  addEventListener() {}
}
const documentElement = { dataset: {}, classList: { toggle() {} }, lang: "fr" }
const document = {
  title: "",
  documentElement,
  querySelector(selector) { return selector === "#app" ? appElement : null },
  createElement() { return { width: 0, height: 0, getContext() { return null } } }
}
const windowObject = {
  THIMOLI_RELEASE: { mode: 'prototype', unlockAll: true },
  matchMedia() { return { matches: false } },
  addEventListener() {},
  scrollTo() {},
  setTimeout(callback) { callback() },
  speechSynthesis: { getVoices() { return [] }, cancel() {}, speak() {} }
}
windowObject.window = windowObject
let persistedState = null

const context = vm.createContext({
  console,
  document,
  window: windowObject,
  location: { href: "https://thimoli.test/?page=home", search: "?page=home", pathname: "/", hash: "" },
  history: { replaceState() {}, pushState() {} },
  localStorage: { getItem() { return null }, setItem(key, value) { persistedState = JSON.parse(value) } },
  URLSearchParams,
  URL,
  Intl,
  Date,
  Math,
  Array,
  Object,
  Number,
  String,
  Boolean,
  Set,
  Promise,
  fetch() { return Promise.reject(new Error("offline smoke test")) }
})

vm.runInContext(fs.readFileSync("curriculum.js", "utf8"), context, { filename: "curriculum.js" })
vm.runInContext(fs.readFileSync("learning-engine.js", "utf8"), context, { filename: "learning-engine.js" })
vm.runInContext(fs.readFileSync("learning-ui.js", "utf8"), context, { filename: "learning-ui.js" })
vm.runInContext(fs.readFileSync("assets/audio/alphabet-index.js", "utf8"), context, { filename: "alphabet-index.js" })
vm.runInContext(fs.readFileSync("assets/audio/speech-index.js", "utf8"), context, { filename: "speech-index.js" })
vm.runInContext(fs.readFileSync("foundations.js", "utf8"), context, { filename: "foundations.js" })
vm.runInContext(fs.readFileSync("alphabet-review.js", "utf8"), context, { filename: "alphabet-review.js" })
vm.runInContext(fs.readFileSync("vocabulary-visuals.js", "utf8"), context, { filename: "vocabulary-visuals.js" })
vm.runInContext(fs.readFileSync("kural-practice.js", "utf8"), context, { filename: "kural-practice.js" })
vm.runInContext(fs.readFileSync("village-adventure.js", "utf8"), context, { filename: "village-adventure.js" })
vm.runInContext(fs.readFileSync("i18n-updates.js", "utf8"), context, { filename: "i18n-updates.js" })
vm.runInContext(fs.readFileSync("i18n-exercises.js", "utf8"), context, { filename: "i18n-exercises.js" })
vm.runInContext(fs.readFileSync("app.js", "utf8"), context, { filename: "app.js" })

const result = vm.runInContext(`(() => {
  const pages = ["home", "levels", "path", "review", "stats", "profile", "settings"]
  const pageLengths = {}
  let honestEmptyStats = false
  let quickResume = false
  let visualVillageTrail = false
  let optimizedVillageImages = false
  let lightOnlySettings = false
  for (const page of pages) {
    state.page = page
    render()
    pageLengths[page] = app.innerHTML.length
    if (page === "stats") honestEmptyStats = app.innerHTML.includes("Aucune statistique") && !app.innerHTML.includes("Aperçu démo")
    if (page === "path") quickResume = app.innerHTML.includes("path-resume")
    if (page === "levels") {
      visualVillageTrail = app.innerHTML.includes("vmap-trail")
      optimizedVillageImages = app.innerHTML.includes("assets/villages/thumbs/village-01.webp")
    }
    if (page === "settings") lightOnlySettings = ['light','dark','system'].every(theme => app.innerHTML.includes('data-theme="' + theme + '"'))
  }
  kuralVerses[0] = "அகர முதல எழுத்தெல்லாம் ஆதி$பகவன் முதற்றே உலகு."
  state.page = "kural"
  state.kuralView = "chapter"
  state.kuralChapter = 0
  render()
  pageLengths.kuralChapter = app.innerHTML.length
  const readableKuralList = app.innerHTML.includes("kural-reading-list") && app.innerHTML.includes("அகர முதல")
  state.kuralView = "detail"
  state.kuralIndex = 0
  render()
  pageLengths.kuralDetail = app.innerHTML.length
  for (const mode of ["Alphabet", "Prononciation", "Écriture", "Vocabulaire"]) {
    state.page = "lesson"
    state.lessonMode = mode
    state.activePathNode = null
    render()
    pageLengths[mode] = app.innerHTML.length
  }
  state.page = "lesson"
  state.lessonMode = "Alphabet"
  state.alphabetGroup = "syllables"
  render()
  pageLengths.Syllabes = app.innerHTML.length
  const syllableMatrix = app.innerHTML.includes("syllable-grid") && app.innerHTML.includes("18 × 12 combinaisons")
  const questionCounts = []
  for (let villageIndex = 0; villageIndex < 12; villageIndex += 1) {
    state.currentVillage = villageIndex
    state.examKind = null
    state.examVillage = null
    state.activePathNode = 0
    questionCounts.push(currentLessonQuestions().length)
    if (activePathNodes().length !== 41) throw new Error("Invalid path node count")
  }
  state.currentVillage = 2
  state.activePathNode = null
  state.examVillage = 2
  state.examKind = "mock"
  const mockCount = currentLessonQuestions().length
  state.examKind = "final"
  const finalCount = currentLessonQuestions().length
  state.currentVillage = 11
  state.pathProgress[11] = 0
  const previewAccess = {
    villages: villages.every((_, index) => isVillageUnlocked(index)),
    path: Array.from({ length: PATH_NODE_COUNT }, (_, index) => pathNodeState(index)).every((status) => status !== "locked"),
    exams: villages.every((_, index) => examAccess(index).mock && examAccess(index).final),
    writing: PREVIEW_UNLOCK_ALL && writingCurriculum.length === 12
  }
  state.lessonMode = "Prononciation"
  state.activePathNode = null
  render()
  const directPronunciationAudio = app.innerHTML.includes('data-natural-audio="assets/audio/snippets/0003.mp3"')
  state.page = "lesson"
  state.currentVillage = 0
  state.activePathNode = 0
  state.lesson = 0
  state.examKind = null
  state.examVillage = null
  state.studyStarted = true
  state.feedback = "correct"
  state.questionAttempts = 1
  render()
  const distinctLessonFeedback = app.innerHTML.includes("Réussi du premier coup") && app.innerHTML.includes("learning-solution") && !app.innerHTML.includes("POURQUOI C’EST JUSTE")
  return { pageLengths, questionCounts, mockCount, finalCount, previewAccess, directPronunciationAudio, honestEmptyStats, quickResume, readableKuralList, distinctLessonFeedback, visualVillageTrail, optimizedVillageImages, lightOnlySettings, syllableMatrix }
})()`, context)

if (Object.values(result.pageLengths).some((length) => length < 1000)) throw new Error("A page did not render")
if (result.questionCounts.some((count) => count !== 3)) throw new Error("A lesson does not contain three practice activities")
if (result.mockCount !== 10 || result.finalCount !== 12) throw new Error("Invalid exam sizes")
if (Object.values(result.previewAccess).some((value) => value !== true)) throw new Error("Preview content is not fully unlocked")
if (!result.directPronunciationAudio) throw new Error("Pronunciation audio is not wired directly")
if (!result.honestEmptyStats) throw new Error("Stats must show an honest empty state")
if (!result.quickResume) throw new Error("Learning path has no quick resume card")
if (!result.readableKuralList) throw new Error("Kural chapter list lacks readable previews")
if (!result.distinctLessonFeedback) throw new Error("Lesson feedback still repeats itself")
if (!result.visualVillageTrail) throw new Error("Village map trail is missing")
if (!result.optimizedVillageImages) throw new Error("Village thumbnails are not used")
if (!result.lightOnlySettings) throw new Error("All three appearance choices must be available")
if (!result.syllableMatrix) throw new Error("Tamil syllable matrix is missing")
console.log(JSON.stringify(result, null, 2))

const flows = vm.runInContext(`(() => {
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const act = (action, value, category) => activityHandle({dataset:{activity:action,value,category}})
  state.settings.soundEffects=false
  state.currentVillage=0
  state.pathProgress[0]=0
  state.lessonProgress[0]=0
  startLesson('parcours',0)
  assert(app.innerHTML.includes('LES MODÈLES À CONNAÎTRE'),'real lesson before questions')
  act('start')
  let q=currentLessonQuestions()[0]
  let r=activityResponse(q)
  for (let i=0;i<q.pairs.length;i++) { act('left',String(i)); act('right',String((i+1)%q.pairs.length)) }
  act('check')
  assert(state.feedback==='wrong','wrong matching must fail')
  assert(state.lessonRun.firstTryCorrect===0,'wrong matching earns no point')
  act('retry')
  q.pairs.forEach(p=>{act('left',p.id);act('right',p.id)})
  act('check')
  assert(state.feedback==='correct' && state.lessonRun.firstTryCorrect===0,'retry not a first-try point')
  act('next')
  for(let i=1;i<3;i++) {q=currentLessonQuestions()[state.lesson];act('pick',q.target);act('check');act('next')}
  assert(state.pathProgress[0]===1,'completed lesson advances one step')
  const sessions=state.sessions.length
  render();render()
  assert(state.sessions.length===sessions,'results do not duplicate rewards')
  state.pathProgress[0]=40
  startLesson('parcours',40)
  state.lessonRun.firstTryCorrect=7;state.lessonRun.correctAnswers=7;state.lessonRun.totalChecks=12
  state.lesson=currentLessonQuestions().length
  let failed=finalizeLesson()
  assert(!failed.passed && state.pathProgress[0]===40,'failed final cannot unlock village')
  restartLesson()
  state.lessonRun.firstTryCorrect=8;state.lessonRun.correctAnswers=8;state.lessonRun.totalChecks=12
  state.lesson=currentLessonQuestions().length
  let passed=finalizeLesson()
  assert(passed.passed && state.pathProgress[0]===41,'8/12 passes final')
  state.currentVillage=11
  startLesson('Alphabet',39)
  state.lesson=2
  q=currentLessonQuestions()[state.lesson]
  assert(q.type==='write','advanced level has productive writing')
  r=activityResponse(q);r.text='நான் தமிழ் படிக்கிறேன்.';r.checks=[0,1,2]
  act('check')
  assert(state.feedback==='reviewed','free writing never called correct')
  assert(state.lessonRun.correctAnswers===0 && state.lessonRun.firstTryCorrect===0,'free writing excluded from score')
  startExam('final',3)
  q=currentLessonQuestions()[0];r=activityResponse(q)
  q.pairs.forEach((p,i)=>r.links[p.id]=q.pairs[(i+1)%q.pairs.length].id)
  act('check');act('next')
  assert(state.lesson===1 && state.lessonRun.wrongAnswers===1,'exam proceeds after correction without retry inflation')
  goTo('review'); goTo('lesson',{fromPop:true})
  assert(state.examKind==='final' && currentLessonQuestions().length===12 && state.lesson===1,'Back preserves exam context and denominator')
  let renders=0
  for(let level=0;level<12;level++) {
    state.currentVillage=level;state.examKind=null;state.examVillage=null
    for(let node=0;node<41;node++) {
      state.activePathNode=node;state.lessonRun=null;state.studyStarted=true
      const questions=currentLessonQuestions()
      for(let i=0;i<questions.length;i++) {
        state.lesson=i;state.feedback=null;state.questionAttempts=0
        const markup=lesson()
        assert(markup.includes('learning-workspace'),'activity renders '+questions[i].id)
        assert(!markup.includes('undefined'),'no undefined content '+questions[i].id)
        renders++
      }
    }
  }
  return {flowAssertions:'passed',renderedActivities:renders}
})()`,context)
console.log(JSON.stringify(flows,null,2))

const villageGames = vm.runInContext(`(() => {
  const assert=(ok,message)=>{if(!ok)throw new Error(message)}
  const act=(action,value)=>activityHandle({dataset:{activity:action,value}})
  state.currentVillage=0;state.pathProgress[0]=0;state.lessonProgress[0]=0
  startLesson('Alphabet',1)
  let q=currentLessonQuestions()[0], r=activityResponse(q)
  assert(q.type==='memory','first mission is a memory game')
  const a=q.cards[0], b=q.cards.find(c=>c.pair!==a.pair)
  act('flip',a.id);act('flip',b.id)
  assert(r.flipped.length===0&&!r.memoryPending&&r.helpUsed,'wrong pair resets automatically and does not count as unaided')
  assert(!learning.ready(q,r),'wrong pair cannot complete game')
  q.pairs.forEach(p=>q.cards.filter(c=>c.pair===p.id).forEach(c=>act('flip',c.id)))
  assert(learning.ready(q,r),'all pairs enable validation')
  act('check');assert(state.feedback==='correct'&&state.lessonRun.firstTryCorrect===0,'memory scoring excludes errors')
  act('next')
  q=currentLessonQuestions()[state.lesson];r=activityResponse(q)
  q.pairs.forEach((p,i)=>r.links[p.id]=q.pairs[(i+1)%q.pairs.length].id)
  act('check');act('retry')
  assert(Object.keys(r.links).length===0&&!state.feedback,'matching retry clears connections')
  goTo('home')
  assert(villageNextNode()===1&&home().includes('data-village-resume'),'home resumes running mission')
  const seed=state.lessonRun.shuffleSeed
  goTo('lesson')
  assert(state.lesson===1&&state.lessonRun.shuffleSeed===seed,'resume preserves position and card arrangement')
  const restored=restoreVillageResponse({key:'x',memoryPending:true,flipped:['a','b'],matched:['1']})
  assert(!restored.memoryPending&&restored.flipped.length===0&&restored.matched.length===1,'reload clears only mismatched cards')
  startLesson('Alphabet',2)
  assert(currentLessonQuestions()[0].type==='listen','second mission contains an audio challenge')
  return {villageGames:'passed',resume:true,memoryRetry:true,matchingRetry:true}
})()`,context)
console.log(JSON.stringify(villageGames,null,2))

const homeFlow = vm.runInContext(`(() => {
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg)}
  const act=(action,value,category)=>foundationHandle({dataset:{quest:action,value,category}})
  state.settings.language='fr';state.foundationProgress={};state.foundationRun=null
  const markup=review()
  assert(markup.includes('quest-hero')&&!markup.includes('review-module-grid'),'quest-first home, not four cards')
  assert(markup.includes('0/18 quêtes terminées'),'honest initial progress')
  assert(navItems.map(item=>item.page).join(',')==='stats,home,review,kural,profile','navigation unchanged')
  const inventory=[...writingCurriculum[0].items,...writingCurriculum[1].items]
  assert(new Set(inventory.map(item=>item.text)).size===247,'full native alphabet in writing')
  assert(inventory.every(item=>naturalAudioItems[item.text]),'every native sign has an indexed recording')
  const memoryOrders=new Set([11,22,33,44,55].map(seed=>{state.foundationRun={id:'q1',seed,phase:'play',index:0,response:{}};return foundationQuestions(foundationQuests()[0])[0].cards.map(card=>card.id).join(',')}))
  assert(memoryOrders.size>1,'memory cards change position between new runs')
  state.foundationRun=null
  startFoundationQuest('q2');assert(state.foundationRun===null,'later quests locked')
  const sessionsBefore=state.sessions.length
  for(const quest of foundationQuests()){
    startFoundationQuest(quest.id)
    assert(state.foundationRun.phase==='intro','models before games')
    act('begin')
    for(let step=0;step<3;step++){
      const q=foundationQuestions(quest)[step],r=foundationResponse()
      const html=foundationQuestView()
      assert(!html.includes('undefined'),'quest renders without missing content')
      if(q.type==='memory'){
        const a=q.cards[0],b=q.cards.find(c=>c.text!==a.text)
        act('flip',a.id);act('flip',b.id)
        assert(state.foundationRun.mistakes===1,'incorrect memory pair counted')
        assert(!state.foundationRun.memoryWrong&&foundationResponse().flipped.length===0,'incorrect memory pair turns back automatically')
        for(const text of new Set(q.cards.map(c=>c.text)))q.cards.filter(c=>c.text===text).forEach(c=>act('flip',c.id))
      } else if(q.type==='match'){
        q.pairs.forEach((p,i)=>{act('left',p.id);act('right',q.pairs[(i+1)%q.pairs.length].id)})
        act('check');assert(state.foundationRun.feedback==='wrong','incorrect links show an error')
        act('retry');assert(Object.keys(foundationResponse().links).length===0&&foundationResponse().left===null,'incorrect links reset before retry')
        q.pairs.forEach(p=>{act('left',p.id);act('right',p.id)})
      }
      else if(q.type==='build')learning.units(q.target).forEach((_,i)=>act('add',String(i)))
      else if(q.type==='sort')q.cards.forEach(c=>act('sort',c.id,String(c.category)))
      else {act('pick',q.options.find(x=>x!==q.target));act('check');assert(state.foundationRun.feedback==='wrong','wrong answer rejected');act('retry');act('pick',q.target)}
      act('check');assert(state.foundationRun.feedback==='correct','correct activity accepted')
      act('next')
    }
    assert(state.foundationRun.phase==='complete'&&state.foundationProgress[quest.id],'quest persisted')
    const count=state.sessions.length;finishFoundationQuest();assert(count===state.sessions.length,'no duplicate rewards')
  }
  assert(state.sessions.length===Math.min(100,sessionsBefore+18),'one session per first completion')
  const beforeReplay=state.sessions.length
  startFoundationQuest('q1');state.foundationRun.index=3;finishFoundationQuest()
  assert(state.sessions.length===beforeReplay&&state.foundationRun.reward===0,'replay cannot farm XP')
  const savedRun=restoreFoundationRun(state.foundationRun)
  assert(savedRun?.phase==='complete'&&restoreFoundationRun({id:'q999'})===null,'saved quest restoration validated')
  state.currentVillage=5
  assert((home().match(/data-exam-village="5"/g)||[]).length===2,'exams stay with villages')
  state.pronunciationIndex=5;const sounds=pronunciationPractice()
  assert(sounds.includes('diphtongue')&&!sounds.includes('<small>son court</small>'),'diphthongs not called short/long')
  state.settings.language='en';assert(review().includes('YOUR ADVENTURE'),'English home')
  assert(foundationQuestions(foundationQuests()[1])[1].pairs.find(p=>p.ta==='உ').fr==='u','English vowel pronunciation after cached French catalogue')
  assert(foundationQuestions(foundationQuests()[4])[1].pairs[0].fr==='k as in kilo','English consonant explanation')
  state.settings.language='de';assert(review().includes('DEIN ABENTEUER'),'German home')
  assert(foundationQuestions(foundationQuests()[4])[1].pairs[0].fr==='k wie in Kilo','German consonant explanation')
  state.settings.language='fr';saveState()
  return {questAssertions:'passed',quests:18,activities:54,writingSigns:247,audioSigns:247}
})()`,context)
console.log(JSON.stringify(homeFlow,null,2))
const statsFlow=vm.runInContext(`(()=>{
  const assert=(ok,label)=>{if(!ok)throw new Error(label)}
  state.settings.language='fr'
  state.sessions=[{timestamp:Date.now(),duration:1.234567,xp:15,mode:'Quêtes',village:null}]
  state.answerHistory=[{timestamp:Date.now(),attempt:1,correct:false},{timestamp:Date.now(),attempt:2,correct:true},{timestamp:Date.now(),attempt:1,correct:true}]
  state.pathProgress=Array(12).fill(0);state.pathProgress[0]=40
  state.foundationProgress={q1:{stars:2,timestamp:Date.now()}}
  state.kuralMastered=[0,1];state.kuralRecall={0:'recited',1:'review'}
  let html=stats()
  assert(html.includes('50%'),'first-attempt accuracy excludes retries')
  assert(html.includes('0/12 terminés'),'40 steps does not count final evaluation as passed')
  assert(html.includes('1/18 quêtes terminées'),'foundation progression')
  assert(html.includes('2 lus · 1 récités'),'reading separated from self-reported recitation')
  assert(!html.includes('1.234567'),'readable duration rounding')
  assert(html.includes('Un Kural à retrouver'),'review recommendation links to Kural')
  state.pathProgress[0]=41;assert(stats().includes('1/12 terminés'),'completed village')
  state.settings.language='en';assert(stats().includes('Every step counts'),'English stats')
  state.settings.language='de';assert(stats().includes('Jeder Schritt zählt'),'German stats')
  state.settings.language='fr'
  return {statsAssertions:'passed',firstAttempt:true,completion:true,languages:3}
})()`,context)
console.log(JSON.stringify(statsFlow,null,2))
const profileFlow=vm.runInContext(`(()=>{
  const assert=(ok,label)=>{if(!ok)throw new Error(label)}
  state.foundationProgress={};state.pathProgress=Array(12).fill(0);state.kuralMastered=[];state.kuralRecall={};state.settings.language='fr'
  let html=profile()
  assert(html.includes('0 / 6 trophées gagnés'),'no fake trophies on empty account')
  assert((html.match(/class="pf-badge waiting"/g)||[]).length===6,'six discoverable milestones')
  state.foundationProgress=Object.fromEntries(foundationQuests().map(q=>[q.id,{stars:1}]))
  state.pathProgress[0]=41;state.kuralMastered=[0,1,2,3,4];state.kuralRecall={0:'recited'}
  html=profile();assert(html.includes('6 / 6 trophées gagnés'),'earned milestones computed from progress')
  assert(html.includes('TA COLLECTION EST COMPLÈTE'),'completed collection has next action')
  state.settings.language='en';assert(profile().includes('My adventure'),'English profile')
  state.settings.language='de';assert(profile().includes('Mein Abenteuer'),'German profile')
  state.settings.language='fr'
  return {profileAssertions:'passed',milestones:6,languages:3}
})()`,context)
console.log(JSON.stringify(profileFlow,null,2))
