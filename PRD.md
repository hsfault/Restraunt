# SALTFIRE — Build Spec (PRD)

A premium, studio-grade website **mockup** for SALTFIRE, a live-fire kitchen & bar in Lahore. Modern Pakistani-meets-Mediterranean grill; everything is cooked over oak and charcoal. The site must feel hand-crafted: editorial, asymmetric, motion-led, never templated.

---

## 1. Purpose

- Sell the feeling of the room before anyone books: fire, smoke, salt, patience.
- Three working flows inside a mockup: **browse the menu**, **order for pickup** (bag → checkout → receipt), **reserve a table** (4-step flow → deposit → receipt).
- Everything runs client-side. Payments are mocked. Cart persists in `localStorage`.

## 2. Brand

| Field | Value |
|---|---|
| Wordmark | `SALTFIRE` (always uppercase) |
| Type | Live-fire kitchen & bar |
| Address | 14-C Main Boulevard, Gulberg III, Lahore |
| Tel | +92 42 3571 0000 |
| Hours | Tue–Sun 6:00pm–12:00am · closed Monday · last orders 11:30pm |
| Currency | PKR, formatted `Rs 4,850` |
| Tagline | Cooked over oak. Served without hurry. |
| Footer line | Fire first. Salt always. ©26 |
| Voice | Short, sensory, confident. Banned: "Welcome to our restaurant", "culinary journey", "taste buds", "unforgettable experience", "elevate". No lorem, no emoji in UI. |

## 3. Stack

React 18 + Vite 5 · Tailwind CSS v3 (custom tokens in `tailwind.config.js`) · Framer Motion 11 · Lenis (smooth scroll) · React Router v6 · Zustand (bag, `persist` → localStorage) · lucide-react icons (sparingly). No UI kits.

## 4. Design system — "Charcoal & Ember"

### 4.1 Colour tokens (Tailwind + CSS vars)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0A09` | Main background (never pure black) |
| `char` | `#151311` | Raised panels |
| `smoke` | `#221F1B` | Borders, hover surfaces |
| `bone` | `#EDE6DA` | Primary text; light layers (preloader, curtain) |
| `ash` | `#948B80` | Secondary text |
| `ember` | `#FF5B1F` | The single accent: CTAs, cursor, active, key numbers. Max one accent moment per viewport |
| `glow` | `#FF9A4D` | Ember highlights / gradients only |
| `saffron` | `#F2B441` | Tiny details only (status dot, stars) |

Grain: fixed full-screen SVG `feTurbulence` noise at 4% opacity, `pointer-events: none`, above everything.

### 4.2 Type

- **Archivo** variable (wght 100–900, wdth 62–125) — display + UI. Giant wordmark: 800, `font-stretch: 112%`, tracking `-0.04em`, leading `0.8`.
- **Instrument Serif** italic — emotional words inside headlines.
- **JetBrains Mono** — counters, labels, prices, receipt, uppercase meta (11–12px, tracking `0.12em`).
- Fluid scale: hero wordmark `clamp(4.5rem, 19vw, 22rem)`; section titles `clamp(2.5rem, 7vw, 7rem)`, uppercase, tight.
- Google Fonts with `display=swap`.

### 4.3 Layout language

- Editorial, asymmetric, deliberately broken 12-col grid. 1px `bone/10%` rules between info columns.
- Sections from "Signature dishes" onward are `char` **panels**, 32px top radius, sliding over the previous section (sticky + negative margin), inset 12px on desktop, 0 on mobile. Covered content dims to 0.5 and scales to 0.96. Each panel carries a top-centre notch tab (SVG bump ~140×36) with `↓ SCROLL` in mono.
- Arch frames for portraits: `border-radius: 999px 999px 24px 24px`.
- Banned: equal card grids, 3-feature rows, rounded-2xl shadow card rows, centred "title + 2 buttons" hero, purple/blue gradients, gradient text, emoji, glass everywhere. Glass only on nav, coverflow cards, coverflow control bar (and the receipt toolbar, which is specified as glass).

### 4.4 Motion

- Eases: `primary = [0.76, 0, 0.24, 1]` (curtains/reveals), `ui = [0.22, 1, 0.36, 1]`; springs stiffness 260–320, damping 28–32 for layout.
- Text reveal: split into lines/words/chars, each in an `overflow:hidden` mask, rising from `translateY(110%)`, stagger 0.04–0.06s, 0.9s.
- Image reveal: `clip-path: inset(100% 0 0 0) → inset(0)` 1.1s, inner image scale 1.25 → 1.
- Transform / opacity / clip-path only. `will-change` only while animating.
- `prefers-reduced-motion`: no preloader sequence, no scrub (pinned scenes render as static stacks), simple fades.
- Lenis: `lerp 0.09`, `wheelMultiplier 1`. Stopped while preloader, modals, drawer or mobile menu are open.

## 5. Global components

| Component | Spec |
|---|---|
| **Preloader** | Once per session (`sessionStorage`). Bone layer; ember "SALTFIRE" Archivo 900 ~9vw. Phase 1 (0–2.4s): letters rise out of order S,F,A,I,L,R,T,E; a torn-edge window between SALT/FIRE flips 8 images every 90ms; mono counter 000→100 eased, top-right. Phase 2 (2.4–3.0s): window scaleX→0, gap closes, letters drop out (0.03s stagger). Phase 3 (3.0–3.7s): bone layer lifts via `clip-path inset(0 0 100% 0)`; hero wordmark rises 0.15s before the curtain finishes. Skipped with reduced motion. |
| **Navbar** | Glass pill: fixed top 16px, max 1080px, h 60, r 18, `rgba(21,19,17,.55)` + blur(18) saturate(140%), hairline border + inset highlight. Logo flame SVG + wordmark; links Menu ▾, Story, Chef's Table, Private Dining ▾, Visit; search circle, bag with spring badge, Reserve (bone). Underline grows left→right in, exits right. Dropdown panels (glass, y −8→0, 0.25s, 120ms close delay): Menu = 3 columns (category, clip-reveal image, 4 dish links); Private Dining = 3 rooms. **Search**: circle morphs (layout) into 280px input, pill widens with layout spring; live filter of `menu.js`, max 5 results (thumb, name, price), arrows/Enter/click → `/menu#id`; Esc/× closes; opens with `/` or Ctrl/Cmd+K. Hides on scroll down, shows on up; bg opacity rises after 80px. Mobile: logo, bag, 44px hamburger (2 lines → X) → full-screen ink overlay, curtain drop, giant links 12vw with 01–05 indices, footer with hours/address/Reserve. |
| **Cursor** | Fine pointers only. 10px ember dot, lerp 0.18. `data-cursor="view|drag|open|reserve"` → 84px circle with mono label (spring). Links → 6px. |
| **PageTransition** | Bone curtain rises from bottom (0.6s primary), tiny ink mono page name centre, scroll to top while covered, curtain continues up and off; page title letters rise. `AnimatePresence mode="wait"`. |
| **Footer** | "Fire first." bone + "Salt always." ash, ©26 right, Archivo 700 ~5vw. 4 ruled columns: Visit, Hours, Explore, Newsletter (underline input + arrow; submit → arrow flies right, "You're on the list." types in). Edge-to-edge "SALTFIRE" brushed-metal gradient (bone → #8A8379) cropped by the bottom edge, light sweep every 6s, letters rise. © line + Instagram / TikTok / WhatsApp. |
| **BagDrawer** | Right drawer, ink, 440px (full on mobile). Thumb, name, qty stepper, line price, remove (height collapse), subtotal, Checkout → `/bag`. Focus trap, Esc. |
| **Receipt** | Thermal printer experience (Section 8). |
| **SplitText / RevealImage / MagneticButton / Ticker / SparkCanvas** | Reusable primitives. |

## 6. Pages & sections

### `/` Home

1. **Hero** (100svh): giant bone wordmark; circular top-down plate between SALT|FIRE over the text (34vw desktop / 62vw mobile, ember shadow), rotates 360°/60s, +90° and scale 1→0.85 on scroll out. 1px rule, 3 editorial columns. Live status chip from real time (Asia/Karachi). Magnetic "Reserve a table" (≤8px).
2. **Ingredient ticker**: serif italic ~2.4rem bone/70, ember ✦ separators, speed follows scroll velocity, direction follows scroll direction.
3. **The Fire** (~250vh pinned): arch window 24vw×34vw → full viewport, radius → 0, inner counter-scale 1.3→1; "COOKED OVER" / "OAK" slide apart; three lines fade in sequence; ends as inset 12px r32 frame.
4. **Signature dishes — coverflow**: "Seven plates we'd *defend* in court." Perspective 1400; ±1: x ±62%, rotY ∓38°, s .82, brightness .6; ±2: x ±105%, rotY ∓48°, s .68, blur 2, opacity .5. Glass cards (4:5 image, "◎ View dish" chip, name, mono meta). Ambient radial of active dominant colour (canvas-sampled, fallback hex) cross-fading 0.9s. Glass control bar: prev / play-pause (4s, progress line) / next | thumb + name | "03 / 07". Drag with velocity snap, arrow keys, click side card. Active card click → `layoutId` morph into modal (image left; story, components, pairs with, price, stepper, Add to bag). Mobile: ±20°, only ±1.
5. **Anatomy — exploded view** (~300vh pinned): left list of 5 steps; right isometric CSS 3D stage (`rotateX(58deg) rotateZ(-38deg)`) of 5 top-down layers separating translateZ 0→90/180/270/360 with SVG leader lines drawing in; last 20% collapse + ember flash. Mobile/reduced: vertical stack with labels.
6. **Menu preview**: 5-category switcher with sliding ember pill (layoutId); editorial rows with dotted leaders, ash description, mono chips (V, GF, HOT); hover image 260×320 follows cursor (lerp .12, tilt ±8° by velocity, clip reveal), row nudges 12px; "+ Add" on hover (always on mobile); rows exit up / rise in (0.04 stagger); "See the full menu →".
7. **Numbers**: asymmetric strip — ember block 40% "2019 / First fire lit"; two stacked outline blocks "46 seats", "1,200°F"; count-up, tabular mono.
8. **Chef**: arch portrait parallax −10%→10%; "Chef Daniyal Rehman", mono title, 3-line manifesto with ember serif keywords, hand-drawn underline, self-writing signature (1.6s).
9. **Private dining**: pinned horizontal gallery driven by vertical scroll, 6 mixed-size images (arch, wide, square), clip reveals, mono captions, cursor VIEW, lightbox via layout morph, progress bar. Mobile: scroll-snap swipe.
10. **Press**: one large serif quote at a time, 5s cycle, words out up / in up, publication row shows active.
11. **Reserve CTA**: ember panel r32, "Your table is *waiting.*", ink button + outline button, ~60 rising spark particles on canvas (paused off-screen).

### `/menu`
Curtain in, giant "MENU". Sticky glass category bar (scroll-spy, horizontal scroll on mobile). Filters All / Vegetarian / Gluten-free / Chef's pick (layout animation). Editorial rows for all ~32 items, each `id` anchor; hash deep-link scrolls and flashes the row ember. "+ Add" → thumbnail flies along a curved path to the nav bag, badge pops.

### `/bag`
"YOUR BAG". Items + steppers; pickup slot chips; name/phone floating-label inputs; mock card (number grouping, MM/YY, CVC). Summary: subtotal, tax 16%, service 5%, total. "Pay Rs X" → 1.6s processing (ember progress line) → Receipt.

### `/reserve`
"RESERVE". 4 steps, "01 — 04" indicator + progress line. 1 custom calendar (Mondays/past disabled, ember spring fill). 2 time slots 6:00–10:30pm/30min (some full, struck), guests 1–12, seating rows with images (Hearth counter / Dining room / Terrace). 3 details: name, phone, email, occasion chips, notes. 4 confirm → "Confirm & pay Rs 2,000 deposit" → Receipt. Direction-aware slides; validation messages shake.

### `*` NotFound
"The coals went out here." with route back.

## 7. Receipt experience
Ink dim → white printer bar (r14, slot + 2 marks) slides in. Paper `#FAF8F3`, 340px, mono, emerges in ~14 uneven jerks (40–120ms, micro pauses) from behind the slot; Web Audio noise ticks per jerk (Audio toggle). Content: flame banner + glass chip "· KITCHEN & BAR ·", "· OFFICIAL RECEIPT ·", SALTFIRE 22px, details, NTN 7654321-8, dotted dividers, ORDER #SF-xxxx / RES #, date (now), SERVER Ali R., STATUS PAID ✓, items table or reservation block, subtotal/tax/service/TOTAL, CSS barcode, "Thank you. See you by the fire.", zig-zag torn edge. Toolbar (glass): RE-PRINT, TEAR (ember, pulsing), FEED (+40px), RESET (retract), AUDIO. TEAR: jerk 6px, rotate −4° spring wobble, drop + fade → "Collected Receipt" modal (receipt icon, "Detached from terminal", ×, scrollable receipt, "Print to paper" via `window.print` + print stylesheet, "Back to SALTFIRE").

## 8. State & data

- `src/store/bag.js` — Zustand + persist: `items[{id, qty}]`, `add`, `setQty`, `remove`, `clear`, `open`, `setOpen`, `pulse` (badge pop counter), `lastOrder`.
- `src/data/brand.js` — brand facts, hours schedule, nav, ingredients, fire lines, chef, numbers, socials.
- `src/data/menu.js` — 32 items: `id, name, category, desc, price, tags[V|GF|HOT], chefsPick, image`.
- `src/data/dishes.js` — 7 signature dishes (link to menu id) with story, components, pairsWith, dominantColor; anatomy layers.
- `src/data/gallery.js` — 6 private-dining images, captions, shapes; 3 seating options for reserve.
- `src/data/press.js` — 3 quotes from The Lahore Table, Plate & Province, Northbound Food Review.

## 9. Image manifest (Pollinations, fixed seeds, saved to `/public/images/`)

Generated by `scripts/build-images.mjs` → `scripts/pollinations.py --batch`. Every prompt gets the art-direction suffix; top-down plates get the overhead suffix. Sizes rounded to multiples of 16 where needed.

| File | Size | Subject |
|---|---|---|
| hero-plate.jpg | 1024×1024 (top-down) | lamb chops, labneh swoosh, pomegranate, herb oil, flaky salt |
| fire-hearth.jpg | 1920×1088 | open oak hearth, coals, grates, hands turning skewers, sparks |
| dish-1…7.jpg | 1024×1280 | tikka / seabass / raan / cauliflower / wagyu seekh / aubergine / smoked kulfi |
| layer-1-plate … layer-5-garnish.jpg | 1024×1024 (top-down) | plate / labneh / chops / oil + pomegranate / herbs + salt |
| menu-{id}.jpg | 768×960 | one per menu item |
| chef.jpg | 1024×1408 | chef, black apron, hearth, half-shadow, arms crossed |
| private-1…6.jpg | 1600×1008 / 1008×1408 / 1200×1200 | candle-lit table, copper bar, hearth counter, terrace, wine wall, tasting course |
| preloader-1…8.jpg | 600×800 | flames, skewer, sizzling pan, salt, naan, smoke, smoked cocktail, coal macro |
| receipt-banner.jpg | 800×160 | ember flame silk texture |

Failures: retry once with a new seed; still failing → CSS gradient fallback (`RevealImage`/`Img` `onError`) and reported.

## 10. File structure

```
src/
  main.jsx, App.jsx
  lib/ lenis.js useMagnetic.js useSplitText.js useMediaQuery.js audio.js color.js time.js format.js motion.js
  store/ bag.js
  data/ brand.js menu.js dishes.js gallery.js press.js
  components/ Navbar/{Navbar,NavSearch,NavDropdown,MobileMenu,FlameMark}.jsx Preloader PageTransition Cursor Footer BagDrawer
              Receipt/{Printer,ReceiptPaper,ReceiptControls,CollectedModal}.jsx SplitText RevealImage MagneticButton Ticker SparkCanvas
              PanelNotch FlyToBag MenuRow PageTitle Img
  sections/ Hero FireScene Coverflow DishModal Anatomy MenuPreview Numbers Chef PrivateGallery Press ReserveCTA
  pages/ Home Menu Bag Reserve NotFound
index.css — fonts, vars, grain, print stylesheet, thin ember scrollbar
```

## 11. Acceptance

- Preloader plays once/session, skipped on reduced motion.
- Search filters real data, deep-links, keyboard (/ , Ctrl/Cmd+K, Esc, ↑↓, Enter).
- Coverflow: drag, swipe, keys, autoplay, ambient colour, layout-morph modal, Add to bag.
- Anatomy scrub separates and reassembles; mobile fallback.
- Bag persists; fly-to-bag; both checkout and reservation end in the printer receipt with all five controls + Collected modal + print.
- Curtain on every navigation.
- 360 → 1920 responsive, no horizontal overflow, ≥44px tap targets, cursor off on touch.
- Semantic HTML, alt text, ember 2px focus-visible rings, modal focus traps, Esc closes everything.
- Lazy images in fixed aspect boxes; fonts `display=swap`.
- `npm run build` passes.
