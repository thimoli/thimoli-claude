// Personal practice is separate from the legacy "read" history. Oral recall is self-assessed.
function restoreKuralPractice(value) {
  if (!value || !Number.isInteger(value.index) || value.index < 0 || value.index > 1329) return null
  return { index: value.index, step: Number.isInteger(value.step) ? Math.max(0, Math.min(3, value.step)) : 0,
    line: value.line === 1 ? 1 : 0, order: Array.isArray(value.order) ? [...new Set(value.order.filter(id => Number.isInteger(id) && id >= 0 && id < 20))] : [], feedback: '', reveal: false,
    seed: Number.isInteger(value.seed) ? value.seed : Math.floor(Math.random() * 0x7fffffff) }
}
function kuralSafe(text) {
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
}
function kuralPracticeHero() {
  const run = state.kuralPractice
  const index = run ? run.index : state.kuralIndex
  const records = Object.entries(state.kuralRecall)
  const recalled = records.filter(([, r]) => r === 'recited').length
  const review = records.filter(([, r]) => r === 'review')
  return `<section class="kural-mission"><div class="kural-mission-copy"><span class="eyebrow">TON ATELIER MÉMOIRE</span><h2>Deux lignes.<br>Un petit défi.</h2><p>Lis, assemble les mots, récite.</p></div>${mascot('welcome', 'kural-coach', '')}<div class="kural-mission-target"><span>Kural ${index + 1}</span><strong>${kuralFrenchTitle(Math.floor(index / 10))}</strong></div><button class="primary" type="button" data-kp-start="${index}">${run && run.step < 3 ? 'Reprendre ma séance' : 'M’entraîner'} <span aria-hidden="true">→</span></button><div class="kural-personal-progress"><span><strong>${recalled}</strong> récités sans aide</span><span><strong>${review.length}</strong> à retravailler</span></div><small class="kural-self-note">Auto-évaluation · sur cet appareil</small></section>${review.length ? `<section class="kural-review-shelf"><h2>Encore un petit effort</h2><p>Retrouve les textes que tu souhaites retravailler.</p><div>${review.slice(0, 6).map(([i]) => `<button type="button" class="secondary" data-kp-start="${i}">Kural ${Number(i) + 1} ↗</button>`).join('')}</div></section>` : ''}`
}
function kuralPracticePanel(rawVerse) {
  const run = state.kuralPractice
  if (!run || run.index !== state.kuralIndex) return `<button class="primary kural-train" type="button" data-kp-start="${state.kuralIndex}">Mémoriser ce Kural <span aria-hidden="true">→</span></button>`
  const lines = rawVerse.split('$').filter(line => line.trim())
  const phonetics = kuralPhoneticFor(run.index, rawVerse)
  const steps = ['Découvrir', 'Reconstruire', 'Réciter']
  let body = ''
  if (run.step === 0) body = `<h2>Fais connaissance avec ces deux lignes</h2><p>Lis le texte au-dessus. Tu peux l’écouter, puis le répéter une fois avant de jouer.</p><button class="primary" type="button" data-kp-next>Je passe au défi →</button>`
  if (run.step === 1) {
    const words = lines[run.line].trim().split(/\s+/)
    run.order = run.order.filter(id => id < words.length)
    const bank = words.map((word, id) => ({ word, id }))
    let seed = (run.seed + run.line) >>> 0
    for (let i = bank.length - 1; i > 0; i -= 1) {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
      const j = Math.floor((seed / 4294967296) * (i + 1))
      ;[bank[i], bank[j]] = [bank[j], bank[i]]
    }
    if (bank.every((item, i) => item.id === i) && bank.length > 1) bank.push(bank.shift())
    body = `<span class="eyebrow">LIGNE ${run.line + 1} SUR ${lines.length}</span><h2>Retrouve le fil du poème</h2><p>Touche les mots dans le bon ordre. Retouche un mot choisi pour le retirer.</p><div class="kural-answer" aria-label="Ta réponse">${run.order.length ? run.order.map(id => `<button type="button" data-kp-remove="${id}" lang="ta">${kuralSafe(words[id])}</button>`).join('') : '<span>Compose la ligne ici…</span>'}</div><div class="kural-word-bank">${bank.map(({word,id}) => `<button type="button" data-kp-word="${id}" ${run.order.includes(id) || run.feedback === 'correct' ? 'disabled' : ''}><span lang="ta">${kuralSafe(word)}</span><small>${kuralSafe(tamilToPhonetic(word))}</small></button>`).join('')}</div><button class="text-button" type="button" data-kp-reveal>${run.reveal ? 'Cacher le modèle' : 'Un petit indice ?'}</button>${run.reveal ? `<div class="kural-hint" lang="ta">${kuralSafe(lines[run.line])}</div>` : ''}<div class="kural-practice-feedback ${run.feedback}" role="status">${run.feedback === 'wrong' ? 'Pas encore : l’ordre a changé. Tu peux modifier ta réponse ou regarder le modèle.' : run.feedback === 'correct' ? 'Bien joué ! Tu as retrouvé cette ligne.' : ''}</div>${run.feedback === 'correct' ? '<button class="primary" type="button" data-kp-next>Continuer →</button>' : `<button class="primary" type="button" data-kp-check ${run.order.length !== words.length ? 'disabled' : ''}>Vérifier l’ordre</button>`}`
  }
  if (run.step === 2) body = `<h2>À toi de le réciter</h2><p>Essaie à voix haute, sans regarder. Ici, pas de micro ni de note automatique : tu fais le point toi-même.</p><div class="kural-recall-cover">${run.reveal ? lines.map((line, i) => `<div><span lang="ta">${kuralSafe(line)}</span><small>${kuralSafe(phonetics[i] || '')}</small></div>`).join('') : '<span aria-hidden="true">✦</span><strong>Le texte fait une pause.<br>À ta mémoire de jouer.</strong>'}</div><button class="secondary" type="button" data-kp-reveal>${run.reveal ? 'Cacher le texte' : 'Revoir le texte'}</button><p class="kural-self-note">Comment ça s’est passé ?</p><button class="primary" type="button" data-kp-result="recited">J’ai récité sans aide</button><button class="text-button" type="button" data-kp-result="review">J’ai encore besoin de m’entraîner</button>`
  if (run.step === 3) body = `${mascot('celebrate', 'kural-success-mascot', '')}<h2>Un pas de plus dans ta mémoire</h2><p>${state.kuralRecall[run.index] === 'recited' ? 'Tu as indiqué avoir récité ce Kural sans aide. Reviens le réciter plus tard pour voir ce qui reste.' : 'Ce Kural est dans tes textes à retravailler. Recommencer fait partie de l’apprentissage.'}</p><button class="primary" type="button" data-kural-back="home">Terminer ma séance</button><button class="text-button" type="button" data-kp-restart>Refaire ce défi</button>`
  return `<section class="kural-practice"><ol class="kural-practice-steps" aria-label="Étapes de mémorisation">${steps.map((name, i) => `<li class="${run.step >= i ? 'reached' : ''}" ${run.step === i ? 'aria-current="step"' : ''}><span>${run.step > i ? '✓' : i + 1}</span>${name}</li>`).join('')}</ol>${body}</section>`
}
function kuralPracticeHandle(target) {
  if (target.dataset.kpStart !== undefined) {
    const index = Number(target.dataset.kpStart)
    if (!Number.isInteger(index) || index < 0 || index > 1329) return true
    if (!state.kuralPractice || state.kuralPractice.index !== index || state.kuralPractice.step === 3) state.kuralPractice = restoreKuralPractice({index, step:0})
    openKuralView('detail', {index})
    return true
  }
  const run = state.kuralPractice
  if (!run || state.page !== 'kural' || state.kuralView !== 'detail' || run.index !== state.kuralIndex || !kuralVerses[run.index]) return false
  const lines = kuralVerses[run.index].split('$').filter(line => line.trim())
  const words = lines[run.line].trim().split(/\s+/)
  if (target.hasAttribute('data-kp-next')) {
    if (run.step === 0) run.step = 1
    else if (run.step === 1 && run.feedback === 'correct') { if (run.line < lines.length - 1) run.line += 1; else run.step = 2 }
    else return true
    run.order = []; run.feedback = ''; run.reveal = false
  } else if (target.dataset.kpWord !== undefined && run.step === 1 && run.feedback !== 'correct') {
    const id = Number(target.dataset.kpWord)
    if (Number.isInteger(id) && id >= 0 && id < words.length && !run.order.includes(id)) run.order.push(id)
    run.feedback = ''
  } else if (target.dataset.kpRemove !== undefined && run.step === 1 && run.feedback !== 'correct') { run.order = run.order.filter(id => id !== Number(target.dataset.kpRemove)); run.feedback = ''
  } else if (target.hasAttribute('data-kp-check') && run.step === 1) {
    if (run.order.length !== words.length) return true
    run.feedback = run.order.map(id => words[id]).join(' ') === words.join(' ') ? 'correct' : 'wrong'
  } else if (target.hasAttribute('data-kp-reveal')) run.reveal = !run.reveal
  else if (target.dataset.kpResult && run.step === 2 && ['recited','review'].includes(target.dataset.kpResult)) { state.kuralRecall[run.index] = target.dataset.kpResult; run.step = 3; run.reveal = false
  } else if (target.hasAttribute('data-kp-restart')) state.kuralPractice = restoreKuralPractice({index:run.index,step:0})
  else return false
  stopTamilAudio()
  saveState()
  render()
  return true
}
