# Samaguri Satra Website - Design System

## Overview

Samaguri Satra Website adapts the Claude.com design aesthetic — warm cream canvas, coral accents, and serif display typography — for a **cultural heritage digital platform**. The design maintains the editorial, literary feel of Claude.com while transforming it into a museum/archival experience for Assamese manuscript paintings and Sattras.

The base atmosphere is a **tinted cream canvas** (`{colors.canvas}` — #faf9f5) — warm, deliberately not the cool gray-white that typical tech products use. Headlines run a **slab-serif display** (Cormorant Garamond / EB Garamond as substitutes for Copernicus) at weight 500 with subtle letter-spacing, paired with **Inter** body sans. The combination feels like a curated museum catalog, not a typical SaaS product.

Brand voltage comes from the **cream + coral pairing** — coral (`{colors.primary}` — #cc785c) serves as the signature accent, used on primary CTAs and full-bleed callout cards. The warm coral evokes traditional Assamese aesthetics (the colors found in manuscript paintings, Sattra tapestries, and Assamese silk). The dark navy surfaces (`{colors.surface-dark}` — #181715) provide contrast for immersive content sections — code editor becomes **artifact viewer**, model comparison becomes **collection gallery**.

The system has three surface modes that alternate page-by-page:
1. **Cream canvas** (`{colors.canvas}`) — default body floor
2. **Light cream cards** (`{colors.surface-card}`) — feature card backgrounds, collection cards
3. **Dark navy surfaces** (`{colors.surface-dark}`) — artifact detail views, audio player, QR scanner, footer

The dark surfaces are where Samaguri Satra shows its digital archive — artifact detail pages, audio player controls, QR scanner interface, search results. The cream-to-dark contrast creates a rhythmic pacing through the archive experience.

**Key Characteristics:**
- Warm cream canvas (`{colors.canvas}` — #faf9f5) with dark warm-ink text (`{colors.ink}` — #141413). The brand's defining color choice — evokes aged manuscript paper.
- Coral primary CTA (`{colors.primary}` — #cc785c). Used on primary buttons and full-bleed callout cards. The warm tone connects to Assamese cultural aesthetics.
- Serif display headlines via Cormorant Garamond / EB Garamond at weight 500. Pairs with humanist sans body (Inter) for a curated editorial voice — feels like a museum exhibition catalog.
- Dark navy artifact surfaces (`{colors.surface-dark}` — #181715) carrying artifact detail views, audio player, QR scanner, and collection grids — the digital archive experience.
- Light cream collection cards (`{colors.surface-card}` — #efe9de) — slightly darker than canvas, used for content-driven artifact explanations and collection previews.
- Decorative elements draw from Assamese manuscript painting motifs — not the Anthropic spike-mark, but traditional Assamese patterns as subtle dividers and borders.
- Border radius follows Claude.com hierarchy: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content + artifact cards, `{rounded.xl}` (16px) for the hero container.
- Section rhythm `{spacing.section}` (96px) — modern standard. Internal card padding stays generous at `{spacing.xl}` (32px).

---

## Colors

### Brand & Accent
- **Coral / Primary** (`{colors.primary}` — #cc785c): The signature warm coral, evoking traditional Assamese colors. Used on every primary CTA, on full-bleed coral callout cards, and as accent on the brand wordmark.
- **Coral Active** (`{colors.primary-active}` — #a9583e): The press / hover-darker variant.
- **Coral Disabled** (`{colors.primary-disabled}` — #e6dfd8): A desaturated cream-tinted disabled state.
- **Accent Gold** (`{colors.accent-gold}` — #c9a227): A warm gold used on featured collection badges, "new arrival" highlights — evokes manuscript gold leaf.
- **Accent Teal** (`{colors.accent-teal}` — #5db8a6): Used sparingly on secondary product surfaces (audio player play states, connection indicators).

### Surface
- **Canvas** (`{colors.canvas}` — #faf9f5): The default page floor. Tinted cream — warm, evokes aged manuscript paper.
- **Surface Soft** (`{colors.surface-soft}` — #f5f0e8): Section dividers, very-soft band backgrounds.
- **Surface Card** (`{colors.surface-card}` — #efe9de): Collection cards, content cards. One step darker than canvas.
- **Surface Cream Strong** (`{colors.surface-cream-strong}` — #e8e0d2): Strongest-cream variant used on selected category tabs and emphasized section bands.
- **Surface Dark** (`{colors.surface-dark}` — #181715): Artifact detail views, audio player, QR scanner interface, footer. The dominant dark surface.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #252320): Elevated cards inside dark bands (audio player expanded state, search results).
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — #1f1e1b): Slightly lighter dark, used for code block backgrounds (not applicable here — use for image overlays).
- **Hairline** (`{colors.hairline}` — #e6dfd8): The 1px border tone on cream surfaces. Same hex as `{colors.primary-disabled}` — borders feel like one elevation step rather than harsh lines.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebe6df): Barely-visible divider used inside the same band.

### Text
- **Ink** (`{colors.ink}` — #141413): All headlines and primary text. Warm dark, slightly off-pure-black — like ink on aged paper.
- **Body Strong** (`{colors.body-strong}` — #252523): Emphasized paragraphs, lead text, collection titles.
- **Body** (`{colors.body}` — #3d3d3a): Default running-text color.
- **Muted** (`{colors.muted}` — #6c6a64): Sub-headings, breadcrumbs, secondary text.
- **Muted Soft** (`{colors.muted-soft}` — #8e8b82): Captions, fine-print, metadata labels.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on coral buttons.
- **On Dark** (`{colors.on-dark}` — #faf9f5): Cream-tinted white used on dark surfaces (echoes the canvas tone).
- **On Dark Soft** (`{colors.on-dark-soft}` — #a09d96): Footer body text, secondary labels in dark sections.

### Semantic
- **Success** (`{colors.success}` — #5db872): "Available" indicators, upload success.
- **Warning** (`{colors.warning}` — #d4a017): Warning callouts.
- **Error** (`{colors.error}` — #c64545): Validation errors, QR scan failures.

---

## Typography

### Font Family
The system uses **Cormorant Garamond** (or **EB Garamond** as substitute) as the slab-serif display face for headlines, and **Inter** as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles technical elements (QR codes, technical metadata).

The display/body split is editorial:
- Cormorant Garamond serif (weight 500, subtle positive tracking) → h1, h2, h3, hero display, collection titles
- Inter sans (weight 400-500) → body, navigation, buttons, captions, labels, metadata
- JetBrains Mono → QR codes, technical IDs, timestamps

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 500 | 1.05 | 0 | Homepage h1 ("Discover Assamese Manuscript Paintings") — Garamond serif |
| `{typography.display-lg}` | 48px | 500 | 1.1 | 0 | Section heads — Garamond |
| `{typography.display-md}` | 36px | 500 | 1.15 | 0 | Sub-section heads, collection names — Garamond |
| `{typography.display-sm}` | 28px | 500 | 1.2 | 0 | Featured collections, callout headlines — Garamond |
| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Collection card titles — Inter |
| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, artifact titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Metadata labels, list titles |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text — Inter |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print, descriptions |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions, timestamps |
| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, "NEW" badges, language labels |
| `{typography.code}` | 14px | 400 | 1.6 | 0 | QR codes, technical IDs |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display sizes use weight 500 (medium), never bold. Garamond serif gives the literary, curated feel — switching to sans-serif display would make the site feel like every other generic website.

Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. The sans body is humanist (Inter) — never geometric. Inter's humanist proportions match the warm, curated aesthetic.

### Note on Font Substitutes
- For display serif: **Cormorant Garamond** at weight 500 is the closest open-source match. **EB Garamond** is a fallback. Both evoke the manuscript aesthetic.
- For body sans: **Inter** is the primary choice — both are humanist designs suitable for long-form reading.
- The combination creates a museum-catalog feel — scholarly yet accessible.

---

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — modern rhythm.
- **Card internal padding:** `{spacing.xl}` (32px) for collection cards, artifact detail cards; `{spacing.lg}` (24px) for audio player, search results, QR scanner.
- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger dark CTA band.

### Grid & Container
- **Max content width:** ~1200px centered.
- **Editorial body:** Single 12-column grid; hero often uses 6/6 split (headline left, hero image/card right).
- **Collection card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **Artifact grid:** 4-up or 6-up at desktop (masonry-style), 2-up at tablet, 1-up at mobile.
- **Events/News grid:** 3-up at desktop, 1-up at mobile.

### Whitespace Philosophy
The cream canvas + serif display + generous internal padding create an editorial pacing — the site reads like a museum exhibition catalog rather than a typical web app. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting content breathe.

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, sub-nav, collection cards |
| Cream card | `{colors.surface-card}` background — no shadow | Collection cards, feature cards, content cards |
| Dark surface card | `{colors.surface-dark}` background — no shadow | Artifact detail view, audio player, QR scanner |
| Subtle drop shadow | Faint shadow at low alpha | Hover-elevated states (rarely used) |

The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the cream-vs-dark surface contrast. The dark artifact interface has its own internal chrome (image viewer controls, audio waveform, QR scanning overlay) which adds detail without needing external shadows.

### Decorative Depth
- Traditional Assamese manuscript patterns appear as subtle dividers — not as dominant brand marks but as gentle section breaks.
- Artifact images carry their own depth: high-resolution manuscript paintings with subtle warm glow, metadata overlays in muted tones.
- Hero illustrations use warm, muted tones — traditional Assamese motifs in coral and navy on cream.

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Reserved for badge accents and tiny elements |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs, category tabs |
| `{rounded.lg}` | 12px | Content cards (collection, feature, artifact), audio player |
| `{rounded.xl}` | 16px | Hero container, larger marquee components |
| `{rounded.pill}` | 9999px | Badge pills, "NEW" tags, language toggles |
| `{rounded.full}` | 9999px / 50% | Avatar substitutes, icon buttons |

### Photography & Illustrations
The site rarely uses stock photography. Instead it uses:
- High-resolution scans of actual manuscript paintings (the core content)
- Warm-toned illustration accents (traditional Assamese motifs in coral/navy)
- Artifact detail view with image viewer (the dominant "hero" treatment)
- Audio waveform visualizations
- QR scanning interface with camera overlay

When photography is used (rare — testimonials/about), avatars crop to perfect circles at 40px diameter.

---

## Components

### Floating Navbar

**`top-nav-floating`** — The primary navigation for the website, featuring a distinctive floating pill design with circular borders. This is the ONLY navbar design to use - replaces the previous top-nav.

**Position & Shape:**
- Fixed position at top-8 (32px from top)
- Centered horizontally with transform: translate-x-1/2
- Width: 90vw on mobile, 92% on sm+, max-w-7xl
- Full rounded pill shape (border-radius: 9999px / rounded-full)
- 3px circular border in subtle tone
- Background: `{colors.surface-dark}` (#181715) with backdrop-blur-3xl OR `{colors.primary}` (#cc785c) with transparency

**Layout Structure:**
- Left: Logo image (blank placeholder logo)
- Center (absolute positioned): Decorative logo (horaiLogo)
- Center (flex): Navigation links - HOME, COLLECTIONS, EVENTS, NEWS, VISIT, FEEDBACK, ABOUT US
- Right: Actions cluster (Admin text-link) - **REMOVE login button completely**

**Navigation Links:**
- Font: Inter 14px / 500 weight, uppercase
- Color: `{colors.on-dark}` (cream white) on dark background
- Active state: `{colors.primary}` (coral) with larger text
- Hover state: `{colors.primary}` (coral) text color with underline indicator
- Spacing: px-3 py-2 per link

**Mobile Behavior:**
- Collapses to bottom navigation bar
- Fixed at bottom-0 with safe-area padding
- Primary items: Home, Collections, Events, Feedback
- Secondary items in expandable "More" menu: News, Visit, About Us

**States:**
- Default: Semi-transparent background with blur
- Scrolled: More opaque background

---

### Hero Section

**`hero-section`** — Full-width hero section for the landing page. Light mode only - remove all dark mode styling and transitions.

**Dimensions:**
- Minimum height: 320px (min-h-[320px])
- Full width with centered content
- Max content width: 1200px (max-w-[1200px])
- Vertical padding: `{spacing.section}` (96px)

**Background:**
- Uses BackgroundPattern component for decorative visual
- OR warm gradient/video background
- Light mode appearance only - no dark mode transitions

**Content Layout:**
- Centered text alignment
- Headline: Garamond serif, 48px-64px, font-bold, text-shadow for readability
- Subheadline: Sans-serif, below main headline

**Position:**
- z-index: 30 (above background, below navbar)
- Margin top: 80px (to clear floating navbar)

---

### Search Bar (Floating)

**`search-bar-floating`** — Prominent search bar positioned above the hero section. Must include custom search suggestions dropdown.

**Position:**
- Above hero section content, centered
- Margin top: 24px
- z-index: 50 (above other content)

**Dimensions:**
- Width: 90% on mobile, 80% on md+, max-w-[700px]
- Height: 50px mobile, 60px md+
- Rounded-full (pill shape)
- Padding: p-2 pl-4 pr-10 (mobile), larger on md+

**Background:**
- Same as navbar: `{colors.surface-dark}` (#181715) with backdrop-blur-lg
- Shadow for depth

**Elements:**
- Search icon: Left side, white colour, 20px
- Input field: Flex-1, transparent background, white text, placeholder in white
- QR Scanner button: Right side, hidden on mobile (hidden sm:flex)
- Search button: Right side, hidden on md (hidden md:block), "Search" text

**Custom Suggestions Dropdown (REQUIRED):**
- Appears below input when user types
- Max 5 suggestions displayed
- Background: `{colors.surface-card}` (#efe9de)
- Text: `{colors.ink}` (#141413)
- Max height: 200px with overflow-y-auto
- Border radius: rounded-lg
- Item hover: Background changes to `{colors.primary}` (#cc785c), text white
- Displays: Collection name — Category format

---

### Welcome to Majuli Section

**`intro-section-majuli`** — Introduction section showcasing Majuli as the Spiritual Isle of Assam. Two-column layout.

**Background:**
- `{colors.surface-soft}` (#f5f0e8) OR `{colors.canvas}` (#faf9f5)

**Layout:**
- Desktop: Two-column grid (1fr 1fr)
  - Left column: Text content with padding
  - Right column: Background image (hidden md:block)
- Mobile: Single column, image hidden

**Dimensions:**
- Max width: 1330px centered
- Border radius: rounded-3xl (24px)
- Shadow: shadow-xl
- Internal padding: p-8 sm:p-12 (32px-48px)

**Text Content:**
- Headline: text-3xl sm:text-4xl, font-bold, `{colors.ink}` or dark tone
- Body paragraphs: text-gray-700, leading-relaxed
- CTA button: Inline-flex, rounded-full, `{colors.primary}` background, white text

**Image:**
- Uses herobg.jpg as background-cover
- Min height: 300px on desktop
- Hidden on mobile (hidden md:block)

---

### EXPLORE OUR COLLECTIONS Section

**`collections-carousel`** — Horizontal scrolling carousel showcasing collection items on the home page.

**Background:**
- `{colors.canvas}` (#faf9f5) or white (#ffffff)

**Layout:**
- Full width with max-w-7xl container
- Horizontal scrollable container with snap-x snap-mandatory
- Gap: 3-4px between items

**Section Header:**
- Left aligned on desktop, centered on mobile
- "View More" link on the right (desktop)
- Text: text-2xl sm:text-4xl md:text-5xl, font-bold

**Carousel Card Specifications:**
- Minimum width: 160px (mobile), 220px (sm), 240px (md), 260px (lg)
- Aspect ratio: 3:4 (portrait)
- Height: 200px (mobile), 280px (sm), 300px (md), 340px (lg)
- Border radius: rounded-xl to rounded-2xl
- Shadow: shadow-md, hover shadow-lg
- Flex: flex-none (doesn't shrink)
- Snap: snap-start

**Card Content:**
- Image: absolute inset-0, object-cover, rounded-lg
- Hover: scale-105 transform
- Overlay: Absolute bottom, z-10, mx-1-2, p-1-2, bg-surface-dark/60 with backdrop-blur-lg
- Overlay text: centered, white/cream text
- Title: font-semibold, text-xs-sm, text-white group-hover:text-primary
- Category: text-xs, text-gray-200, group-hover:text-primary/80

**Animation:**
- Auto-scroll: Every 3 seconds
- Scroll behavior: smooth
- Wrap around: Scroll to start when reaching end

**Navigation Arrows:**
- Position: Right aligned, below carousel
- Buttons: "⇽" and "⇾" characters or chevron icons
- Hover: text-primary (coral)
- Size: text-xl

---

### Footer (Professional)

**`footer-professional`** — Dark footer with center-aligned content and four distinct columns.

**Background:**
- `{colors.surface-dark}` (#181715) - dark navy surface

**Layout:**
- Max width: max-w-7xl centered
- Padding: px-6 py-16 (vertical)
- 4-column grid on desktop, single column on mobile

**Column Structure (All Center-Aligned):**

**Column 1 - Logo & Description:**
- Logo image at top (horaiLogo or samaguri logo)
- Description text below in `{colors.on-dark-soft}`
- Max width: max-w-lg
- Text: text-sm, centered, mx-auto for logo

**Column 2 - Quick Links:**
- Heading: text-base, font-semibold, `{colors.primary}` (coral) - "Quick Links"
- List: space-y-2, text-white
- Items: Privacy Policy, Disclaimer, Terms & Conditions, Copyright Policy
- Hover: text-primary (coral)

**Column 3 - Contact Us:**
- Heading: text-base, font-semibold, `{colors.primary}` (coral) - "Contact Us"
- List: space-y-2, text-white
- Items: Address, Phone number, Email
- Add clickable/hover effects for phone and email

**Column 4 - Find Us:**
- Heading: text-base, font-semibold, `{colors.primary}` (coral) - "Find Us"
- Map placeholder: Small box showing location
- Can use mapPin icon or placeholder for Samaguri Satra location in Majuli

**Mobile Behavior:**
- Grid changes to single column
- Text remains centered
- Logo still at top

**Divider:**
- Border top: border-white/20 or border-surface-dark-soft
- Margin: my-6 (24px)

**Bottom Section:**
- Copyright text centered
- Text: text-sm, text-on-dark-soft

### Buttons

**`button-primary`** — The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (Inter 14px / 500), padding 12px × 20px, height 40px, rounded `{rounded.md}` (8px). Active state darkens to `{colors.primary-active}` (#a9583e).

**`button-secondary`** — Cream button with hairline outline. Background `{colors.canvas}`, text `{colors.ink}`, 1px hairline border, same padding + height + radius as primary.

**`button-secondary-on-dark`** — Used over `{colors.surface-dark}` surfaces. Background `{colors.surface-dark-elevated}` (#252320), text `{colors.on-dark}`. Stays dark — the system never inverts to a light secondary on dark surfaces.

**`button-text-link`** — Inline text button, no background. Used for "Admin" in the top nav and inline CTA links.

**`button-icon-circular`** — 36px circular icon button. Background `{colors.canvas}`, hairline border, ink-color icon. Used for search toggle, audio controls, "view more".

**`text-link`** — Inline body links in `{colors.primary}` (the coral). Underlined on press.

### Cards & Containers

**`hero-band`** — Cream-canvas hero with a 6-6 grid: h1 + sub-headline + button row on the left, hero image card (featured manuscript painting) on the right. Vertical padding `{spacing.section}` (96px).

**`hero-image-card`** — A larger card holding the hero's right-side artifact — a featured manuscript painting in high resolution, or a dark artifact preview card. Background `{colors.canvas}` or `{colors.surface-dark}` depending on context, rounded `{rounded.xl}` (16px).

**`collection-card`** — Used in 3-up collection grids. Background `{colors.surface-card}` (#efe9de — slightly darker cream), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a thumbnail image at top, an `{typography.title-md}` collection name, brief description, and artifact count.

**`artifact-card`** — Used in artifact grids. Similar to collection card but smaller — thumbnail image, title, year/period, "View Details" link. Rounded `{rounded.lg}`, padding `{spacing.lg}` (24px).

**`artifact-detail-card`** — Dark navy card showing the artifact in detail. Background `{colors.surface-dark}`, rounded `{rounded.lg}`, internal padding `{spacing.xl}` (32px). Carries the high-res artifact image, title in `{colors.on-dark}`, metadata, and action buttons (Audio Guide, QR Code, Share).

**`audio-player-card`** — Specialized dark card showing the audio player interface. Background `{colors.surface-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Displays waveform visualization, play/pause, language toggle (English/Hindi/Assamese), progress bar, and time indicators.

**`qr-scanner-card`** — Dark card for QR scanning interface. Background `{colors.surface-dark}`, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Camera viewfinder area, scanning indicator, result display.

**`search-result-card`** — Card showing search results. Background `{colors.canvas}` with hairline border, rounded `{rounded.lg}`, padding `{spacing.lg}` (24px). Thumbnail, title, relevance score, language availability indicator.

**`event-card`** — Card for events. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Event image, date badge, title, brief description, "Learn More" link.

**`news-card`** — Card for news/bulletins. Similar to event card. Featured news uses `{colors.surface-dark}` background.

**`feature-card`** — Used in feature sections. Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}` (32px). Icon at top, title, description.

**`callout-card-coral`** — Full-bleed coral card for major CTAs. Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px).

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-md}`, rounded `{rounded.md}`, padding 10px × 14px, height 40px. 1px hairline border.

**`text-input-focused`** — Focus state. Border thickens or shifts to `{colors.primary}` (coral).

**`search-input`** — Search bar variant. Larger padding, search icon prefix, clear button suffix.

**`filter-dropdown`** — Used for category filters (time period, artist, collection). Background `{colors.surface-card}`, rounded `{rounded.md}`, padding 8px × 12px.

**`language-selector`** — Toggle for audio language (English/Hindi/Assamese). Pill-style toggle, rounded `{rounded.pill}`.

### Tags / Badges

**`badge-pill`** — Small pill label for category tags (painting style, time period, collection). Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 4px × 12px.

**`badge-coral`** — Coral-fill badge for "NEW", "FEATURED", "AUDIO AVAILABLE". Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 12px.

**`badge-gold`** — Gold-fill badge for "RARE", "IMPORTANT". Background `{colors.accent-gold}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 12px.

### Tab / Filter

**`category-tab`** + **`category-tab-active`** — Used in filter rows on collections and search. Inactive: transparent background, `{colors.muted}` text. Active: `{colors.surface-card}` background, `{colors.ink}` text. Padding 8px × 14px, rounded `{rounded.md}`.

### CTA / Footer

**`cta-band-coral`** — Pre-footer "Explore Collections" CTA card. Full-width coral fill, white type, rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.display-sm}` (serif), sub-line, and a cream-button CTA.

**`cta-band-dark`** — Alternative pre-footer band on artifact-focused pages. Background `{colors.surface-dark}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding 64px.

**`footer`** — Dark navy footer. Background `{colors.surface-dark}`, text `{colors.on-dark-soft}`. 4-column link list at desktop covering Collections · Visit · About · Legal. Vertical padding 64px. The Samaguri Satra wordmark sits at the top in `{colors.on-dark}`.

---

## Accessibility & Visibility Requirements

### Contrast Ratio Standards (CRITICAL)
All text must meet WCAG 2.1 AA compliance:
- **Body text**: Minimum 4.5:1 contrast ratio against background
- **Large text** (18px+ regular or 14px+ bold): Minimum 3:1 contrast ratio
- **UI components** (buttons, inputs): Minimum 3:1 contrast ratio

### Text-on-Background Rules
- **NEVER** use text and background of same or near-same colour
- **NEVER** use `{colors.body}` (#3d3d3a) on `{colors.surface-card}` (#efe9de) - contrast insufficient
- **NEVER** use `{colors.muted}` (#6c6a64) on `{colors.canvas}` (#faf9f5) - contrast insufficient
- Always use `{colors.ink}` (#141413) or `{colors.body-strong}` (#252523) on light backgrounds
- Always use `{colors.on-dark}` (#faf9f5) on dark backgrounds

### Component Visibility Checklist
When implementing any component, verify:
- [ ] Primary text uses `{colors.ink}` or `{colors.body-strong}` on light backgrounds
- [ ] Secondary text uses `{colors.body}` (not `{colors.muted}`) on light backgrounds
- [ ] Links use `{colors.primary}` (coral) - never muted
- [ ] Text on dark surfaces uses `{colors.on-dark}` - never muted-soft
- [ ] Input text uses high contrast against input background
- [ ] Placeholder text is distinguishable from entered text
- [ ] Button text has minimum 4.5:1 against button background

### Common Visibility Issues to Avoid
- Muted text on cream/light backgrounds → Use body colour instead
- Gray text on light gray sections → Use ink or body-strong
- Light text on dark sections → Use on-dark, not muted
- Placeholder blending with input background → Ensure visible distinction

---

## Do's and Don'ts

### Do
- Anchor every page on the cream canvas. The warm tint is the brand differentiator — evokes aged manuscript paper.
- Use Garamond serif for every display headline. Pair with Inter sans body. The serif character creates the museum-catalog feel.
- Reserve `{colors.primary}` (coral) for primary CTAs and full-bleed callout cards. Don't overuse.
- Use dark artifact surfaces for artifact detail, audio player, and QR scanner. The dark creates immersion.
- Pair cream collection cards with dark artifact cards in alternating bands. The rhythm is the visual language.
- Maintain generous 32px internal padding on cards. Content needs room to breathe.
- Apply `{spacing.section}` (96px) between major bands.
- Always verify text contrast meets 4.5:1 ratio (body) or 3:1 (large text/UI)
- Use `{colors.ink}` or `{colors.body-strong}` for primary text on light backgrounds
- Use `{colors.on-dark}` for text on dark surfaces

### Don't
- Don't use cool grays or pure white for canvas. Cream is the brand.
- Don't bold serif display weight. Garamond at 700 reads as aggressive; the system stays at 500.
- Don't use cool blue or saturated cyan as a brand accent. The warm coral is the brand.
- Don't put coral everywhere. The coral is scarce on individual elements and generous only on full-bleed callout cards.
- Don't use sans-serif for display headlines. The serif character is the brand voice.
- Don't repeat the same surface mode in two consecutive bands. Alternate: cream → cream-card → dark-surface → cream → coral-callout → dark-footer.
- Don't add hover state styling beyond what the system encodes — primary darkens on press.
- **Don't** use `{colors.muted}` (#6c6a64) on light backgrounds — contrast too low
- **Don't** use body text on same-colour background — visibility will be poor
- **Don't** skip contrast checking when adding new components
- **Don't** include "Latest Highlights" section on home page — remove it

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64→32px; hero-image stacks below content; collection grids 1-up; artifact grids 2-up; events 1-up; footer 4 cols → 1 |
| Tablet | 768–1024px | Top nav stays horizontal but tightens; collection cards 2-up; artifact grids 3-up |
| Desktop | 1024–1440px | Full top-nav with all menu items; 3-up collection cards; 4-up or 6-up artifact grids; 3-up events |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 × 40px.
- `{component.button-icon-circular}` at exactly 36 × 36.
- `{component.text-input}` height is 40px.
- Card entire area is tappable.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen cream sheet.
- Hero band's 6-6 grid collapses to single-column on mobile — headline + buttons first, then the image card below.
- Collection/artifact grids reduce columns rather than scaling cards down.
- Audio player collapses to minimal bar at bottom on mobile.
- QR scanner fills full screen on mobile.

### Image Behavior
- Artifact images scale proportionally; maintain aspect ratio.
- Thumbnails use consistent aspect ratio (4:3) across grids.
- Audio waveform stays fixed height with horizontal scroll if needed.

---

## Homepage / Landing Page Layout

The homepage (landing page) must include the following sections **in this exact order**:

1. **Floating Navbar** (`top-nav-floating`)
   - Use the Artifex-style floating navbar with circular borders
   - Apply Samaguri colour theme (cream/coral/navy)
   - **REMOVE the login button completely**

2. **Search Bar** (`search-bar-floating`)
   - Position: Above the hero section
   - Must include custom search suggestions dropdown
   - Use Artifex functionality with Samaguri colours

3. **Hero Section** (`hero-section`)
   - Light mode only - no dark mode transition
   - Background video or warm gradient
   - Centered headline using Garamond serif

4. **Welcome to Majuli Section** (`intro-section-majuli`)
   - Two-column layout: text left, image right
   - Image hidden on mobile (hidden md:block)

5. **EXPLORE OUR COLLECTIONS** (`collections-carousel`)
   - Horizontal scrolling carousel
   - Animation: auto-scroll every 3 seconds
   - Manual navigation arrows
   - Use exact same functionality as Artifex, with Samaguri colours

6. **Footer** (`footer-professional`)
   - 4-column professional layout
   - All content center-aligned
   - Column 1: Logo + description
   - Column 2: Quick Links
   - Column 3: Contact Us (email, phone, address)
   - Column 4: Find Us (map placeholder)

### Sections to REMOVE from Homepage:
- **Latest Highlights section** — remove completely
- Any other sections not listed above

---

## Feature-Specific Components

### Collections Page
- **Collection hero**: Large featured collection with coral callout
- **Collection grid**: 3-up masonry-style cards showing individual collections
- **Filter bar**: Category tabs (by period, by style, by Satra)
- **Sort dropdown**: Sort by date, name, popularity

### Artifact Detail Page
- **Hero image**: Full-width artifact image viewer (dark surface)
- **Metadata panel**: Title, artist, period, collection, description
- **Audio player**: Embedded audio player (dark surface)
- **QR code display**: Artifact-specific QR for physical access
- **Language toggle**: Switch between English/Hindi/Assamese descriptions

### Audio Guide Page
- **Audio grid**: List of available audio guides
- **Featured audio**: Highlighted audio with waveform
- **Player controls**: Play/pause, progress, language selector
- **Related artifacts**: Link to related paintings

### QR Scanner Page
- **Camera viewfinder**: Full-screen camera with overlay
- **Scanning indicator**: Animated scan line
- **Result card**: Shows artifact info when scanned
- **Manual entry**: Text input as fallback

### Search Page
- **Search input**: Prominent search bar with filters
- **Filter sidebar**: Categories, time periods, collections
- **Results grid**: Artifact results with relevance indicators
- **No results state**: Helpful suggestions

### Admin Dashboard
- **Stats overview**: Visitor count, feedback count, artifact count
- **Quick actions**: Upload artifact, add audio, manage collections
- **Recent activity**: Latest uploads, feedback, visits
- **Navigation sidebar**: Full admin menu

---

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key.
2. Variants (`-active`, `-disabled`, `-focused`) live as separate entries.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay Garamond serif 500. Body stays Inter 400. The split is unbreakable.
6. Cream + coral + dark navy is the trinity. Don't introduce a fourth surface tone.
7. When in doubt about emphasis: bigger Garamond serif before bolder weight.

---

## Known Gaps

- Custom fonts (Cormorant Garamond, Inter) need to be loaded via Google Fonts or self-hosted.
- Audio player streaming implementation not in scope — just the UI design.
- QR code generation logic not in scope — just the scanner interface design.
- Admin authentication flow not in scope — just the dashboard UI.
- Multi-language content management not in scope — just the language toggle UI.
- Animation and transition timings (page transitions, card hover effects, audio waveform animation) are not in scope.
- Form validation states beyond focused are not extracted.
- The actual artifact viewing experience (zoom, pan, fullscreen) shares some tokens but adds product-specific components out of scope for this design document.