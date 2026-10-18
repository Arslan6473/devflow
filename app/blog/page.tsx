import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";
import { SectionHeading } from "@/components/shared/section-heading";
import { CalendarDays, Tag } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Articles on developer tools, privacy, performance, and the thinking behind DevFlow.",
  path: "/blog",
});

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Blog"
        title="Insights & Updates"
        subtitle="Developer tools, privacy thinking, and what we're building at DevFlow."
        className="mb-10"
      />

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block glass rounded-xl p-6 hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
              >
                <article>
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {post.date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {formatDate(post.date)}
                      </span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Tag className="size-3.5" aria-hidden="true" />
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
