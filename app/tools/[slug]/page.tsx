import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, getTool } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { buildMetadata, softwareAppLd, breadcrumbLd, jsonLdScript } from "@/lib/seo";
import { ToolPageClient } from "@/components/tools/tool-page-client";
import { RelatedTools } from "@/components/tools/related-tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return buildMetadata({
    title: `${tool.name} — Free Online Tool`,
    description: `${tool.description} Free, fast, and 100% client-side.`,
    path: "/tools/" + slug,
    keywords: tool.keywords,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  // Related tools: same category excluding self, top up from others if < 2
  const sameCat = tools.filter(
    (t) => t.category === tool.category && t.slug !== tool.slug
  );
  const others = tools.filter(
    (t) => t.category !== tool.category && t.slug !== tool.slug
  );
  const related =
    sameCat.length >= 2
      ? sameCat.slice(0, 4)
      : [...sameCat, ...others].slice(0, 4);

  const relatedSlugs = related.map((t) => t.slug);

  const appLd = softwareAppLd(tool);
  const crumbLd = breadcrumbLd([
    { name: "Home", url: siteConfig.url },
    { name: "Tools", url: siteConfig.url + "/tools" },
    { name: tool.name, url: siteConfig.url + "/tools/" + slug },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(crumbLd) }}
      />

      <ToolPageClient slug={slug} />

      <RelatedTools slugs={relatedSlugs} />
    </>
  );
}
