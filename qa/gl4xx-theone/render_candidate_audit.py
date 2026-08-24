"""Render compact contact sheets for manual GL4xx candidate inspection."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


def font(size: int):
    candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--harvest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    data = json.loads(args.harvest.read_text(encoding="utf-8"))
    args.output.mkdir(parents=True, exist_ok=True)
    title_font = font(25)
    label_font = font(17)
    url_font = font(13)
    columns, rows = 6, 4
    cell_w, cell_h = 248, 238
    margin, header = 18, 50

    for page_index in range(0, len(data["products"]), rows):
        products = data["products"][page_index:page_index + rows]
        canvas = Image.new(
            "RGB",
            (margin * 2 + columns * cell_w, header + margin + rows * cell_h),
            "#f4f1eb",
        )
        draw = ImageDraw.Draw(canvas)
        draw.text((margin, 12), f"GL4xx candidate audit — sheet {page_index // rows + 1}", fill="#172e24", font=title_font)

        for row_index, product in enumerate(products):
            candidates = [item for item in product["candidate_downloads"] if item["decode"] == "PASS"]
            # Prefer highest natural area, while retaining distinct source files.
            candidates.sort(key=lambda item: (item["width"] * item["height"], item["bytes"]), reverse=True)
            selected = candidates[:columns]
            y = header + margin + row_index * cell_h
            for column_index in range(columns):
                x = margin + column_index * cell_w
                draw.rounded_rectangle(
                    (x + 4, y + 3, x + cell_w - 6, y + cell_h - 6),
                    radius=7,
                    fill="#ffffff",
                    outline="#d9d2c5",
                    width=1,
                )
                if column_index >= len(selected):
                    if column_index == 0:
                        draw.text((x + 12, y + 15), product["code"], fill="#172e24", font=title_font)
                        draw.text((x + 12, y + 55), "No decodable candidate", fill="#9b352d", font=label_font)
                    continue
                item = selected[column_index]
                local = args.harvest.parent / Path(item["local_file"]).relative_to(args.harvest.parent.name) if item["local_file"].startswith(args.harvest.parent.name) else Path(item["local_file"])
                if not local.is_absolute():
                    local = Path.cwd() / local
                with Image.open(local) as source:
                    thumb = ImageOps.contain(source.convert("RGB"), (cell_w - 28, 164), Image.Resampling.LANCZOS)
                image_x = x + (cell_w - thumb.width) // 2
                image_y = y + 34
                canvas.paste(thumb, (image_x, image_y))
                draw.text((x + 10, y + 8), f"{product['code']} · C{column_index + 1}", fill="#172e24", font=label_font)
                draw.text((x + 10, y + 201), f"{item['width']}×{item['height']} · {item['bytes'] // 1024} KB", fill="#6a5d4d", font=url_font)
                filename = Path(item["url"].split("?")[0]).name
                draw.text((x + 10, y + 220), filename[:31], fill="#6a5d4d", font=url_font)

        target = args.output / f"candidate-audit-{page_index // rows + 1}.png"
        canvas.save(target, optimize=True)
        print(target)


if __name__ == "__main__":
    main()
