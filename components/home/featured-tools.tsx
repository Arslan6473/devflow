"use client";

import { tools } from "@/config/tools";
import { SectionHeading } from "@/components/shared/section-heading";
import { ToolCard } from "@/components/shared/tool-card";

export function FeaturedTools() {
  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Tools"
        title="Everything you need"
        subtitle="Five essential developer tools, each crafted for speed and privacy."
        align="center"
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
