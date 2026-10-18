# DevFlow — Next.js 16 conventions (READ before writing route/page code)

This project runs **Next.js 16.2.9** (App Router). It differs from older Next.js in your
training data. The bundled official docs are the source of truth:
`node_modules/next/dist/docs/01-app/` — consult them when unsure, per the repo's AGENTS.md.

## Critical conventions

1. **`params` and `searchParams` are Promises.** You MUST `await` them.
   ```tsx
   // app/tools/[slug]/page.tsx
   export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
     // ...
   }
   export async function generateMetadata(
     { params }: { params: Promise<{ slug: string }> }
   ): Promise<Metadata> {
     const { slug } = await params;
     // ...
   }
   ```
   This applies to `page.tsx`, `layout.tsx`, `generateMetadata`, `opengraph-image.tsx`,
   and `route.ts` handlers that take dynamic segments.

2. **`generateStaticParams`** returns the param objects (synchronous values), e.g.
   `return tools.map((t) => ({ slug: t.slug }))`.

3. **Metadata file conventions** use `MetadataRoute` types:
   - `app/sitemap.ts` → `export default function sitemap(): MetadataRoute.Sitemap`
   - `app/robots.ts` → `export default function robots(): MetadataRoute.Robots`
   - `app/manifest.ts` → `export default function manifest(): MetadataRoute.Manifest`
   Check `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`.

4. **`metadataBase`** should be set in the root layout `metadata` so OG/canonical URLs resolve.

5. **Client-only components** (anything using Monaco, `window`, zustand stores, browser APIs)
   must be `"use client"`, and Monaco specifically must be loaded via
   `next/dynamic(..., { ssr: false })`.

6. **MDX**: consult `node_modules/next/dist/docs/01-app/02-guides/mdx.md` for the current
   recommended setup before wiring blog/docs. We use a content-directory approach
   (`content/blog/*.mdx`, `content/docs/*.mdx`) parsed with `gray-matter` +
   `next-mdx-remote/rsc`, not file-based MDX routes.

## Project-wide constraints (apply to every task)

- No `git commit` / `git add` — the user does not want commits. Create/modify files only.
- All tool processing is 100% client-side; nothing is transmitted or stored server-side.
- Tailwind v4 (CSS-first; tokens in `app/globals.css`). No `tailwind.config.js`.
- Dark mode is the DEFAULT theme.
- TypeScript strict. `npx tsc --noEmit`, `npm run lint`, and `npm run build` must pass at the end.
- Tool logic lives in `lib/` and returns `Result<T> = {ok:true,value} | {ok:false,error}` — never throws across the UI boundary.
- The tool registry `config/tools.ts` is the single source of truth (slugs, names, icons, categories, keywords, lazy `load`).
