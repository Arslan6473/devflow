import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllDocs } from "@/lib/mdx";
import { SectionHeading } from "@/components/shared/section-heading";
import { BookOpen, ChevronRight } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Docs",
  description:
    "Documentation for DevFlow — getting started, keyboard shortcuts, privacy details, and more.",
  path: "/docs",
});

export default function DocsPage() {
  const docs = getAllDocs();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Documentation"
        title="DevFlow Docs"
        subtitle="Everything you need to get the most out of DevFlow's developer tools."
        className="mb-10"
      />

      {docs.length === 0 ? (
        <p className="text-muted-foreground">Documentation coming soon.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/docs/${doc.slug}`}
                className="group flex items-start gap-4 glass rounded-xl p-5 hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 h-full"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {doc.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>
                <ChevronRight
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
