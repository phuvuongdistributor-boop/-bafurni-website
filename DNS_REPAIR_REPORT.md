# DNS Repair Report

Date: 2026-07-11
Domain: bafurni.com
Vercel project: bafurni-website

## Root Cause

The apex origin A record was already configured to Vercel IP 216.198.79.1 in iNET DNS, but iNET OneShield protection was enabled on the apex record. That proxy layer returned old public apex IPs and caused the custom domain to miss the expected Vercel behavior.

## Vercel Requirement Observed

Vercel dashboard showed:
- bafurni.com: valid production domain
- www.bafurni.com: valid, redirects with 308 to bafurni.com
- Apex should point to Vercel production configuration
- Default domain https://bafurni-website.vercel.app remained valid

## Change Applied

- Changed only the apex @ A record protection mode from protected to DNS-only.
- Kept apex @ A value as 216.198.79.1.
- Did not remove portal.bafurni.com.
- Did not remove MX/TXT/SPF/DKIM/DMARC/Google verification records.
- Did not change nameservers, billing, ownership, Vercel project, or portal config.

## DNS After Repair

Resolvers checked:
- system resolver
- 1.1.1.1
- 8.8.8.8
- sapa.vclouddns.com
- laocai.vclouddns.com

Apex A after repair:
- 216.198.79.1

Apex AAAA after repair:
- no AAAA answer observed

Portal after repair:
- portal.bafurni.com CNAME productdb-v2-portal.onrender.com
- portal HTTP status: 200

## HTTP Verification

- https://bafurni.com/ returned 200 OK with Vercel server headers.
- curl -I --max-redirs 0 https://bafurni.com/ did not redirect to itself.
- https://bafurni-website.vercel.app/ returned 200 OK.
- https://portal.bafurni.com/ returned 200 OK.

DNS repair status: PASS.
