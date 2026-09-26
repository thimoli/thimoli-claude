const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const path = require('node:path')

const harness = fs.readFileSync(path.join(__dirname, 'smoke-curriculum.js'), 'utf8').split('const result = vm.runInContext')[0]
const shell = { require, __dirname, process, console, URL, URLSearchParams }
vm.runInNewContext(harness + '\nglobalThis.contextForTest = context', shell)
const context = shell.contextForTest
vm.runInContext(fs.readFileSync('alphabet-review.js', 'utf8'), context, { filename: 'alphabet-review.js' })
context.assert = assert
const savedStates = []
context.localStorage.setItem = (key, value) => savedStates.push(JSON.parse(value))

vm.runInContext(`(() => {
  function progressSnapshot() {
    return JSON.stringify({ paths: state.pathProgress, lessons: state.lessonProgress, sessions: state.sessions, completed: state.completedSessions, lives: state.lives, history: state.answerHistory, foundations: state.foundationProgress })
  }
  function action(name, value, token) {
    const run = state.alphabetReviewRun
    return alphabetReviewHandle({ dataset: { alphabetReview: name, value, alphabetReviewStep: token ?? (run ? run.seed + ':' + run.index : '') } })
  }
  const inventory = Object.values(alphabetGroups).flat().map(item => item.letter).sort()
  const before = progressSnapshot()
  const questions = alphabetReviewQuestions(731)
  assert.equal(questions.length, 31)
  assert.equal(JSON.stringify(questions.map(q => q.letter).sort()), JSON.stringify(inventory), 'every base sign is asked exactly once')
  assert.equal(JSON.stringify(questions), JSON.stringify(alphabetReviewQuestions(731)), 'seeded question/option ordering is stable')
  assert.notEqual(JSON.stringify(questions), JSON.stringify(alphabetReviewQuestions(732)), 'new seeds change ordering')
  for (const question of questions) {
    assert.equal(question.options.length, 4)
    assert.equal(new Set(question.options).size, 4)
    assert.ok(question.options.includes(question.letter))
    if (question.group !== 'special') assert.ok(question.options.every(letter => alphabetGroups[question.group].some(item => item.letter === letter)), 'distractors belong to the same group')
  }
  const vocabularyBefore = JSON.stringify(alphabetGroups)
  for (const language of ['fr', 'en', 'de']) {
    state.settings.language = language
    const hints = questions.map(alphabetReviewHint)
    assert.equal(new Set(hints).size, 31, 'each sign has a distinct clue in ' + language)
    for (const question of questions) assert.ok(!alphabetReviewHint(question).includes(question.letter), 'clue does not reveal the Tamil answer')
    const short = questions.find(q => q.letter === 'அ')
    const long = questions.find(q => q.letter === 'ஆ')
    const diphthong = questions.find(q => q.letter === 'ஐ')
    assert.ok(alphabetReviewHint(short).includes(({fr:'court',en:'short',de:'kurzer'})[language]))
    assert.ok(alphabetReviewHint(long).includes(({fr:'long',en:'long',de:'langer'})[language]))
    assert.ok(alphabetReviewHint(diphthong).includes(({fr:'diphtongue',en:'diphthong',de:'Diphthong'})[language]))
    const markup = alphabetReviewView()
    assert.ok(markup.includes(({fr:'Bilan alphabet',en:'Alphabet review',de:'Alphabet-Rückblick'})[language]))
    assert.ok(!markup.includes('data-speak'), 'review does not add or judge spoken audio')
    assert.ok(markup.includes('data-alphabet-review="start"'))
  }
  assert.equal(JSON.stringify(alphabetGroups), vocabularyBefore, 'shared inventory remains unchanged')
  assert.equal(alphabetReviewHandle({ dataset: {} }), false)
  assert.equal(action('answer', 'அ'), true, 'answer without a run is ignored')
  state.settings.language = 'fr'
  startAlphabetReview(731)
  assert.equal(state.lessonMode, 'Bilan alphabet')
  assert.equal(state.activePathNode, null)
  assert.equal(state.examKind, null)
  assert.equal(state.lessonRun, null)
  assert.equal(progressSnapshot(), before)
  const first = state.alphabetReviewRun.questions[0]
  action('next')
  assert.equal(state.alphabetReviewRun.index, 0, 'cannot skip an unanswered question')
  action('answer', 'invalid')
  assert.equal(state.alphabetReviewRun.answers.length, 0, 'invalid options are rejected')
  state.page = 'review'
  action('answer', first.letter)
  assert.equal(state.alphabetReviewRun.answers.length, 0, 'stale action outside review is ignored')
  state.page = 'lesson'
  const wrong = first.options.find(letter => letter !== first.letter)
  const token = state.alphabetReviewRun.seed + ':0'
  action('answer', wrong)
  action('answer', first.letter)
  assert.equal(state.alphabetReviewRun.answers.length, 1, 'answer is counted once')
  assert.equal(state.alphabetReviewRun.answers[0].correct, false, 'second click cannot repair the first-attempt score')
  const correction = alphabetReviewView()
  assert.ok(correction.includes('ar-feedback is-wrong'))
  assert.ok(correction.includes('<span lang="ta">' + first.letter + '</span>'))
  assert.ok(correction.includes('data-alphabet-review="next"'))
  action('next')
  action('next', undefined, token)
  assert.equal(state.alphabetReviewRun.index, 1, 'stale double click cannot skip the following sign')
  action('answer', first.letter, token)
  assert.equal(state.alphabetReviewRun.answers.length, 1, 'stale answer cannot affect the following sign')
  while (state.alphabetReviewRun.phase === 'play') {
    const run = state.alphabetReviewRun
    action('answer', run.questions[run.index].letter)
    action('next')
  }
  const run = state.alphabetReviewRun
  assert.equal(run.index, 31)
  assert.equal(run.answers.length, 31)
  assert.equal(run.answers.filter(answer => answer.correct).length, 30)
  for (const language of ['fr', 'en', 'de']) {
    state.settings.language = language
    const summary = alphabetReviewView()
    assert.ok(summary.includes('<h1>30/31</h1>'))
    assert.ok(summary.includes('ar-review-list'))
    assert.ok(summary.includes('<strong lang="ta">' + first.letter + '</strong>'))
    assert.ok(summary.includes('data-alphabet-review="start"'))
    assert.ok(!summary.includes('data-alphabet-review="next"'))
  }
  action('next')
  assert.equal(run.index, 31, 'completed run stays within its bounds')
  assert.equal(progressSnapshot(), before, 'recap never changes path progress, lives, XP, sessions or answer history')
  state.settings.language = 'fr'
  startAlphabetReview(731)
  assert.equal(state.alphabetReviewRun.index, 0)
  assert.equal(state.alphabetReviewRun.answers.length, 0)
  assert.equal(JSON.stringify(state.alphabetReviewRun.questions), JSON.stringify(questions))
  while (state.alphabetReviewRun.phase === 'play') {
    const run = state.alphabetReviewRun
    action('answer', run.questions[run.index].letter)
    action('next')
  }
  assert.ok(alphabetReviewView().includes('<h1>31/31</h1>'))
  assert.ok(!alphabetReviewView().includes('ar-review-list'))
  assert.equal(progressSnapshot(), before)
})()`, context)

assert.ok(savedStates.length > 0)
assert.ok(savedStates.every(saved => !Object.hasOwn(saved, 'alphabetReviewRun')), 'recap run is not persisted')
console.log('PASS: all 31 alphabet signs, unique multilingual clues, seeded choices, correction, first-attempt score, double-click guards and no saved progress/rewards.')
