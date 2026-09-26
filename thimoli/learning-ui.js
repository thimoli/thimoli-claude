/* Village activity UI; uses the shared app state/navigation, without a second router. */
const learning = window.THIMOLI_LEARNING
const activityEscape = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))
function activityResponse(question) {
  if (state.activityResponse?.key !== question.id) state.activityResponse = { key: question.id, order: [], links: {}, groups: {}, text: state.writingDrafts?.[question.id] || "", value: "", left: null, checks: [], flipped: [], matched: [] }
  if (question.type === 'memory') {
    const r = state.activityResponse
    r.flipped = Array.isArray(r.flipped) ? r.flipped : []
    r.matched = Array.isArray(r.matched) ? r.matched : []
    if (r.memoryPending && (!r.memoryAt || Date.now() - r.memoryAt >= 900)) { r.memoryPending = false; r.flipped = [] }
  }
  return state.activityResponse
}
function activityReset() {
  state.activityResponse = null
  state.studyStarted = false
}
function activitySolutionMarkup(q, response = null, feedback = null) {
  const translated = text => activityEscape(translateUiText(text));
  if (q.type === 'match' && response && (feedback === 'correct' || feedback === 'wrong')) {
    return `<span class="learning-match-review">${q.pairs.map((pair,index)=>{
      const chosen = q.pairs.find(candidate=>candidate.id===response.links[pair.id])
      const correct = chosen?.id === pair.id
      return `<span class="learning-match-review-row ${correct?'is-pair-correct':'is-pair-wrong'}"><span class="learning-match-review-number" aria-hidden="true">${index+1}</span><span class="learning-match-review-copy"><span class="learning-match-review-answer"><span lang="ta">${activityEscape(pair.ta)}</span> → ${translated(chosen?.fr || activityFeedbackText('Sans paire','Unpaired','Ohne Paar'))}</span><span class="learning-match-verdict"><span aria-hidden="true">${correct?'✓':'×'}</span> ${correct?activityFeedbackText('Correct','Correct','Richtig'):activityFeedbackText('À corriger','Try again','Korrigieren')}</span>${correct?'':`<span class="learning-match-correction">${activityFeedbackText('Bonne association','Correct match','Richtige Zuordnung')} : <strong>${translated(pair.fr)}</strong></span>`}</span></span>`
    }).join('')}</span>`
  }
  if (q.type === 'match' || q.type === 'memory') return q.pairs.map(p => `<span lang="ta">${activityEscape(p.ta)}</span> → <span>${translated(p.fr)}</span>`).join('<br>');
  if (q.type === 'sort') return q.cards.map(p => `<span lang="ta">${activityEscape(p.text)}</span> → <span>${translated(q.categories[p.category])}</span>`).join('<br>');
  return `<span lang="ta">${activityEscape(learning.solution(q))}</span>`;
}
function activityFeedbackText(fr, en, de) {
  return ({fr,en,de})[state.settings.language] || fr
}
function activityMeaningMarkup(q, feedback) {
  if (feedback !== 'correct' || !['build','gap','select','listen'].includes(q.type) || !q.meaning) return ''
  return `<p class="learning-meaning" lang="${activityEscape(state.settings.language)}"><span>${activityFeedbackText('Sens','Meaning','Bedeutung')}</span><strong>${activityEscape(translateUiText(q.meaning))}</strong></p>`
}
function activityMatchBody(q, r, disabled, feedback) {
  const graded = feedback === 'correct' || feedback === 'wrong'
  const pairNumber = id => q.pairs.findIndex(pair => pair.id === id) + 1
  const association = number => activityFeedbackText(`Paire ${number}`, `Pair ${number}`, `Paar ${number}`)
  const verdict = correct => correct ? activityFeedbackText('Correct','Correct','Richtig') : activityFeedbackText('À corriger','Try again','Korrigieren')
  const tile = (pair, side, sourceId) => {
    const linked = sourceId !== undefined
    const number = linked ? pairNumber(sourceId) : 0
    const selected = !graded && (side === 'left' ? r.left === pair.id : linked && r.left === sourceId)
    const correct = graded && linked && r.links[sourceId] === sourceId
    const result = graded && linked ? (correct ? 'is-pair-correct' : 'is-pair-wrong') : ''
    const meaning = translateUiText(pair.fr)
    const label = [side === 'left' ? pair.ta : meaning, linked ? association(number) : activityFeedbackText('Sans paire','Unpaired','Ohne Paar'), selected ? activityFeedbackText('Sélectionné','Selected','Ausgewählt') : '', graded && linked ? verdict(correct) : ''].filter(Boolean).join(', ')
    const picture = side === 'right' && q.visual !== false && typeof vocabularyPicture === 'function' ? vocabularyPicture(pair.ta) : ''
    return `<button class="learning-match-tile ${linked?'is-linked':''} ${selected?'is-selected':''} ${result} ${picture?'has-picture':''}" data-activity="${side}" data-value="${activityEscape(pair.id)}" ${linked?`data-association="${(number-1)%6+1}"`:''} type="button" ${disabled} aria-pressed="${selected}" aria-label="${activityEscape(label)}"><span class="learning-match-number" aria-hidden="true">${linked?number:'·'}</span>${side==='left'?`<span class="learning-match-label" lang="ta">${activityEscape(pair.ta)}</span>`:picture?`<span class="learning-match-picture" aria-hidden="true">${picture}</span>`:`<span class="learning-match-label">${activityEscape(meaning)}</span>`}${graded&&linked?`<span class="learning-match-verdict"><span aria-hidden="true">${correct?'✓':'×'}</span> ${verdict(correct)}</span>`:selected?`<span class="learning-match-selected" aria-hidden="true">${activityFeedbackText('Sélectionné','Selected','Ausgewählt')}</span>`:''}</button>`
  }
  const count = Object.keys(r.links).length
  const correctCount = graded ? q.pairs.filter(pair => r.links[pair.id] === pair.id).length : 0
  const message = graded
    ? activityFeedbackText(`${correctCount}/${q.pairs.length} paires correctes. Une croix indique une paire à corriger.`, `${correctCount}/${q.pairs.length} pairs correct. A cross marks a pair to try again.`, `${correctCount}/${q.pairs.length} Paare richtig. Ein Kreuz markiert ein Paar zum Korrigieren.`)
    : activityFeedbackText(`${count}/${q.pairs.length} paires reliées. Même numéro, même couleur : c’est ton association.`, `${count}/${q.pairs.length} pairs linked. The same number and colour show your match.`, `${count}/${q.pairs.length} Paare verbunden. Gleiche Nummer und Farbe zeigen deine Zuordnung.`)
  return `<div class="learning-match" role="group" aria-label="${activityFeedbackText('Associer les deux colonnes','Match the two columns','Verbinde die beiden Spalten')}"><div>${q.pairs.map(pair=>tile(pair,'left',r.links[pair.id]!==undefined?pair.id:undefined)).join('')}</div><div>${q.order.map(id=>tile(q.pairs.find(pair=>pair.id===id),'right',Object.keys(r.links).find(key=>r.links[key]===id))).join('')}</div></div><p class="learning-fine learning-match-status" role="status">${message}</p>`
}
function activityHeader(context, total, intro = false) {
  const close = context.exam ? "home" : "path"
  return `<header class="lesson-top"><button class="icon-button" type="button" data-go="${close}" aria-label="Quitter l’activité">×</button>${progressBar(intro ? 0 : state.lesson / total * 100, intro ? "Découvrir la leçon" : `Activité ${state.lesson + 1} sur ${total}`, "lesson-progress")}<button class="lesson-hearts" type="button" data-modal="hearts" aria-label="${state.lives} cœurs restants"><span class="lesson-heart-symbol" aria-hidden="true">♥</span><span class="lesson-heart-count">${state.lives}</span></button></header>`
}
function villageStudy(context) {
  const stage = context.stage
  const pack = learning.pack(context.villageIndex)
  const family = ['அம்மா','அப்பா'].every(word => stage.items.some(item => item.ta === word)) && typeof familyLearningDiagram === 'function' ? familyLearningDiagram() : ''
  return `<div class="app-view page-lesson learning-page">${statusBar()}${activityHeader(context,3,true)}<div class="learning-kicker">VILLAGE ${context.villageIndex + 1} <span>LEÇON ${context.node.stage+1}/10</span></div><h1>${activityEscape(stage.lesson)}</h1><p class="learning-lead">${activityEscape(stage.objective)}</p>${coach("hint", "D’abord, observe les exemples. Ensuite, à toi de relier, de compléter et de reconstruire.", {compact:true,label:"On apprend ensemble"})}
    ${family}<section class="study-card"><span class="eyebrow">LES MODÈLES À CONNAÎTRE</span>${stage.items.map(item => {
      const picture = typeof vocabularyPicture === 'function' ? vocabularyPicture(item.ta) : ''
      return `<article class="study-word${picture ? ' has-picture' : ''}">${picture ? `<span class="study-word-picture" aria-hidden="true">${picture}</span>` : ''}<div class="study-word-copy"><strong lang="ta">${activityEscape(item.ta)}</strong><small>${activityEscape(tamilToPhonetic(item.ta))}</small><p>${activityEscape(item.fr)}</p></div><button class="study-listen" type="button" data-speak="${activityEscape(item.ta)}" aria-label="${activityEscape(audioLabel(item.ta))}">${speakerIcon}</button></article>`
    }).join("")}${stage.note ? `<aside class="study-rule">${activityEscape(stage.note)}</aside>` : ""}</section>
    <details class="study-more"><summary>Préparer le défi du village <span aria-hidden="true">+</span></summary><h2>${activityEscape(pack.title)}</h2><p>${activityEscape(pack.rule)}</p><div class="study-examples">${pack.groups.map(([text,category])=>`<p><strong lang="ta">${activityEscape(text)}</strong><span>${activityEscape(pack.categories[category])}</span></p>`).join("")}</div><p lang="ta" class="study-sentence">${activityEscape(pack.sentence[0])}</p><p>${activityEscape(pack.sentence[1])}</p><p>Tu retrouveras aussi de courts textes à lire. Les réponses seront à chercher dans le texte.</p></details>
    <button class="primary learning-start" type="button" data-activity="start">J’ai lu, je m’entraîne <span aria-hidden="true">→</span></button><p class="learning-fine">Tu peux relire les modèles pendant les entraînements.</p></div>`
}
function activityBody(q,r,disabled,feedback = null) {
  if (q.type === 'memory') return villageMemoryBody(q,r,disabled)
  if (q.type === 'listen') return `<div class="village-audio-prompt"><button type="button" class="listen-button" data-speak="${activityEscape(q.audio)}" aria-label="Écouter le message">${speakerIcon}<span>Écouter le message</span></button></div>` + activityBody({...q,type:q.tokens?'build':'select'},r,disabled,feedback)
  const button = (text, action, value, extra="") => `<button type="button" class="learning-tile" data-activity="${action}" data-value="${activityEscape(value)}" ${disabled} ${extra}>${activityEscape(text)}</button>`
  if (q.type === "match") return activityMatchBody(q,r,disabled,feedback)
  if (q.type === "build") return `<div class="learning-answer-zone" aria-label="Ta réponse" lang="ta">${r.order.length?r.order.map(id=>button(q.tokens.find(t=>t.id===id)?.text,"remove",id,'aria-label="Retirer ce bloc"')).join(""):`<span class="learning-placeholder" lang="${state.settings.language}">${activityEscape(translateUiText('Touche les blocs dans le bon ordre…'))}</span>`}</div><div class="learning-bank" lang="ta">${q.tokens.map(t=>button(t.text,"add",t.id,r.order.includes(t.id)?'disabled aria-hidden="true" style="visibility:hidden"':"")).join("")}</div><p class="learning-fine">Touche un bloc de ta réponse pour le remettre dans la réserve.</p>`
  if (q.type === "gap") return `<p class="learning-cloze" lang="ta">${q.parts.map((part,i)=>i===q.hole?`<span class="learning-hole">${activityEscape(r.value||"…")}</span>`:activityEscape(part)).join(q.words?" ":"")}</p><div class="learning-bank" lang="ta">${q.options.map(value=>button(value,"pick",value,`aria-pressed="${r.value===value}"`)).join("")}</div>`
  if (q.type === "select") return `<div class="learning-bank learning-signs" lang="ta">${q.options.map(value=>button(value,"pick",value,`aria-pressed="${r.value===value}"`)).join("")}</div>`
  if (q.type === "sort") return `<div class="learning-sort">${q.cards.map(card=>`<div class="learning-sort-row"><strong lang="ta">${activityEscape(card.text)}</strong><div>${q.categories.map((cat,index)=>`<button type="button" data-activity="sort" data-value="${card.id}" data-category="${index}" aria-pressed="${r.groups[card.id]===index}" ${disabled}>${activityEscape(cat)}</button>`).join("")}</div></div>`).join("")}</div>`
  if (q.type === "read") return `<blockquote class="learning-passage" lang="ta">${activityEscape(q.passage)}</blockquote><label class="learning-input-label" for="learning-response">Ta réponse en tamoul</label><input id="learning-response" lang="ta" class="learning-input" data-activity-input value="${activityEscape(r.text)}" autocomplete="off" autocapitalize="off" spellcheck="false" ${disabled}><div class="learning-bank learning-reading-bank" lang="ta">${q.tokens.map(value=>button(value,"word",value)).join("")}</div><button class="learning-text-button" type="button" data-activity="clear" ${disabled}>Effacer ma réponse</button>`
  if (q.type === "write") return `<p class="learning-note">Atelier libre · pas de note automatique. Ton brouillon est enregistré sur cet appareil.</p><label class="learning-input-label" for="learning-response">Mon texte en tamoul</label><textarea id="learning-response" lang="ta" class="learning-input learning-draft" data-activity-input maxlength="6000" spellcheck="false" ${disabled}>${activityEscape(r.text)}</textarea><details class="study-more"><summary>Une piste pour commencer</summary><p lang="ta" class="study-sentence">${activityEscape(q.model)}</p><p>C’est un début de texte, pas un corrigé complet.</p></details><div class="learning-checklist">${q.checklist.map((text,index)=>`<button type="button" data-activity="selfcheck" data-value="${index}" role="checkbox" aria-checked="${r.checks.includes(index)}" ${disabled}><b aria-hidden="true">${r.checks.includes(index)?"✓":"○"}</b><span>${activityEscape(text)}</span></button>`).join("")}</div>`
  return ""
}
function interactiveLesson(q, context, total) {
  const r = activityResponse(q)
  const exam = Boolean(context.exam || context.node?.type === "evaluation")
  const feedback = state.feedback
  const isReviewed = feedback === "reviewed"
  const isCorrect = feedback === "correct"
  const isWrong = feedback === "wrong"
  const disabled = feedback ? "disabled" : ""
  const title = exam ? "Mise à l’épreuve" : context.stage?.title || "À toi de jouer"
  const submitText = q.type === "write" ? "Terminer mon auto-évaluation" : q.type === 'memory' ? 'Valider mes paires' : "Vérifier ma réponse"
  return `<div class="app-view page-lesson learning-page">${statusBar()}${activityHeader(context,total)}<div class="learning-kicker">${exam ? "ÉVALUATION" : "VILLAGE "+(context.villageIndex+1)} <span>${state.lesson+1}/${total} ACTIVITÉS</span></div><p class="learning-topic">${activityEscape(title)}</p><h1>${q.title}</h1><p class="learning-lead">${activityEscape(q.prompt)}</p>
    ${exam ? '<p class="learning-note">Le score compte les réponses justes du premier coup, sans indice. Chaque activité vaut un point.</p>' : ""}
    <section class="learning-workspace ${isCorrect?"is-correct":isWrong?"is-wrong":""}">${activityBody(q,r,disabled,feedback)}</section>
    ${state.showHint && !feedback ? `<aside class="learning-hint"><strong>Un coup de pouce</strong><p>${activityEscape(q.hint)}</p></aside>`:""}
    ${!feedback?`<div class="learning-actions">${!exam && q.type!=="write"?'<button class="secondary" type="button" data-hint>Un indice</button>':""}<button class="primary" type="button" data-activity="check" ${learning.ready(q,r)?"":"disabled"}>${submitText}</button></div>${!exam && context.stage?`<details class="study-more"><summary>Revoir la leçon</summary><p>${activityEscape(context.stage.note || context.stage.objective)}</p>${context.stage.items.map(item=>`<p><strong lang="ta">${activityEscape(item.ta)}</strong> · ${activityEscape(item.fr)}</p>`).join("")}<p>${activityEscape(learning.pack(context.villageIndex).rule)}</p><p lang="ta">${activityEscape(learning.pack(context.villageIndex).sentence[0])}</p><p>${activityEscape(learning.pack(context.villageIndex).sentence[1])}</p></details>`:""}`:""}
    ${feedback?`<section class="learning-feedback ${isWrong?"is-wrong":""}" role="status"><div class="learning-feedback-heading">${mascot(isWrong?"correction":"success","learning-coach","")}<div><span class="eyebrow">${isReviewed?"AUTO-ÉVALUATION TERMINÉE":isCorrect?"BIEN JOUÉ":"ON COMPREND, PUIS ON AVANCE"}</span><h2>${isReviewed?"Ton brouillon est conservé":isCorrect?(state.questionAttempts===1&&!r.helpUsed?"Réussi du premier coup !":"Tu as trouvé !") : "Compare avec le modèle"}</h2></div></div>${!isReviewed?`<p class="learning-solution">${activitySolutionMarkup(q,r,feedback)}</p>${activityMeaningMarkup(q,feedback)}`:""}<p>${activityEscape(q.explanation)}</p>${isWrong && q.type==="read"?`<p class="learning-note">Recopie exactement l’extrait demandé, avec sa forme dans la phrase.</p>`:""}<button class="primary" type="button" ${isWrong&&!exam?'data-activity="retry"':'data-activity="next"'}>${isWrong&&!exam?"Je réessaie":"Continuer"} <span aria-hidden="true">→</span></button></section>`:""}
    </div>`
}
function activityHandle(target) {
  const action = target.dataset.activity
  if (!action) return false
  if (action === "start") { state.studyStarted=true; saveState(); render(); window.scrollTo(0,0); return true }
  const q = currentLessonQuestions()[state.lesson]
  if (!q?.type) return true
  const r = activityResponse(q)
  const value = target.dataset.value
  const context = currentLearningContext()
  const exam = Boolean(context.exam || context.node?.type === "evaluation")
  if (action === 'flip' && q.type === 'memory') return villageMemoryFlip(q,r,value)
  if (action === "next") {
    if (!(state.feedback === "correct" || state.feedback === "reviewed" || exam && state.feedback === "wrong")) return true
    state.lesson++; state.feedback=null; state.showHint=false; state.questionAttempts=0; state.heartLostThisQuestion=false; state.activityResponse=null
    saveState(); render(); window.scrollTo(0,0); return true
  }
  if (action === "retry") {
    if (state.feedback !== "wrong" || exam) return true
    state.feedback=null; state.showHint=false
    r.order=[]; r.links={}; r.groups={}; r.text=""; r.value=""; r.left=null; r.flipped=[]; r.matched=[]; r.memoryPending=false
  } else if (state.feedback) return true
  else if (action === "left") r.left=value
  else if (action === "right" && r.left!==null) {
    for (const key of Object.keys(r.links)) if (r.links[key]===value) delete r.links[key]
    r.links[r.left]=value; r.left=null
  } else if (action === "add" && !r.order.includes(value)) r.order.push(value)
  else if (action === "remove") r.order=r.order.filter(id=>id!==value)
  else if (action === "pick") r.value=value
  else if (action === "sort") r.groups[value]=Number(target.dataset.category)
  else if (action === "word") r.text=(r.text+" "+value).trim()
  else if (action === "clear") r.text=""
  else if (action === "selfcheck") r.checks=r.checks.includes(Number(value))?r.checks.filter(i=>i!==Number(value)):[...r.checks,Number(value)]
  else if (action === "check") {
    if (!learning.ready(q,r)) return true
    ensureLessonRun()
    const correct = learning.check(q,r)
    if (correct===null) {
      state.feedback="reviewed"
      state.lessonRun.selfReviewed=(state.lessonRun.selfReviewed||0)+1
    } else {
      state.questionAttempts++
      state.lessonRun.totalChecks++
      state.feedback=correct?"correct":"wrong"
      if (correct) { state.lessonRun.correctAnswers++; if (state.questionAttempts===1&&!r.helpUsed) state.lessonRun.firstTryCorrect++ }
      else {
        state.lessonRun.wrongAnswers++
        if (state.questionAttempts>=4&&!state.heartLostThisQuestion) { state.lives=Math.max(0,state.lives-1); state.heartLostThisQuestion=true }
      }
      recordAnswer(q, q.type==="match"?JSON.stringify(r.links):q.type==="sort"?JSON.stringify(r.groups):learning.answerText(q,r),correct)
      playFeedbackTone(correct)
    }
  }
  saveState(); render(); return true
}
function activityInput(event) {
  if (!event.target.matches("[data-activity-input]") || state.feedback) return
  const q = currentLessonQuestions()[state.lesson]
  if (!q) return
  const r = activityResponse(q)
  r.text=event.target.value.slice(0,6000)
  if (q.type==="write") state.writingDrafts[q.id]=r.text
  saveState()
  const check=app.querySelector('[data-activity="check"]')
  if (check) check.disabled=!learning.ready(q,r)
}
