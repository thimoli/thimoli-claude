# Thimoli — Level-zero quests, 2026-09-23

## Implemented locally

- The central home (`?page=review`) is an 18-quest adventure, with 54 activities across three chapters. Existing villages, navigation order and learner records are preserved.
- Models precede memory, matching, listening, sorting and word-building games. Completion unlocks the next quest; mistakes do not spend hearts here. Resume and best stars persist. First completion grants 15 XP; replay grants no additional XP.
- Memory cards use a new persisted shuffle seed for each run. A mismatched pair turns red, announces the error and closes automatically after 900 ms; reloading during that moment cannot leave cards stuck open. A failed matching activity keeps its numbered links visible for feedback, then clears every link on Retry.
- The four original workshops remain in a collapsed toolkit instead of dominating the home screen.
- Writing exposes all 31 native base signs and all 216 consonant-vowel combinations through a picker. Its image comparison is explicitly described as a guide, not handwriting recognition.
- Tamil grids use roomier columns and post-font-load glyph fitting. Writing models use fitted canvas typography.
- An eagerly loaded 247-sign audio index avoids waiting for the Kural download. It references 54 existing and 193 new MP3s. Playback is cancelled cleanly on navigation, and missing/failed audio produces a visible message.

## Verification

- `node --check app.js` and `node --check foundations.js` pass.
- `node scripts/test-learning.js` passes the existing village-engine checks.
- `node scripts/smoke-curriculum.js` passes 1,474 activity renders, 18 quest flows, wrong answers, completion gating, resume validation, repeat-reward protection, native writing/audio coverage and English/German quest labels.
- Browser QA at 375 × 812: no measured alphabet/combination glyph overflow, resume works, a newly added combination starts audio playback, and the final writing combination is selectable. An intentionally incorrect diagonal trace was rejected at 25% similarity.
- Browser QA also exercised a deliberately incorrect memory pair and a complete wrong matching permutation. The former displayed two error cards before closing itself; the latter returned to 0/3 links after Retry.

## Release cautions

- The new audio is synthetic (`ta-IN-PallaviNeural`), not teacher-validated. See `assets/audio/alphabet/README.md`. In particular, review isolated ரூ for possible expansion as a currency abbreviation. Successful playback is not pronunciation validation.
- The quests are original introductory activities, not a claim to reproduce all Valar Tamil books.
- No cloud deployment of this quest revision was completed in this turn. Sites' required workflow was blocked when supplying its credential through the required standard-input channel. The live phone link still points at the older version.
- Source is at the workspace root; local preview is `dist`; the publication checkout is `site-deploy` with static content in `site-deploy/dist`.
- Resume publishing through the Sites skill and `site-workflow.mjs`, with a fresh credential and remote-state check. Do not bypass its credential/input requirements or mark the phone link updated without a successful deployment status.
