import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbLd, jsonLdScript } from "@/lib/seo";
import { getAllDocs, getDocBySlug } from "@/lib/mdx";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MdxRenderer } from "@/components/mdx-renderer";
import { siteConfig } from "@/config/site";
import { BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.meta.title,
    description: doc.meta.description,
    path: `/docs/${slug}`,
    keywords: doc.meta.tags,
  });
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const { meta, content } = doc;
  const allDocs = getAllDocs();

  const breadcrumbJsonLd = breadcrumbLd([
    { name: "Home", url: siteConfig.url },
    { name: "Docs", url: `${siteConfig.url}/docs` },
    { name: meta.title, url: `${siteConfig.url}/docs/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      <div className="container max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Docs", href: "/docs" },
            { label: meta.title },
          ]}
          className="mb-8"
        />

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documentation
              </p>
              <nav aria-label="Docs navigation">
                <ul className="space-y-0.5">
                  {allDocs.map((d) => {
                    const isActive = d.slug === slug;
                    return (
                      <li key={d.slug}>
                        <Link
                          href={`/docs/${d.slug}`}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
                          {d.title}
                          {isActive && (
                            <ChevronRight className="ml-auto size-3.5 text-primary" aria-hidden="true" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <article>
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                  {meta.title}
                </h1>
                <p className="text-lg text-muted-foreground">{meta.description}</p>
              </header>

              <div className="prose-container">
                <MdxRenderer source={content} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
