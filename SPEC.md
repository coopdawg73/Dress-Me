# THE EDIT — Build Specification & Claude Code Brief
**A luxury styling game. Style the moment, top the board.**

Version 1.1 · Prepared for a Claude Code build · No reference prototype — building directly from this spec.

---

## 0. How to use this document

This is a complete build brief. It contains everything needed to build the game from scratch: the concept, the exact gameplay, the full scoring math, all game content (garments and briefs), the visual/art direction, the UI layout, and the leaderboard/backend plan.

**Note on provenance:** an earlier draft of this spec assumed a working single-file HTML prototype (`the-edit.html`) existed as a mechanics/feel reference. No such prototype exists for this build — Sections 5–8 below (scoring engine, content, art direction, SVG rendering, layout) are the sole source of truth. Treat every formula, data table, and layout description here as authoritative and implement it exactly as written.

---

## 1. Concept

**THE EDIT** is a fast, elegant styling game. Each round presents a *client* and an *occasion* ("Céline — Black-Tie Gala — timeless drama"). The player dresses the client from a rack of covetable pieces before a timer runs out. A house advisor ("Camille") grades the look, and a rising streak multiplier rewards consecutive good taste. Scores post to a public leaderboard.

**One-line pitch:** *A client, an occasion, and a ticking clock — read the brief, curate the look, and let the house advisor pass judgment.*

### Why this game / mission tie (loose, aesthetic)

Remark is luxury clienteling for prestige retail — AI advisors that guide high-value shoppers through fit, styling, occasion, and the decision to buy, bringing the human advisor relationship into digital commerce. THE EDIT borrows that world *aesthetically and thematically* without being a training sim:

- The player performs the **advisor's job in miniature** — reading intent, curating an edit, styling for an occasion.
- The **house advisor "Camille"** who critiques each look echoes Remark's guided, human clienteling voice.
- The visual language (editorial, restrained, gold-on-espresso, serif display type) reads *prestige retail*.

It is a marketing toy for **customers and prospects**: shareable, competitive, on-brand, and quick to play. It is **not** a product demo and never claims to be one. Branding is a light "by Remark" footer/attribution (see §13) — the game itself stays unbranded in its core UI.

### Audience & context

- **Primary players:** prospects and customers, at events, on a microsite, or via a shared link. Also fun internally.
- **Session length:** 60–180 seconds per run. Highly repeatable.
- **Device:** desktop-first, must be responsive to mobile/portrait.

---

## 2. Design pillars

1. **Instantly understood.** Everyone knows "dress this person for this event." Zero tutorial needed; the 3-step how-to on the start screen is enough.
2. **Easy to play, hard to master.** A near-optimal answer exists each round (puzzle), but a timer and streak multiplier create arcade pressure and a real skill ceiling worth chasing on a leaderboard.
3. **Fair, legible scoring.** "Better styling" must feel objective and explainable. Every score breaks down into named sub-scores with a one-line human critique. No black boxes.
4. **Editorial luxury.** Every pixel should feel like a fashion house, not a casual game. Restraint, whitespace, serif display type, gold hairlines, deep espresso ground.
5. **Come back tomorrow.** A daily shared brief (same for everyone) plus an endless mode gives both a fair competitive board and an infinite grind.

---

## 3. Game modes

### The Daily Muse (daily challenge)

- **5 fixed briefs**, identical for every player that calendar day (seeded by date).
- Fixed **40s** timer per look.
- Sum of all 5 look scores = final score.
- Posts to a **per-day leaderboard**. Resets daily. This is the "fair fight" board and the primary sharing hook ("beat my score on today's muse").

### The Atelier (endless)

- Random briefs, **3 lives**. A "Faux Pas" grade costs a life; game over at zero.
- Timer **starts at 46s and decreases 2s every 2 rounds, floored at 24s** — difficulty ramps via time pressure.
- Posts to an **all-time endless leaderboard**.

Both modes share the identical core loop, scoring engine, and streak multiplier.

---

## 4. Core gameplay loop

```
Show brief (client + event + mood + dress code + flags)
      ↓
Player fills equipment slots from the rack, watching the figure update live
      ↓
"Present the Look"  (or auto-submit when timer hits 0)
      ↓
Score engine grades → advisor verdict + animated sub-score bars + round score × streak
      ↓
Update total, streak, lives → next round  (or end → leaderboard)
```

### Equipment slots

`dress · top · bottom · outerwear · shoes · bag · jewelry`

**Coverage rule:** a valid look needs **(a dress) OR (a top AND a bottom)**, **plus shoes**. Outerwear, bag, and jewelry are optional and mainly drive coherence and flair. Equipping a dress clears top+bottom and vice versa (mutual exclusivity).

### Streak multiplier

- A look grading **Refined or better (≥75%)** extends the streak; anything below resets it to zero.
- Multiplier applied to the round score = `min(3, 1 + 0.25 × streak)` using the streak *entering* the round (first good look is ×1, next ×1.25, …, capped ×3).

### Lives (endless only)

- Start at 3. A **Faux Pas (<35%)** costs one life. Zero lives → game over.

---

## 5. Scoring engine (the crown jewel)

The look is scored on four quality dimensions plus a tempo bonus. **Max quality subtotal = 900; tempo adds up to 100.**

Let `items` = all equipped item objects. Each item carries: `formality (1–5)`, `arche` (archetype), `color` (→ palette family, warm/cool/neutral, statement flag).

### 5.1 Occasion fit — up to 300

Weighted average formality of the look vs. the brief's target.

```
weights = { dress:2.2, top:1.3, bottom:1.3, shoes:1.3, outerwear:1.2, bag:0.8, jewelry:0.7 }
lookF   = Σ(weight × formality) / Σ(weight)
occasion = 300 × max(0, 1 − |lookF − target| / 2.2)
```

### 5.2 Mood / vibe match — up to 250

How well item archetypes match the brief's target vibes, with partial credit for adjacent archetypes.

```
vibe = 250 × ( Σ matchVal(item.arche, brief.vibes) / items.length )
```

`matchVal(a, vibes)`: `1` if `a` is in `vibes`; else `0.5` if `a` is *adjacent* to any vibe; else `0`.

**Archetype adjacency graph** (symmetric):

```
classic ── minimal, romantic
minimal ── classic, relaxed
romantic ── classic, glam
glam ── romantic, edgy
edgy ── glam, minimal
relaxed ── minimal
```

### 5.3 Coherence — up to 250

Rewards a disciplined palette; penalizes clashes and over-loudness.

```
start 250
non-neutral pieces = items whose color family is NOT neutral
if palette mixes a warm AND a cool non-neutral      → −90
if ≥3 distinct non-neutral families                 → −60   (else if exactly 2 → −20)
if >2 statement pieces                              → −50
if ≤1 non-neutral family AND ≥2 non-neutrals        → +25   (monochrome reward)
clamp to [0, 250]
```

### 5.4 Flair — up to 100

Rewards exactly one *correct* statement piece; punishes both timidity (on formal briefs) and noise.

```
statements = equipped items flagged statement:true
matched    = statements whose archetype matches a brief vibe (matchVal ≥ 1)
if 0 statements   → 42 if (target≥5 or brief.flair) else 58
if 1 statement    → 100 if matched else 70
if 2 statements   → 76 if any matched else 52
if >2 statements  → 30
```

### 5.5 Brief-specific modifiers

```
if brief.requireOuter and no outerwear   → coherence ×0.80
if brief.forbidOuter and outerwear worn  → coherence ×0.82, occasion ×0.90
```

### 5.6 Gates (completeness)

```
subtotal = occasion + coherence + vibe + flair
if no dress and not (top and bottom)     → subtotal ×0.40
if no shoes                              → subtotal ×0.72
```

### 5.7 Tempo & final

```
percent   = round(subtotal / 900 × 100)
tempo     = round(max(0, timeLeft) / maxTime × 100)
roundScore = round( (subtotal + tempo) × streakMultiplier )
```

### 5.8 Grades (by `percent`)

| Percent | Grade | Notes |
|---|---|---|
| ≥ 90 | **Impeccable** | praise line |
| ≥ 75 | **Refined** | extends streak |
| ≥ 55 | **Considered** | |
| ≥ 35 | **Passable** | |
| < 35 | **Faux Pas** | costs a life (endless) |

### 5.9 Advisor critique ("Camille")

A single line, chosen by rule:

1. Missing coverage → "She can't walk out half-dressed…" / missing shoes → "…she'll need shoes to leave the house."
2. `percent ≥ 90` → random praise line.
3. `percent ≥ 75` → warm approval naming the client.
4. Otherwise identify the **weakest** normalized dimension (occasion / coherence / vibe) and speak to it — e.g. overdressed/underdressed for occasion, "the palette is fighting itself" for coherence, "it misses the '{mood}' mood {client} asked for" for vibe.

The critique is what makes the game feel *guided* and on-brand. Keep the voice: confident, warm, concise, a little editorial. Never snarky.

---

## 6. Content

### 6.1 Palette (color families)

Each garment references a color family. Families carry `hex`, `neutral` (bool), `warmCool` ∈ {warm, cool, neutral}. Navy is treated as neutral (forgiving) but leans cool.

| key | hex | neutral | warm/cool |
|---|---|---|---|
| ivory | `#EAE1CF` | yes | neutral |
| cream | `#F3EEE2` | yes | neutral |
| black | `#1D1B18` | yes | neutral |
| charcoal | `#3C3B3C` | yes | neutral |
| grey | `#98979A` | yes | neutral |
| taupe | `#A08E78` | yes | neutral |
| navy | `#2A3450` | yes | cool |
| indigo | `#3B4664` | no | cool |
| camel | `#B98B5E` | no | warm |
| burgundy | `#6E2436` | no | warm |
| emerald | `#1F4C3C` | no | cool |
| blush | `#E4C1BB` | no | warm |
| silver | `#C6CAD0` | no | cool |
| gold | `#C9A24B` | no | warm |

### 6.2 Garment data model

```ts
type Item = {
  slot: 'dress'|'top'|'bottom'|'outerwear'|'shoes'|'bag'|'jewelry';
  id: string;
  name: string;          // display name
  tmpl: string;          // SVG template key (drives the silhouette)
  color: string;         // key into palette
  formality: 1|2|3|4|5;
  arche: 'classic'|'minimal'|'romantic'|'glam'|'edgy'|'relaxed';
  statement: boolean;    // bold hero piece?
};
```

### 6.3 Full item catalogue (starter set — 40 pieces)

**Dresses** (`tmpl` ∈ gown/cocktail/slip/midi): Midnight Gown (gown, black, F5, glam), Ivory Column (gown, ivory, F5, classic), Emerald Slip (slip, emerald, F4, romantic, ★), Rouge Cocktail (cocktail, burgundy, F4, glam), Camel Knit Midi (midi, camel, F2, minimal), Blush Slip Dress (slip, blush, F3, romantic), Navy Midi (midi, navy, F3, classic), Noir Cocktail (cocktail, black, F4, classic).

**Tops** (blouse/knit/blazer/tee/cami): Silk Blouse (ivory, F3, classic), Cashmere Knit (grey, F2, minimal), Tuxedo Blazer (black, F4, edgy), White Tee (cream, F1, relaxed), Silk Cami (burgundy, F3, romantic), Fine Turtleneck (navy, F2, minimal).

**Bottoms** (trousers/wide/jeans/skirt/pencil): Tailored Trousers (black, F4, classic), Wide-Leg Trousers (camel, F3, minimal), Straight Jeans (indigo, F1, relaxed), Pleated Skirt (ivory, F3, romantic), Pencil Skirt (charcoal, F4, classic), Satin Trousers (emerald, F4, glam, ★).

**Outerwear** (coat/trench/jacket/cape): Wool Coat (camel, F3, classic), Leather Trench (black, F3, edgy), Opera Cape (ivory, F4, glam, ★), Tailored Blazer (grey, F3, minimal), Velvet Blazer (burgundy, F4, glam, ★).

**Shoes** (heel/sandal/boot/sneaker/flat): Black Stiletto (black, F4, glam), Nude Pump (blush, F3, classic), Silver Sandal (silver, F4, glam, ★), White Sneaker (cream, F1, relaxed), Ankle Boot (black, F2, edgy), Ballet Flat (ivory, F2, minimal).

**Bags** (clutch/minaudiere/tote/shoulder): Satin Clutch (black, F4, glam), Gold Minaudière (gold, F5, glam, ★), Leather Tote (camel, F2, minimal), Quilted Shoulder (black, F3, classic), Woven Basket (taupe, F1, relaxed).

**Jewellery** (necklace/pearl/collar): Diamond Drops (silver, F4, glam, ★), Gold Chain (gold, F3, classic), Pearl Strand (ivory, F3, romantic), Statement Collar (gold, F4, edgy, ★).

*(★ = statement piece)*

### 6.4 Brief catalogue (12 briefs)

```ts
type Brief = {
  name: string;         // client
  event: string;        // occasion (headline)
  target: 1..5;         // dress code
  vibes: Archetype[];   // 1–2 target moods
  vibeWords: string;    // human mood line shown to player
  hint?: 'warm'|'cool'; // optional palette lean (soft signal)
  flair?: boolean;      // "make a statement"
  requireOuter?: boolean;
  forbidOuter?: boolean;
};
```

| Client | Event | Target | Vibes | Mood words | Flags |
|---|---|---|---|---|---|
| Mara | Gallery Opening | 4 | minimal, edgy | confident, understated | |
| Céline | Black-Tie Gala | 5 | glam, classic | timeless drama | flair |
| Inès | Garden Party | 3 | romantic, relaxed | soft, sunlit | forbidOuter |
| Noor | Boardroom Pitch | 4 | classic, minimal | sharp and polished | |
| Lena | Weekend Brunch | 2 | relaxed, minimal | easy elegance | |
| Vivienne | Opera Premiere | 5 | glam, romantic | opulent, romantic | flair |
| Sofia | Cocktail Reception | 4 | glam, classic | lively but refined | |
| Astrid | Winter City Stroll | 3 | minimal, classic | chic against the cold | requireOuter |
| Juno | Creative Awards | 4 | edgy, glam | bold, directional | flair |
| Amélie | Countryside Wedding | 4 | romantic, classic | graceful, guest-appropriate | |
| Delphine | Fashion Week Front Row | 4 | edgy, minimal | sculptural, considered | flair |
| Rania | Dinner Date | 3 | romantic, minimal | intimate, a little alluring | |

---

## 7. Art direction & rendering

### 7.1 Approach — SVG, no image assets

The entire game is drawn with **inline SVG** — no bitmaps. This keeps it self-contained, crisp at any size, instantly themeable, and trivially deployable. Style is **flat editorial illustration**: clean silhouettes, a subtle dark outline (`rgba(0,0,0,.30)`), and a faint white sheen highlight on large garments.

### 7.2 The figure

A stylized croquis mannequin in a `0 0 240 500` viewBox: head + hair, neck, torso, arms at sides, two legs. Skin `#D8C4AB`, hair `#5A4632`, face `#E7D0B4`. Garments layer over it in this order (back to front):

```
base body → (bottom, then top)  OR  (dress) → shoes → outerwear → bag → jewelry
```

### 7.3 Garment rendering

Each garment is a small function of `(template, colorHex)` returning an SVG `<g>` positioned in figure coordinates. Templates define silhouettes (e.g. `gown` = flared column to floor; `cocktail` = knee length; `slip` = straps + body; `coat` = two open panels + collar; `heel`/`boot`/`sneaker` = a pair at the feet; `necklace`/`collar`/`pearl` at the neckline). Since there is no reference prototype, design each template's SVG path data directly from this description — clean geometric shapes (rects, paths with a few curve points) are sufficient; polish can iterate later.

### 7.4 Rack thumbnails

Thumbnails reuse the same `drawGarment()` output, cropped to a per-slot bounding box via the SVG `viewBox` (e.g. dresses `70 116 100 364`, shoes `80 456 84 42`). No separate icon art needed. `preserveAspectRatio="xMidYMid meet"`.

### 7.5 Design tokens

```css
--bg:#141210; --bg2:#0f0d0b; --panel:#1D1A15; --panel2:#26221B;
--line:#3A342B; --gold:#C9A24B; --gold-soft:#E0C58C;
--text:#EDE6D8; --muted:#9A9081; --bad:#C07A6E; --good:#8FB08A;
--shadow:0 24px 60px rgba(0,0,0,.55);
```

- **Ground:** espresso radial + linear gradient. Boutique-at-night feel; colorful garments pop against it.
- **Type:** headings `Cormorant Garamond` (serif display, 500–700, italic for emphasis); body `Jost` (light sans, wide letter-spacing). Load from Google Fonts.
- **Motifs:** thin gold hairline rules, generous whitespace, uppercase wide-tracked micro-labels, dot indicators for "dress code."
- **Motion:** soft fades/slide-ins between screens, animated score bars (width transition), score count-up, a floating "×N streak" flourish on the stage.

### 7.6 Tone of copy

Editorial, warm, confident, concise. Micro-labels are uppercase tracked-out ("THE BRIEF", "DRESS CODE", "MOOD"). Camille speaks in italic serif. Never gamer-y or shouty.

---

## 8. UI screens & layout

### Masthead (persistent)

`THE EDIT` wordmark (gold "EDIT") + tagline "Dress the Moment." · right side: live HUD (Score, Streak ×, Round/Daily, Lives ◆◆◆ or Look n/5, Exit). Footer (all screens): small, quiet "by Remark" attribution line — not a logo lockup, doesn't compete with the wordmark.

### Start screen

Editorial hero ("Style the *moment*.") → two mode cards (**The Daily Muse**, **The Atelier**) → 3-step how-to → a "best scores" line pulled from the leaderboard.

### Game screen — two-column board

- **Left — The Stage:** spotlighted figure that updates live as pieces are equipped. Footer caption "Styling {client}." Streak flourish overlays here.
- **Right — The Brief + The Closet:**
  - *Brief card:* client, event headline, mood line + flags, dress-code dots, mood chips, and the **timer bar** (turns warm/red under 30%).
  - *Closet:* slot tabs (with a gold dot on filled slots) → responsive tile grid (thumbnail + name + formality dots; equipped tiles show a check; optional slots include a "Leave off" tile) → **Present the Look** button + a coverage hint ("Still needs: shoes").

### Result overlay

Grade headline (color-coded by tier) → **Camille** avatar + italic critique → animated sub-score bars (Occasion / Coherence / Mood / Flair / Tempo) → round score with streak multiplier → "Next Look →" (or "See Results" on the final round).

### Game-over / leaderboard

Final score → mode leaderboard (top 10) → free-text display-name entry if the score qualifies (client-side length cap + a basic profanity-word-list filter; see §9.3), highlighting the new row → "Play Again" / "Home."

All screens must reflow to a single column on narrow/mobile widths (figure on top, brief + closet below).

---

## 9. Leaderboard & persistence

### 9.1 Local fallback

`localStorage` under `theEdit.lb.v1`, keyed `endless` and `daily.<YYYYMMDD>`. Sorted desc, top 25 kept, top 10 shown. Used as an offline fallback if Supabase is unreachable, and during early development before the backend is wired up.

### 9.2 Production backend — Supabase

A `scores` table `(id, board text, name text, score int, created_at)`. Anon public `insert` + `select` via Row-Level Security policies scoped to those two operations and columns only (no update/delete for anon). Abstracted behind two functions so the UI never changes:

```ts
postScore(board, { name, score, ts }): Promise<void>
getScores(board): Promise<Entry[]>   // sorted desc
```

**Boards:** `endless` (all-time) and `daily:<YYYYMMDD>` (per-day; query filters by the date-stamped board key — no TTL needed since old daily boards simply stop being queried by the UI, though they remain in the table for history/debugging).

### 9.3 Anti-cheat & moderation (light, appropriate to a marketing toy)

Client scores are inherently spoofable. Proportionate measures: a server-side **sanity cap** (reject scores above a plausible max per look × rounds — for Daily Muse: 5 × max possible round score; for Atelier: a generous but bounded ceiling), basic **rate limiting** per IP/session on the insert endpoint. Full server-authoritative scoring is overkill here; document the tradeoff.

Since display names are **free text** (per §13 decision), apply a basic profanity/slur word-list filter and a length cap (e.g. 20 chars) both client-side (immediate feedback) and re-validated before the Supabase insert (never trust client validation alone).

### 9.4 Share hook

After a run, offer "Challenge a friend" → copies a link to the Daily Muse with an OG image showing the score. Great for prospect virality.

---

## 10. Tech stack & project structure

- **Vite + React + TypeScript** — component UI, typed game data, fast dev/build.
- **Plain CSS (or CSS modules)** with the design tokens above — no heavy UI kit; the look is bespoke.
- **SVG drawn in React** — `drawGarment()`-style typed render helpers returning JSX/SVG, built directly from §7.3's description.
- **Zustand** for game state.
- **Backend:** Supabase client behind the `postScore/getScores` interface (§9.2).
- **Deploy:** Vercel, standalone deploy (no custom domain yet — see §13).

### Suggested structure

```
the-edit/
  index.html
  src/
    main.tsx
    App.tsx
    game/
      data/items.ts          // Item catalogue (Section 6.3)
      data/briefs.ts         // Brief catalogue (Section 6.4)
      data/palette.ts        // color families (Section 6.1)
      scoring.ts             // computeScore(), matchVal(), grades (Section 5)
      critique.ts            // Camille's verdict logic (Section 5.9)
      state.ts               // Zustand store: mode, round, total, streak, lives, equipped
      rng.ts                 // mulberry32, dateSeed, pickDailyBriefs
    render/
      Figure.tsx             // layered mannequin + garments
      garments.tsx           // drawGarment() typed SVG helpers
      Thumb.tsx              // cropped-viewBox thumbnails
    ui/
      Masthead.tsx  StartScreen.tsx  GameBoard.tsx
      BriefCard.tsx  Closet.tsx  ResultSheet.tsx  Leaderboard.tsx
    leaderboard/
      client.ts              // postScore/getScores (local fallback + Supabase)
    styles/tokens.css  styles/global.css
  SPEC.md                    // this document
```

### Testing

Unit-test `scoring.ts` hard — it's the fairness backbone. Golden cases: a perfect gala look scores Impeccable; a jeans+sneakers gala look scores Faux Pas; warm+cool clash drops coherence ~90; missing shoes applies the ×0.72 gate; daily seed is deterministic across machines for a given date.

---

## 11. Build milestones

1. **M1 — Scaffold & data.** Vite+TS+React app; port palette, items, briefs as typed data. Render the start screen with tokens/fonts.
2. **M2 — Figure & closet.** Build `drawGarment()` from §7.3; live figure; slot tabs + thumbnail rack; equip/unequip with the dress↔top/bottom exclusivity.
3. **M3 — Scoring & result.** Implement `computeScore` + critique exactly per §5; result overlay with animated bars, grade, round score × streak.
4. **M4 — Loop & modes.** Timer, streak, lives; Daily Muse (seeded 5) and Atelier (endless ramp); game-over flow.
5. **M5 — Leaderboard.** Local first, then Supabase; initials→free-text entry with profanity filter; per-day + all-time boards.
6. **M6 — Polish & ship.** Mobile reflow, motion, share link + OG image, light anti-cheat, deploy to Vercel.

Ship M1–M4 to have a genuinely fun, self-contained game; M5–M6 make it a competitive, shareable prospect toy.

---

## 12. Roadmap / stretch ideas

- **Seasonal collections / drops** of new garments and briefs to keep the meta fresh.
- **Co-branded editions** — swap palette + garment set + advisor name to a specific Maison for an event activation.
- **"Style-off" head-to-head** — two players, same brief, live compare.
- **Client memory** — a returning client references last round's look ("last time you put me in emerald…").
- **Accessibility pass** — keyboard equip, ARIA on tiles, reduced-motion, contrast check on the dark theme.
- **Sound** — subtle atelier ambience + a satisfying "present" chime (muted by default).

---

## 13. Open decisions — resolved

1. **Backend:** Supabase.
2. **Hosting/domain:** standalone Vercel deploy on its auto-generated domain; custom domain/subdomain to be decided later.
3. **Branding level:** standalone "THE EDIT" toy with a light "by Remark" footer/attribution — no branding inside core gameplay UI.
4. **Art fidelity:** SVG-illustration look (§7), self-contained, no image assets.
5. **Moderation:** free-text display names, gated by a client + server profanity/length filter (§9.3).
6. **Reference prototype:** none — building directly from this spec (§0).

---

*End of specification.*
