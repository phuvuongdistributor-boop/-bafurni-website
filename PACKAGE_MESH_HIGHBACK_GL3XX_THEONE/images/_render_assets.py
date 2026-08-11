from __future__ import annotations

import csv
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


REPO = Path(__file__).resolve().parents[2]
PACKAGE = REPO / "PACKAGE_MESH_HIGHBACK_GL3XX_THEONE"
OUTPUT = PACKAGE / "images"
PUBLIC_OUTPUT = REPO / "assets" / "v10-04" / "gl3xx-theone" / "marketing"

BG = "#F2ECE3"
PAPER = "#FFFFFF"
INK = "#211915"
MUTED = "#6F6259"
ACCENT = "#9B5E3E"
LINE = "#D9CFC4"

FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")
# Segoe UI is intentionally used for display text because this Windows build
# contains the complete Vietnamese glyph set required by public creatives.
FONT_SERIF = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_SERIF_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")

COLLAGE_CODES = ["GL307", "GL320", "GL322", "GL323", "GL326", "GL328", "GL329", "GL331", "GL333", "GL334"]
HERO_CODES = ["GL328", "GL333", "GL323"]
WIDE_CODES = ["GL328", "GL331", "GL333", "GL323"]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def product_image(code: str) -> Image.Image:
    path = REPO / "assets" / "v10-04" / "gl3xx-theone" / "products" / code / "main.jpg"
    image = Image.open(path).convert("RGBA")
    if image.size != (580, 580):
        raise ValueError(f"{code}: expected exact natural 580x580, got {image.size}")
    return image


def fit_without_upscale(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    max_w, max_h = size
    scale = min(max_w / image.width, max_h / image.height, 1.0)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    if target == image.size:
        return image.copy()
    return image.resize(target, Image.Resampling.LANCZOS)


def paste_contain(canvas: Image.Image, source: Image.Image, box: tuple[int, int, int, int]) -> None:
    x, y, w, h = box
    fitted = fit_without_upscale(source, (w, h))
    canvas.alpha_composite(fitted, (x + (w - fitted.width) // 2, y + (h - fitted.height) // 2))


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines, current = [], ""
    for word in text.split():
        trial = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), trial, font=face)[2] <= width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def text_block(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, face: ImageFont.FreeTypeFont, fill: str, width: int, spacing: int = 8) -> int:
    x, y = xy
    line_h = draw.textbbox((0, 0), "Ag", font=face)[3]
    for line in text.split("\n"):
        for wrapped in wrap(draw, line, face, width):
            draw.text((x, y), wrapped, font=face, fill=fill)
            y += line_h + spacing
    return y


def brand(draw: ImageDraw.ImageDraw, x: int, y: int, color: str, scale: float = 1.0) -> None:
    box = round(68 * scale)
    draw.rectangle((x, y, x + box, y + box), outline=color, width=max(1, round(2 * scale)))
    ba = font(FONT_SERIF, round(29 * scale))
    label = font(FONT_BOLD, round(27 * scale))
    bbox = draw.textbbox((0, 0), "BA", font=ba)
    draw.text((x + (box - (bbox[2] - bbox[0])) / 2, y + (box - (bbox[3] - bbox[1])) / 2 - bbox[1]), "BA", font=ba, fill=color)
    draw.text((x + box + round(20 * scale), y + round(15 * scale)), "BA_Furniture", font=label, fill=color)


def save_png(canvas: Image.Image, filename: str) -> Path:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.mkdir(parents=True, exist_ok=True)
    package_path = OUTPUT / filename
    public_path = PUBLIC_OUTPUT / filename
    image = canvas.convert("RGB")
    image.save(package_path, "PNG", optimize=True)
    image.save(public_path, "PNG", optimize=True)
    return package_path


def product_panel(canvas: Image.Image, code: str, box: tuple[int, int, int, int], label_size: int = 25) -> None:
    draw = ImageDraw.Draw(canvas)
    x, y, w, h = box
    draw.rectangle((x, y, x + w, y + h), fill=PAPER, outline=LINE, width=2)
    paste_contain(canvas, product_image(code), (x + 14, y + 10, w - 28, h - 60))
    draw.text((x + 18, y + h - 43), code, font=font(FONT_BOLD, label_size), fill=INK)


def render_hero() -> Path:
    canvas = Image.new("RGBA", (1920, 1080), INK)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 90, 72, PAPER)
    draw.text((90, 285), "THE ONE · GL3XX", font=font(FONT_BOLD, 27), fill="#C9BDB4")
    text_block(draw, (90, 340), "Chọn ghế lưng cao\ntheo đúng cách ngồi.", font(FONT_SERIF_BOLD, 74), PAPER, 820, 5)
    draw.text((90, 600), "22 mã · thông số có nguồn · ảnh đúng Code", font=font(FONT_REGULAR, 29), fill="#C9BDB4")
    draw.rectangle((90, 690, 520, 698), fill=ACCENT)
    product_panel(canvas, HERO_CODES[0], (1030, 105, 520, 830), 30)
    product_panel(canvas, HERO_CODES[1], (1570, 105, 280, 395), 23)
    product_panel(canvas, HERO_CODES[2], (1570, 520, 280, 415), 23)
    draw.text((90, 975), "Ảnh sản phẩm nguồn 580×580 được giữ nguyên — không upscale", font=font(FONT_REGULAR, 21), fill="#AFA39A")
    return save_png(canvas, "hero-1920x1080.png")


def render_collage() -> Path:
    canvas = Image.new("RGBA", (1600, 1200), BG)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 65, 55, INK, 0.86)
    draw.text((65, 200), "THE ONE · GHẾ LƯNG CAO", font=font(FONT_BOLD, 23), fill=ACCENT)
    title_end = text_block(draw, (65, 245), "10 mẫu đại diện.\nRõ điểm khác biệt.", font(FONT_SERIF_BOLD, 53), INK, 435, 3)
    draw.text((65, title_end + 22), "Tựa đầu · Tay ghế · Ngả · Để chân", font=font(FONT_REGULAR, 23), fill=MUTED)
    draw.text((65, 1100), "BA_Furniture · V10.04 · ảnh thật đúng Code", font=font(FONT_REGULAR, 19), fill=MUTED)
    x0, y0, cell_w, cell_h, gap = 545, 55, 190, 520, 15
    for index, code in enumerate(COLLAGE_CODES):
        col, row = index % 5, index // 5
        x = x0 + col * (cell_w + gap)
        y = y0 + row * (cell_h + gap)
        product_panel(canvas, code, (x, y, cell_w, cell_h), 21)
    return save_png(canvas, "collage-1600x1200.png")


def render_thumbnail() -> Path:
    canvas = Image.new("RGBA", (1200, 1200), INK)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 60, 55, PAPER, 0.85)
    draw.text((60, 195), "THE ONE · GL3XX", font=font(FONT_BOLD, 23), fill="#C9BDB4")
    text_block(draw, (60, 235), "Ghế lưới\nlưng cao", font(FONT_SERIF_BOLD, 79), PAPER, 560, 0)
    draw.text((60, 455), "22 mã theo nhu cầu thật", font=font(FONT_REGULAR, 26), fill="#C9BDB4")
    for (x, y), code in zip([(55, 625), (405, 570), (755, 625)], HERO_CODES):
        product_panel(canvas, code, (x, y, 390, 500), 27)
    return save_png(canvas, "thumbnail-1200x1200.png")


def render_wide(filename: str, size: tuple[int, int]) -> Path:
    w, h = size
    scale = w / 1640
    canvas = Image.new("RGBA", size, INK)
    draw = ImageDraw.Draw(canvas)
    brand(draw, round(60 * scale), round(45 * scale), PAPER, max(0.68, 0.78 * scale))
    left = round(65 * scale)
    draw.text((left, round(h * 0.31)), "THE ONE · GL3XX", font=font(FONT_BOLD, max(18, round(23 * scale))), fill="#C9BDB4")
    text_block(draw, (left, round(h * 0.38)), "22 mẫu.\nRõ cách chọn.", font(FONT_SERIF_BOLD, max(43, round(65 * scale))), PAPER, round(w * 0.45), 0)
    panel_x, panel_y = round(w * 0.58), round(h * 0.08)
    panel_w, panel_h = round(w * 0.38), round(h * 0.84)
    gap = max(7, round(w * 0.008))
    cw, ch = (panel_w - gap) // 2, (panel_h - gap) // 2
    for index, code in enumerate(WIDE_CODES):
        col, row = index % 2, index // 2
        product_panel(canvas, code, (panel_x + col * (cw + gap), panel_y + row * (ch + gap), cw, ch), max(16, round(19 * scale)))
    return save_png(canvas, filename)


def render_contact_sheet(paths: list[Path]) -> Path:
    labels = ["Hero", "Collage", "Thumbnail", "OG", "Social Cover"]
    canvas = Image.new("RGB", (1500, 1710), BG)
    draw = ImageDraw.Draw(canvas)
    draw.text((55, 40), "V10.04 · MARKETING ASSET CONTACT SHEET", font=font(FONT_BOLD, 38), fill=INK)
    draw.text((55, 92), "5 assets · ảnh thật đúng Code · product pixels not upscaled", font=font(FONT_REGULAR, 22), fill=MUTED)
    cell_w, cell_h = 700, 490
    for index, (label, path) in enumerate(zip(labels, paths)):
        col, row = index % 2, index // 2
        x, y = 40 + col * 730, 150 + row * 510
        draw.rectangle((x, y, x + cell_w, y + cell_h), fill=PAPER, outline=LINE, width=2)
        source = Image.open(path).convert("RGB")
        thumb = ImageOps.contain(source, (cell_w - 40, cell_h - 90), Image.Resampling.LANCZOS)
        canvas.paste(thumb, (x + (cell_w - thumb.width) // 2, y + 15))
        draw.text((x + 20, y + cell_h - 62), f"{label} · {source.width}×{source.height}", font=font(FONT_BOLD, 20), fill=INK)
    output = OUTPUT / "V10_04_MARKETING_CONTACT_SHEET.jpg"
    canvas.save(output, "JPEG", quality=94, optimize=True, progressive=True)
    return output


def write_manifest(paths: list[Path]) -> None:
    rows = [
        ("Hero", paths[0], HERO_CODES),
        ("Collage", paths[1], COLLAGE_CODES),
        ("Thumbnail", paths[2], HERO_CODES),
        ("OG", paths[3], WIDE_CODES),
        ("Social Cover", paths[4], WIDE_CODES),
    ]
    with (OUTPUT / "IMAGE_MANIFEST.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Asset", "File", "Width", "Height", "SourceCodes", "SourceImageStatus", "MaxSourceResolution", "ProductPixelsUpscaled", "Watermark", "QR", "SupplierLogo"])
        for label, path, codes in rows:
            image = Image.open(path)
            writer.writerow([label, path.name, image.width, image.height, "|".join(codes), "LOW_RES_EXACT", "580x580", False, False, False, False])


def main() -> None:
    for code in set(COLLAGE_CODES + HERO_CODES):
        product_image(code)
    paths = [
        render_hero(),
        render_collage(),
        render_thumbnail(),
        render_wide("og-1200x630.png", (1200, 630)),
        render_wide("social-cover-1640x924.png", (1640, 924)),
    ]
    render_contact_sheet(paths)
    write_manifest(paths)
    print(f"Rendered {len(paths)} marketing assets; product pixels upscaled: false")


if __name__ == "__main__":
    main()
