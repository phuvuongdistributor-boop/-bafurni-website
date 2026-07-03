# DEPLOYMENT CHECKLIST - SPRINT W05

## Production Target

- Domain: `https://bafurni.com`
- Portal: `https://portal.bafurni.com`
- Publish scope: Homepage static website only.

## Checklist

| Item | Status | Notes |
|---|---:|---|
| Website Ready | PASS | Static source in `/website`; homepage, CSS, JS, robots, sitemap, schema and assets present. |
| Asset Ready | PASS | Product images copied into `assets/products/`; favicon and OG placeholder present. |
| SEO Ready | PASS | Title, meta description, canonical, OG, Organization schema, robots and sitemap ready. |
| SSL Ready | PENDING | SSL can be provisioned automatically by Vercel or Render after domain is connected. Not active because no deploy/DNS change was performed. |
| Domain Ready | PENDING | `bafurni.com` is the target domain, but platform domain setup and DNS are not changed in this task. |
| DNS Required | YES | DNS must be configured only after deployment approval. Do not change `portal.bafurni.com`. |
| Estimated Deploy Time | 15-45 minutes | Static deploy usually takes minutes; SSL/DNS validation may add extra time depending on DNS provider. |
| Rollback Plan | READY | Use platform rollback to previous deployment, or revert DNS to previous host. Keep current `/website` source as the approved build package. |

## Pre-Deploy Verification

PASS:

- Homepage local HTTP 200.
- Missing URL local HTTP 404.
- `robots.txt` local HTTP 200.
- `sitemap.xml` local HTTP 200.
- `assets/favicon.svg` local HTTP 200.
- Product image asset local HTTP 200.
- Portal CTA: `https://portal.bafurni.com`.
- Hotline CTA: `tel:0929878666`.
- Internal anchors checked; no dead internal links.
- JSON-LD checked; schema valid.
- `vercel.json` checked; JSON valid.
- `render.yaml` checked; no wildcard rewrite masking 404.

## STOP Status

No deploy was executed.

No DNS was changed.

No Search Console verification was performed.

No Google/Facebook/Zalo publishing was performed.
