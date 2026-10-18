"use client";

import { toolsByCategory, categories } from "@/config/tools";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export function ToolCategories() {
  const byCategory = toolsByCategory();

  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Categories"
        title="Browse by category"
        subtitle="Tools grouped by what they do — find exactly what you need fast."
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const catTools = byCategory[cat];
          return (
            <div
              key={cat}
              className={cn(
                "glass rounded-xl p-5 flex flex-col gap-4 transition-shadow hover:shadow-lg hover:shadow-primary/10"
              )}
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-sm">{cat}</h3>
                <p className="text-xs text-muted-foreground">
                  {catTools.length} {catTools.length === 1 ? "tool" : "tools"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {catTools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.slug}
                      title={t.shortName}
                      className="inline-flex items-center justify-center rounded-lg p-2 bg-primary/10 border border-primary/20"
                    >
                      <Icon className="size-4 text-primary" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
