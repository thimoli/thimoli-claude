/* The illustrated world is a navigation layer, not a claim of textbook equivalence. */
function villageNextNode(index = state.currentVillage) {
  if (villageHasRunningMission(index)) return state.activePathNode
  if (state.pathProgress[index] < PATH_NODE_COUNT) return state.pathProgress[index]
  const replay = Array.from({length:40}, (_, i) => i)
  replay.sort((a,b) => (state.villagePractice[`${index}:${a}`]?.last || 0) - (state.villagePractice[`${index}:${b}`]?.last || 0))
  return replay[0]
}
function villageHasRunningMission(index = state.currentVillage) {
  return !state.examKind && Number.isInteger(state.activePathNode) && state.lessonRun && !state.lessonRun.finalized && state.lessonRun.contextKey === `path:${index}:${state.activePathNode}:${state.lessonMode}`
}
function villageMissionAction(index, node) {
  return villageHasRunningMission(index) && state.activePathNode === node ? 'data-village-resume' : `data-path-node="${node}"`
}
function villageQuestIcon(kind) {
  const shapes = {
    book: '<path fill="var(--quest-icon-fill)" d="M5 7.5c4-1.5 7-1 11 1.5 4-2.5 7-3 11-1.5V25c-4-1.5-7-1-11 1.5-4-2.5-7-3-11-1.5Z"/><path d="M5 7.5c4-1.5 7-1 11 1.5 4-2.5 7-3 11-1.5V25c-4-1.5-7-1-11 1.5-4-2.5-7-3-11-1.5Zm11 1.5v17.5M9 12l3 1M9 17l3 1M20 13l3-1M20 18l3-1"/>',
    cards: '<rect x="4" y="5" width="15" height="20" rx="4" fill="var(--quest-icon-fill)" transform="rotate(-10 11.5 15)"/><rect x="12" y="8" width="15" height="20" rx="4" fill="var(--quest-icon-paper)"/><path fill="var(--quest-icon-fill)" d="m19.5 13 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4Z"/>',
    puzzle: '<path fill="var(--quest-icon-fill)" d="M6 8h7V6a3 3 0 0 1 6 0v2h7v7h-2a3 3 0 0 0 0 6h2v6h-7v-2a3 3 0 0 0-6 0v2H6v-7h2a3 3 0 0 0 0-6H6Z"/>',
    flag: '<path fill="var(--quest-icon-fill)" d="M9 6c5-4 9 4 16 0v13c-7 4-11-4-16 0Z"/><path d="M9 4v24M5 28h9M9 6c5-4 9 4 16 0v13c-7 4-11-4-16 0"/><path d="m14 12 2 2 4-4"/>'
  }
  return `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[kind] || shapes.book}</svg>`
}
function villageQuestInfo(stage, slot) {
  const games = [
    {name:'Découvrir', kind:'book', detail:'Une mini-leçon, puis trois défis'},
    {name:'Les paires cachées', kind:'cards', detail:'Mémoire, liens et construction'},
    {name:'L’atelier des mots', kind:'puzzle', detail:'Écoute, assemblage et mots à compléter'},
    {name:'Le défi du village', kind:'flag', detail:'Lecture, tri ou phrase à reconstruire'}
  ]
  return games[slot]
}
function villageAdventureHome() {
  const index=state.currentVillage, village=villages[index], progress=state.pathProgress[index]
  const next=villageNextNode(index), node=pathNodesFor(index)[next]
  const stage=villageStages(index)[Math.min(9,node.stage)]
  const percent=Math.round(progress/PATH_NODE_COUNT*100)
  const done=progress>=PATH_NODE_COUNT
  return `<div class="app-view page-home village-adventure">${statusBar()}<header class="va-heading"><div><span class="eyebrow">TON AVENTURE</span><h1>Mes villages</h1></div><button class="secondary" type="button" data-go="levels">La carte ↗</button></header>
    <section class="va-world"><button class="va-world-art" type="button" data-go="levels" aria-label="Voir les douze villages">${villageImage(index,'',village.name)}</button><div class="va-world-copy"><span class="eyebrow">VILLAGE ${index+1} / 12</span><h2>${village.name}</h2><p lang="ta">${village.ta}</p><span class="va-world-theme">${village.theme}</span></div><div class="va-progress"><span>${Math.min(10,Math.floor(progress/4))}/10 quêtes parcourues</span><strong>${percent}%</strong>${progressBar(percent,`${percent}% du village parcouru`)}</div></section>
    <section class="va-mission"><div class="va-mission-head"><span class="eyebrow">${done?'POUR GARDER TES ACQUIS':'TA PROCHAINE MISSION'}</span>${mascot('hint','va-coach','')}</div><h2>${next===40?'La grande épreuve':stage.title}</h2><p>${next===40?'Rassemble ce que tu as appris, sans te précipiter.':stage.objective}</p><div class="va-mission-tags"><span>${node.type==='lesson'?'Découvrir → jouer':node.type==='evaluation'?'12 défis':'Jeux courts'}</span><span>${next===40?'Objectif 8/12':`Quête ${node.stage+1} sur 10`}</span></div><button class="primary" type="button" ${villageMissionAction(index,next)}>${villageHasRunningMission(index)?'Reprendre ma mission':done?'Rejouer une mission':progress===0?'Commencer l’aventure':'Continuer ma mission'} <span aria-hidden="true">→</span></button></section>
    <button class="va-route-link" type="button" data-open-path><span><strong>Mon sentier de quêtes</strong><small>Choisir une leçon ou rejouer un défi</small></span><span aria-hidden="true">→</span></button>
    <div class="va-game-strip" aria-label="Les jeux du village"><span>▦ Mémoire</span><span>↔ Associations</span><span>✦ Assemblage</span><span>◖ Écoute</span></div>
    <details class="va-exams"><summary>Me préparer à l’évaluation</summary>${villageExams(index)}</details>${villageSourceNote()}${bottomNav()}</div>`
}
function villageSourceNote() {
  return `<details class="va-sources"><summary>Le programme et les livres Valar</summary><p>Ces activités sont des créations Thimoli inspirées des formats d’annales Valar Tamil disponibles auprès d’écoles tamoules en France. Elles ne reproduisent pas les douze manuels complets.</p><p>Les niveaux avancés restent à compléter et à relire avec un enseignant. Une réussite ici n’est pas une certification scolaire.</p><a href="https://www.aftclr.fr/" target="_blank" rel="noopener noreferrer">Consulter les annales de l’AFTCLR ↗</a></details>`
}
function villageAdventurePath() {
  const index=state.currentVillage, village=villages[index], progress=state.pathProgress[index]
  const next=villageNextNode(index), stages=villageStages(index)
  const places=['La porte des savoirs','La maison des mots','Le jardin des phrases','La place des histoires','L’école du village']
  const cards=stages.map((stage,i)=>{
    const earned=Math.min(4,Math.max(0,progress-i*4))
    const active=next>=i*4&&next<i*4+4
    const slots=[0,1,2,3].map(slot=>{
      const n=i*4+slot, info=villageQuestInfo(stage,slot), status=pathNodeState(n)
      const result=state.villagePractice[`${index}:${n}`]
      return `<button type="button" class="va-stop ${status} ${n===next?'suggested':''}" data-path-node="${n}" ${status==='locked'?'disabled':''}><span class="va-stop-icon va-icon-${info.kind}" aria-hidden="true">${villageQuestIcon(info.kind)}${status==='complete'?'<i class="va-icon-done">✓</i>':''}</span><span><strong>${info.name}</strong><small>${info.detail}</small></span><span class="va-stop-score">${result?`${result.best}%`:'→'}</span></button>`
    }).join('')
    return `${i%2===0?`<div class="va-chapter"><span>${String(i/2+1).padStart(2,'0')}</span><h2>${places[i/2]}</h2></div>`:''}<details class="va-quest ${earned===4?'complete':''}" ${active?'open':''}><summary><span class="va-quest-number">${earned===4?'✓':i+1}</span><span><small>QUÊTE ${i+1}</small><strong>${stage.title}</strong></span><span class="va-quest-count">${earned}/4</span></summary><p>${stage.objective}</p><div class="va-stops">${slots}</div><p class="va-quest-foot">${earned===4?'Parcours terminé · rejoue pour consolider.':'Une leçon, puis trois missions pour pratiquer.'}</p></details>`
  }).join('')
  return `<div class="app-view page-path village-adventure">${statusBar()}<header class="va-heading"><button class="icon-button" type="button" data-go="home" aria-label="Retour au village">←</button><div><span class="eyebrow">VILLAGE ${index+1}</span><h1>Mon sentier</h1></div><button class="icon-button" type="button" data-go="levels" aria-label="Voir la carte des villages">↗</button></header><section class="va-path-banner">${villageImage(index,'',village.name)}<div><h2>${village.name}</h2><p>${progress}/${PATH_NODE_COUNT} étapes parcourues</p>${progressBar(Math.round(progress/PATH_NODE_COUNT*100),'Progression du sentier')}</div></section>
    <section class="path-resume va-resume"><div><span class="eyebrow">${progress===PATH_NODE_COUNT?'À REJOUER':'LA SUITE DE TON AVENTURE'}</span><h2>${next===40?'La grande épreuve':stages[Math.floor(next/4)].title}</h2></div><button type="button" ${villageMissionAction(index,next)}>C’est parti →</button></section><main class="va-trail">${cards}<section class="va-final"><span class="eyebrow">LA GRANDE ÉPREUVE</span><h2>La clé du village</h2><p>12 défis variés. Objectif : 8 bonnes réponses au premier essai.</p><button type="button" class="primary" data-path-node="40" ${pathNodeState(40)==='locked'?'disabled':''}>${progress===41?'Rejouer l’épreuve':'Tenter l’épreuve'}</button></section></main>${villageSourceNote()}${bottomNav()}</div>`
}
function villageMemoryBody(q, r, disabled) {
  return `<div class="village-memory" role="group" aria-label="Jeu des paires cachées">${q.cards.map((card,i) => {
    const found=r.matched.includes(card.pair), open=found||r.flipped.includes(card.id)
    return `<button type="button" data-activity="flip" data-value="${card.id}" class="${open?'is-open':''} ${found?'is-found':''} ${r.memoryPending&&open&&!found?'is-wrong':''}" lang="${open&&card.side==='ta'?'ta':state.settings.language}" ${disabled||found||r.memoryPending?'disabled':''} aria-label="${open?activityEscape(card.side==='ta'?card.text:translateUiText(card.text))+(found?', '+fq('paire trouvée','pair found','Paar gefunden'):''):`${fq('Carte','Card','Karte')} ${i+1}, ${fq('face cachée','face down','verdeckt')}`}">${open?activityEscape(card.side==='ta'?card.text:translateUiText(card.text)):'<span aria-hidden="true">✦</span>'}</button>`
  }).join('')}</div><p class="village-memory-note ${r.memoryPending?'is-wrong':''}" role="status">${r.memoryPending?'Ce n’est pas la même paire. Les cartes vont se retourner.':`${r.matched.length}/${q.pairs.length} paires retrouvées`}</p>`
}
function villageMemoryFlip(q,r,id) {
  const card=q.cards.find(c=>c.id===id)
  if (state.feedback||!card||r.memoryPending||r.flipped.includes(id)||r.matched.includes(card.pair)) return true
  r.flipped.push(id)
  if (r.flipped.length===2) {
    const a=q.cards.find(c=>c.id===r.flipped[0]), b=q.cards.find(c=>c.id===r.flipped[1])
    if(a.pair===b.pair) { r.matched.push(a.pair); r.flipped=[]; playFeedbackTone(true) }
    else {
      r.memoryPending=true; r.memoryAt=Date.now(); r.helpUsed=true; playFeedbackTone(false)
      window.setTimeout(()=>{
        if (state.activityResponse!==r) return
        r.flipped=[]; r.memoryPending=false; saveState()
        if(state.page==='lesson') render()
      },900)
    }
  }
  saveState(); render(); return true
}
function restoreVillageResponse(value) {
  if (!value || typeof value !== 'object') return null
  return value.memoryPending ? {...value,memoryPending:false,flipped:[]} : value
}
