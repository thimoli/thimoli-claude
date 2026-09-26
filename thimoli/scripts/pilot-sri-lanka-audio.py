"""Generate an isolated pronunciation pilot, never overwrite the app's audio index."""
import asyncio
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path.home() / 'Documents/Codex/thimoli-audio-quest-assets/dependencies'))
import edge_tts
import miniaudio

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/audio-pilot-sri-lanka'
VOICE = 'ta-LK-SaranyaNeural'

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    voices = await edge_tts.list_voices()
    if not any(v['ShortName'] == VOICE for v in voices):
        raise RuntimeError('Requested Sri Lankan voice unavailable; no automatic voice substitution.')
    report = []
    for name, text in [('au-isolated', 'ஔ'), ('au-repeated', 'ஔ. ஔ. ஔ.'), ('au-context', 'இது ஔ என்னும் எழுத்து.')]:
        target = OUT / (name + '.mp3')
        if not target.exists():
            await asyncio.wait_for(edge_tts.Communicate(text, VOICE, rate='+0%', pitch='+0Hz').save(str(target)), timeout=45)
        signal = miniaudio.decode_file(str(target), nchannels=1, sample_rate=24000, output_format=miniaudio.SampleFormat.SIGNED16).samples
        rms = math.sqrt(sum((x/32768)**2 for x in signal)/max(1,len(signal)))
        result = {'text':text,'voice':VOICE,'file':str(target),'seconds':round(len(signal)/24000,3),'rms':round(rms,6),'linguisticallyValidated':False}
        report.append(result)
        print(json.dumps(result,ensure_ascii=True),flush=True)
        if rms < .003:
            print('WARNING: low signal; do not deploy this candidate.',flush=True)
    (OUT/'pilot.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

asyncio.run(main())
