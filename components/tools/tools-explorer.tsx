"use client";

import { useState } from "react";
import { tools, categories, type ToolCategory } from "@/config/tools";
import { ToolCard } from "@/components/shared/tool-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/store/use-favorites";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function ToolsExplorer() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">(
    "All"
  );
  const favorites = useFavorites((s) => s.favorites);
  const hydrated = useHydrated();

  const q = query.toLowerCase();
  const filtered = tools.filter((t) => {
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    const matchesSearch =
      q === "" ||
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.keywords.some((kw) => kw.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const favoritedTools =
    hydrated && favorites.length > 0
      ? tools.filter((t) => favorites.includes(t.slug))
      : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Search + category filters */}
      <div className="flex flex-col gap-4">
        <Input
          type="search"
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm h-10 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Favorites section */}
      {hydrated && favoritedTools.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Favorites</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoritedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* All / filtered tools */}
      <section className="flex flex-col gap-4">
        {filtered.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {filtered.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            No tools match &ldquo;{query}&rdquo;
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}.
          </p>
        )}
      </section>
    </div>
  );
}
