# Phase 8 Report — Blog, Docs, Static Pages, MDX

**Status: DONE**

## Build Route List

```
Route (app)
○  /                            (static)
○  /_not-found                  (static)
○  /about                       (static)
○  /blog                        (static)
●  /blog/[slug]                 (SSG)
   └ /blog/why-client-side-tools-are-better
   └ /blog/getting-started-with-devflow
○  /contact                     (static)
○  /docs                        (static)
●  /docs/[slug]                 (SSG)
   └ /docs/getting-started
   └ /docs/keyboard-shortcuts
   └ /docs/privacy-and-security
○  /privacy                     (static)
○  /tools                       (static)
●  /tools/[slug]                (SSG — pre-existing)
```

All blog and docs slugs prerender successfully as SSG.

## MDX Rendering Approach

Used **`next-mdx-remote/rsc`** (`MDXRemote` + `compileMDX` from the `next-mdx-remote` package's RSC-compatible export). This is the content-directory approach: MDX files live in `content/blog/*.mdx` and `content/docs/*.mdx`, parsed with `gray-matter` for frontmatter, and rendered with `<MDXRemote source={content} components={...} />` as a React Server Component.

The approach chosen avoids `@next/mdx` (which is file-based routing) and uses the library approach as specified. The `MdxRenderer` server component in `components/mdx-renderer.tsx` provides custom styled mappings for all standard HTML elements.

## Files Created

- `lib/mdx.ts` — server-side content utilities (`getAllPosts`, `getPostBySlug`, `getAllDocs`, `getDocBySlug`)
- `components/mdx-renderer.tsx` — RSC MDX renderer with custom styled components
- `components/contact-form.tsx` — client-side form using react-hook-form + zod/v3 + mailto open
- `app/blog/page.tsx` — blog index with glass card list
- `app/blog/[slug]/page.tsx` — blog post with `generateStaticParams`, `generateMetadata`, JSON-LD
- `app/docs/page.tsx` — docs index grid
- `app/docs/[slug]/page.tsx` — doc page with left sidebar navigation
- `app/about/page.tsx` — about page with values, tech stack, privacy stance
- `app/privacy/page.tsx` — full privacy policy
- `app/contact/page.tsx` — contact page using `ContactForm`
- `content/blog/getting-started-with-devflow.mdx`
- `content/blog/why-client-side-tools-are-better.mdx`
- `content/docs/getting-started.mdx`
- `content/docs/keyboard-shortcuts.mdx`
- `content/docs/privacy-and-security.mdx`

## Zod Note

`@hookform/resolvers/zod` imports from `zod/v3` internally, so the contact form uses `import { z } from "zod/v3"` to stay compatible with the resolver. This is intentional and matches how hookform works with zod v4 packages.

## Checks

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors
- `npm run build` — success, 20 static pages generated

## Concerns

None. The build is clean. The one lint issue encountered (`window.location.href` flagged by `react-hooks/immutability`) was fixed by switching to `window.open(mailto, "_self")` which achieves the same behavior without triggering the rule.
