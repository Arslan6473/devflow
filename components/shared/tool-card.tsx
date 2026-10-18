"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { type Tool } from "@/config/tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
        tabIndex={0}
      >
        <div className="glass h-full rounded-xl p-5 transition-shadow hover:shadow-lg hover:shadow-primary/10 flex flex-col gap-4">
          {/* Icon chip */}
          <div className="flex items-start justify-between">
            <div className="inline-flex items-center justify-center rounded-lg p-2.5 bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-primary/20">
              <Icon className="size-5 text-primary" />
            </div>
            {/* FavoriteButton — stop click propagating to the link */}
            <span
              onClick={(e) => e.preventDefault()}
              onKeyDown={(e) => e.preventDefault()}
            >
              <FavoriteButton slug={tool.slug} />
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="font-semibold text-sm leading-snug">{tool.name}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
          </div>

          {/* Category badge */}
          <Badge variant="secondary" className="w-fit text-xs">
            {tool.category}
          </Badge>
        </div>
      </Link>
    </motion.div>
  );
}
