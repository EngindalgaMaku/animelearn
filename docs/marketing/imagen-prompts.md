# Imagen 3.0 Prompt Pack — Zumenzu Product Visuals (EN)

High-quality Google Imagen 3.0 prompts for static visuals that showcase Zumenzu as an interactive Python learning platform: Code Arena, 11 activity types, daily quests and streaks, XP/badges, diamonds, card packs, progress dashboard, and the VS Code-like Python Tip widget. Copy-paste ready.

See also: Element-themed interior concepts in [docs/AI_GALLERY_VISUALIZATION_PROMPTS.md](../AI_GALLERY_VISUALIZATION_PROMPTS.md)

Brand and style constraints

- Visual tone: Modern tech-education, clean dark UI, premium product shots
- Brand accents: Electric cyan #00E5FF and violet #7C4DFF (use as subtle edge glows and UI highlights)
- UI motifs: Code editor panel, green test checks, terminal feed lines, activity tiles (quiz/memory/drag-drop/fill blanks), quest cards, streak counter, XP/badge row, diamonds, line charts, VS Code-like tip card
- Typography in images: Prefer NO embedded text; leave negative space for overlays; if text appears, keep it minimal, crisp, and generic
- Safety/IP: Do not show real brands/logos; no copyrighted characters; no Stripe/Shopier marks; UI must be generic/original

Global negative prompt

No copyrighted IP or logos, no brand names, no photographic human faces, no gore/violence, no seizure strobe, avoid heavy lens flare and harsh bloom, avoid unreadable micro-text, avoid oversaturated neon, no payment branding, no moire/banding, no jittered edges.

Universal Imagen 3.0 settings

- Model: imagen-3.0-generate-001
- Aspect ratios: 21:9 (web hero), 16:9 (YouTube/site banners), 1:1 (social), 9:16 (mobile store/screencap)
- Quality: High/Ultra-high
- Output count: 4 variations; pick best, then iterate
- Seed: Optional — freeze best seed for consistency
- Style: Photorealistic UI/3D hybrid render, sharp edges, gentle DOF, cinematic lighting, subtle particles

— — —

1. Homepage Hero — Learning-first (21:9, textless)

Filename: hero_homepage_21x9_textless.jpg

Prompt:
Modern learning platform hero image, dark premium UI with electric cyan #00E5FF and violet #7C4DFF accents, wide 21:9 composition. Foreground: crisp product UI composite showing a code editor panel (Python snippet) with green test check icons in a pass list, a clean terminal feed, and a compact activity row (quiz card, memory grid, drag-and-drop, fill blanks). Secondary elements: daily quest card ticking complete, streak counter with a subtle flame motif, a slim XP/badge ribbon, a small diamonds count, and a tasteful card pack reward thumbnail (no explosion). Background: soft parallax panels and subtle bokeh particles, cinematic rim lighting. Leave generous negative space for headline overlays; do not render brand names; avoid embedded text; keep everything generic and original. Photorealistic UI/3D hybrid, sharp edges, legible iconography, premium product lighting.

Parameters:

- ar: 21:9
- resolution: ultrawide 5K+ (e.g., 5120×2160)
- variations: 4
- negative: Global negative prompt

— — —

2. Homepage Hero — Alt focus on Code Arena (21:9)

Filename: hero_code_arena_21x9.jpg

Prompt:
Premium 21:9 hero focusing on Code Arena. Center a large code editor pane with Python code highlighted, a vertical test results panel showing multiple green check icons, and a compact result banner stating all tests passed (as generic icons/badges, avoid real text). Right side: small cards representing activity types (quiz, memory, drag-drop, fill blanks) with cyan/violet hover glows. Bottom strip: mini progress chart rising and a minimal badge row. Dark UI, subtle cyan/violet edge light, soft depth-of-field, no logos, no embedded text.

Parameters:

- ar: 21:9
- resolution: ultrawide 5K+
- variations: 4
- negative: Global negative prompt

— — —

3. YouTube Banner / Website Feature (16:9)

Filename: banner_feature_16x9.jpg

Prompt:
Clean 16:9 feature banner for an interactive Python platform. Balanced composition: left third shows a code pane with a pass checklist (green checks) and tiny terminal lines; right two-thirds show an activities collage (quiz choice card with highlighted option, memory pair flipping, drag-drop tiles snapping, fill blanks line filling). Accent elements: daily quest card complete tick, streak counter incremented, small diamond icon sparkle. Dark, premium lighting; cyan #00E5FF and violet #7C4DFF accents; no text; leave safe header area for overlays.

Parameters:

- ar: 16:9
- resolution: 3840×2160 (4K)
- variations: 4
- negative: Global negative prompt

— — —

4. Feature Collage — Learning breadth (16:9)

Filename: collage_learning_breadth_16x9.jpg

Prompt:
A sophisticated collage of product features on a dark UI canvas: 4-6 floating panels arranged in depth with soft shadows and parallax — Code Arena (pass checks), Activities grid (quiz/memory/drag-drop/fill blanks), Daily quest card + streak counter, XP/badges ribbon, diamonds + subtle card pack, and a small progress dashboard chart. Maintain visual hierarchy and breathing room; cyan/violet highlights; sharp UI edges; no embedded text; no brand marks.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

5. Mobile Store Screenshot (9:16)

Filename: mobile_store_9x16.jpg

Prompt:
Vertical 9:16 premium mobile mockup, dark UI. Top: Code Arena panel with small pass checks. Middle: carousel of activities (quiz, memory, drag-drop, fill blanks) as separate tiles with soft cyan glow underlines. Lower: daily quest card completed, streak indicator (day counter with subtle flame), XP/badge micro row, and a small diamonds count. Bottom: mini progress chart. Clean device-like bezel implied; no real phone branding; no embedded text; make elements large and legible.

Parameters:

- ar: 9:16
- resolution: 1440×2560+
- variations: 4
- negative: Global negative prompt

— — —

6. Instagram Square — Feature Grid (1:1)

Filename: social_square_feature_grid_1x1.jpg

Prompt:
Square 1:1 dark canvas with a 2×2 or 3×3 grid of crisp feature tiles: Code Arena pass checks; quiz card reveal; memory pair match; drag-drop alignment; fill blanks complete; daily quests & streaks; XP/badges ribbons; diamonds + subtle card pack; progress dashboard mini chart; Python Tip widget (VS Code-like). Secure consistent spacing, cyan/violet accent edges, premium product lighting. No text. Iconography only.

Parameters:

- ar: 1:1
- resolution: 2048×2048+
- variations: 4
- negative: Global negative prompt

— — —

7. Code Arena Close-up (16:9 or 4:3)

Filename: closeup_code_arena.jpg

Prompt:
Macro product shot of the Code Arena: large code editor pane in Python, side panel of test results with multiple green check icons, a slim terminal strip with clean output lines. Subtle cyan cursor glow, violet accent under active tab. Depth-of-field focusing on the code area; edge highlights; no brand text; no real code content, keep syntax-like shapes. Premium, cinematic.

Parameters:

- ar: 16:9 (or 4:3 alternative)
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

8. Learning Activities Grid (16:9)

Filename: activities_grid_16x9.jpg

Prompt:
Grid of 4 large activity tiles with depth and glow: a multiple-choice quiz card with a highlighted option tile; a memory game pair flipping animation frame; a drag-and-drop puzzle with ghost outlines; a fill-the-blank line snapping complete. Add two small accessory tiles: algorithm visualization mini-graph and class builder schematic icons. Dark UI; cyan/violet glows; no text; crisp shapes; premium lighting.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

9. Daily Quests & Streaks (16:9)

Filename: quests_streaks_16x9.jpg

Prompt:
Hero shot for daily systems: a quest card with a big completion tick, a streak counter with a tasteful flame icon incrementing, a compact calendar strip with today highlighted, and a small “daily mini-quiz” badge icon. Background: soft parallax cards; cyan #00E5FF glows; violet accents; no text; no brand logos. Keep elements bold and legible.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

10. XP, Badges & Diamonds (16:9)

Filename: rewards_xp_badges_diamonds_16x9.jpg

Prompt:
Premium shot of the reward layer: a rising XP progress bar, two or three elegant badge medallions with subtle metallic sheen, a neat row of diamonds with a soft cyan sparkle, and a very small card pack thumbnail (reward moment) with tasteful glow (no explosion). Keep it sophisticated; avoid clutter; dark UI with cyan/violet accents; no logos; no text.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

11. Card Pack Reward — Tasteful (16:9)

Filename: reward_card_pack_16x9.jpg

Prompt:
A single premium card pack reward moment on dark background: elegant pack with matte black and faint cyan/violet edge glow, a minimal burst of particles, and a shadowed background. Keep the effect restrained, modern, and educational-product appropriate. No brand marks; no character IP; no loud explosions; no text.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

12. Progress Dashboard Analytics (16:9)

Filename: dashboard_progress_16x9.jpg

Prompt:
Analytics overview panel for learning progress: simple line chart trending upward, small donut chart segments by category (Python Fundamentals, Data Structures, Algorithms, Functions & OOP as generic colored slices), recent activity cards, and a neat streak indicator. Dark UI; cyan/violet accents; clean; legible without micro-text; no logos; no embedded text.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

13. Daily Python Tip Widget (3:2 or 4:3)

Filename: python_tip_widget.jpg

Prompt:
VS Code-like tip widget card: code block panel with a highlighted Python snippet area, a small tip icon, and simple action buttons (like/complete/share) drawn as generic icons. Keep text as shapes (no real sentences). Subtle cyan highlight line and violet shadow glow. Minimal, modern, dark UI; crisp edges; premium lighting; no brand marks.

Parameters:

- ar: 4:3 (or 3:2)
- resolution: 3000×2250+
- variations: 4
- negative: Global negative prompt

— — —

14. Device Mockup Hero (16:9)

Filename: device_hero_laptop_phone_16x9.jpg

Prompt:
Elegant device hero: a slim laptop and a modern phone angled on a dark surface with cyan rim light, displaying the product UI composites — laptop shows Code Arena + dashboard; phone shows activities + quests. Keep screens readable as shapes, no embedded text, no device branding. Subtle reflections and bokeh; premium product photography style.

Parameters:

- ar: 16:9
- resolution: 4K
- variations: 4
- negative: Global negative prompt

— — —

Generation checklist

- [ ] Use model imagen-3.0-generate-001
- [ ] Set correct aspect ratio per prompt
- [ ] Generate 4 variations; select best and freeze seed
- [ ] Verify no embedded real text or logos
- [ ] Check brand accent consistency (#00E5FF, #7C4DFF)
- [ ] Ensure feature breadth (learning-first, not only rewards)
- [ ] Export high-res JPG/PNG; keep layer for overlays

Post-processing notes

- Light color grade toward cool cyan/violet palette
- Add minimal grain and vignette for polish if needed (very subtle)
- Keep hero images textless; overlay headline/subhead in the website builder
- For thumbnails, reserve the top-left or top-right corner as a safe text area

Cross-references

- Element-themed gallery interiors (Imagen prompts): [docs/AI_GALLERY_VISUALIZATION_PROMPTS.md](../AI_GALLERY_VISUALIZATION_PROMPTS.md)
- Video prompt pack (Veo 3): [docs/marketing/veo3-prompts.md](./veo3-prompts.md)
