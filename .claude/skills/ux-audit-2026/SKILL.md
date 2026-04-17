---
name: ux-audit-2026
description: >
  Analyzes websites and web applications for UI/UX quality, identifying improvement areas and
  checking compliance with 2026+ modern web design and development standards. Use this skill
  whenever a user asks to: audit a website, review a site's UX or design, check if a site is
  modern, evaluate accessibility or performance, find usability issues, analyze a competitor's
  site, give feedback on a web app's interface, or says anything like "what's wrong with this
  site", "how can I improve my website", "does my site look modern", "review my UI", or
  "analyze this web app". Trigger even if the user only pastes a URL without explanation —
  assume they want a full UX audit. This skill covers: visual design, interaction design,
  accessibility (WCAG 2.2), Core Web Vitals, mobile-first design, AI-readiness, and
  2026-specific standards like spatial/adaptive UI, micro-interactions, ethical design,
  and design originality against AI-driven homogenization.
---

# UX Audit 2026+ Skill

You are an expert UX auditor specializing in modern web standards with a critical eye for
design originality. When this skill triggers, conduct a thorough, structured audit of the
target website or web app.

## Philosophical Framework: The Anti-Homogenization Mandate

As AI tools (Figma AI, v0, Bolt, Lovable, Cursor, etc.) democratize design and development,
a dangerous convergence has emerged: sites increasingly share the same Tailwind defaults,
the same shadcn/ui component DNA, the same Lucide/Heroicons icon language, the same
hero→features→testimonials→CTA layout formula, and the same Framer Motion easing curves.
This "AI aesthetic monoculture" trades brand identity for template convenience.

This audit explicitly evaluates whether a site has a **design fingerprint** — a visual and
interactive identity that could not be trivially reproduced by prompting an AI tool.
The goal is not to reject modern tooling but to assess whether the team has transcended
defaults to create something with genuine character.

---

## Step 1: Gather Information — Dual-Track Analysis

A proper audit requires **both** code-level analysis and live visual inspection.
Run both tracks for any live URL. If only a screenshot or description is available,
work from Track B alone and note the limitation.

### Track A: Code & Structure Analysis

Use **web_fetch** to retrieve the page HTML/content. From the raw source, extract:

1. **Technology fingerprint**: Identify frameworks, libraries, CSS methodology
   - Check for: Tailwind class patterns, CSS-in-JS markers, component library signatures
   - Look for: `<meta name="generator">`, framework-specific data attributes (`data-radix-*`, `data-nextjs-*`, etc.)
   - Scan `<head>` for: design token CSS variables, font loading strategy, resource hints
   - Note: third-party script inventory (analytics, chat widgets, A/B testing)

2. **Structural quality**: Evaluate HTML semantics and accessibility foundations
   - Landmark roles (`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`)
   - Heading hierarchy (is it sequential? h1 → h2 → h3?)
   - ARIA usage patterns (proper vs. ARIA abuse)
   - Schema.org / structured data markup
   - `llms.txt`, `robots.txt`, sitemap presence

3. **CSS architecture signals**: Look for evidence of intentional design systems
   - Custom properties / design tokens (or just Tailwind defaults?)
   - Media queries and container queries usage
   - Animation/transition definitions
   - Color space usage (OKLCH/P3 or just hex/rgb?)

4. **Performance signals from source**:
   - Image format and loading strategy (`<picture>`, `loading="lazy"`, `srcset`)
   - Font loading (`font-display`, preload links, number of font files)
   - Script loading strategy (defer, async, module)
   - Bundle indicators (code-split markers, dynamic imports)

Use **web_search** to find:
- Recent Lighthouse or PageSpeed Insights data
- Public performance reports or audits
- User reviews mentioning UX issues
- Competitor sites for differentiation comparison

### Track B: Live Visual Inspection

If **Claude in Chrome** tools are available (preferred):

1. **Desktop capture**:
   - Use `navigate` to load the URL
   - Use `computer` to take a full-page screenshot at default viewport
   - Use `read_page` to get the accessibility tree
   - Use `javascript_tool` to extract computed styles, CSS variables, and runtime metrics:
     ```js
     // Example extractions:
     JSON.stringify({
       fonts: document.fonts.size,
       customProperties: getComputedStyle(document.documentElement).cssText.match(/--[\w-]+/g)?.length,
       viewportWidth: window.innerWidth,
       colorScheme: getComputedStyle(document.documentElement).colorScheme
     })
     ```

2. **Mobile capture**:
   - Use `resize_window` to set viewport to 390×844 (iPhone 15 Pro)
   - Take another screenshot — compare layout adaptation
   - Check: does navigation collapse? Do touch targets resize? Does content reflow?

3. **Interaction testing** (if time allows):
   - Test a primary CTA hover/click
   - Open navigation menu on mobile viewport
   - Check a form field focus state
   - Test dark mode toggle if present

If Claude in Chrome is **not** available:
- Use **image_search** with queries: "[site name] website", "[site name] mobile app"
- Use **web_fetch** on Google PageSpeed Insights API or similar public tools
- Note in the report: "Visual inspection limited to code analysis — live rendering not verified"

### Track Synthesis

Before scoring, cross-reference both tracks:
- Does the HTML structure match what the visual rendering suggests?
- Are there CSS rules that look good in code but might break visually?
- Does the technology stack explain the visual quality (or lack thereof)?

---

## Step 2: Run the Audit

Evaluate across all **9 dimensions** below. Score each **0–10** and note specific findings.

---

### DIMENSION 1: Visual Design & Brand Consistency
**Weight: 10%**

Check:
- Typography hierarchy (fluid type scales, variable fonts, custom typeface choices)
- Color system (semantic tokens, dark mode support, contrast ratios)
- Spacing/layout grid consistency
- Icon system coherence
- Illustration/imagery style alignment
- Brand voice in microcopy
- Visual rhythm — does the page have a breathing cadence or is it a wall of sections?

**2026 Standard:** Design tokens, fluid typography (clamp()), CSS layers (@layer), systematic color palettes with OKLCH/P3 color spaces, CSS nesting (native), anchor positioning API.

---

### DIMENSION 2: Interaction Design & Micro-interactions
**Weight: 12%**

Check:
- Loading states and skeleton screens
- Hover/focus/active states on interactive elements
- Form validation UX (inline, real-time, contextual error recovery)
- Transition and animation quality (purposeful, not decorative)
- Gesture support on touch devices
- Drag-and-drop or advanced interaction patterns
- Scroll behavior — snap points, parallax depth, scroll-linked reveals
- Haptic feedback philosophy (does interaction feel tactile or flat?)

**2026 Standard:** View Transitions API, scroll-driven animations (`animation-timeline: scroll()`), `@starting-style` for entry animations, motion that respects `prefers-reduced-motion`, CSS scroll-snap with proximity/mandatory logic, popover API for tooltips/dropdowns.

---

### DIMENSION 3: Accessibility (WCAG 2.2 Compliance)
**Weight: 18%** ⚠️ High priority

Check:
- Color contrast (AA minimum, AAA preferred for body text)
- Keyboard navigability (tab order, focus indicators, skip navigation)
- Screen reader compatibility (ARIA roles, landmark regions, live regions)
- Focus trap in modals/drawers with Escape key dismissal
- Alt text quality on images (descriptive, not "image of...")
- WCAG 2.2 criteria: target size (24×24px min), focus appearance, dragging alternatives
- Cognitive accessibility: reading level, information density, cognitive load
- Reduced motion handling: are animations truly disabled or just slowed?

**2026 Standard:** WCAG 2.2 AA mandatory, AAA for critical flows. EAA (European Accessibility Act) compliance for EU-facing sites. ARIA Authoring Practices Guide (APG) patterns as baseline.

---

### DIMENSION 4: Performance & Core Web Vitals
**Weight: 18%** ⚠️ High priority

Check/estimate:
- **LCP** (Largest Contentful Paint): target < 2.5s
- **INP** (Interaction to Next Paint): target < 200ms
- **CLS** (Cumulative Layout Shift): target < 0.1
- Image optimization (AVIF/WebP, responsive images with `<picture>`, lazy loading with native `loading="lazy"`)
- Font loading strategy (`font-display: swap`, preload, subsetting, variable fonts to reduce file count)
- JavaScript bundle size and code-splitting strategy
- Third-party script impact and loading strategy (defer, async, partytown)
- Render-blocking resource identification
- Resource hints (preconnect, prefetch, preload) usage

**2026 Standard:** INP as Core Web Vital. Edge rendering (SSR/SSG/ISR), partial hydration, Islands architecture, React Server Components or equivalent. Speculation Rules API for instant page navigations.

---

### DIMENSION 5: Mobile-First & Responsive Design
**Weight: 12%**

Mobile traffic exceeds 60% globally. This dimension evaluates not just whether a site
*works* on mobile, but whether it was **conceived for mobile** — treating desktop as the
progressive enhancement layer, not the other way around.

#### 5A: Viewport & Layout Foundations
- Meta viewport configuration (`width=device-width, initial-scale=1`)
- Responsive layout system across breakpoints (fluid, not just snapping at 768/1024)
- Container queries (`@container`) for component-level responsiveness
- Modern viewport units (`dvh`/`svh`/`lvh`) instead of `vh` (which breaks on mobile browsers with dynamic toolbars)
- Logical properties (`inline`/`block`) for internationalization-ready layouts
- CSS `@media (hover: none)` patterns to differentiate touch vs. pointer interfaces
- Safe area insets (`env(safe-area-inset-*)`) for notch/Dynamic Island/punch-hole cameras
- Foldable/dual-screen support (CSS `env()` for fold geometry, `@media (horizontal-viewport-segments: 2)`)

#### 5B: Touch & Gesture Interaction
- Touch target sizes (≥44×44px Apple HIG / ≥48dp Material Design)
- Thumb zone optimization — are primary actions within comfortable one-handed reach?
- Bottom-anchored navigation patterns (tab bars, FABs, bottom sheets)
- Swipe gestures: swipe-to-action (delete, archive), swipe-back navigation awareness
- Pull-to-refresh implementation (custom or native, does it conflict with browser refresh?)
- Long press / context menu patterns
- Overscroll behavior (`overscroll-behavior` CSS property — elastic bounce vs. hard stop vs. navigation trigger)
- Touch event handling: passive listeners for scroll performance, no 300ms tap delay
- Pinch-to-zoom: is it appropriately enabled (content) or disabled (app-like UI)?

#### 5C: Mobile Form UX
- `inputmode` attribute usage (`numeric`, `tel`, `email`, `url`, `search`, `decimal`)
- `type` attribute optimization (matching keyboard layout to field purpose)
- `autocomplete` attributes for autofill (name, email, address, credit card, OTP)
- Minimum 16px font size on `<input>` and `<select>` (prevents iOS auto-zoom)
- Biometric authentication support (Web Authentication API — Face ID / Touch ID / fingerprint)
- OTP auto-read support (`autocomplete="one-time-code"`, Web OTP API)
- Mobile-friendly date/time pickers (native vs. custom — does custom beat native?)
- Form field grouping and step-by-step wizards vs. long scrolling forms
- Virtual keyboard management: does the form scroll correctly when keyboard appears? Does fixed bottom UI get pushed up or obscured?

#### 5D: PWA & Native-Like Capabilities
- Web App Manifest presence and quality (`manifest.json` with name, icons, theme color, display mode)
- Service Worker registration and caching strategy (Cache First, Network First, Stale-While-Revalidate)
- Offline support: graceful degradation vs. full offline functionality vs. nothing
- Install prompt strategy: timing, frequency, dismissal behavior
- Push notification support and permission request UX (not on first visit)
- Background sync for deferred actions
- Share Target API (can the app receive shared content from other apps?)
- Badge API for notification counts on app icon
- App shortcuts (quick actions from home screen long press)
- Standalone/fullscreen mode behavior: custom status bar, back navigation handling, splash screen quality

#### 5E: Mobile Performance & Network Resilience
- Network-aware loading: does the site adapt to connection quality? (`navigator.connection` API)
- Data saver / Lite mode respect: reduced image quality, deferred non-critical loads
- Adaptive serving: different asset quality for 3G vs. 5G
- Battery-conscious patterns: minimize background processing, reduce animation on low battery
- Content-visibility (`content-visibility: auto`) for off-screen rendering optimization
- Skeleton screens and progressive content loading to maintain perceived performance

#### 5F: Cross-Device Continuity
- Session persistence: does login state survive device switching?
- Form data preservation: if a user starts a form on desktop, can they continue on mobile?
- Scroll position and UI state: any continuity mechanisms (deep links, state in URL)?
- Clipboard/share integration for cross-device workflows
- QR code or handoff patterns for deliberate device transitions

**2026 Standard:** PWA capabilities are baseline expectations for any serious web application. Container queries and new viewport units are production-ready. Mobile form UX with proper `inputmode`, `autocomplete`, and biometric auth separates amateur from professional implementations. Cross-device continuity is emerging as a differentiator. Sites that treat mobile as "the same thing but smaller" will feel dated.

---

### DIMENSION 6: Information Architecture & Navigation
**Weight: 8%**

Check:
- Navigation clarity and discoverability
- Breadcrumb presence on deep pages
- Search functionality quality (fuzzy matching, recent searches, filters)
- Content hierarchy and scan-ability (F-pattern, Z-pattern awareness)
- Empty states and error pages (helpful, branded, actionable)
- Onboarding flow (for apps) — progressive disclosure vs. information dump
- Deep linking and URL structure (human-readable, shareable)

**2026 Standard:** Command palette (⌘K) for power users, contextual AI-powered search, progressive disclosure patterns, smart defaults that reduce clicks.

---

### DIMENSION 7: AI-Readiness & Modern Web Patterns
**Weight: 7%**

Check:
- AI assistant integration (chat, search, recommendations) — quality not just presence
- Streaming UI patterns (typewriter, progressive rendering, loading skeletons for AI responses)
- Personalization capabilities (beyond "Hi, [name]" — actual content adaptation)
- Structured data / schema.org markup (for AI crawlers and rich results)
- `llms.txt` file presence (AI content access standard)
- Conversational UI patterns (if applicable)
- AI-generated content disclosure (transparency indicators)
- Agent-friendly architecture (API-first surfaces, structured actions)

**2026 Standard:** Sites without structured data and AI-friendly content will lose discoverability in AI-powered search (ChatGPT Search, Gemini, Perplexity, SearchGPT). Agent-compatible sites gain organic traffic from AI-driven task completion.

---

### DIMENSION 8: Ethical Design & Trust
**Weight: 5%**

Check:
- Dark patterns (hidden costs, forced continuity, roach motels, confirmshaming)
- Cookie consent UX (not dark pattern-y, genuine choice architecture)
- Privacy-first data collection (minimal collection, clear purpose)
- Transparent pricing/policies
- Inclusive imagery and language (diversity without tokenism)
- Cognitive load management (decision fatigue awareness)
- Sustainability (carbon-aware design, efficient asset loading)

**2026 Standard:** EU Digital Services Act compliance, FTC dark pattern enforcement, GDPR enforcement trends, sustainability metrics (Website Carbon Calculator benchmarks).

---

### DIMENSION 9: Design Originality & Differentiation 🆕
**Weight: 10%** — The Anti-Homogenization Dimension

This dimension evaluates whether the design has a genuine identity or has collapsed into
the "AI template aesthetic" — the visual equivalent of elevator music.

#### 9A: Template Dependency Audit
Check for signs of unmodified template/library defaults:
- **Tailwind defaults**: untouched spacing scale (4/8/12/16), default border-radius (`rounded-lg`), default shadows, default color palette (slate/zinc/neutral). Score lower if the site looks like it could have been generated by `npx shadcn@latest init` without customization.
- **Component library DNA**: Does every card, button, input, and dialog look like stock shadcn/ui, Radix Themes, Chakra UI, or MUI defaults? Or has the team established a custom component language?
- **Icon monoculture**: Is the entire icon set Lucide/Heroicons/Phosphor with zero customization? Or are there custom icons, brand-specific glyphs, or a thoughtful mixed system?
- **Layout formula**: Does the page follow the exact hero → feature grid → social proof → CTA → footer formula that every AI-generated landing page produces?

#### 9B: Visual Signature Assessment
Check for presence of distinctive design elements:
- **Custom typography**: Is there a typeface choice that reflects brand personality, or is it Inter/Geist/System UI? (Note: Inter/system fonts are fine technically — score based on whether the typography *system* has character, not just the face itself.)
- **Color personality**: Does the palette evoke something specific or is it another blue-primary-with-gray-neutrals scheme? Look for unexpected accent colors, gradient strategies, or chromatic approaches.
- **Spatial design language**: Does the whitespace have intentionality? Are there asymmetric layouts, unconventional grid breaks, or editorial-style compositions?
- **Illustration/imagery strategy**: Stock photos with blue overlay? Generic 3D isometric illustrations? AI-generated hero images? Or a curated visual language with genuine character?
- **Motion signature**: Is there a distinctive animation philosophy — a custom easing curve, a signature transition pattern, an unconventional loading state — or just default `ease-in-out 300ms` everywhere?

#### 9C: Competitive Distinctiveness
- Could this site be confused with a direct competitor if logos were removed?
- Does the design reinforce the brand's unique value proposition visually?
- Is there at least one "only we do this" design element?

#### Scoring Guide for Dimension 9:
- **9-10**: Strong design fingerprint. Custom type, distinctive color, original layouts, signature interactions. Could not be replicated by AI prompting alone.
- **7-8**: Modified defaults with personality. Template foundation but significantly customized with brand-specific choices.
- **5-6**: Lightly skinned template. Changed colors and logo but component DNA is visible. Indistinguishable from hundreds of similar sites.
- **3-4**: Stock template with brand colors swapped. Layout formula is generic. No visual identity beyond the logo.
- **0-2**: Pure unmodified template or AI-generated output. Could be any company in any industry.

**2026 Standard:** As AI-generated sites proliferate, design originality becomes a competitive moat. Brand recall, user trust, and perceived quality all correlate with distinctive design. Sites that feel "generated" increasingly trigger user skepticism ("is this a real company or a scam?").

---

## Step 3: Generate the Report

Present findings in this exact structure:

```
═══════════════════════════════════════════
  🔍 UX AUDIT REPORT — [Site Name]
  Audited: [Date] | Standard: 2026+
═══════════════════════════════════════════

## OVERALL SCORE: [X/100] — [Grade]

[One sentence verdict]

---

## SCORECARD

| Dimension                        | Score | Weight | Weighted | Status |
|----------------------------------|-------|--------|----------|--------|
| Visual Design & Brand            | X/10  | 10%    | X.X      | 🟢/🟡/🔴 |
| Interaction & Micro-interactions | X/10  | 12%    | X.X      | 🟢/🟡/🔴 |
| Accessibility (WCAG 2.2)         | X/10  | 18%    | X.X      | 🟢/🟡/🔴 |
| Performance & Core Web Vitals    | X/10  | 18%    | X.X      | 🟢/🟡/🔴 |
| Mobile-First & Responsive        | X/10  | 12%    | X.X      | 🟢/🟡/🔴 |
| Information Architecture         | X/10  | 8%     | X.X      | 🟢/🟡/🔴 |
| AI-Readiness                     | X/10  | 7%     | X.X      | 🟢/🟡/🔴 |
| Ethical Design & Trust           | X/10  | 5%     | X.X      | 🟢/🟡/🔴 |
| Design Originality 🆕            | X/10  | 10%    | X.X      | 🟢/🟡/🔴 |

🟢 Good (8–10)  🟡 Needs Work (5–7)  🔴 Critical (0–4)

---

## 🧬 HOMOGENIZATION RISK ASSESSMENT

**Risk Level: [Low / Medium / High / Critical]**

Template DNA Detected:
- [List specific template/library defaults found]
- [e.g., "Unmodified shadcn/ui Card, Dialog, and Button components"]
- [e.g., "Default Tailwind spacing scale throughout"]

Design Fingerprint Elements Found:
- [List distinctive elements, if any]
- [e.g., "Custom illustration system with hand-drawn style"]
- [e.g., "None identified — site is visually interchangeable with competitors"]

**Differentiation Verdict:** [One sentence — does this site have a visual identity or is it
another face in the AI-generated crowd?]

---

## 🔴 CRITICAL ISSUES (Fix First)
[List issues that severely impact users or compliance]

## 🟡 IMPROVEMENT AREAS
[Issues worth addressing for better UX]

## 🟢 WHAT'S WORKING WELL
[Genuine strengths — be specific]

---

## 📋 PRIORITIZED ACTION PLAN

### Quick Wins (< 1 day)
- [Specific, actionable items]

### Short Term (1–2 weeks)
- [Specific items]

### Strategic (1–3 months)
- [Larger initiatives]

### Design Identity Recommendations
- [Specific suggestions to develop a stronger design fingerprint]
- [These should be practical, not vague — e.g., "Commission a custom icon set for your
  core 20 product icons" rather than "be more creative"]

---

## 2026 COMPLIANCE SUMMARY

✅ Meets standard: [list]
⚠️ Partially meets: [list]
❌ Does not meet: [list]

---

*Report generated using UX Audit 2026+ Skill*
*Standards: WCAG 2.2, Core Web Vitals (INP), EAA 2025, DSA, Anti-Homogenization Assessment*
```

---

## Scoring Guide

| Score | Grade | Meaning |
|-------|-------|---------|
| 90–100 | A+ | Exceptional — 2026-ready with strong design identity |
| 80–89 | A | Strong — minor improvements, good differentiation |
| 70–79 | B | Solid foundation — notable gaps or template dependency |
| 60–69 | C | Functional but dated or generic |
| 50–59 | D | Poor UX — multiple critical issues or no design identity |
| <50 | F | Fundamental redesign needed |

---

## Important Notes

- Be **specific**: cite actual elements, pages, or patterns observed
- Be **constructive**: pair every problem with a recommended fix
- Be **honest but fair**: don't penalize for things you couldn't verify
- If you couldn't fetch the site, note what you could and couldn't assess
- Focus on **impact**: not every issue deserves equal emphasis
- For Dimension 9 (Originality): **name the specific libraries/templates** you detect, don't be vague. "Looks like shadcn/ui" is better than "looks generic". Recognizing a template is not a criticism of the tool — it's a signal that the team hasn't invested in differentiation.
- When suggesting differentiation improvements, be **practical and budget-aware**: a startup can't commission a full custom design system, but they can customize 5 key components, choose a distinctive typeface, and develop one signature interaction.

## Special Cases

**SaaS web apps**: Weight Dimensions 6 (IA), 2 (Interactions), and 9 (Originality) more heavily — SaaS products live or die by interaction quality and competitive distinctiveness.
**E-commerce**: Weight Dimension 8 (Ethical Design) and performance more heavily. Originality matters for trust.
**Landing pages**: Weight Dimension 1 (Visual), conversion UX, and Dimension 9 (Originality) more heavily — landing pages are the most susceptible to AI-template monoculture.
**Government/public sector**: Accessibility (Dimension 3) is legally mandatory — flag any failures as Critical. Originality is less relevant here.
**Creative agencies/portfolios**: Dimension 9 (Originality) should be weighted at 20%+ — a creative agency using default templates is a fundamental brand credibility problem.
**AI/tech products**: Check for ironic homogenization — AI companies whose own sites look AI-generated undermine their credibility as innovators.
