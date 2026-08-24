import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = Number(process.env.PORT || 4184);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2"
};

function resolveRoute(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://127.0.0.1:${PORT}`).pathname);
  if (pathname === "/") return "index.html";
  if (pathname === "/danh-muc/ghe-luoi-phong-hop") return "gl4xx-meeting-chair.html";
  const gl4xxProduct = pathname.match(/^\/san-pham\/ghe-luoi-phong-hop\/([a-z0-9-]+)$/i);
  if (gl4xxProduct) return `gl4xx-product-pages/${gl4xxProduct[1].toLowerCase()}.html`;
  if (pathname === "/danh-muc/ghe-giam-doc") return "executive-chair-theone.html";
  if (/^\/san-pham\/ghe-giam-doc\/[a-z0-9-]+$/i.test(pathname)) return "executive-chair-product.html";
  if (pathname === "/danh-muc/ghe-luoi-lung-cao") return "mesh-highback-gl3xx.html";
  if (/^\/san-pham\/ghe-luoi-lung-cao\/[a-z0-9-]+$/i.test(pathname)) return "mesh-highback-product.html";
  if (pathname === "/danh-muc/ghe-hop-chan-quy") return "sl-meeting-chair.html";
  if (/^\/san-pham\/ghe-hop-chan-quy\/[a-z0-9-]+$/i.test(pathname)) return "sl-meeting-product.html";
  return pathname.replace(/^\//, "") || "index.html";
}

const server = http.createServer((request, response) => {
  const relative = resolveRoute(request.url || "/");
  const file = path.resolve(ROOT, relative);
  if (!file.startsWith(`${ROOT}${path.sep}`) && file !== ROOT) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`GL4xx preview http://127.0.0.1:${PORT}`);
});
