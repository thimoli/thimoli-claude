/* Level zero: short, original quests built from the app's shared Tamil inventory. */
function fq(fr, en, de) { return ({ fr, en, de })[state.settings.language] || fr }
function audioLabel(text) {
  return text === 'ஃ' ? fq('Écouter le nom : āytam','Listen to the name: āytam','Namen anhören: āytam') : `${fq('Écouter','Listen','Anhören')} ${text}`
}
function pronunciationLibrary() {
  const button = text => `<button type="button" data-speak="${text}" aria-label="${audioLabel(text)}"><strong lang="ta">${text}</strong><small>${text==='ஃ'?fq('āytam · nom du signe','āytam · sign name','āytam · Zeichenname'):tamilToPhonetic(text)}</small></button>`
  return `<section class="pronunciation-library"><h2>${fq('Tous les sons, à portée de doigt','Every sound at your fingertips','Alle Laute zum Anhören')}</h2><p class="writing-practice-note">${fq('Enregistrements de synthèse vocale. Écoute, puis répète tranquillement.','Synthesised recordings. Listen, then repeat at your own pace.','Synthetische Sprachaufnahmen. Höre zu und sprich in Ruhe nach.')}</p><details open><summary>${fq('Voyelles','Vowels','Vokale')} · 12</summary><div class="pronunciation-letter-grid">${alphabetGroups.vowels.map(x=>button(x.letter)).join('')}</div></details><details><summary>${fq('Consonnes et signe spécial','Consonants and special sign','Konsonanten und Sonderzeichen')} · 19</summary><div class="pronunciation-letter-grid">${[...alphabetGroups.consonants,...alphabetGroups.special].map(x=>button(x.letter)).join('')}</div></details><details><summary>${fq('Les combinaisons','Combinations','Kombinationen')} · 216</summary><label class="writing-family-select">${fq('Choisis une famille','Choose a family','Wähle eine Familie')}<select data-sound-family>${alphabetGroups.consonants.map(x=>`<option value="${x.letter}" ${state.syllableConsonant===x.letter?'selected':''}>${x.letter}</option>`).join('')}</select></label><div class="pronunciation-letter-grid">${alphabetGroups.vowels.map((_,i)=>button(uyirmeiCombo(state.syllableConsonant,i))).join('')}</div></details></section>`
}
function restoreFoundationRun(raw) {
  if (!raw || !/^q([1-9]|1[0-8])$/.test(raw.id) || !['intro','play','complete'].includes(raw.phase)) return null
  if (!Number.isInteger(raw.index) || raw.index < 0 || raw.index > (raw.phase==='complete'?3:2)) return null
  return {...raw, seed:Number.isInteger(raw.seed)?raw.seed:(Date.now()>>>0), mistakes:Math.max(0,Number(raw.mistakes)||0), startedAt:Number(raw.startedAt)||Date.now(), response:raw.response||{}, memoryWrong:false}
}
function fitTamilTiles() {
  if(!app.querySelectorAll || !document.fonts)return
  const fit=()=>app.querySelectorAll('.alphabet-grid-clean strong, .syllable-cell strong, .writing-picker strong, .pronunciation-letter-grid strong, .quest-hero-signs span, .quest-memory [lang="ta"], .alphabet-focus-letter > span').forEach(el=>{
    const parent=el.parentElement
    const available=parent.clientWidth-16
    if(available<=0)return
    el.style.fontSize=''
    let size=parseFloat(getComputedStyle(el).fontSize)
    // Measure after the Tamil font is ready; keep the whole grapheme together.
    const range=document.createRange();range.selectNodeContents(el)
    const width=range.getBoundingClientRect().width
    if(width>available)el.style.fontSize=`${Math.max(16,size*available/width)}px`
  })
  document.fonts.ready.then(fit)
}
let foundationCatalogue = null
function foundationConsonantHint(item) {
  const hints = {
    en: ['k as in kilo', 'ng as in sing', 'ch as in match', 'ny with the tongue near the palate', 't with the tongue curled back', 'n with the tongue curled back', 't with the tongue at the teeth', 'n with the tongue at the teeth', 'p as in papa', 'm as in mum', 'y as in yoga', 'a brief tapped r', 'a light l', 'between v and w', 'a deep Tamil sound with the tongue curled back', 'l with the tongue curled back', 'a strong, rapid r', 'n with the tongue behind the upper teeth'],
    de: ['k wie in Kilo', 'ng wie in singen', 'tsch wie in Matsch', 'nj mit der Zunge nahe am Gaumen', 't mit zurückgebogener Zungenspitze', 'n mit zurückgebogener Zungenspitze', 't mit der Zunge an den Zähnen', 'n mit der Zunge an den Zähnen', 'p wie in Papa', 'm wie in Mama', 'j wie in Yoga', 'ein kurz angeschlagenes r', 'ein leichtes l', 'zwischen deutschem w und englischem w', 'ein tiefer tamilischer Laut mit zurückgebogener Zunge', 'l mit zurückgebogener Zungenspitze', 'ein kräftiges, schnelles r', 'n mit der Zunge hinter den oberen Zähnen']
  }
  return hints[state.settings.language]?.[alphabetGroups.consonants.indexOf(item)] || item.hint
}
function foundationQuests() {
  if (foundationCatalogue) return foundationCatalogue
  const list = []
  const add = (kind, title, items, chapter) => list.push({ id: `q${list.length + 1}`, kind, title, items, chapter })
  // Resolve sound labels when read, so switching language never leaves cached French hints.
  for (let i = 0; i < 12; i += 3) add('vowels', ['Les premières voix', 'De nouvelles voix', 'La chasse aux voyelles', 'Les dernières voyelles'][i / 3], alphabetGroups.vowels.slice(i, i + 3).map(x => ({ ta: x.letter, get fr() { return tamilToPhonetic(x.letter) }, word: x.word })), 0)
  for (let i = 0; i < 18; i += 3) add('consonants', `Les consonnes · ${i / 3 + 1}`, alphabetGroups.consonants.slice(i, i + 3).map(x => ({ ta: x.letter, get fr() { return foundationConsonantHint(x) } })), 1)
  add('families', 'Chaque signe a sa famille', [{ta:'அ',get fr(){return fq('Voyelle','Vowel','Vokal')}}, {ta:'க்',get fr(){return fq('Consonne','Consonant','Konsonant')}}, {ta:'ஃ',get fr(){return fq('Signe spécial','Special sign','Sonderzeichen')}}], 1)
  for (const consonant of ['க்','ம்','த்']) add('combos', `${consonant} + une voyelle`, [0,1,2].map(i => ({ta:uyirmeiCombo(consonant,i),fr:`${consonant} + ${alphabetGroups.vowels[i].letter}`})), 2)
  vocabularySets.forEach(set => add('words', set.name, set.words.slice(0,4).map(([ta,fr])=>({ta,fr})), 2))
  foundationCatalogue = list
  return list
}
function foundationTitle(quest) {
  const index = foundationQuests().indexOf(quest)
  const english = ['First sounds','New sounds','Vowel hunt','The last vowels']
  const german = ['Die ersten Laute','Neue Laute','Vokalsuche','Die letzten Vokale']
  if (index < 4) return fq(quest.title, english[index], german[index])
  if (quest.kind === 'consonants') return fq(quest.title, `Consonants · ${index - 3}`, `Konsonanten · ${index - 3}`)
  if (quest.kind === 'families') return fq(quest.title, 'Find each family', 'Die Zeichenfamilien')
  if (quest.kind === 'combos') return quest.title.replace('une voyelle', fq('une voyelle','a vowel','ein Vokal'))
  return translateUiText(quest.title)
}
function foundationUnlocked(index) { return index === 0 || Boolean(state.foundationProgress[foundationQuests()[index - 1]?.id]) }
function foundationQuestions(quest) {
  const n = foundationQuests().indexOf(quest) + 1
  const runSeed = state.foundationRun?.id === quest.id && Number.isInteger(state.foundationRun.seed) ? state.foundationRun.seed : n
  const items = quest.items
  const match = {visual:quest.kind==='words',type:'match',id:`${quest.id}-match`,title:fq('À toi de relier','Match the pairs','Verbinde die Paare'),prompt:fq('Touche un signe, puis son partenaire.','Tap a sign, then its partner.','Tippe auf ein Zeichen und dann auf seinen Partner.'),pairs:items.map((x,i)=>({...x,id:String(i),fr:translateUiText(x.fr)})),order:learning.shuffle(items.map((_,i)=>String(i)),runSeed+101)}
  const memory = {type:'memory',id:`${quest.id}-memory`,title:fq('Le jeu des paires','Memory pairs','Das Paarspiel'),prompt:fq('Retourne deux cartes et retrouve les signes identiques.','Turn over two cards and find matching signs.','Decke zwei Karten auf und finde gleiche Zeichen.'),cards:learning.shuffle(items.slice(0,3).flatMap((x,i)=>[{id:`${i}a`,text:x.ta},{id:`${i}b`,text:x.ta}]),runSeed+211)}
  let challenge
  if (quest.kind === 'words') {
    const item = items[n % items.length]
    const units = learning.units(item.ta)
    challenge = {type:'build',id:`${quest.id}-build`,title:fq('Le mot en morceaux','Word puzzle','Wortpuzzle'),prompt:fq(`Reconstruis « ${item.fr} ».`,`Build the word for “${translateUiText(item.fr)}”.`,`Setze das Wort für „${translateUiText(item.fr)}“ zusammen.`),target:item.ta,meaning:item.fr,tokens:learning.shuffle(units.map((text,i)=>({id:String(i),text})),runSeed+307)}
  } else if (quest.kind === 'families') {
    challenge = {type:'sort',id:`${quest.id}-sort`,title:fq('Range les signes','Sort the signs','Ordne die Zeichen'),prompt:fq('À quelle famille appartient chaque signe ?','Which family does each sign belong to?','Zu welcher Familie gehört jedes Zeichen?'),categories:['Voyelle','Consonne','Signe spécial'].map(x=>translateUiText(x)),cards:[{id:'0',text:'ஈ',category:0},{id:'1',text:'ம்',category:1},{id:'2',text:'ஃ',category:2}]}
  } else {
    const target = items[1]
    challenge = {type:'select',id:`${quest.id}-select`,title:quest.kind==='vowels'?fq('Tends l’oreille','Listen closely','Hör genau hin'):fq('Le signe mystère','Mystery sign','Das gesuchte Zeichen'),prompt:quest.kind==='vowels'?fq('Écoute, puis retrouve le signe. Tu peux réécouter.','Listen and find the sign. Replay as often as you need.','Höre zu und finde das Zeichen. Du kannst es erneut anhören.'):fq(`Retrouve : ${target.fr}`,`Find: ${translateUiText(target.fr)}`,`Finde: ${translateUiText(target.fr)}`),target:target.ta,options:learning.shuffle(items.map(x=>x.ta),runSeed+401),audio:quest.kind==='vowels'?target.ta:null}
  }
  return [memory,match,challenge]
}
function foundationsHome() {
  const quests = foundationQuests()
  const done = quests.filter(q => state.foundationProgress[q.id]).length
  const running = state.foundationRun && quests.find(q=>q.id===state.foundationRun.id) && state.foundationRun.phase !== 'complete'
  const next = running ? quests.find(q=>q.id===state.foundationRun.id) : quests.find(q=>!state.foundationProgress[q.id]) || quests[0]
  const nextIndex = quests.indexOf(next)
  const chapterTitles = [fq('La forêt des voyelles','The vowel forest','Der Vokalwald'),fq('Les gardiens des signes','The sign keepers','Die Zeichenhüter'),fq('L’atelier des premiers mots','Your first words','Die ersten Wörter')]
  return `<div class="app-view page-foundation-quests">${statusBar()}${logoBar()}${dailyStats()}
    <header class="quest-home-heading"><span class="eyebrow">${fq('NIVEAU 0 · TON AVENTURE','LEVEL 0 · YOUR ADVENTURE','STUFE 0 · DEIN ABENTEUER')}</span><h1>${fq('Un petit défi ?','Ready for a little quest?','Lust auf eine kleine Quest?')}</h1></header>
    <section class="quest-hero"><div class="quest-hero-copy"><span class="quest-kicker">${fq('QUÊTE','QUEST','QUEST')} ${String(nextIndex+1).padStart(2,'0')} <span>· ${fq('3 défis','3 challenges','3 Aufgaben')}</span></span><h2>${foundationTitle(next)}</h2><div class="quest-hero-signs" lang="ta">${next.items.slice(0,3).map(x=>`<span>${x.ta}</span>`).join('')}</div><p>${fq('Observe, joue, puis gagne ta première étoile.','Discover, play and earn a star.','Entdecke, spiele und verdiene einen Stern.')}</p></div>${mascot('hint','quest-hero-mascot','')}<button class="primary" type="button" data-quest-start="${next.id}">${running?fq('Reprendre ma quête','Continue my quest','Quest fortsetzen'):fq('C’est parti !','Let’s play!','Los geht’s!')} <span aria-hidden="true">→</span></button></section>
    <div class="quest-journey-progress"><strong>${done}/${quests.length} ${fq('quêtes terminées','quests completed','Quests abgeschlossen')}</strong><span>${quests.reduce((n,q)=>n+(state.foundationProgress[q.id]?.stars||0),0)} ★</span>${progressBar(done/quests.length*100,fq('Quêtes terminées','Completed quests','Abgeschlossene Quests'))}</div>
    <section class="quest-chapters" aria-label="${fq('Ton parcours','Your journey','Dein Lernweg')}">${chapterTitles.map((title,chapter)=>`<details class="quest-chapter" ${next.chapter===chapter?'open':''}><summary><span><small>${fq('CHAPITRE','CHAPTER','KAPITEL')} ${chapter+1}</small><strong>${title}</strong></span><b aria-hidden="true">+</b></summary><ol>${quests.map((q,i)=>{if(q.chapter!==chapter)return '';const complete=state.foundationProgress[q.id];const unlocked=foundationUnlocked(i);return `<li><button type="button" data-quest-start="${q.id}" class="quest-stop ${complete?'is-complete':q.id===next.id?'is-current':''}" ${unlocked?'':'disabled'}><span class="quest-stop-number" aria-hidden="true">${complete?'✓':String(i+1).padStart(2,'0')}</span><span><strong>${foundationTitle(q)}</strong><small>${complete?`${'★'.repeat(complete.stars)} · ${fq('Rejouer','Play again','Noch einmal')}`:unlocked?fq('Mémoire · associations · défi','Memory · matching · challenge','Memory · Paare · Aufgabe'):fq('Termine la quête précédente','Complete the previous quest','Schließe die vorherige Quest ab')}</small></span><b aria-hidden="true">${unlocked?'›':'⌑'}</b></button></li>`}).join('')}</ol></details>`).join('')}</section>
    <details class="quest-library"><summary><span>${fq('Mon sac à outils','My toolkit','Meine Lernhilfen')}</span><small>${fq('Alphabet, sons, écriture, mots','Alphabet, sounds, writing, words','Alphabet, Laute, Schreiben, Wörter')}</small></summary><div>${reviewItems.map(item=>`<button type="button" data-review="${item.name}"><span>${translateUiText(item.name)}</span><b aria-hidden="true">›</b></button>`).join('')}<button type="button" data-start-lesson="Bilan alphabet"><span>${fq('Bilan alphabet · 31 signes','Alphabet review · 31 signs','Alphabet-Rückblick · 31 Zeichen')}</span><b aria-hidden="true">›</b></button></div></details>${bottomNav()}</div>`
}
function startFoundationQuest(id) {
  const quests=foundationQuests(), index=quests.findIndex(q=>q.id===id)
  if(index<0 || !foundationUnlocked(index))return
  if(state.foundationRun?.id!==id || state.foundationRun.phase==='complete')state.foundationRun={id,phase:'intro',index:0,mistakes:0,assisted:false,response:{},seed:(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,startedAt:Date.now()}
  state.page='lesson';state.lessonMode='Quêtes';state.activePathNode=null;state.examKind=null;state.examVillage=null
  stopTamilAudio(); saveState(); updateUrl('lesson');render();window.scrollTo(0,0)
}
function blankFoundationResponse(index) { return {key:index,order:[],links:{},groups:{},value:'',left:null,flipped:[],matched:[]} }
function foundationNextQuestId(id) {
  const quests=foundationQuests(),index=quests.findIndex(q=>q.id===id)
  if(index<0 || !state.foundationProgress[id])return null
  const next=quests[index+1]
  return next && foundationUnlocked(index+1) ? next.id : null
}
function foundationResponse() {
  const run=state.foundationRun
  if(run.response?.key!==run.index)run.response=blankFoundationResponse(run.index)
  // A reload during the short wrong-pair animation must never leave two cards stuck open.
  if(!run.memoryWrong&&run.response.flipped?.length>=2)run.response.flipped=[]
  return run.response
}
function foundationQuestView() {
  const run=state.foundationRun, quest=foundationQuests().find(q=>q.id===run?.id)
  if(!quest)return foundationsHome()
  const qs=foundationQuestions(quest), r=foundationResponse(), q=qs[run.index]
  const head=`<header class="quest-play-head"><button class="icon-button" type="button" data-go="review" aria-label="${fq('Quitter la quête','Leave quest','Quest verlassen')}">×</button>${progressBar(run.phase==='complete'?100:run.index/qs.length*100,fq('Avancée de la quête','Quest progress','Quest-Fortschritt'))}<span>${Math.min(run.index+1,3)}/3</span></header>`
  if(run.phase==='complete')return `<div class="app-view quest-play quest-finish">${statusBar()}${head}${mascot('celebrate','quest-finish-mascot','')}<span class="eyebrow">${fq('QUÊTE TERMINÉE','QUEST COMPLETE','QUEST GESCHAFFT')}</span><h1>${fq('Une étape de plus !','One step further!','Ein Schritt weiter!')}</h1><div class="quest-stars" aria-label="${run.stars}/3">${'★'.repeat(run.stars)}${'☆'.repeat(3-run.stars)}</div><p>${fq('Tu as travaillé','You practised','Du hast geübt')} <strong>${foundationTitle(quest)}</strong>.</p><p class="quest-reward">${run.reward?`+${run.reward} XP`:fq('Entraînement supplémentaire','Extra practice','Zusätzliches Training')}</p>${foundationNextQuestId(quest.id)?`<button class="primary" data-quest-start="${foundationNextQuestId(quest.id)}" type="button">${fq('Étape suivante','Next step','Nächster Schritt')} →</button>`:''}<button class="${foundationNextQuestId(quest.id)?'secondary':'primary'}" data-go="review" type="button">${fq('Retour à mon aventure','Back to my adventure','Zurück zum Abenteuer')} →</button><button class="text-button" data-quest-start="${quest.id}" type="button">${fq('Rejouer pour progresser','Play again to improve','Noch einmal üben')}</button></div>`
  if(run.phase==='intro')return `<div class="app-view quest-play">${statusBar()}${head}<span class="eyebrow">${fq('AVANT DE JOUER','BEFORE YOU PLAY','BEVOR ES LOSGEHT')}</span><h1>${foundationTitle(quest)}</h1><p class="quest-instruction">${fq('Observe ces modèles. Tu vas les retrouver dans trois petits jeux.','Look at these examples. You’ll use them in three short games.','Schau dir diese Beispiele an. Du brauchst sie in drei kleinen Spielen.')}</p>${quest.kind==='words'&&quest.items[0]?.ta==='அம்மா'&&typeof familyLearningDiagram==='function'?familyLearningDiagram():''}<div class="quest-models ${quest.kind==='words'?'quest-models-visual':''}">${quest.items.map(x=>`<article>${quest.kind==='words'&&typeof vocabularyPicture==='function'?`<div class="quest-model-picture">${vocabularyPicture(x.ta)}</div>`:''}<strong lang="ta">${x.ta}</strong><span>${translateUiText(x.fr)}</span><button type="button" data-speak="${x.ta}" aria-label="${audioLabel(x.ta)}">${speakerIcon}</button></article>`).join('')}</div><button class="primary" type="button" data-quest="begin">${fq('J’ai observé, je joue','Ready to play','Bereit zum Spielen')} →</button></div>`
  let body
  if(q.type==='memory')body=`<div class="quest-memory ${quest.kind==='words'?'quest-memory-words':''}">${q.cards.map(card=>{const paired=r.matched.includes(card.text),visible=paired||r.flipped.includes(card.id),wrong=run.memoryWrong&&r.flipped.includes(card.id);return `<button type="button" data-quest="flip" data-value="${card.id}" class="${visible?'is-revealed':''} ${paired?'is-paired':''} ${wrong?'is-wrong':''}" aria-label="${visible?card.text:fq('Carte cachée','Hidden card','Verdeckte Karte')}" ${paired||run.feedback||run.memoryWrong?'disabled':''}><span ${visible?'lang="ta"':'aria-hidden="true"'}>${visible?card.text:'✦'}</span></button>`}).join('')}</div><p class="quest-memory-count ${run.memoryWrong?'is-wrong':''}" role="${run.memoryWrong?'alert':'status'}">${run.memoryWrong?fq('Pas la même paire… regarde bien, les cartes vont se retourner.','Not a pair… look closely, the cards will turn back.','Kein Paar… schau genau hin, die Karten drehen sich zurück.'):`${r.matched.length}/3 ${fq('paires retrouvées','pairs found','Paare gefunden')}`}</p>`
  else body=activityBody(q,r,run.feedback?'disabled':'',run.feedback)
  const ready=q.type==='memory'?r.matched.length===3:learning.ready(q,r)
  return `<div class="app-view quest-play learning-page">${statusBar()}${head}<span class="eyebrow">${foundationTitle(quest)}</span><h1>${q.title}</h1><p class="quest-instruction">${q.prompt}</p>${q.audio?`<button class="quest-listen" type="button" data-speak="${q.audio}">${speakerIcon}<span>${fq('Écouter le son','Listen to the sound','Laut anhören')}</span></button>`:''}<section class="learning-workspace">${body}</section>${run.feedback?`<section class="quest-feedback ${run.feedback}">${mascot(run.feedback==='correct'?'success':'correction','','')}<div><strong>${run.feedback==='correct'?fq('Bien joué !','Well done!','Gut gemacht!'):fq('On réessaie ensemble','Let’s try again','Versuchen wir es noch einmal')}</strong><p>${run.feedback==='correct'?fq('Tu peux passer au défi suivant.','You can move on to the next challenge.','Weiter zur nächsten Aufgabe.'):fq('Compare avec les modèles, puis corrige ta réponse. Tu ne perds pas de cœur ici.','Check the examples and try again. You won’t lose a heart here.','Vergleiche mit den Beispielen und versuche es erneut. Hier verlierst du kein Herz.')}</p>${q.type==='match'?`<p class="learning-solution">${activitySolutionMarkup(q,r,run.feedback)}</p>`:''}${activityMeaningMarkup(q,run.feedback)}</div></section><button class="primary" type="button" data-quest="${run.feedback==='correct'?'next':'retry'}">${run.feedback==='correct'?fq('Continuer','Continue','Weiter'):fq('Réessayer','Try again','Erneut versuchen')} →</button>`:`<button class="primary" type="button" data-quest="check" ${ready?'':'disabled'}>${fq('Valider mon défi','Check my challenge','Aufgabe prüfen')}</button>`}<details class="quest-help"><summary>${fq('Revoir les modèles','See the examples again','Beispiele noch einmal ansehen')}</summary>${quest.items.map(x=>`<div class="quest-audio-model"><p><strong lang="ta">${x.ta}</strong> · ${translateUiText(x.fr)}</p><button type="button" data-speak="${x.ta}" aria-label="${audioLabel(x.ta)}">${speakerIcon}</button></div>`).join('')}</details></div>`
}
function finishFoundationQuest() {
  const run=state.foundationRun
  if(run.phase==='complete')return
  const stars=run.assisted?1:run.mistakes===0?3:run.mistakes<3?2:1
  const before=state.foundationProgress[run.id]
  state.foundationProgress[run.id]={stars:Math.max(before?.stars||0,stars),timestamp:Date.now()}
  run.stars=stars;run.reward=before?0:15;run.phase='complete'
  if(!before){state.sessions.push({timestamp:Date.now(),duration:Math.max(0.1,Math.min(30,(Date.now()-run.startedAt)/60000)),accuracy:Math.round(3/(3+run.mistakes)*100),xp:15,mode:'Quêtes',village:null});state.sessions=state.sessions.slice(-100)}
}
function foundationHandle(target) {
  if(target.dataset.questStart){startFoundationQuest(target.dataset.questStart);return true}
  if(state.page!=='lesson'||state.lessonMode!=='Quêtes'||!state.foundationRun)return false
  const action=target.dataset.quest||target.dataset.activity
  if(!action)return false
  const run=state.foundationRun, quest=foundationQuests().find(q=>q.id===run.id)
  if(!quest)return true
  const q=foundationQuestions(quest)[run.index],r=foundationResponse(),value=target.dataset.value
  if(action==='begin'){run.phase='play';run.feedback=null}
  else if(action==='next'&&run.feedback==='correct'){run.index++;run.feedback=null;run.response={};if(run.index===3)finishFoundationQuest()}
  else if(action==='retry'){run.feedback=null;run.memoryWrong=false;run.response=blankFoundationResponse(run.index)}
  else if(!run.feedback&&run.phase==='play'){
    if(action==='flip'&&q.type==='memory'&&!run.memoryWrong&&r.flipped.length<2){const card=q.cards.find(x=>x.id===value);if(card&&!r.flipped.includes(value)&&!r.matched.includes(card.text)){r.flipped.push(value);if(r.flipped.length===2){const a=q.cards.find(x=>x.id===r.flipped[0]),b=q.cards.find(x=>x.id===r.flipped[1]);if(a.text===b.text){r.matched.push(a.text);r.flipped=[];playFeedbackTone(true)}else{run.mistakes++;run.memoryWrong=true;playFeedbackTone(false);const runId=run.id,step=run.index,wrongCards=r.flipped.slice();window.setTimeout(()=>{const current=state.foundationRun;if(state.page==='lesson'&&current?.id===runId&&current.index===step&&current.memoryWrong&&wrongCards.every((id,i)=>current.response?.flipped?.[i]===id)){current.response.flipped=[];current.memoryWrong=false;saveState();render()}},900)}}}}
    else if(action==='left')r.left=value
    else if(action==='right'&&r.left!==null){Object.keys(r.links).forEach(k=>{if(r.links[k]===value)delete r.links[k]});r.links[r.left]=value;r.left=null}
    else if(action==='pick')r.value=value
    else if(action==='add'&&!r.order.includes(value))r.order.push(value)
    else if(action==='remove')r.order=r.order.filter(x=>x!==value)
    else if(action==='sort')r.groups[value]=Number(target.dataset.category)
    else if(action==='check'){const ready=q.type==='memory'?r.matched.length===3:learning.ready(q,r);if(!ready)return true;const correct=q.type==='memory'||learning.check(q,r);run.feedback=correct?'correct':'wrong';if(!correct)run.mistakes++;playFeedbackTone(correct)}
  }
  saveState();render();return true
}
