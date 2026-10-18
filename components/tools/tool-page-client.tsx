"use client";

import { getTool } from "@/config/tools";
import { ToolShell } from "@/components/shared/tool-shell";
import { DynamicTool } from "@/components/tools/dynamic-tool";

interface ToolPageClientProps {
  slug: string;
}

export function ToolPageClient({ slug }: ToolPageClientProps) {
  const tool = getTool(slug);
  if (!tool) return null;

  return (
    <ToolShell tool={tool}>
      <DynamicTool slug={slug} />
    </ToolShell>
  );
}
