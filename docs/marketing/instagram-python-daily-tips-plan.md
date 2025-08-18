# Instagram Playbook: Python Daily Tips for zumenzu.com

This guide defines brand, templates, prompts, and a repeatable workflow to produce Instagram content for English Python Daily Tips.

Repository locations (proposed):

- [docs/marketing/instagram-python-daily-tips-plan.md](docs/marketing/instagram-python-daily-tips-plan.md)
- [content/instagram/overlays/](content/instagram/overlays/)
- [content/instagram/backgrounds/](content/instagram/backgrounds/)
- [content/instagram/carbon-exports/](content/instagram/carbon-exports/)
- [content/instagram/posts/](content/instagram/posts/)

Brand system

- Colors:
  - Primary: #6E4AFF (indigo-purple)
  - Accent: #FF3CAC (pink)
  - Gradient: #0EA5E9 (blue) → #7C3AED (purple) → #EC4899 (pink)
  - Dark BG: #0B1020
- Typography:
  - Headlines: Inter or Poppins (Bold)
  - Code (Carbon): JetBrains Mono or Fira Code
- Logo: small white “zumenzu.com” lockup bottom-right with 70% opacity.

Profile setup

- Handle: @zumenzu_python (or similar)
- Name: Zumenzu • Python Daily Tips
- Bio: Short value + CTA: “Daily Python techniques. Learn smarter, 1 tip/day. More on zumenzu.com”
- Link in bio: https://zumenzu.com with UTM (e.g., utm_source=instagram&utm_campaign=python_tips)
- Highlights: Getting Started, Tips, Reels, Tutorials.

Profile image generation prompt (Imagen or similar)

- Square 1024×1024
- Prompt:
  1. “Minimal vector logo for a Python tips brand named ZUMENZU. Abstract letter Z fused with a subtle python-snake silhouette, gradient mesh background in indigo #6E4AFF to pink #FF3CAC with soft glow. Flat, crisp, high contrast, centered, no text, no watermark.”
- Negative prompt: “photo, 3d render, photographic skin tones, text, watermark, UI, frame, noisy background.”
- Style notes: flat iconography, simple geometry, 5–10% glow.

Post templates (choose 1–3 variants)
Variant A — Bold Gradient

- Background: gradient mesh with subtle grid.
- Overlay: rounded glass frame with header bar “Python Daily Tip”.
- Colors: gradient from brand palette; glass blur with 20–30% white.
- Imagen prompt for background (1080×1080 or 2048×2048 then downscale):
  “Futuristic minimal gradient mesh background with indigo #6E4AFF, blue #0EA5E9, and pink #FF3CAC, subtle diagonal grid at 8% opacity, soft glow, empty central safe area for code insert. No text, no watermark, no logos, no borders.”
- Negative prompt: “text, words, numbers, watermark, UI elements, borders, frame, code.”

Variant B — Dark Glassmorphism

- Background: near-black #0B1020 with blue/purple light bokeh.
- Overlay: glass rectangle (radius 24) centered, thin 1px border #7C3AED at 40%.
- Imagen prompt:
  “Dark tech background, near-black navy #0B1020 with soft purple/blue bokeh, subtle vignette. Clean, modern, no text. Central area left empty.”

Variant C — Minimal Light

- Background: off-white #F6F7FB with faint 45° stripes at 6% opacity.
- Accent line top: gradient #0EA5E9→#7C3AED→#EC4899 height 8px.
- Imagen prompt:
  “Minimal light background off-white #F6F7FB, faint 45-degree micro-stripes 6% opacity, clean, editorial, no text, no watermark.”

Carbon.now.sh setup

- Theme: Nord, Dracula, or One Dark (consistent).
- Font: JetBrains Mono, size 16–18.
- Window controls: Off.
- Line numbers: Off.
- Padding: Medium.
- Background: Transparent.
- Export: PNG 2x, width ~1024–1400, transparent.
- Process:
  1. Paste the tip snippet.
  2. Set theme & font as above.
  3. Export PNG with transparency.
  4. Place on overlay in design tool (Figma/Canva) centered with 48px safe margins.

Caption framework (Hook → Value → CTA)

- Hook: 1 sentence that names the outcome.
- Value: 2–3 bullets with specifics.
- CTA: “Save & Follow for more. Full guides at zumenzu.com.”
- Example:
  “Stop iterating the hard way. Use Python’s built-ins to write cleaner loops. Save for later 🔖 and follow @zumenzu_python.”

Hashtags (rotate sets)

- Set A: #Python #PythonTips #Coding #LearnPython #CodeNewbie #Programming #SoftwareEngineering #Dev #Code #100DaysOfCode
- Set B: #PythonDeveloper #CodingTips #Tech #DataScience #AI #MachineLearning #WebDev #Engineer #PyCon #CleanCode
- Set C: #Programmer #WomenWhoCode #Developers #CodeDaily #Automation #Scripting #OpenSource #Backend #Tutorial

Posting cadence

- 1 post daily at high-engagement time for TR/EU (e.g., 09:00–10:00 or 18:00–20:00 TRT).
- 2–3 carousels per week (deep dives).
- 2 reels per week (15–30s screen capture of tip output).
- Stories: publish the new tip to Stories with poll (“Want a tutorial?”).

Production pipeline

- Plan in [docs/marketing/instagram-python-daily-tips-plan.md](docs/marketing/instagram-python-daily-tips-plan.md).
- For each tip:
  1. Draft text in Notion/Sheet.
  2. Generate background (Imagen) → save to [content/instagram/backgrounds/](content/instagram/backgrounds/).
  3. Export snippet (Carbon) → save to [content/instagram/carbon-exports/](content/instagram/carbon-exports/).
  4. Compose in Figma/Canva using overlays from [content/instagram/overlays/](content/instagram/overlays/).
  5. Export final 1080×1080 PNG to [content/instagram/posts/](content/instagram/posts/).
  6. Write caption + hashtags; add alt text.
  7. Schedule in Buffer/Meta Studio.

Definition of Done checklist

- Background on-brand and clean (no unintended text).
- Code image readable at mobile scale.
- Caption ≤ 2,000 chars; first sentence is the hook.
- Hashtags: 8–12 from rotating set.
- Alt text added (describe the code and outcome).
- File named YYYYMMDD_tip-keywords_en.png.

Alt text template

- “Python tip showing [topic] code snippet displayed on a gradient background with brand colors indigo, blue, and pink.”

Automation ideas (optional, no code here)

- Use Buffer or Meta Business Suite for scheduling.
- Maintain a Google Sheet with columns: Date, Tip Title, Background File, Carbon File, Post File, Caption, Hashtag Set, Status.
- Consider lightweight scripts later to auto-capture Carbon with a headless browser if needed.

Imagen prompt library (copy-paste)

- Background 01:
  “Futuristic minimal gradient mesh, indigo #6E4AFF, blue #0EA5E9, pink #FF3CAC, very subtle diagonal grid 8% opacity, soft glow, center left empty. No text, no watermark, no UI.”
- Background 02:
  “Dark tech bokeh on near-black #0B1020, purple/blue soft lights, clean negative space center, modern, no text, no watermark.”
- Background 03:
  “Minimal off-white #F6F7FB with faint 45° micro-stripes 6% opacity, editorial aesthetic, no text, no watermark.”
- Negative prompt for all:
  “text, letters, words, logo, watermark, screenshot UI, borders, frames, noisy artifacts.”

Overlay guidance

- Keep overlay as PNG with transparent window where Carbon image sits.
- Create 3 overlay files:
  - [content/instagram/overlays/variant-a.png](content/instagram/overlays/variant-a.png)
  - [content/instagram/overlays/variant-b.png](content/instagram/overlays/variant-b.png)
  - [content/instagram/overlays/variant-c.png](content/instagram/overlays/variant-c.png)
- Each overlay includes header “Python Daily Tip” + small logo bottom-right.

Caption templates

- Template A:
  “Quick tip: {benefit}.

  Why it helps:
  • {point1}
  • {point2}

  Save for later 🔖 and follow @zumenzu_python for daily tips.”

- Template B:
  “Today’s Python micro-tip: {one-liner}. More in bio.”
- Template C:
  “Struggling with {problem}? Try this approach. Save & share.”

30-day content calendar (topics)

- Day 1: Loop techniques (index/value).
- Day 2: String formatting basics.
- Day 3: Data structure selection cheat notes.
- Day 4: Handling missing keys gracefully.
- Day 5: File reading shortcuts.
- Day 6: Sorting strategies.
- Day 7: Basic error handling patterns.
- Day 8: Date/time formatting essentials.
- Day 9: Quick tests for small scripts.
- Day10: Working with paths.
- Day11: Environment configs and secrets basics.
- Day12: Simple performance checks.
- Day13: Readable conditions.
- Day14: Working with CSVs quickly.
- Day15: Simple JSON handling.
- Day16: Reusable utility function ideas.
- Day17: Clean imports and structure tips.
- Day18: Quick refactor ideas.
- Day19: Command-line flags basics.
- Day20: Logging essentials.
- Day21: Virtual environments hygiene.
- Day22: Packaging quickstart.
- Day23: Working with APIs basics.
- Day24: HTTP requests essentials.
- Day25: Caching small results.
- Day26: Basic data validation.
- Day27: Simple testing habits.
- Day28: Docstrings essentials.
- Day29: Typing hints essentials.
- Day30: Project structure checklist.

Export specs

- Size: 1080×1080 px
- Format: PNG (sRGB) or JPG
- Under 8 MB
- Margin: keep 48 px safe area

Growth experiments

- 1-in-7 posts as carousel: problem → code → result → takeaway.
- Monthly giveaway: followers submit tip ideas; best one featured.
- Cross-post to LinkedIn/Twitter with square image + thread.

Attribution

- Backgrounds created with Imagen (AI).
- Code snippets rendered via carbon.now.sh.
- Brand: zumenzu.com.

---

## Appendix A — Site link on image (zumenzu.com)

Why we originally said “No text”

- When generating the background with an image model, asking for “no text” prevents random or distorted glyphs and keeps the background clean. We then add a crisp, accessible footer with “zumenzu.com” in the overlay (Figma/Canva), ensuring sharpness, brand consistency, and legibility on mobile.
- However, if you prefer the site link baked into the generated image, use the “Footer-included prompt” variants below. Both methods are supported.

Recommended method (overlay-based, crisp text)

- Add “zumenzu.com” as overlay text, not inside the AI image:
  - Position: bottom-right, inside a 48 px safe margin
  - Font: Inter Medium (or Poppins Medium)
  - Size: 24–28 px (1080×1080), letter-spacing 0.2 px
  - Color: #FFFFFF at 70% opacity
  - Optional subtle glow: 8–12% white outer glow or 1 px stroke at 20% opacity
  - Do not compress or rasterize twice; export once at the end

Figma/Canva style preset (create once)

- Text style name: Footer / zumenzu.com
- Font: Inter Medium 26 px, 0.2 px letter-spacing
- Color: #FFFFFF @ 70% opacity
- Align: right/bottom
- Placement: 48 px from right and bottom edges
- Include this in all three overlay variants

Alternative method (bake site link into the generated background)

- Use these “Footer-included” prompts (remove “no text” from prompt and from the negative prompt). Results vary per model; overlay method remains the most reliable.

Footer-included prompt variants

1. Variant A — Bold Gradient (footer-included prompt)

- Prompt:
  “Futuristic minimal gradient mesh background with indigo #6E4AFF, blue #0EA5E9, and pink #FF3CAC, subtle diagonal grid at 8% opacity, soft glow. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, white at 70% opacity, no other text, no watermark, no logos, no borders.”
- Negative prompt (adjusted):
  “watermark, UI elements, borders, frame, noisy artifacts”
- Resolution: 1080×1080 (or 2048×2048 and downscale for sharpness)

2. Variant B — Dark Glassmorphism (footer-included prompt)

- Prompt:
  “Dark tech background, near-black navy #0B1020 with soft purple/blue bokeh, subtle vignette. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, white at 70% opacity, no other text, no watermark, no logos, no borders. Central area left empty for code.”
- Negative prompt:
  “watermark, UI elements, borders, frame, noisy artifacts”
- Resolution: 1080×1080 (or 2048×2048 then downscale)

3. Variant C — Minimal Light (footer-included prompt)

- Prompt:
  “Minimal light background off-white #F6F7FB with faint 45-degree micro-stripes 6% opacity, editorial aesthetic. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, #0B1020 at 70% opacity, no other text, no watermark, no logos, no borders.”
- Negative prompt:
  “watermark, UI elements, borders, frame, noisy artifacts”
- Resolution: 1080×1080 (or 2048×2048 then downscale)

Imagen prompt library additions

- Background 01 (with footer):
  “Futuristic minimal gradient mesh, indigo #6E4AFF, blue #0EA5E9, pink #FF3CAC, very subtle diagonal grid 8% opacity, soft glow. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, white at 70% opacity, no other text, no watermark, no logos, no borders.”
- Background 02 (with footer):
  “Dark tech bokeh on near-black #0B1020, purple/blue soft lights, clean negative space center, modern. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, white at 70% opacity, no other text, no watermark, no logos, no borders.”
- Background 03 (with footer):
  “Minimal off-white #F6F7FB with faint 45° micro-stripes 6% opacity, editorial aesthetic. Include a small bottom-right footer text 'zumenzu.com' in clean sans-serif, #0B1020 at 70% opacity, no other text, no watermark, no logos, no borders.”
- Adjusted negative prompt for “with footer”:
  “watermark, UI elements, borders, frame, noisy artifacts”

Production note

- If the model fails to render the footer text cleanly (misspellings, artifacts), switch to the overlay method (recommended). It is faster, consistent, and brand-perfect across posts.

Accessibility and moderation

- Keep the footer legible but not intrusive (70% opacity).
- Ensure caption also includes a clear CTA: “More on zumenzu.com” (for link-in-bio behavior).
- Alt text: “Python tip with code snippet and brand footer zumenzu.com in the bottom-right.”
