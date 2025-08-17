# Veo 3 Prompts — Code Arena + Quiz (8s Global, Anime Ninja Theme)

Context: Aligns with activity taxonomy in [ActivityRenderer.tsx](src/components/learn/ActivityRenderer.tsx:509) and UI labels in [code-arena page.tsx](src/app/code-arena/page.tsx:305).

Activity chips to flash (exact labels to match product): Drag & Drop • Memory Game • Quiz • Fill Blanks • Code Lab • Algorithm Viz • Matching • Code Builder • Class Builder • Interactive Demo • Data Explorer

General constraints

- Duration: max 8 seconds
- English VO and on-screen text
- Readability first: 2-second holds for primary text, big high-contrast fonts
- Show Quiz focus while nodding to all 11 types quickly
- Avoid dense code; use abstract glyphs and clean MCQ UI
- Keep CTA inside 9:16 safe-area for vertical reuse
- Music: energetic, SFX subtle; no copyright cues

How to use

- Paste any one variant into Veo 3 as the full prompt.
- Render 16:9 master; then crop 9:16.
- If your run time exceeds 8s, trim CTA hold to 1s and compress montage timing.

Variant A — Shonen Academy (balanced, inspirational)

- Duration: 8s
- Style: bright anime dojo, neon sakura highlights, cel-shaded, parallax camera
- VO (English, neutral global): 'Welcome to Code Arena. Start with Quiz. Instant feedback. Earn XP. Begin now.'
- On-screen text sequence
  - 0.0–1.5s: 'Code Arena'
  - 1.5–4.5s: 'Quiz — Instant feedback'
  - 4.5–6.5s: 'XP • Diamonds • Badges'
  - 6.5–8.0s: 'Start Quiz'
- Visual beats
  - 0.0–1.5s Hook: Close-up eyes ignite; arena title forms from particles
  - 1.5–4.5s Quiz: MCQ appears, correct answer glow, brief explanation card
  - 4.5–6.5s Rewards: XP +120, Diamonds +10, badge pops, streak +1
  - 6.5–8.0s CTA: Portal opens; button pulses
- Quick montage flash (under 0.8s total): show chips: Drag & Drop, Memory Game, Fill Blanks, Code Lab, Algorithm Viz, Matching, Code Builder, Class Builder, Interactive Demo, Data Explorer
- Tech notes: limit total on-screen words; keep text within safe regions; subtle glitch/ink-smoke wipes

Variant B — Cyber‑Ninja Futurism (sleek, neon, techno)

- Duration: 8s
- Style: dark grid dojo, cyan-magenta neon, holographic UI; quick whip pans
- VO: 'Code Arena online. Quiz first. Learn fast. Level up. Enter.'
- On-screen text
  - 0.0–1.2s: 'Initialize: Code Arena'
  - 1.2–3.8s: 'Quiz — Adaptive difficulty'
  - 3.8–6.2s: 'XP • Diamonds • Streak'
  - 6.2–8.0s: 'Enter Quiz'
- Visual beats
  - Hook: HUD boot sequence; sensei silhouette nod
  - Quiz: Timer ring; selection ripple; correct chime
  - Rewards: counters tick
  - CTA: neon portal, glossy button
- Montage flash: sequence of 11 activity chips sweeping in a 0.6s arc
- Music/SFX: glitch-lite transitions; low taiko hit on CTA

Variant C — Classic Shinobi (ink brush, elegant, minimal VO)

- Duration: 8s
- Style: sumi-e ink strokes morphing into UI panels; warm parchment tones
- VO (whisper): 'Begin with Quiz. Precision. Progress.'
- On-screen text
  - 0.0–1.6s: 'Code Arena'
  - 1.6–4.0s: 'Quiz — Clear explanations'
  - 4.0–6.6s: 'XP • Badges • Streak'
  - 6.6–8.0s: 'Start now'
- Visual beats
  - Brush stroke reveals arena; kanji-like code glyphs
  - MCQ appears as ink tiles; correct mark appears as red hanko stamp
  - Rewards float like paper charms
  - CTA is a red seal that pulses
- Montage: chips appear as stamped seals; total under 0.6s
- Audio: shakuhachi motif over subtle percussion; clean UI chime

Variant D — Arcade Speedrun (fast, punchy, no VO)

- Duration: 8s
- Style: arcade HUD, bold colors, high-energy motion
- On-screen text (large, 2–3 words max each)
  - 0.0–1.2s: 'Code Arena'
  - 1.2–3.0s: 'Quiz Mode'
  - 3.0–5.2s: 'Instant Feedback'
  - 5.2–6.6s: 'XP + Diamonds'
  - 6.6–8.0s: 'Start Quiz'
- Visual beats
  - Flash logo; quick parallax of arena
  - Single MCQ snap; correct checkmark slam
  - Reward counters animate with confetti
  - CTA pops with elastic scale
- Montage: micro grid of all 11 activity icons for 0.4s
- Music/SFX: chiptune + clap; hits aligned to text switches

Variant E — Mentor Challenge (character-led, authoritative)

- Duration: 8s
- Style: focus on Sensei close-up, confident gestures
- VO (Sensei): 'Welcome, trainee. Begin with Quiz. Show me your focus.'
- On-screen text
  - 0.0–1.4s: 'Code Arena'
  - 1.4–4.2s: 'Quiz — Timed challenges'
  - 4.2–6.6s: 'XP • Badges • Streak'
  - 6.6–8.0s: 'Begin'
- Visual beats
  - Eye close-up; hand gesture summons quiz panel
  - Correct answer glow, explanation flashes briefly
  - Rewards and streak; portal forms in palm
  - CTA inside the portal
- Montage: Sensei sweeps hand to reveal all activity chips in a curved arc
- Sound: cinematic hits + soft bell on correct

Activity chips copy (pasteable)

- Drag & Drop • Memory Game • Quiz • Fill Blanks • Code Lab • Algorithm Viz • Matching • Code Builder • Class Builder • Interactive Demo • Data Explorer

CTA text options (choose one)

- Start Quiz
- Begin the Quiz
- Enter Quiz
- Test your skills

Timing budget example (fits 8s)

- Hook: ~1.2s
- Quiz demo: ~2.6s
- Rewards: ~2.2s
- Montage flash: ~0.6s
- CTA: ~1.4s

Safe-area and export

- Keep all critical text within 9:16 inner safe area (approx 880×1560 inside 1080×1920)
- Master at 1920×1080 (25–30 fps); verify legibility in 9:16 crop
- Use solid or blurred plates behind small captions for contrast

Licensing note

- Use original music or licensed library cues; create original shinobi-inspired characters (avoid existing anime IP).
