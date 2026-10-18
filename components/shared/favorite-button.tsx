"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/store/use-favorites";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string;
  className?: string;
}

export function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const hydrated = useHydrated();
  const isFavorite = useFavorites((s) => s.isFavorite);
  const toggle = useFavorites((s) => s.toggle);

  // Gate persisted state behind hydration to avoid SSR mismatch
  const filled = hydrated && isFavorite(slug);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggle(slug)}
              aria-label={filled ? "Remove from favorites" : "Add to favorites"}
              className={cn(className)}
            />
          }
        >
          <Star
            className={cn(
              "size-4 transition-colors",
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          {filled ? "Remove from favorites" : "Add to favorites"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
