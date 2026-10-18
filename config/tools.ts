import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Braces, KeyRound, FileCode2, Link2, Regex } from "lucide-react";

export type ToolCategory = "Formatters" | "Encoders" | "Security" | "Text";

export type Tool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  load: () => Promise<{ default: ComponentType }>;
};

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortName: "JSON Formatter",
    description:
      "Instantly format, prettify, and validate JSON. Detect syntax errors, collapse/expand nodes, and copy clean output with one click.",
    category: "Formatters",
    icon: Braces,
    keywords: ["json", "formatter", "validator", "prettify", "lint", "syntax"],
    load: () => import("@/components/tools/json-formatter"),
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortName: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens — header, payload, and signature — entirely in your browser. No token ever leaves your device.",
    category: "Security",
    icon: KeyRound,
    keywords: ["jwt", "json web token", "decode", "auth", "bearer", "oauth", "claims"],
    load: () => import("@/components/tools/jwt-decoder"),
  },
  {
    slug: "base64",
    name: "Base64 Encoder & Decoder",
    shortName: "Base64",
    description:
      "Encode any text or binary data to Base64, or decode Base64 back to plain text. Supports URL-safe Base64 variants.",
    category: "Encoders",
    icon: FileCode2,
    keywords: ["base64", "encode", "decode", "binary", "url-safe", "atob", "btoa"],
    load: () => import("@/components/tools/base64"),
  },
  {
    slug: "url-encoder",
    name: "URL Encoder & Decoder",
    shortName: "URL Encoder",
    description:
      "Encode or decode URL components and query strings. Handles percent-encoding, special characters, and full URL parsing.",
    category: "Encoders",
    icon: Link2,
    keywords: ["url", "encode", "decode", "percent-encoding", "query string", "uri", "encodeURIComponent"],
    load: () => import("@/components/tools/url-encoder"),
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortName: "Regex Tester",
    description:
      "Write, test, and debug regular expressions with live match highlighting, capture group inspection, and flag toggles.",
    category: "Text",
    icon: Regex,
    keywords: ["regex", "regular expression", "pattern", "match", "test", "flags", "capture groups"],
    load: () => import("@/components/tools/regex-tester"),
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export const categories: ToolCategory[] = ["Formatters", "Encoders", "Security", "Text"];

export function toolsByCategory(): Record<ToolCategory, Tool[]> {
  const result = {} as Record<ToolCategory, Tool[]>;
  for (const cat of categories) {
    result[cat] = tools.filter((t) => t.category === cat);
  }
  return result;
}
