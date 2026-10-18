# DevFlow Design System Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the design-system foundation and config layer for DevFlow — CSS utilities, ThemeProvider, layout shell, site config, and tool registry.

**Architecture:** Tailwind v4 CSS-first (no tailwind.config.js). All design tokens live in `app/globals.css` via `@theme inline` and CSS custom properties. next-themes drives dark-default theming via `class` attribute. Config files (`config/site.ts`, `config/tools.ts`) are the single source of truth for site metadata and tool definitions.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, shadcn/ui (existing scaffold), next-themes 0.4.x, Inter + JetBrains Mono via `next/font/google`, lucide-react, sonner.

## Global Constraints

- Do NOT run `git commit` or `git add`.
- Tailwind v4 CSS-first — NO `tailwind.config.js`.
- Dark mode is the DEFAULT theme (`defaultTheme="dark"`, `attribute="class"`, `enableSystem`).
- TypeScript strict — `noEmit`, bundler module resolution.
- `@/*` path alias maps to project root.
- Do NOT remove existing shadcn tokens from `globals.css`.
- `npx tsc --noEmit` errors ONLY allowed on the 5 missing `@/components/tools/*` modules — everything else must be type-clean.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | Add violet→blue primary tokens; glass/gradient-text/bg-grid/glow utilities |
| `components/theme-provider.tsx` | Create | `"use client"` next-themes wrapper |
| `app/layout.tsx` | Modify | Inter + JetBrains Mono fonts, ThemeProvider, Toaster, metadata from siteConfig |
| `config/site.ts` | Create | `siteConfig` object (name, url, nav, faq, etc.) |
| `config/tools.ts` | Create | Tool registry (5 tools, helpers) |

---

### Task A: Extend `app/globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS custom properties `--primary`, `--ring`, `--accent` tuned to violet/indigo in both light and dark; utility classes `.glass`, `.gradient-text`, `.bg-grid`, `.glow`

- [ ] **Step 1: Update CSS variables for violet→blue primary**

In `app/globals.css`, update `:root` primary/accent/ring values and `.dark` primary/accent/ring values. Also add `--primary-gradient` and `--glow-color` custom properties. Tuned oklch values:

**`:root` block** — change these lines (leave all others untouched):
```css
  --primary: oklch(0.45 0.24 280);          /* violet */
  --primary-foreground: oklch(0.985 0 0);
  --accent: oklch(0.93 0.04 280);           /* soft violet tint */
  --accent-foreground: oklch(0.25 0.15 280);
  --ring: oklch(0.55 0.20 275);
  --sidebar-primary: oklch(0.45 0.24 280);
  --sidebar-ring: oklch(0.55 0.20 275);
```

**`.dark` block** — change these lines:
```css
  --primary: oklch(0.72 0.19 275);          /* lighter violet for dark bg */
  --primary-foreground: oklch(0.10 0.04 280);
  --accent: oklch(0.30 0.10 270);
  --accent-foreground: oklch(0.92 0.05 275);
  --ring: oklch(0.60 0.18 275);
  --sidebar-primary: oklch(0.72 0.19 275);
  --sidebar-ring: oklch(0.60 0.18 275);
```

Also add these custom gradient/glow tokens inside `:root` after `--sidebar-ring`:
```css
  /* DevFlow brand tokens */
  --primary-gradient: linear-gradient(135deg, oklch(0.55 0.24 285), oklch(0.55 0.22 240));
  --glow-color: oklch(0.55 0.24 280 / 40%);
```

And inside `.dark` after `--sidebar-ring`:
```css
  /* DevFlow brand tokens — dark */
  --primary-gradient: linear-gradient(135deg, oklch(0.72 0.19 275), oklch(0.65 0.20 240));
  --glow-color: oklch(0.72 0.19 275 / 35%);
```

- [ ] **Step 2: Add smooth transition on theme change (nice-to-have)**

In the `@layer base` block, after the existing `html { @apply font-sans; }` rule, add:
```css
  html {
    color-scheme: dark light;
  }
  *, *::before, *::after {
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.05s ease;
  }
```

- [ ] **Step 3: Add utility classes via `@layer utilities`**

After the `@layer base` closing brace, append:
```css
@layer utilities {
  /* Glass morphism card/panel */
  .glass {
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    background-color: oklch(1 0 0 / 5%);
    border: 1px solid oklch(1 0 0 / 10%);
  }

  /* Light-mode glass override */
  :root:not(.dark) .glass {
    background-color: oklch(0 0 0 / 4%);
    border-color: oklch(0 0 0 / 10%);
  }

  /* Violet→blue gradient text */
  .gradient-text {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  /* Subtle repeating grid for hero backgrounds */
  .bg-grid {
    background-image:
      repeating-linear-gradient(
        oklch(0.5 0 0 / 6%) 0px,
        transparent 1px,
        transparent 40px,
        oklch(0.5 0 0 / 6%) 40px
      ),
      repeating-linear-gradient(
        90deg,
        oklch(0.5 0 0 / 6%) 0px,
        transparent 1px,
        transparent 40px,
        oklch(0.5 0 0 / 6%) 40px
      );
  }

  /* Soft violet glow for accent buttons/cards */
  .glow {
    box-shadow:
      0 0 0 1px var(--glow-color),
      0 4px 24px var(--glow-color),
      0 1px 4px oklch(0 0 0 / 20%);
  }
}
```

- [ ] **Step 4: Verify CSS is syntactically valid**

Open `app/globals.css` and do a quick visual scan: ensure all braces are matched, no duplicate `@layer utilities` blocks, and the file ends cleanly.

---

### Task B: Create `components/theme-provider.tsx`

**Files:**
- Create: `components/theme-provider.tsx`

**Interfaces:**
- Produces: `ThemeProvider` component, re-exports `useTheme` from next-themes

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
```

---

### Task C: Rewrite `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`
- Consumes: `ThemeProvider` from `@/components/theme-provider`; `Toaster` from `@/components/ui/sonner`; `siteConfig` from `@/config/site`

**Interfaces:**
- Produces: Root layout with Inter (`--font-sans`), JetBrains Mono (`--font-mono`), ThemeProvider, Toaster, metadata

- [ ] **Step 1: Write the full replacement content for `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* TODO: <Navbar /> */}
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
              {/* TODO: drop in <Navbar /> here */}
              <div className="container flex h-14 max-w-screen-2xl items-center">
                <span className="font-semibold">{siteConfig.name}</span>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border/40 py-6">
              {/* TODO: drop in <Footer /> here */}
              <div className="container flex max-w-screen-2xl items-center justify-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {siteConfig.name}
              </div>
            </footer>
          </div>

          {/* TODO: <CommandPalette /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Task D: Create `config/site.ts`

**Files:**
- Create: `config/site.ts`

**Interfaces:**
- Produces: `siteConfig` (const), `SiteConfig` (type)

- [ ] **Step 1: Write the file**

```ts
export const siteConfig = {
  name: "DevFlow",
  shortName: "DevFlow",
  url: "https://devflow.app",
  description:
    "Fast, private, client-side developer tools — JSON formatter, JWT decoder, Base64, URL encoder, and regex tester.",
  ogImage: "/opengraph-image",
  links: { github: "https://github.com/devflow", twitter: "https://twitter.com/devflow" },
  nav: [
    { title: "Tools", href: "/tools" },
    { title: "Docs", href: "/docs" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
  ],
  faq: [
    { q: "Is my data sent to a server?", a: "No. Every tool runs entirely in your browser. Nothing you paste leaves your device." },
    { q: "Is DevFlow free?", a: "Yes, all tools are free to use." },
    { q: "Do you store JWTs or other input?", a: "Never. There is no backend and no storage of your input." },
    { q: "Can I use DevFlow offline?", a: "Once loaded, the tools work without a network connection." },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
```

---

### Task E: Create `config/tools.ts`

**Files:**
- Create: `config/tools.ts`

**Interfaces:**
- Produces: `ToolCategory`, `Tool` types; `tools: Tool[]`; `getTool(slug): Tool | undefined`; `categories: ToolCategory[]`; `toolsByCategory(): Record<ToolCategory, Tool[]>`

- [ ] **Step 1: Write the file**

```ts
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Braces, KeyRound, FileCode2, Link2, Regex } from "lucide-react";

export type ToolCategory = "Formatters" | "Encoders" | "Security" | "Text";

export type Tool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  load: () => Promise<{ default: ComponentType }>;
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortName: "JSON Formatter",
    description:
      "Instantly format, prettify, and validate JSON. Detect syntax errors, collapse/expand nodes, and copy clean output with one click.",
    category: "Formatters",
    icon: Braces,
    keywords: ["json", "formatter", "validator", "prettify", "lint", "syntax"],
    load: () => import("@/components/tools/json-formatter"),
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortName: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens — header, payload, and signature — entirely in your browser. No token ever leaves your device.",
    category: "Security",
    icon: KeyRound,
    keywords: ["jwt", "json web token", "decode", "auth", "bearer", "oauth", "claims"],
    load: () => import("@/components/tools/jwt-decoder"),
  },
  {
    slug: "base64",
    name: "Base64 Encoder & Decoder",
    shortName: "Base64",
    description:
      "Encode any text or binary data to Base64, or decode Base64 back to plain text. Supports URL-safe Base64 variants.",
    category: "Encoders",
    icon: FileCode2,
    keywords: ["base64", "encode", "decode", "binary", "url-safe", "atob", "btoa"],
    load: () => import("@/components/tools/base64"),
  },
  {
    slug: "url-encoder",
    name: "URL Encoder & Decoder",
    shortName: "URL Encoder",
    description:
      "Encode or decode URL components and query strings. Handles percent-encoding, special characters, and full URL parsing.",
    category: "Encoders",
    icon: Link2,
    keywords: ["url", "encode", "decode", "percent-encoding", "query string", "uri", "encodeURIComponent"],
    load: () => import("@/components/tools/url-encoder"),
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortName: "Regex Tester",
    description:
      "Write, test, and debug regular expressions with live match highlighting, capture group inspection, and flag toggles.",
    category: "Text",
    icon: Regex,
    keywords: ["regex", "regular expression", "pattern", "match", "test", "flags", "capture groups"],
    load: () => import("@/components/tools/regex-tester"),
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export const categories: ToolCategory[] = ["Formatters", "Encoders", "Security", "Text"];

export function toolsByCategory(): Record<ToolCategory, Tool[]> {
  const result = {} as Record<ToolCategory, Tool[]>;
  for (const cat of categories) {
    result[cat] = tools.filter((t) => t.category === cat);
  }
  return result;
}
```

---

### Task F: Verify TypeScript and Dev Server

**Files:** (no changes)

- [ ] **Step 1: Run `tsc --noEmit` and verify only 5 expected errors**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit 2>&1
```

Expected: exactly 5 errors, all of the form `Cannot find module '@/components/tools/<name>'`. Zero errors from any other file.

- [ ] **Step 2: Start dev server, curl home page, stop server**

```bash
cd /home/hp/Projects/Test-Project/devflow && npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: HTTP 200.

- [ ] **Step 3: Write phase1-report.md**

Write to `docs/superpowers/reports/phase1-report.md` listing files created/modified, utility additions, and tsc error confirmation.
