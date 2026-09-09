from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
    page=browser.new_page(viewport={'width':1200,'height':630},device_scale_factor=1)
    page.goto('http://127.0.0.1:4173/assets/og-ba-furniture-v2.svg')
    page.locator('svg').screenshot(path=str(ROOT/'assets/og-ba-furniture-v2.png'))
    browser.close()
for f in list(ROOT.glob('*.html'))+list(ROOT.glob('*.js'))+[ROOT/'schema.json']:
    s=f.read_text(encoding='utf-8')
    t=s.replace('/assets/og-ba-furniture-v2.svg','/assets/og-ba-furniture-v2.png')
    if t!=s: f.write_text(t,encoding='utf-8',newline='\n')
