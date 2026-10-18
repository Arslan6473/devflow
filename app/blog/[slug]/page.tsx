import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, articleLd, breadcrumbLd, jsonLdScript } from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MdxRenderer } from "@/components/mdx-renderer";
import { siteConfig } from "@/config/site";
import { CalendarDays, Tag } from "lucide-react";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.meta.title,
    description: post.meta.description,
    path: `/blog/${slug}`,
    keywords: post.meta.tags,
    type: "article",
    publishedTime: post.meta.date || undefined,
    tags: post.meta.tags,
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const articleJsonLd = articleLd({
    title: meta.title,
    description: meta.description,
    date: meta.date,
    slug,
    tags: meta.tags,
  });

  const breadcrumbJsonLd = breadcrumbLd([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: meta.title, url: `${siteConfig.url}/blog/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      <div className="container max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: meta.title },
          ]}
          className="mb-8"
        />

        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              {meta.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-5">
              {meta.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {meta.date && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <time dateTime={meta.date}>{formatDate(meta.date)}</time>
                </span>
              )}
              {meta.tags && meta.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="size-4" aria-hidden="true" />
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </header>

          <div className="prose-container">
            <MdxRenderer source={content} />
          </div>
        </article>
      </div>
    </>
  );
}
