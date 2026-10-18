"use client";

import { useEffect } from "react";
import { type Tool } from "@/config/tools";
import { useRecent } from "@/store/use-recent";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { cn } from "@/lib/utils";

interface ToolShellProps {
  tool: Tool;
  children: React.ReactNode;
  className?: string;
}

export function ToolShell({ tool, children, className }: ToolShellProps) {
  const addRecent = useRecent((s) => s.addRecent);
  const Icon = tool.icon;

  useEffect(() => {
    addRecent(tool.slug);
  }, [tool.slug, addRecent]);

  return (
    <div className={cn("container mx-auto max-w-screen-xl py-6 px-4 md:px-8", className)}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.name },
        ]}
        className="mb-6"
      />

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          {/* Gradient icon chip */}
          <div className="shrink-0 inline-flex items-center justify-center rounded-xl p-3 bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-primary/20">
            <Icon className="size-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {tool.name}
              </h1>
              <FavoriteButton slug={tool.slug} className="shrink-0 mt-0.5" />
            </div>
            <p className="mt-1.5 text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </div>

      {/* Tool content */}
      <div>{children}</div>
    </div>
  );
}
