"""Package the user-approved transparent logo without redrawing/recoloring."""
from pathlib import Path
from PIL import Image
import base64, io, re

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT.parent.parent/'outputs/logo-alpha-fix/BA_FURNITURE_TRANSPARENT_EDGE_V2.png'
im = Image.open(SOURCE).convert('RGBA')
im.save(ROOT/'images/brand/ba-furniture-approved-v2.png', optimize=True)
square = Image.new('RGBA', (512,512))
small = im.copy()
small.thumbnail((488,488), Image.Resampling.LANCZOS)
square.alpha_composite(small, ((512-small.width)//2,(512-small.height)//2))
square.save(ROOT/'assets/brand/ba-furniture-approved-v2-512.png', optimize=True)
square.save(ROOT/'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
b = io.BytesIO()
square.save(b, format='PNG')
uri = 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
og = (ROOT/'assets/og-ba-furniture.svg').read_text(encoding='utf-8')
og = re.sub(r'data:image/png;base64,[^"]+',uri,og)
(ROOT/'assets/og-ba-furniture-v2.svg').write_text(og,encoding='utf-8')
replacements = {
 '/images/brand/ba-logo-mark.png':'/images/brand/ba-furniture-approved-v2.png',
 '/assets/brand/ba-logo-mark-512.png':'/assets/brand/ba-furniture-approved-v2-512.png',
 '/assets/og-ba-furniture.svg':'/assets/og-ba-furniture-v2.svg',
 'width="1070" height="705"':'width="1536" height="1024"',
}
# Mechanical reference updates only in runtime source, not packages/history/QA.
files = list(ROOT.glob('*.html'))+list(ROOT.glob('*.js'))+[ROOT/'schema.json']+list((ROOT/'gl4xx-product-pages').glob('*.html'))
for f in files:
    s=f.read_text(encoding='utf-8')
    t=s
    for old,new in replacements.items(): t=t.replace(old,new)
    # Cache-bust shared shell so warm product pages use the approved mark.
    t=re.sub(r'site-shell\.js\?v=[\w.-]+','site-shell.js?v=1.3.2-logo',t)
    if t!=s: f.write_text(t,encoding='utf-8',newline='\n')
print('Approved transparent logo packaged; runtime/SEO references updated.')
