import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  order?: number;
};

const blogDir = path.join(process.cwd(), "content/blog");
const docsDir = path.join(process.cwd(), "content/docs");

/** Pages render the frontmatter title as the page's only <h1>; drop a duplicate leading "# Title". */
function stripLeadingH1(content: string): string {
  return content.replace(/^\s*#\s+[^\n]*\n/, "");
}

function readMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  const files = readMdxFiles(blogDir);
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(blogDir, filename), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
    } satisfies PostMeta;
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(
  slug: string
): { meta: PostMeta; content: string } | null {
  const filePath = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
    },
    content: stripLeadingH1(content),
  };
}

export function getAllDocs(): PostMeta[] {
  const files = readMdxFiles(docsDir);
  const docs = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(docsDir, filename), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      order: (data.order as number) ?? 999,
    } satisfies PostMeta;
  });
  return docs.sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.title ?? "").localeCompare(b.title ?? "");
  });
}

export function getDocBySlug(
  slug: string
): { meta: PostMeta; content: string } | null {
  const filePath = path.join(docsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      order: (data.order as number) ?? 999,
    },
    content: stripLeadingH1(content),
  };
}
