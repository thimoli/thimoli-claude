"""Audit every live letter and build non-deployed Sri Lankan comparison recordings.

Signal checks cannot establish correct Tamil articulation. Keep the live index intact.
"""
import asyncio
import hashlib
import html
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path.home()/'Documents/Codex/thimoli-audio-quest-assets/dependencies'))
import edge_tts
import miniaudio

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pronunciation-review'
VOICE='ta-LK-SaranyaNeural'
RATE=24000

def measure(file):
    samples=miniaudio.decode_file(str(file),nchannels=1,sample_rate=RATE,output_format=miniaudio.SampleFormat.SIGNED16).samples
    rms=math.sqrt(sum((s/32768)**2 for s in samples)/max(1,len(samples)))
    blocks=[math.sqrt(sum((s/32768)**2 for s in samples[i:i+240])/len(samples[i:i+240])) for i in range(0,len(samples),240)]
    threshold=max(.008,max(blocks,default=0)*.08)
    active=sum(b>threshold for b in blocks)/100
    peak=max((abs(s)/32768 for s in samples),default=0)
    return {'seconds':round(len(samples)/RATE,3),'rms':round(rms,6),'activeSeconds':active,'peak':round(peak,6),'clippedFraction':sum(abs(s)>=32760 for s in samples)/max(1,len(samples)),'signalOK':rms>=.004 and active>=.08 and peak>=.02,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'candidates').mkdir(exist_ok=True)
    index=json.loads((ROOT/'assets/audio/alphabet-index.js').read_text(encoding='utf-8').split(' = ',1)[1].strip().removesuffix(';'))
    voices=await edge_tts.list_voices()
    if not any(v['ShortName']==VOICE for v in voices):
        raise RuntimeError('Sri Lankan voice unavailable; refusing a different voice.')
    sem=asyncio.Semaphore(4)
    async def review(letter,source):
        row={'letter':letter,'current':source,'voice':VOICE,'linguisticallyValidated':False}
        try: row['currentSignal']=measure(ROOT/source)
        except Exception as error: row['currentError']=str(error)
        # Keep the full framing phrase; no word-boundary cropping that could cut phonemes.
        text=f'இது {letter} என்னும் எழுத்து.'
        key=hashlib.sha256((VOICE+'|0|'+text).encode()).hexdigest()[:20]
        target=OUT/'candidates'/f'{key}.mp3'
        async with sem:
            for attempt in range(2):
                try:
                    if not target.exists() or target.stat().st_size<1000:
                        await asyncio.wait_for(edge_tts.Communicate(text,VOICE,rate='+0%',pitch='+0Hz').save(str(target)),timeout=40)
                    row.update({'candidate':f'candidates/{key}.mp3','spokenText':text,'candidateSignal':measure(target)})
                    break
                except Exception as error:
                    row['candidateError']=str(error)
                    if attempt==0: await asyncio.sleep(1)
        return row
    rows=await asyncio.gather(*(review(letter,source) for letter,source in index.items()))
    def duplicates(field):
        groups={}
        for row in rows:
            if field in row: groups.setdefault(row[field]['sha256'],[]).append(row['letter'])
        return [v for v in groups.values() if len(v)>1]
    summary={'total':len(rows),'currentSignalFailures':[r['letter'] for r in rows if not r.get('currentSignal',{}).get('signalOK')], 'candidateSignalFailures':[r['letter'] for r in rows if not r.get('candidateSignal',{}).get('signalOK')], 'currentDuplicates':duplicates('currentSignal'),'candidateDuplicates':duplicates('candidateSignal'),'linguisticallyValidated':False,'deployed':False}
    (OUT/'audit.json').write_text(json.dumps({'summary':summary,'rows':rows},ensure_ascii=False,indent=2),encoding='utf-8')
    cards=[]
    for row in rows:
        letter=html.escape(row['letter'])
        new=(f'<audio controls preload="none" src="{row["candidate"]}"></audio>' if row.get('candidateSignal',{}).get('signalOK') else '<p>Essai indisponible ou signal insuffisant.</p>')
        cards.append(f'<article><h2 lang="ta">{letter}</h2><label>Actuel</label><audio controls preload="none" src="/{row["current"]}"></audio><label>Essai féminin · Sri Lanka</label>{new}<p>Phrase complète : <span lang="ta">{html.escape(row.get("spokenText",""))}</span></p></article>')
    page='''<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thimoli · Comparaison des prononciations</title><style>body{font-family:system-ui;background:#fff9ef;color:#234453;max-width:950px;margin:auto;padding:22px}h1{font-size:28px}p{line-height:1.6}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}article{background:white;border:1px solid #e4e8dc;border-radius:24px;padding:18px;min-width:0}h2{font-size:40px;margin:5px 0 20px}audio{width:100%;margin:8px 0 18px}label{display:block;font-weight:650}a{color:#b24a21}input{box-sizing:border-box;width:100%;padding:14px;border-radius:14px;border:1px solid #cdd8c8;font:inherit;margin:18px 0}article p{font-size:13px;color:#627363}</style><a href="/?page=review">← Retour à Thimoli</a><h1>Écoutons les lettres ensemble</h1><p>247 signes comparés. Les nouveaux essais utilisent la voix féminine sri-lankaise, dans une courte phrase, sans découper les sons. Ils ne remplacent pas encore ceux des exercices : leur articulation doit être validée à l’écoute.</p><label for="search">Retrouver une lettre tamoule</label><input id="search" placeholder="Exemple : ஔ"><main>'''+''.join(cards)+'''</main><script>document.querySelector('#search').addEventListener('input',e=>{for(const card of document.querySelectorAll('article'))card.hidden=!card.querySelector('h2').textContent.includes(e.target.value.trim())});document.addEventListener('play',e=>{for(const a of document.querySelectorAll('audio'))if(a!==e.target)a.pause()},true)</script></html>'''
    (OUT/'index.html').write_text(page,encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=True),flush=True)

asyncio.run(main())
