export const siteConfig = {
  name: "DevFlow",
  shortName: "DevFlow",
  // Set NEXT_PUBLIC_SITE_URL to the production domain so canonical/OG/sitemap URLs are correct
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://devflow.app").replace(/\/$/, ""),
  description:
    "Free online developer tools that run 100% in your browser — JSON formatter & validator, JWT decoder, Base64 encoder/decoder, URL encoder, and regex tester. No sign-up, no data uploads.",
  keywords: [
    "developer tools",
    "online developer tools",
    "json formatter",
    "json validator",
    "jwt decoder",
    "base64 encode decode",
    "url encoder",
    "regex tester",
    "client-side tools",
    "privacy-first dev tools",
  ],
  ogImage: "/opengraph-image",
  links: { github: "https://github.com/Arslan6473/devflow", twitter: "https://twitter.com/devflow" },
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
