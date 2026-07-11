# BLOCKER REPORT - BAFurniture Website V3

## Status

BLOCKED - The V3 autonomous experience rebuild cannot safely proceed to implementation/deploy verification because the production target `https://bafurni.com` is not currently serving the Vercel production deployment.

## Blocking Condition

The apex production domain `bafurni.com` returns a self-redirect loop before the website HTML is served.

Observed behavior:

- `https://bafurni.com/` returns `308 Permanent Redirect` to `https://bafurni.com/`.
- `https://bafurni.com/category.html` returns `308 Permanent Redirect` to `https://bafurni.com/category.html`.
- Browser QA fails with `ERR_TOO_MANY_REDIRECTS`.
- Default Vercel deployment URL `https://bafurni-website.vercel.app/` returns `200 OK`.

## DNS Evidence

Current DNS for apex `bafurni.com` resolves to non-Vercel IP addresses:

- `103.216.118.10`
- `103.166.183.10`
- `103.56.163.10`

`www.bafurni.com` resolves via CNAME:

- `85fff51167b1580a.vercel-dns-017.com`

When the same apex host is forced to resolve to Vercel IPs, it serves correctly:

- `curl --resolve bafurni.com:443:76.76.21.21 https://bafurni.com/` returns `200 OK`.
- `curl --resolve bafurni.com:443:216.198.79.1 https://bafurni.com/` returns `200 OK`.

This confirms the current production code/deployment can serve the site, but the public apex DNS/custom-domain path is misconfigured.

## Repo / Deployment State

- Repository: `phuvuongdistributor-boop/-bafurni-website`
- Branch: `main`
- Current main at time of blocker report: rollback state after Sprint 31 deploy test
- Last safe content tree: Sprint 30 site tree
- Vercel default domain: working
- Production apex domain: blocked by DNS/custom-domain redirect loop

## Safety Actions Already Taken

- Sprint 31 overlay deploy attempt was rolled back after public redirect loop was detected.
- Rollback commit: `ca561aec6945f58f23d07ee56109531769151395`
- No force push was used.
- ProductDB was not modified.
- Portal was not modified.
- No fake backend, fake Zalo URL, or DNS change was attempted.

## Required Fix Outside Code

Update DNS / Vercel domain configuration for `bafurni.com` so the apex domain points to Vercel correctly.

Recommended checks:

1. In the DNS provider, remove the current apex A records pointing to `103.*` hosting IPs unless they are intentionally required.
2. Configure apex `bafurni.com` according to Vercel domain instructions, typically Vercel apex A record `76.76.21.21` or the exact records shown in the project dashboard.
3. Keep or verify `www.bafurni.com` CNAME according to Vercel.
4. In Vercel project domain settings, confirm primary domain and redirect direction do not create apex-to-apex loops.
5. Re-test:
   - `curl -I --max-redirs 0 https://bafurni.com/` should return `200 OK`, not `308` to itself.
   - `https://bafurni.com/` should load in browser without `ERR_TOO_MANY_REDIRECTS`.

## Stop Reason

The V3 program requires production verification on `https://bafurni.com`. Continuing a full rebuild while the production apex domain cannot be verified would violate the safety rule: do not report live or proceed through deployment when public production cannot be verified.
