"""Read-only check of all live recordings. Metrics flag listening priorities, not correctness."""
import hashlib
import html
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path.home() / 'Documents/Codex/thimoli-audio-quest-assets/dependencies'))
try:
    import miniaudio
except (ImportError, PermissionError):
    miniaudio = None

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pronunciation-review'
SAMPLE_RATE = 24000

def measure(file):
    samples = miniaudio.decode_file(str(file), nchannels=1, sample_rate=SAMPLE_RATE,
                                  output_format=miniaudio.SampleFormat.SIGNED16).samples
    blocks = [math.sqrt(sum((s / 32768) ** 2 for s in samples[i:i+240]) /
                        len(samples[i:i+240])) for i in range(0, len(samples), 240)]
    threshold = max(.008, max(blocks, default=0) * .08)
    active = sum(b > threshold for b in blocks) / 100
    rms = math.sqrt(sum((s / 32768) ** 2 for s in samples) / max(1, len(samples)))
    return dict(seconds=round(len(samples)/SAMPLE_RATE, 3), activeSeconds=active,
                rms=round(rms, 6), signalOK=active >= .08 and rms >= .004,
                sha256=hashlib.sha256(file.read_bytes()).hexdigest())

def main():
    index = json.loads((ROOT/'assets/audio/alphabet-index.js').read_text(encoding='utf-8').split(' = ', 1)[1].strip().removesuffix(';'))
    prior = {r['letter']:r for r in json.loads((OUT/'audit.json').read_text(encoding='utf-8'))['rows']}
    rows = []
    for letter, file in index.items():
        row = dict(letter=letter, file=file)
        try:
            if miniaudio:
                row.update(measure(ROOT/file))
                row['measurement'] = 'fresh decode'
            else:
                digest = hashlib.sha256((ROOT/file).read_bytes()).hexdigest()
                saved = prior[letter]['currentSignal']
                if digest != saved['sha256']:
                    raise RuntimeError('Changed file: prior measurements cannot be reused')
                row.update(saved)
                row['measurement'] = 'prior decode, SHA256 reverified now'
        except Exception as error:
            row['error'] = str(error)
        rows.append(row)
    lookup = {r['letter']: r for r in rows}
    pairs = [('அ','ஆ'), ('இ','ஈ'), ('உ','ஊ'), ('எ','ஏ'), ('ஒ','ஓ')]
    for consonant in 'கஙசஞடணதநபமயரலவழளறன':
        pairs.extend((consonant+a, consonant+b) for a,b in [('', 'ா'), ('ி','ீ'), ('ு','ூ'), ('ெ','ே'), ('ொ','ோ')])
    contrasts = []
    for short, long in pairs:
        a,b = lookup[short],lookup[long]
        ratio = b.get('activeSeconds',0)/max(.01,a.get('activeSeconds',0))
        contrasts.append(dict(short=short, long=long, shortActive=a.get('activeSeconds'),
                              longActive=b.get('activeSeconds'), ratio=round(ratio,2),
                              priority=ratio < 1.35))
    hashes = {}
    for row in rows:
        if row.get('sha256'):
            hashes.setdefault(row['sha256'], []).append(row['letter'])
    report = dict(letters=len(rows), contrasts=len(contrasts),
                  measurementMode='fresh decode' if miniaudio else 'prior measurements with every SHA256 reverified',
                  failed=[r['letter'] for r in rows if not r.get('signalOK')],
                  identical=[v for v in hashes.values() if len(v)>1],
                  priorityContrasts=sum(p['priority'] for p in contrasts),
                  linguisticValidation=False, deployed=False,
                  caution='Active duration is threshold-based, not phoneme alignment. Ratio <1.35 is a listening triage heuristic, not a linguistic pass/fail.',
                  pairs=contrasts, recordings=rows)
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'contrast-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    candidates = {r['letter']:r for r in json.loads((OUT/'audit.json').read_text(encoding='utf-8'))['rows']}
    def player(letter):
        row=lookup[letter]
        return f'<label lang="ta">{letter}</label><audio controls preload="none" src="/{html.escape(row["file"])}"></audio>'
    cards=[]
    for pair in contrasts:
        a,b=pair['short'],pair['long']
        cards.append(f'<article><h2 lang="ta">{a} / {b}</h2><p>{"À écouter en priorité" if pair["priority"] else "À valider à l’oreille"}</p><div class="pair">'+player(a)+player(b)+'</div></article>')
    allcards=[]
    for row in rows:
        letter=row['letter']; candidate=candidates.get(letter,{})
        extra=f'<details><summary>Essai féminin sri-lankais · phrase complète, non validée</summary><audio controls preload="none" src="{html.escape(candidate["candidate"])}"></audio><p lang="ta">{html.escape(candidate["spokenText"])}</p></details>' if candidate.get('candidate') else ''
        allcards.append('<article>'+player(letter)+extra+'</article>')
    page='''<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thimoli · Contrôle des sons</title><style>body{font:16px system-ui;background:#fff9ef;color:#234453;max-width:950px;margin:auto;padding:20px}h1{font-size:27px}p{line-height:1.6}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px}article{background:white;border:1px solid #e4e8dc;border-radius:22px;padding:18px;min-width:0}h2,label[lang]{font-size:30px}label{display:block}audio{width:100%;margin:8px 0 16px}summary{cursor:pointer;line-height:1.5}a{color:#a54620}input{width:100%;box-sizing:border-box;padding:14px;margin:16px 0;font:inherit}</style><a href="/?page=review">← Retour à l’application</a><h1>Le contrôle des sons Thimoli</h1><p>Écoute comparative des enregistrements actuels. Le contrôle technique ne remplace pas une validation par un locuteur tamoul sri-lankais. Aucun son de l’application n’a été remplacé par cette page.</p><h2>1. Les 95 paires courtes / longues</h2><p>Commence par அ / ஆ, puis compare les autres paires. Les priorités sont des indices de durée, pas des verdicts sur la prononciation.</p><main>'''+''.join(cards)+'''</main><h2>2. Les 247 signes, un par un</h2><label for="letter">Chercher un signe</label><input id="letter" placeholder="Exemple : அ"><main id="all">'''+''.join(allcards)+'''</main><script>document.querySelector('#letter').addEventListener('input',e=>{for(const c of document.querySelectorAll('#all article'))c.hidden=!c.querySelector('label').textContent.includes(e.target.value.trim())});document.addEventListener('play',e=>{for(const a of document.querySelectorAll('audio'))if(a!==e.target)a.pause()},true)</script></html>'''
    (OUT/'contrasts.html').write_text(page,encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k not in ('pairs','recordings')},ensure_ascii=True))
    print(json.dumps(contrasts[:5],ensure_ascii=True))

if __name__=='__main__':main()
