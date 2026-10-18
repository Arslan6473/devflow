"use client";

import { getTool } from "@/config/tools";
import { ToolCard } from "@/components/shared/tool-card";
import { SectionHeading } from "@/components/shared/section-heading";

interface RelatedToolsProps {
  slugs: string[];
}

export function RelatedTools({ slugs }: RelatedToolsProps) {
  if (slugs.length === 0) return null;

  const relatedTools = slugs
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<ReturnType<typeof getTool>> => t !== undefined);

  if (relatedTools.length === 0) return null;

  return (
    <section className="container mx-auto max-w-screen-xl px-4 md:px-8 pb-12">
      <SectionHeading
        title="Related Tools"
        subtitle="More developer tools you might find useful."
        className="mb-6"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
