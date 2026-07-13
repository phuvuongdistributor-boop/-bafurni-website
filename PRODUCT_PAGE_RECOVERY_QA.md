# Product Page Recovery QA

Date: 2026-07-13
Production: https://bafurni.com

## QA Matrix

Tested by browser automation on public production.

Required checks per product URL:

- HTTP 200
- Title matches product name
- H1 matches product name
- Code matches URL product code
- Category rendered from ProductDB/category inference
- Main image is ProductDB `Image_URL` or transparent placeholder
- No category composite image as product hero
- No generic BA-GVP-01 fallback
- No console error
- No broken image
- No horizontal overflow

## Product URLs Tested

### Chairs

- TQ05: PASS desktop + mobile
- TQ01: PASS
- TQ07: PASS
- TQ08: PASS
- TQ09: PASS
- TQ11: PASS

### Desks

- DT1890V2: PASS
- DT2010V2: PASS
- DT1890VM2: PASS
- DT2010VM2: PASS
- DT1890V4: PASS

### Cabinets / Locker / Storage

- TU09K3GD: PASS
- TU981-3KD: PASS
- TU982-3KD: PASS
- TU07: PASS
- TU08: PASS

### Other Groups

- CT2412V1: PASS
- CT2412VM1: PASS
- CT4016V19: PASS
- SF01: PASS
- SF01-1: PASS

### Unknown Route

- `/san-pham/not-real-product-code`: PASS not-found state, no generic fallback.

## Aggregate Result

- Product browser checks: 22
- Correct binding: 22
- Incorrect binding: 0
- Real ProductDB image loaded: 22
- Product fallback image used: 0
- Not-found placeholder: 1
- Console errors: 0
- Broken images: 0
- Horizontal overflow after fix: 0

## Screenshots

- `C:\Users\Admin\AppData\Local\Temp\bafurni-v41-final-TQ05-desktop.png`
- `C:\Users\Admin\AppData\Local\Temp\bafurni-v41-final-TQ05-mobile.png`
- `C:\Users\Admin\AppData\Local\Temp\bafurni-v41-final-NotFound.png`

QA status: PASS.
