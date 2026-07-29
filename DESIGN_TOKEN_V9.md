# BAFurniture V9 — Design Tokens

## Font

| Token | Giá trị |
|---|---|
| `--v9-font-display` | Playfair Display, Georgia, Times New Roman, serif |
| `--v9-font-body` | Inter, system UI fallback |

Hai family được self-host bằng WOFF2 variable với subset Latin + Vietnamese. Chỉ Playfair Display được preload vì đây là font tiêu đề ở màn hình đầu; Inter tải theo nhu cầu từ CSS. Cấu hình này loại bỏ phụ thuộc Google Fonts và tránh đổi font muộn trên cold load.

## Color

| Token | Giá trị | Vai trò |
|---|---:|---|
| `--v9-color-canvas` | `#f6f3ed` | Nền chung trung tính ấm |
| `--v9-color-paper` | `#ffffff` | Card, gallery, input |
| `--v9-color-soft` | `#ece8e0` | Announcement và bề mặt phụ |
| `--v9-color-ink` | `#1c211e` | Heading, button chính |
| `--v9-color-muted` | `#646963` | Body phụ, caption |
| `--v9-color-accent` | `#9b7447` | Kicker, focus, nhấn |
| `--v9-color-accent-dark` | `#74512f` | Hover CTA |
| `--v9-color-line` | `#d8d2c8` | Border |
| `--v9-color-inverse` | `#fdfcf9` | Chữ trên nền tối |

Không dùng gradient.

## Spacing

| Token | px |
|---|---:|
| `--v9-space-1` | 8 |
| `--v9-space-2` | 16 |
| `--v9-space-3` | 24 |
| `--v9-space-4` | 32 |
| `--v9-space-5` | 40 |
| `--v9-space-6` | 48 |
| `--v9-space-8` | 64 |
| `--v9-space-10` | 80 |
| `--v9-space-12` | 96 |

## Radius, shadow, motion

| Token | Giá trị |
|---|---|
| `--v9-radius-sm` | 8 px |
| `--v9-radius-md` | 16 px |
| `--v9-radius-lg` | 24 px |
| `--v9-shadow-card` | `0 14px 40px rgba(28,33,30,.07)` |
| `--v9-shadow-hover` | `0 22px 54px rgba(28,33,30,.12)` |
| `--v9-shadow-image` | `0 24px 70px rgba(28,33,30,.10)` |
| `--v9-transition` | 200 ms premium easing |
