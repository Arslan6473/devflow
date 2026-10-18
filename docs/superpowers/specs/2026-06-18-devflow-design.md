# DevFlow — Developer Tools Platform Design

**Date:** 2026-06-18
**Status:** Approved — ready for implementation planning

## Summary

DevFlow is a premium, client-side developer utility website built with Next.js 15
(App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and Framer Motion. It offers
five daily-use developer tools that run entirely in the browser (no backend, nothing
leaves the client), wrapped in a polished SaaS UI inspired by Linear, Vercel, GitHub,
and Raycast.

This first build is a **polished core MVP**: all five tools fully working, a marketing
home page, an All Tools page, individual SSG tool pages, an MDX-backed blog and docs
system, static About/Contact/Privacy pages, full SEO, dark/light theming, command-palette
search, favorites, recent tools, and reserved ad slots.

## Goals

- Five correct, fast, fully client-side developer tools.
- A premium, responsive UI that developers would bookmark.
- Clean, registry-driven architecture that makes adding a sixth tool trivial.
- Strong SEO foundations (per-tool metadata, structured data, sitemap, robots).
- Unit-tested tool logic separated from UI.

## Non-Goals (this pass)

- No server-side persistence, accounts, or databases.
- No real AdSense script/IDs (reserved slot components only).
- No contact-form backend (client-side validation + mailto/feedback UX only).
- No analytics integration.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript (strict).
- **Styling:** Tailwind CSS v4 (CSS-first config, theme tokens as CSS variables).
- **UI primitives:** shadcn/ui (Radix-based), lucide-react icons.
- **Animation:** Framer Motion.
- **Theming:** next-themes (dark default, no flash).
- **State:** zustand with `persist` middleware (localStorage).
- **Toasts:** sonner.
- **Editor:** `@monaco-editor/react` (lazy, client-only, theme-synced).
- **Forms/validation:** react-hook-form + zod (contact page, any validated inputs).
- **JWT:** `jose` for decoding/verification utilities.
- **Content:** MDX for blog and docs.
- **Testing:** Vitest for `lib/` tool logic.
- All dependencies are open-source.

## Architecture

### Key decision: registry-driven tools

A central tool registry (`config/tools.ts`) is the single source of truth. Each tool is:

```ts
type Tool = {
  slug: string;            // "json-formatter"
  name: string;            // "JSON Formatter & Validator"
  shortName: string;       // "JSON Formatter"
  description: string;     // SEO + card copy
  category: ToolCategory;  // "Formatters" | "Encoders" | "Security" | "Text"
  icon: LucideIcon;
  keywords: string[];      // search + SEO
  component: () => Promise<{ default: ComponentType }>; // dynamic import
};
```

This registry drives: the All Tools grid, command-palette search, favorites/recent,
related-tools internal linking, `generateStaticParams`, per-tool `generateMetadata`,
JSON-LD, and the sitemap. Adding a tool = one registry entry + one component file.

### Folder structure

```
app/
  layout.tsx                 # ThemeProvider, Toaster, fonts, base metadata, Navbar/Footer
  page.tsx                   # Home
  tools/page.tsx             # All Tools (searchable/filterable grid)
  tools/[slug]/page.tsx      # Individual tool page (generateStaticParams + generateMetadata)
  blog/page.tsx              # Blog index
  blog/[slug]/page.tsx       # Blog post (MDX)
  docs/page.tsx              # Docs index
  docs/[slug]/page.tsx       # Docs page (MDX)
  about/page.tsx
  contact/page.tsx
  privacy/page.tsx
  sitemap.ts
  robots.ts
  manifest.ts
  opengraph-image.tsx        # default OG image
components/
  ui/                        # shadcn primitives (button, card, dialog, input, tabs, ...)
  layout/                    # Navbar, Footer, CommandPalette, ThemeToggle, AdSlot, Breadcrumbs
  tools/                     # JsonFormatter, JwtDecoder, Base64Tool, UrlTool, RegexTester
  shared/                    # CodeEditor, CopyButton, DownloadButton, ToolShell, ToolCard,
                             #   FavoriteButton, SectionHeading, GradientBackground
  home/                      # Hero, FeaturedTools, ToolCategories, WhyDevFlow, Stats, FAQ, CTA
lib/
  json.ts                    # format, minify, validate
  jwt.ts                     # decode header/payload/signature, expiry, human timestamps
  base64.ts                  # encode/decode (UTF-8 safe), file helpers
  url.ts                     # encode/decode, query-string parse, URL validation
  regex.ts                   # build regex, find matches + capture groups
  utils.ts                   # cn(), clipboard, download helpers
  mdx.ts                     # read/parse MDX content
  seo.ts                     # metadata + JSON-LD builders
config/
  tools.ts                   # tool registry
  site.ts                    # site metadata, nav, social, FAQ data
store/
  use-favorites.ts           # zustand, persisted
  use-recent.ts              # zustand, persisted
content/
  blog/*.mdx
  docs/*.mdx
__tests__/ or *.test.ts      # Vitest unit tests for lib/
```

## Tool Specifications

All tools live inside a shared `ToolShell` (header with name/description, favorite
toggle, breadcrumb, ad slots) and use the shared `CodeEditor`, `CopyButton`, and
`DownloadButton`. Each tool records itself in "recent tools" on mount.

### 1. JSON Formatter & Validator
- Pretty-print with configurable indent (2/4/tab).
- Minify.
- Validate with precise error message + line/column when available.
- Copy formatted output; download as `.json`.
- Live two-pane (input → output) editor layout.

### 2. JWT Decoder
- Decode JWT into Header, Payload, Signature sections.
- Show expiration status (valid / expired / not-yet-valid) using `exp`/`nbf`/`iat`.
- Human-readable timestamps for `exp`, `iat`, `nbf`.
- No storage; purely client-side decode. Clearly note signature is not verified
  (no secret) — decode only.

### 3. Base64 Encoder & Decoder
- Encode text → Base64 and decode Base64 → text (UTF-8 safe, not naive btoa).
- URL-safe variant toggle.
- File support: encode an uploaded file to Base64; decode + download.
- Copy output.

### 4. URL Encoder & Decoder
- Encode / decode (encodeURIComponent / decodeURIComponent).
- Query-string parser: break a URL into a readable key/value table.
- URL validation with feedback.
- Copy output.

### 5. Regex Tester
- Live regex testing against a test string with debounced real-time updates.
- Highlight matches inline.
- Flag toggles (g, i, m, s, u, y).
- Match groups visualization (numbered + named capture groups per match).
- Graceful handling of invalid patterns.

## State Management

- `use-favorites`: `Set<slug>`-like array, toggle/add/remove, persisted to localStorage.
- `use-recent`: ordered list of recently used tool slugs (capped, e.g. last 6),
  most-recent-first, persisted.
- Both consumed by Navbar/CommandPalette/All Tools/Home. SSR-safe hydration guard
  to avoid mismatch.

## Bonus Features mapping

- **Tool Search** → CommandPalette (⌘K / Ctrl-K) fuzzy search over registry.
- **Favorites / Recent** → zustand stores, surfaced on Home and All Tools.
- **Copy / Download** → shared `CopyButton` / `DownloadButton` with sonner feedback.
- **Dark/Light** → next-themes toggle, dark default.
- **Keyboard Shortcuts** → ⌘K palette, `/` to focus search, Esc to close; documented in docs.
- **Responsive** → mobile-first layouts, collapsible nav.
- **AdSense-ready** → `AdSlot` placeholder components in layout gutters (no script).

## Pages

- **Home:** Hero, Featured Tools, Tool Categories, Why DevFlow, Stats, FAQ, CTA, Footer.
- **All Tools:** searchable + category-filterable grid of `ToolCard`s, with favorites section.
- **Individual Tool Pages:** SSG, per-tool SEO, breadcrumb, related tools, ad slots.
- **Blog:** MDX index + posts (2–3 sample posts) with `Article` structured data.
- **Docs:** MDX index + pages (getting started, keyboard shortcuts, privacy of tools).
- **About / Contact / Privacy:** static; Contact uses react-hook-form + zod (client-side,
  mailto submission, no backend).

## Design System & Theming

- Tailwind v4 CSS-first theme: color tokens (background, foreground, primary, accent,
  muted, border, card) as CSS variables for light + dark.
- Glassmorphism utility classes (backdrop blur + translucent borders) and gradient
  helpers for hero/accents.
- Fonts: Inter (UI) + JetBrains Mono (code), via `next/font`.
- Framer Motion: section reveal-on-scroll, card hover lift, command-palette transitions,
  page transitions — tasteful, reduced-motion aware.
- Monaco theme synced to next-themes (vs-dark / light).

## SEO

- Base metadata in root layout (title template, description, OG, Twitter, icons).
- Per-tool `generateMetadata` from the registry (title, description, keywords, canonical, OG).
- JSON-LD: `SoftwareApplication` per tool, `WebSite` + `Organization` on home,
  `Article` on blog posts, `BreadcrumbList` on tool/blog/docs pages.
- `sitemap.ts` and `robots.ts` generated from registry + MDX content.
- `manifest.ts` for PWA-style metadata.
- Internal linking: related tools, breadcrumbs, footer nav, blog↔tool cross-links.

## Error Handling

- Tool logic in `lib/` returns discriminated result objects
  (`{ ok: true, value } | { ok: false, error }`) — no thrown exceptions across the
  UI boundary; UI renders friendly inline error states.
- Invalid input (bad JSON, malformed JWT, invalid regex/URL) shows clear, specific
  messaging without crashing.
- Monaco and any client-only components are dynamically imported with `ssr: false`
  and loading fallbacks.
- Error boundary + `not-found.tsx` for unknown tool slugs / routes.

## Testing

- Vitest unit tests for every `lib/` module covering happy paths and edge cases:
  - json: valid/invalid/minify/indent.
  - jwt: valid decode, expired, missing parts, malformed.
  - base64: round-trip incl. non-ASCII, url-safe, invalid input.
  - url: encode/decode round-trip, query parsing, validation.
  - regex: matches + groups, invalid pattern, flags behavior.
- Build gate: `tsc` typecheck + `eslint` + `next build` must pass.

## Open-source / Privacy posture

All processing is client-side; tools never transmit input. The Privacy page and a
docs page state this explicitly. No telemetry in this build.
