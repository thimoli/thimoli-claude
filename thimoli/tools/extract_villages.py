"""Extract the 12 Thimoli villages from the official 4×3 source sheet.

The source has a nearly uniform warm-white canvas. Only canvas pixels connected
to a cell edge are removed, so pale details inside clouds and buildings remain.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "thimoli-villages-flat-v2.png"
OUTPUT_DIR = ROOT / "assets" / "villages"
BACKGROUND = (252, 251, 249)
GRID_COLUMNS = 4
GRID_ROWS = 3
OUTPUT_SIZE = 512


def distance_sq(pixel: tuple[int, int, int]) -> int:
    return sum((pixel[index] - BACKGROUND[index]) ** 2 for index in range(3))


def transparent_cell(cell: Image.Image) -> Image.Image:
    rgb = cell.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        offset = y * width + x
        if background[offset] or distance_sq(pixels[x, y]) > 22**2:
            return
        background[offset] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    for y in range(height):
        for x in range(width):
            offset = y * width + x
            if background[offset]:
                alpha_pixels[x, y] = 0
                continue
            if distance_sq(pixels[x, y]) > 38**2:
                continue
            touches_background = any(
                0 <= nx < width
                and 0 <= ny < height
                and background[ny * width + nx]
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
            )
            if touches_background:
                distance = distance_sq(pixels[x, y]) ** 0.5
                alpha_pixels[x, y] = max(0, min(255, round((distance - 18) / 20 * 255)))

    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("No village artwork found in a grid cell")

    padding = 10
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(width, bbox[2] + padding)
    bottom = min(height, bbox[3] + padding)
    cropped = rgba.crop((left, top, right, bottom))

    side = max(cropped.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.alpha_composite(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    return square.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for row in range(GRID_ROWS):
        for column in range(GRID_COLUMNS):
            index = row * GRID_COLUMNS + column + 1
            left = round(column * source.width / GRID_COLUMNS)
            right = round((column + 1) * source.width / GRID_COLUMNS)
            top = round(row * source.height / GRID_ROWS)
            bottom = round((row + 1) * source.height / GRID_ROWS)
            village = transparent_cell(source.crop((left, top, right, bottom)))
            village.save(OUTPUT_DIR / f"village-{index:02d}.png", optimize=True)

    print(f"Exported 12 transparent villages to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
