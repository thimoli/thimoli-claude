const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const path = require('node:path')

const baseHarness = fs.readFileSync(path.join(__dirname, 'smoke-curriculum.js'), 'utf8')
  .split('const result = vm.runInContext')[0]
  .replace('addEventListener() {}', 'addEventListener(event, handler) { this.handlers ||= {}; this.handlers[event] = handler }')

for (const exploration of [false, true]) {
  const harness = baseHarness.replace("unlockAll: true", `unlockAll: ${exploration}`)
  const shell = { require, __dirname, process, console, URL, URLSearchParams }
  vm.runInNewContext(harness + '\nglobalThis.contextForTest = context', shell)
  const context = shell.contextForTest
  context.assert = assert
  vm.runInContext(`(() => {
    function reset() {
      state.pathProgress.fill(0)
      state.lessonProgress.fill(0)
      state.currentVillage = 0
      state.reviewExamVillage = 0
      state.settings.language = 'fr'
      state.settings.autoAudio = false
      state.examKind = null
      state.examVillage = null
      state.activePathNode = null
      state.lessonRun = null
      state.lesson = 0
      state.page = 'home'
    }
    function finish(correct = currentLessonQuestions().filter(q => q.type !== 'write').length) {
      state.lessonRun.firstTryCorrect = correct
      state.lesson = currentLessonQuestions().length
      return lessonComplete()
    }
    function clickNext() {
      const target = {
        dataset: {},
        classList: { contains() { return false } },
        hasAttribute(name) { return name === 'data-next-lesson-stage' }
      }
      app.handlers.click({ target: { closest() { return target } } })
    }
    for (const node of [0, 3, 39]) {
      reset()
      state.pathProgress[0] = node
      assert.equal(startPathNode(node), true)
      const markup = finish()
      assert.ok(markup.includes('data-next-lesson-stage><span>Étape suivante</span>'))
      assert.match(markup, /class="secondary secondary-full"[^>]*data-return-path/)
      assert.match(markup, /class="secondary secondary-full"[^>]*data-go="home"/)
      const progress = JSON.stringify(state.pathProgress)
      const sessions = state.sessions.length
      clickNext()
      assert.equal(state.activePathNode, node + 1)
      assert.equal(state.page, 'lesson')
      assert.equal(state.lesson, 0)
      assert.equal(state.lessonMode, (node + 1) % 4 === 0 && node + 1 < 40 ? 'parcours' : 'Alphabet')
      assert.equal(state.lessonRun.finalized, false)
      assert.equal(JSON.stringify(state.pathProgress), progress, 'navigation grants no progress')
      assert.equal(state.sessions.length, sessions, 'navigation grants no duplicate reward')
      clickNext()
      assert.equal(state.activePathNode, node + 1, 'duplicate click cannot skip the new lesson')
    }

    reset()
    startPathNode(0)
    assert.equal(continueLessonStage(), false, 'unfinished lesson cannot continue')
    finish()
    const completedSessions = state.sessions.length
    for (const [language, label, back] of [['fr', 'Étape suivante', 'Retour au parcours'], ['en', 'Next step', 'Back to the path'], ['de', 'Nächster Schritt', 'Zurück zum Lernpfad']]) {
      state.settings.language = language
      const markup = lessonComplete()
      assert.ok(markup.includes('data-next-lesson-stage><span>' + label + '</span>'))
      assert.ok(markup.includes('data-return-path>' + back + '</button>'))
    }
    assert.equal(state.sessions.length, completedSessions, 'rerendering result is idempotent')
    state.lessonRun.contextKey = 'stale'
    assert.equal(continueLessonStage(), false, 'stale completion cannot advance another context')

    reset()
    state.pathProgress[0] = 10
    startPathNode(1)
    finish()
    assert.equal(state.pathProgress[0], 10)
    clickNext()
    assert.equal(state.activePathNode, 2, 'replay continues with its next sequential step')
    assert.equal(state.pathProgress[0], 10)

    reset()
    assert.equal(startPathNode(-1), false)
    assert.equal(startPathNode(PATH_NODE_COUNT), false)
    assert.equal(startPathNode(0, villages.length), false)
    if (PREVIEW_UNLOCK_ALL) {
      for (const node of [8, 40]) {
        reset()
        startPathNode(node)
        finish()
        assert.equal(state.pathProgress[0], 0, 'out-of-order exploration grants no progress')
        clickNext()
        assert.equal(state.activePathNode, 0, 'next step returns to the unfinished prerequisite')
        assert.equal(state.currentVillage, 0)
      }
    } else {
      assert.equal(startPathNode(1), false, 'locked node remains inaccessible')
      assert.equal(startPathNode(0, 1), false, 'locked village remains inaccessible')
    }

    reset()
    state.pathProgress[0] = PATH_NODE_COUNT - 1
    startPathNode(PATH_NODE_COUNT - 1)
    const failed = finish(0)
    assert.ok(!failed.includes('data-next-lesson-stage'), 'failed evaluation has no next action')
    assert.ok(failed.includes('data-restart-lesson'))
    assert.equal(state.pathProgress[0], PATH_NODE_COUNT - 1)
    assert.equal(continueLessonStage(), false)
    restartLesson()
    finish()
    assert.equal(state.pathProgress[0], PATH_NODE_COUNT)
    clickNext()
    assert.equal(state.currentVillage, 1, 'passed path evaluation continues into next village')
    assert.equal(state.activePathNode, 0)
    assert.equal(state.pathProgress[1], 0)

    for (const kind of ['mock', 'final']) {
      reset()
      state.pathProgress[0] = PATH_NODE_COUNT
      state.pathProgress[1] = kind === 'mock' ? 8 : PATH_NODE_COUNT - 1
      const progress = JSON.stringify(state.pathProgress)
      startExam(kind, 1)
      assert.equal(state.currentVillage, 0, 'practice can target a different village')
      assert.ok(!finish(0).includes('data-next-lesson-stage'))
      assert.equal(continueLessonStage(), false)
      restartLesson()
      assert.ok(finish().includes('data-next-lesson-stage'))
      clickNext()
      assert.equal(state.currentVillage, 1, 'continue uses the examined village')
      assert.equal(state.activePathNode, kind === 'mock' ? 8 : PATH_NODE_COUNT - 1)
      assert.equal(state.examKind, null)
      assert.equal(state.examVillage, null)
      assert.equal(JSON.stringify(state.pathProgress), progress, 'practice exams do not unlock anything')
    }

    reset()
    state.pathProgress.fill(PATH_NODE_COUNT)
    state.pathProgress[villages.length - 1] = PATH_NODE_COUNT - 1
    startPathNode(PATH_NODE_COUNT - 1, villages.length - 1)
    const finalMarkup = finish()
    assert.ok(!finalMarkup.includes('data-next-lesson-stage'), 'last village has no nonexistent next step')
    assert.ok(finalMarkup.includes('data-restart-lesson'))
    assert.equal(continueLessonStage(), false)
    assert.equal(state.currentVillage, villages.length - 1)
    startExam('final', villages.length - 1)
    assert.ok(!finish().includes('data-next-lesson-stage'), 'final exam practice also ends safely')

    reset()
    state.pathProgress[0] = PATH_NODE_COUNT
    state.pathProgress[1] = PATH_NODE_COUNT
    state.pathProgress[2] = 5
    startPathNode(PATH_NODE_COUNT - 1)
    finish()
    clickNext()
    assert.equal(state.currentVillage, 2, 'completed villages resume at the next unfinished village')
    assert.equal(state.activePathNode, 5)
    assert.equal(state.pathProgress[2], 5)
  })()`, context)
}
console.log('PASS: next-stage navigation, replay, prerequisites, exams, final village, FR/EN/DE and duplicate-click guards in normal and exploration modes.')
