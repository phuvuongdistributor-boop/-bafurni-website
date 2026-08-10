from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


REPO = Path(__file__).resolve().parents[2]
PACKAGE = REPO / "PACKAGE_EXECUTIVE_CHAIR_THEONE"
OUTPUT = PACKAGE / "images"
PRODUCT_DATA = PACKAGE / "website" / "product-data.json"

BG = "#F3EEE6"
PAPER = "#FFFFFF"
INK = "#211915"
MUTED = "#6F6259"
ACCENT = "#9B5E3E"
LINE = "#D9CFC4"

FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")
# Segoe UI is used for display text because its Windows font build contains
# the complete Vietnamese glyph set required by the public marketing assets.
FONT_SERIF = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_SERIF_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def load_products() -> dict[str, dict]:
    payload = json.loads(PRODUCT_DATA.read_text(encoding="utf-8"))
    return {item["code"]: item for item in payload["products"]}


PRODUCTS = load_products()


def public_to_local(path: str) -> Path:
    return REPO / path.lstrip("/")


def product_image(code: str) -> Image.Image:
    source = public_to_local(PRODUCTS[code]["image"])
    return Image.open(source).convert("RGBA")


def fit_without_upscale(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    max_w, max_h = size
    scale = min(max_w / image.width, max_h / image.height, 1.0)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(target, Image.Resampling.LANCZOS)


def paste_contain(canvas: Image.Image, source: Image.Image, box: tuple[int, int, int, int]) -> None:
    x, y, w, h = box
    fitted = fit_without_upscale(source, (w, h))
    px = x + (w - fitted.width) // 2
    py = y + (h - fitted.height) // 2
    canvas.alpha_composite(fitted, (px, py))


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
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


def text_block(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    face: ImageFont.FreeTypeFont,
    fill: str,
    width: int,
    spacing: int = 8,
) -> int:
    x, y = xy
    line_h = draw.textbbox((0, 0), "Ag", font=face)[3]
    for line in wrap(draw, text, face, width):
        draw.text((x, y), line, font=face, fill=fill)
        y += line_h + spacing
    return y


def brand(draw: ImageDraw.ImageDraw, x: int, y: int, color: str, scale: float = 1.0) -> None:
    box = round(74 * scale)
    draw.rectangle((x, y, x + box, y + box), outline=color, width=max(1, round(2 * scale)))
    ba = font(FONT_SERIF, round(34 * scale))
    label = font(FONT_BOLD, round(30 * scale))
    bbox = draw.textbbox((0, 0), "BA", font=ba)
    draw.text((x + (box - (bbox[2] - bbox[0])) / 2, y + (box - (bbox[3] - bbox[1])) / 2 - bbox[1]), "BA", font=ba, fill=color)
    draw.text((x + box + round(24 * scale), y + round(16 * scale)), "BA_Furniture", font=label, fill=color)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(path, "PNG", optimize=True)


def render_hero() -> None:
    w, h = 1920, 1080
    canvas = Image.new("RGBA", (w, h), INK)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 90, 70, PAPER)
    draw.text((90, 300), "THE ONE · GHẾ LÃNH ĐẠO", font=font(FONT_BOLD, 28), fill=PAPER)
    text_block(draw, (90, 365), "Chọn ghế theo\ncách làm việc.", font(FONT_SERIF, 98), PAPER, 850, 0)
    draw.text((90, 655), "Tám mã. Đúng ảnh, đúng thông số, rõ khác biệt.", font=font(FONT_REGULAR, 30), fill="#C6BBB2")
    draw.rectangle((1130, 75, 1800, 1005), fill=PAPER)
    paste_contain(canvas, product_image("TQ27"), (1165, 140, 600, 760))
    draw.rectangle((1020, 885, 1475, 970), fill=ACCENT)
    draw.text((1052, 908), "TQ27 · KHỔ LỚN", font=font(FONT_BOLD, 31), fill=PAPER)
    save_png(canvas, OUTPUT / "hero-1920x1080.png")


def render_collage() -> None:
    w, h = 1600, 1200
    canvas = Image.new("RGBA", (w, h), BG)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 70, 60, INK, 0.9)
    draw.text((70, 265), "EXECUTIVE CHAIR", font=font(FONT_BOLD, 25), fill=ACCENT)
    text_block(draw, (70, 320), "8 lựa chọn.\n1 cách so sánh.", font(FONT_SERIF, 74), INK, 500, 2)
    draw.text((70, 565), "Tỷ lệ · Cơ cấu · Vật liệu · Khoảng lùi", font=font(FONT_REGULAR, 25), fill=MUTED)
    draw.text((70, 1080), "Ảnh tổng hợp marketing · mỗi mã dùng ảnh sản phẩm đã xác minh", font=font(FONT_REGULAR, 20), fill=MUTED)
    codes = ["TQ30", "TQ26", "TQ34", "TQ39"]
    x0, y0, cell_w, cell_h, gap = 650, 70, 410, 510, 24
    for index, code in enumerate(codes):
        col, row = index % 2, index // 2
        x = x0 + col * (cell_w + gap)
        y = y0 + row * (cell_h + gap)
        draw.rectangle((x, y, x + cell_w, y + cell_h), fill=PAPER, outline=LINE, width=2)
        paste_contain(canvas, product_image(code), (x + 35, y + 25, cell_w - 70, cell_h - 95))
        draw.text((x + 24, y + cell_h - 56), code, font=font(FONT_BOLD, 27), fill=INK)
    save_png(canvas, OUTPUT / "collage-1600x1200.png")


def render_thumbnail() -> None:
    w = h = 1200
    canvas = Image.new("RGBA", (w, h), INK)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 65, 55, PAPER, 0.85)
    draw.text((65, 205), "THE ONE", font=font(FONT_BOLD, 24), fill="#C6BBB2")
    text_block(draw, (65, 250), "Ghế\ngiám đốc", font(FONT_SERIF, 93), PAPER, 500, 0)
    draw.text((65, 500), "8 mã theo nhu cầu thực tế", font=font(FONT_REGULAR, 26), fill="#C6BBB2")
    positions = [(70, 665), (410, 610), (750, 665)]
    for (x, y), code in zip(positions, ["TQ30", "TQ27", "TQ34"]):
        draw.rectangle((x, y, x + 380, y + 460), fill=PAPER, outline=LINE, width=2)
        paste_contain(canvas, product_image(code), (x + 20, y + 20, 340, 370))
        draw.text((x + 22, y + 405), code, font=font(FONT_BOLD, 28), fill=INK)
    draw.text((65, 1160), "Ảnh tổng hợp marketing", font=font(FONT_REGULAR, 18), fill="#AFA39A")
    save_png(canvas, OUTPUT / "thumbnail-1200x1200.png")


def render_card(code: str) -> None:
    product = PRODUCTS[code]
    w = h = 1200
    canvas = Image.new("RGBA", (w, h), BG)
    draw = ImageDraw.Draw(canvas)
    brand(draw, 60, 55, INK, 0.82)
    draw.rectangle((55, 170, 1145, 790), fill=PAPER, outline=LINE, width=2)
    paste_contain(canvas, product_image(code), (115, 185, 970, 585))
    draw.text((60, 845), "THE ONE", font=font(FONT_BOLD, 22), fill=ACCENT)
    draw.text((60, 880), code, font=font(FONT_SERIF_BOLD, 96), fill=INK)
    text_block(draw, (60, 995), product["name"], font(FONT_BOLD, 25), INK, 630, 4)
    draw.line((760, 880, 760, 1115), fill=ACCENT, width=3)
    draw.text((795, 892), product["size"], font=font(FONT_REGULAR, 21), fill=INK)
    text_block(draw, (795, 940), " · ".join(product["features"][:2]), font(FONT_REGULAR, 21), MUTED, 330, 5)
    save_png(canvas, OUTPUT / "product-cards" / f"{code}.png")


def render_wide(path: Path, size: tuple[int, int]) -> None:
    w, h = size
    canvas = Image.new("RGBA", size, INK)
    draw = ImageDraw.Draw(canvas)
    scale = w / 1640
    brand(draw, round(70 * scale), round(55 * scale), PAPER, max(0.75, scale * 0.8))
    left = round(75 * scale)
    draw.text((left, round(h * 0.29)), "THE ONE · EXECUTIVE CHAIR", font=font(FONT_BOLD, max(20, round(25 * scale))), fill="#C6BBB2")
    text_block(draw, (left, round(h * 0.37)), "8 mẫu ghế.\nRõ cách chọn.", font(FONT_SERIF, max(48, round(76 * scale))), PAPER, round(w * 0.48), 0)
    draw.text((left, round(h * 0.74)), "So sánh theo kích thước, cơ cấu và vật liệu.", font=font(FONT_REGULAR, max(19, round(25 * scale))), fill="#C6BBB2")
    panel_x = round(w * 0.57)
    panel_y = round(h * 0.09)
    panel_w = round(w * 0.4)
    panel_h = round(h * 0.82)
    gap = max(8, round(w * 0.008))
    cell_w = (panel_w - gap) // 2
    cell_h = (panel_h - gap) // 2
    for index, code in enumerate(["TQ30", "TQ27", "TQ34", "TQ39"]):
        col, row = index % 2, index // 2
        x = panel_x + col * (cell_w + gap)
        y = panel_y + row * (cell_h + gap)
        draw.rectangle((x, y, x + cell_w, y + cell_h), fill=PAPER)
        paste_contain(canvas, product_image(code), (x + 12, y + 12, cell_w - 24, cell_h - 48))
        draw.text((x + 14, y + cell_h - 36), code, font=font(FONT_BOLD, max(17, round(20 * scale))), fill=INK)
    draw.rectangle((left, h - round(60 * scale), round(w * 0.48), h - round(52 * scale)), fill=ACCENT)
    save_png(canvas, path)


def render_contact_sheet() -> None:
    assets = [
        ("Hero", OUTPUT / "hero-1920x1080.png"),
        ("Collage", OUTPUT / "collage-1600x1200.png"),
        ("Thumbnail", OUTPUT / "thumbnail-1200x1200.png"),
        *[(code, OUTPUT / "product-cards" / f"{code}.png") for code in PRODUCTS],
        ("OG", OUTPUT / "og-1200x630.png"),
        ("Social Cover", OUTPUT / "social-cover-1640x924.png"),
    ]
    columns = 3
    cell_w, cell_h = 760, 570
    header_h = 180
    rows = math.ceil(len(assets) / columns)
    canvas = Image.new("RGB", (columns * cell_w, header_h + rows * cell_h), BG)
    draw = ImageDraw.Draw(canvas)
    draw.text((60, 45), "V10.02 · MARKETING ASSET CONTACT SHEET", font=font(FONT_BOLD, 44), fill=INK)
    draw.text((60, 105), "13 assets · ảnh sản phẩm thật · kiểm tra mã và bố cục trước phát hành", font=font(FONT_REGULAR, 25), fill=MUTED)
    for index, (label, path) in enumerate(assets):
        col, row = index % columns, index // columns
        x = col * cell_w + 30
        y = header_h + row * cell_h + 25
        draw.rectangle((x, y, x + cell_w - 60, y + cell_h - 50), fill=PAPER, outline=LINE, width=2)
        source = Image.open(path).convert("RGB")
        thumb = ImageOps.contain(source, (cell_w - 100, cell_h - 135), Image.Resampling.LANCZOS)
        px = x + (cell_w - 60 - thumb.width) // 2
        py = y + 25
        canvas.paste(thumb, (px, py))
        draw.text((x + 25, y + cell_h - 105), label, font=font(FONT_BOLD, 24), fill=INK)
        draw.text((x + 25, y + cell_h - 72), f"{source.width}×{source.height}", font=font(FONT_REGULAR, 19), fill=MUTED)
    contact = OUTPUT / "V10_02_MARKETING_CONTACT_SHEET.jpg"
    canvas.save(contact, "JPEG", quality=94, optimize=True, progressive=True)


def main() -> None:
    render_hero()
    render_collage()
    render_thumbnail()
    for code in PRODUCTS:
        render_card(code)
    render_wide(OUTPUT / "og-1200x630.png", (1200, 630))
    render_wide(OUTPUT / "social-cover-1640x924.png", (1640, 924))
    render_contact_sheet()


if __name__ == "__main__":
    main()
