import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { buildMetadata, itemListLd, jsonLdScript } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { ToolsExplorer } from "@/components/tools/tools-explorer";

export const metadata = buildMetadata({
  title: "All Developer Tools — JSON, JWT, Base64, URL & Regex",
  description:
    "Browse every free DevFlow developer tool: JSON formatter & validator, JWT decoder, Base64 encoder/decoder, URL encoder/decoder, and regex tester. 100% client-side and private.",
  keywords: ["developer tools", ...tools.flatMap((t) => t.keywords.slice(0, 2))],
  path: "/tools",
});

export default function ToolsPage() {
  const listLd = itemListLd(
    tools.map((t) => ({ name: t.name, url: `${siteConfig.url}/tools/${t.slug}` }))
  );

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:py-16 md:px-8">
      <SectionHeading
        as="h1"
        eyebrow="Tools"
        title="All Developer Tools"
        subtitle="Fast, private, client-side tools — nothing leaves your browser."
        className="mb-8"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(listLd) }}
      />
      <ToolsExplorer />
    </div>
  );
}
