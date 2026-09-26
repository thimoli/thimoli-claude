// Read-only asset audit. Identical files are review candidates, not linguistic verdicts.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const crypto = require('node:crypto')
const root = path.resolve(__dirname, '..')
const context = {window:{}}
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/audio/alphabet-index.js'),'utf8'),context)
const entries = Object.entries(context.window.THIMOLI_ALPHABET_AUDIO)
const hashes = new Map()
const missing = []
for (const [letter,file] of entries) {
  const absolute = path.join(root,file)
  if (!fs.existsSync(absolute)) { missing.push({letter,file}); continue }
  const bytes = fs.readFileSync(absolute)
  const hash = crypto.createHash('sha256').update(bytes).digest('hex')
  const group = hashes.get(hash) || []
  group.push({letter,file,bytes:bytes.length})
  hashes.set(hash,group)
}
console.log(JSON.stringify({
  letters:entries.length,
  missing,
  identicalRecordings:[...hashes.values()].filter(group=>group.length>1),
  linguisticValidation:false,
  note:'Asset identity only. A Tamil-speaking reviewer must verify sounds and approve replacements before use.'
},null,2))
if(missing.length)process.exitCode=1
