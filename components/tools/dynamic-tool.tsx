"use client";

import dynamic from "next/dynamic";

const loadingFallback = (
  <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
);

// Pre-created dynamic components at module level to satisfy react-hooks/static-components
const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": dynamic(
    () => import("@/components/tools/json-formatter"),
    { ssr: false, loading: () => loadingFallback }
  ),
  "jwt-decoder": dynamic(
    () => import("@/components/tools/jwt-decoder"),
    { ssr: false, loading: () => loadingFallback }
  ),
  base64: dynamic(
    () => import("@/components/tools/base64"),
    { ssr: false, loading: () => loadingFallback }
  ),
  "url-encoder": dynamic(
    () => import("@/components/tools/url-encoder"),
    { ssr: false, loading: () => loadingFallback }
  ),
  "regex-tester": dynamic(
    () => import("@/components/tools/regex-tester"),
    { ssr: false, loading: () => loadingFallback }
  ),
};

interface DynamicToolProps {
  slug: string;
}

export function DynamicTool({ slug }: DynamicToolProps) {
  const ToolUI = toolComponents[slug];
  if (!ToolUI) return null;
  return <ToolUI />;
}
