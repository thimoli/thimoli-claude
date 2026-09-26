/* Optional recognition practice. Its run is ephemeral and never earns path progress or XP. */
function alphabetReviewQuestions(seed) {
  const inventory = Object.entries(alphabetGroups).flatMap(([group, letters]) => letters.map(item => ({ letter: item.letter, group })))
  return learning.shuffle(inventory, seed).map((question, index) => {
    const pool = question.group === 'special' ? inventory : inventory.filter(item => item.group === question.group)
    const distractors = learning.shuffle(pool.filter(item => item.letter !== question.letter), seed + index * 17 + 1).slice(0, 3)
    return { ...question, options: learning.shuffle([question.letter, ...distractors.map(item => item.letter)], seed + index * 31 + 7) }
  })
}

function alphabetReviewGroup(group) {
  return group === 'vowels' ? fq('Voyelle', 'Vowel', 'Vokal') : group === 'consonants' ? fq('Consonne', 'Consonant', 'Konsonant') : fq('Signe spécial', 'Special sign', 'Sonderzeichen')
}

function alphabetReviewHint(question) {
  if (question.group === 'special') return fq('āytam · le nom du signe spécial', 'āytam · the name of the special sign', 'āytam · der Name des Sonderzeichens')
  if (question.group === 'consonants') {
    const item = alphabetGroups.consonants.find(item => item.letter === question.letter)
    return `${tamilToPhonetic(question.letter)} · ${foundationConsonantHint(item)}`
  }
  const length = ['அ', 'இ', 'உ', 'எ', 'ஒ'].includes(question.letter)
    ? fq('son court', 'short sound', 'kurzer Laut')
    : ['ஐ', 'ஔ'].includes(question.letter)
      ? fq('diphtongue', 'diphthong', 'Diphthong')
      : fq('son long', 'long sound', 'langer Laut')
  return `${tamilToPhonetic(question.letter)} · ${length}`
}

function startAlphabetReview(seed) {
  stopTamilAudio()
  activityReset()
  const runSeed = Number.isInteger(seed) ? seed >>> 0 : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
  state.alphabetReviewRun = { seed: runSeed, questions: alphabetReviewQuestions(runSeed), index: 0, answers: [], phase: 'play' }
  state.lessonMode = 'Bilan alphabet'
  state.activePathNode = null
  state.examKind = null
  state.examVillage = null
  state.lessonRun = null
  state.lesson = 0
  state.feedback = null
  goTo('lesson')
}

function alphabetReviewView() {
  const run = state.alphabetReviewRun
  const title = fq('Bilan alphabet', 'Alphabet review', 'Alphabet-Rückblick')
  const intro = fq('31 signes · entraînement de reconnaissance', '31 signs · recognition practice', '31 Zeichen · Erkennungsübung')
  const note = fq('Les réponses portent sur les signes écrits. Ce bilan ne mesure pas ta prononciation et ne donne ni XP ni progression de village.', 'Answers concern written signs. This review does not assess your pronunciation or award XP or village progress.', 'Die Antworten betreffen geschriebene Zeichen. Diese Übung bewertet keine Aussprache und vergibt weder XP noch Dorffortschritt.')
  const header = `${statusBar()}${practiceHeader(title, intro, run ? `${run.phase === 'complete' ? 31 : run.index + 1}/31` : '')}`
  if (!run) return `<div class="app-view page-practice alphabet-review">${header}<section class="ar-card"><h2>${fq('Retrouve les 31 signes de base', 'Find the 31 basic signs', 'Finde die 31 Grundzeichen')}</h2><p>${fq('Lis chaque repère, puis choisis le signe tamoul correspondant. Tu verras la correction après chaque réponse.', 'Read each clue, then choose the matching Tamil sign. You will see the correction after each answer.', 'Lies jeden Hinweis und wähle das passende tamilische Zeichen. Nach jeder Antwort siehst du die Auflösung.')}</p><p>${fq('12 voyelles, 18 consonnes et le signe spécial āytam.', '12 vowels, 18 consonants and the special sign āytam.', '12 Vokale, 18 Konsonanten und das Sonderzeichen āytam.')}</p><button class="primary" type="button" data-alphabet-review="start">${fq('Commencer le bilan', 'Start the review', 'Übung beginnen')}</button></section><p class="ar-note">${note}</p></div>`
  if (run.phase === 'complete') {
    const correct = run.answers.filter(answer => answer.correct).length
    const missed = run.questions.filter((question, index) => !run.answers[index].correct)
    const categories = ['vowels', 'consonants', 'special'].map(group => {
      const questions = run.questions.map((question, index) => ({ question, answer: run.answers[index] })).filter(item => item.question.group === group)
      return `<li><span>${alphabetReviewGroup(group)}</span><strong>${questions.filter(item => item.answer.correct).length}/${questions.length}</strong></li>`
    }).join('')
    return `<div class="app-view page-practice alphabet-review">${header}<section class="ar-card ar-complete"><span class="eyebrow">${fq('BILAN TERMINÉ', 'REVIEW COMPLETE', 'ÜBUNG ABGESCHLOSSEN')}</span><h1>${correct}/31</h1><p>${fq('signes retrouvés au premier essai', 'signs found on the first attempt', 'Zeichen beim ersten Versuch erkannt')}</p><ul class="ar-category-results">${categories}</ul></section>${missed.length ? `<section class="ar-card"><h2>${fq('Tes repères à revoir', 'Clues to review', 'Hinweise zum Wiederholen')}</h2><ul class="ar-review-list">${missed.map(question => `<li><strong lang="ta">${question.letter}</strong><span>${activityEscape(alphabetReviewHint(question))}</span></li>`).join('')}</ul></section>` : `<p class="ar-encouragement">${fq('Tu as retrouvé les 31 signes. Bravo pour cette révision !', 'You found all 31 signs. Well done on your review!', 'Du hast alle 31 Zeichen erkannt. Gut gemacht!')}</p>`}<button class="primary" type="button" data-alphabet-review="start">${fq('Refaire le bilan', 'Try the review again', 'Übung wiederholen')}</button><button class="secondary secondary-full" type="button" data-start-lesson="Alphabet">${fq('Revoir l’alphabet', 'Review the alphabet', 'Alphabet ansehen')}</button><button class="secondary secondary-full" type="button" data-go="review">${fq('Retour à mon sac à outils', 'Back to my toolkit', 'Zurück zu meinen Lernhilfen')}</button><p class="ar-note">${note}</p></div>`
  }
  const question = run.questions[run.index]
  const answer = run.answers[run.index]
  const token = `${run.seed}:${run.index}`
  const hint = activityEscape(alphabetReviewHint(question))
  const progress = Math.round((run.index / run.questions.length) * 100)
  const correctLabel = fq('Bonne réponse', 'Correct answer', 'Richtige Antwort')
  return `<div class="app-view page-practice alphabet-review">${header}${progressBar(progress, fq('Progression du bilan', 'Review progress', 'Übungsfortschritt'))}<section class="ar-card"><span class="eyebrow">${alphabetReviewGroup(question.group)}</span><h1>${fq('Retrouve le signe', 'Find the sign', 'Finde das Zeichen')}</h1><p class="ar-hint">${hint}</p><p class="ar-instruction">${fq('Choisis le signe tamoul qui correspond à ce repère.', 'Choose the Tamil sign that matches this clue.', 'Wähle das tamilische Zeichen, das zu diesem Hinweis passt.')}</p><div class="ar-options" role="group" aria-label="${fq('Quatre signes au choix', 'Choose from four signs', 'Vier Zeichen zur Auswahl')}">${question.options.map(letter => `<button class="ar-option ${answer && letter === question.letter ? 'is-correct' : answer && letter === answer.selected ? 'is-wrong' : ''}" type="button" data-alphabet-review="answer" data-alphabet-review-step="${token}" data-value="${letter}" ${answer ? 'disabled' : ''}><strong lang="ta">${letter}</strong>${answer && letter === question.letter ? `<span>${correctLabel}</span>` : answer && letter === answer.selected ? `<span>${fq('Ton choix', 'Your choice', 'Deine Wahl')}</span>` : ''}</button>`).join('')}</div></section>${answer ? `<section class="ar-feedback ${answer.correct ? '' : 'is-wrong'}" role="status"><strong>${answer.correct ? correctLabel : fq('À retenir', 'Remember', 'Merke dir')}</strong><p><span lang="ta">${question.letter}</span> · ${hint}</p><button class="primary" type="button" data-alphabet-review="next" data-alphabet-review-step="${token}">${run.index === run.questions.length - 1 ? fq('Voir mon bilan', 'See my results', 'Mein Ergebnis ansehen') : fq('Étape suivante', 'Next step', 'Nächster Schritt')} <span aria-hidden="true">→</span></button></section>` : ''}<p class="ar-note">${note}</p></div>`
}

function alphabetReviewHandle(target) {
  const action = target.dataset.alphabetReview
  if (!['start', 'answer', 'next'].includes(action)) return false
  if (action === 'start') { startAlphabetReview(); return true }
  const run = state.alphabetReviewRun
  if (state.page !== 'lesson' || state.lessonMode !== 'Bilan alphabet' || !run || run.phase !== 'play') return true
  if (target.dataset.alphabetReviewStep !== `${run.seed}:${run.index}`) return true
  const question = run.questions[run.index]
  if (action === 'answer') {
    if (run.answers[run.index] || !question.options.includes(target.dataset.value)) return true
    run.answers.push({ selected: target.dataset.value, correct: target.dataset.value === question.letter })
  } else {
    if (!run.answers[run.index]) return true
    run.index += 1
    if (run.index === run.questions.length) run.phase = 'complete'
  }
  render()
  const focus = app.querySelector(action === 'answer' ? '[data-alphabet-review="next"]' : '.ar-option, [data-alphabet-review="start"]')
  focus?.focus({ preventScroll: true })
  if (action === 'next') window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' })
  return true
}
