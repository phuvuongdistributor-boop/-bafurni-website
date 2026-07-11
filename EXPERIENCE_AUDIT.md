# Experience Audit

Date: 2026-07-11
Scope: BAFurniture Website V3 public experience on bafurni.com

## Findings Before V3 Layer

- Header existed but needed stronger product discovery behavior and conversion hierarchy.
- Category module existed with routes and ProductDB-safe shell, but visual consistency depended on mixed icon/image assets.
- Product pages and category pages were public and route-safe.
- Some external product images and legacy category SVG placeholders could fail publicly.
- Portal link and ProductDB data bundle existed and were preserved.

## Risks Identified

- External image dependency could create broken images.
- Replacing core HTML directly would increase rollback risk.
- ProductDB and Portal must remain untouched.

## Decision

Implement V3 as a progressive overlay using:
- v3-experience.css
- v3-experience.js
- v3-experience-fix.css
- v3-experience-fix.js
- v3-image-hardening.js

This keeps existing routing and ProductDB modules intact while improving public UX.
