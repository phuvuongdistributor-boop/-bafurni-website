from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "images" / "brand" / "ba-furniture-logo.jpg"
PRIMARY = ROOT / "images" / "brand" / "ba-logo-mark.png"
SQUARE = ROOT / "assets" / "brand" / "ba-logo-mark-512.png"
FAVICON_SVG = ROOT / "assets" / "favicon.svg"
FAVICON_ICO = ROOT / "favicon.ico"
OG_SVG = ROOT / "assets" / "og-ba-furniture.svg"

# Exact crop around the approved gold monogram. It removes only the two baked-in
# text lines from the legacy square JPEG and does not redraw or recolor the mark.
CROP_BOX = (130, 120, 1200, 825)


def data_uri(image: Image.Image, size: tuple[int, int]) -> str:
    resized = image.resize(size, Image.Resampling.LANCZOS)
    payload = io.BytesIO()
    resized.save(payload, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(payload.getvalue()).decode("ascii")


def main():
    source = Image.open(SOURCE).convert("RGB")
    mark = source.crop(CROP_BOX)
    mark.save(PRIMARY, optimize=True)

    square = Image.new("RGB", (512, 512), (255, 255, 255))
    scaled = mark.copy()
    scaled.thumbnail((486, 360), Image.Resampling.LANCZOS)
    square.paste(scaled, ((512 - scaled.width) // 2, (512 - scaled.height) // 2))
    square.save(SQUARE, optimize=True)
    square.save(FAVICON_ICO, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    uri = data_uri(square, (256, 256))
    FAVICON_SVG.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="BA_Furniture">\n'
        f'  <image width="512" height="512" href="{uri}" />\n'
        "</svg>\n",
        encoding="utf-8",
        newline="\n",
    )

    og = OG_SVG.read_text(encoding="utf-8")
    og = re.sub(
        r'  <image x="132" y="138" width="112" height="112" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,[^"]+" />',
        f'  <image x="132" y="138" width="112" height="112" preserveAspectRatio="xMidYMid meet" href="{uri}" />',
        og,
    )
    OG_SVG.write_text(og, encoding="utf-8", newline="\n")

    print(f"primary={mark.size}; square={square.size}; crop={CROP_BOX}")


if __name__ == "__main__":
    main()
