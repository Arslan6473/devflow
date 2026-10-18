import Link from "next/link";
import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/80 py-12">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-block w-fit">
              <span className="text-lg font-bold gradient-text">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Fast, private developer utilities that run entirely in your browser.
            </p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-xs border border-border/40 rounded-md px-3 py-2 bg-muted/30">
              🔒 All tools run in your browser. Nothing you paste leaves your device.
            </p>
          </div>

          {/* Tools column */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Tools</h3>
            <ul className="flex flex-col gap-2">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Docs", href: "/docs" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Privacy", href: "/privacy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
