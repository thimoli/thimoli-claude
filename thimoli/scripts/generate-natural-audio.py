"""Generate consistent neural Tamil audio assets for the static Thimoli app.

The script is resumable: existing non-empty MP3 files are left untouched.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
from pathlib import Path

import edge_tts


VOICE = "ta-IN-PallaviNeural"
TAMIL_RE = re.compile(r"[\u0B80-\u0BFF]")
QUOTED_RE = re.compile(r"(?P<quote>['\"])(?P<value>(?:\\.|(?!\1).)*)(?P=quote)")


def normalized(text: str) -> str:
    return " ".join(text.replace("$", ". ").split()).strip()


def extract_snippets(paths: list[Path]) -> list[str]:
    values: set[str] = set()
    for path in paths:
        source = path.read_text(encoding="utf-8")
        for match in QUOTED_RE.finditer(source):
            value = match.group("value")
            if TAMIL_RE.search(value) and "${" not in value:
                clean = normalized(value.replace("\\n", " "))
                if clean:
                    values.add(clean)
    return sorted(values)


async def generate_one(text: str, destination: Path, semaphore: asyncio.Semaphore) -> tuple[bool, str]:
    if destination.exists() and destination.stat().st_size > 1000:
        return True, "cached"
    destination.parent.mkdir(parents=True, exist_ok=True)
    async with semaphore:
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(text, VOICE, rate="-8%", pitch="+2Hz")
                await communicate.save(str(destination))
                if destination.exists() and destination.stat().st_size > 1000:
                    return True, "generated"
            except Exception as error:  # noqa: BLE001 - retry remote synthesis failures
                if attempt == 2:
                    return False, str(error)
                await asyncio.sleep(1.5 * (attempt + 1))
    return False, "empty output"


async def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--concurrency", type=int, default=8)
    args = parser.parse_args()

    root = args.root.resolve()
    audio_root = root / "assets" / "audio"
    kural_path = root / "assets" / "data" / "thirukkural.txt"
    verses = [line.strip() for line in kural_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    snippets = extract_snippets([root / "app.js", root / "curriculum.js"])
    semaphore = asyncio.Semaphore(max(1, args.concurrency))

    entries: list[tuple[str, Path, str]] = []
    for index, verse in enumerate(verses, start=1):
        clean = normalized(verse)
        relative = f"assets/audio/kural/{index:04d}.mp3"
        entries.append((clean, root / relative, relative))
    for index, text in enumerate(snippets, start=1):
        relative = f"assets/audio/snippets/{index:04d}.mp3"
        entries.append((text, root / relative, relative))

    results = await asyncio.gather(*(
        generate_one(text, destination, semaphore) for text, destination, _ in entries
    ))
    failed = [(entries[index][0], result[1]) for index, result in enumerate(results) if not result[0]]
    manifest = {
        "voice": VOICE,
        "rate": "-8%",
        "items": {text: relative for (text, _, relative), result in zip(entries, results) if result[0]},
    }
    (audio_root / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(json.dumps({"kurals": len(verses), "snippets": len(snippets), "failed": len(failed)}, ensure_ascii=False))
    if failed:
        (audio_root / "failed.json").write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding="utf-8")
        return 1
    failed_path = audio_root / "failed.json"
    if failed_path.exists():
        failed_path.unlink()
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
