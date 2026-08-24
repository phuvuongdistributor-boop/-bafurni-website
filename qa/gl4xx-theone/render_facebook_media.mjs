import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = process.cwd();
const source = path.join(root, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "images", "_facebook-media-source.html");
const output = path.join(root, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "images", "facebook-multi-image");
const publicOutput = path.join(root, "assets", "product-packages", "gl4xx-theone", "marketing");
const codes = ["GL430", "GL427", "GL410", "GL412", "GL419", "GL417", "GL420", "GL402TB"];
fs.mkdirSync(output, { recursive: true }); fs.mkdirSync(publicOutput, { recursive: true });

const defaultBrowser = chromium.executablePath();
const browserRoot = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
const installedBrowser = fs.existsSync(defaultBrowser)
  ? defaultBrowser
  : fs.readdirSync(browserRoot)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .map((name) => path.join(browserRoot, name, "chrome-win64", "chrome.exe"))
      .find((candidate) => fs.existsSync(candidate));
if (!installedBrowser) throw new Error("No installed Chromium executable found");
const browser = await chromium.launch({ headless: true, executablePath: installedBrowser });
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(`${pathToFileURL(source).href}?mode=cover`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const cover = path.join(output, "01-cover-collage-1200x1500.png");
await page.screenshot({ path: cover, clip: { x: 0, y: 0, width: 1200, height: 1500 } });
fs.copyFileSync(cover, path.join(publicOutput, "collage-facebook-group-post-01-1200x1500.png"));
fs.copyFileSync(cover, path.join(root, "PACKAGE_MESH_MEETING_GL4XX_THEONE", "images", "collage-facebook-group-post-01-1200x1500.png"));

await page.setViewportSize({ width: 1080, height: 1080 });
for (let index = 0; index < codes.length; index += 1) {
  const code = codes[index];
  await page.goto(`${pathToFileURL(source).href}?mode=product&code=${code}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const target = path.join(output, `${String(index + 2).padStart(2, "0")}-${code}-1080x1080.png`);
  await page.screenshot({ path: target, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  fs.copyFileSync(target, path.join(publicOutput, path.basename(target)));
}
await browser.close();

const manifest = {
  canvas: { cover: "1200x1500", individual: "1080x1080" },
  order: ["COVER", ...codes],
  files: ["01-cover-collage-1200x1500.png", ...codes.map((code, index) => `${String(index + 2).padStart(2, "0")}-${code}-1080x1080.png`)],
  selectedCodes: codes,
  constraints: { aiRedraw: false, rasterUpscale: false, watermark: 0, qr: 0, supplierLogo: 0, wrongCode: 0 }
};
fs.writeFileSync(path.join(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify(manifest));
