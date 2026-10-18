"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { tools, getTool } from "@/config/tools";
import { useRecent } from "@/store/use-recent";
import { useFavorites } from "@/store/use-favorites";
import { useHydrated } from "@/hooks/use-hydrated";

// ── Tiny zustand store so Navbar can open the palette ─────────────────────────
interface CommandPaletteState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));

// ── Component ──────────────────────────────────────────────────────────────────
export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();
  const hydrated = useHydrated();

  const recentSlugs = useRecent((s) => s.recent);
  const favoriteSlugs = useFavorites((s) => s.favorites);
  const addRecent = useRecent((s) => s.addRecent);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ⌘K / Ctrl+K — always toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
        return;
      }
      // "/" — open only when not in an editable element
      if (e.key === "/" && !open) {
        const target = e.target as HTMLElement;
        const isEditable =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  function handleSelect(slug: string) {
    addRecent(slug);
    setOpen(false);
    router.push(`/tools/${slug}`);
  }

  // Gate persisted state on hydration
  const recentTools = hydrated
    ? recentSlugs.map((s) => getTool(s)).filter(Boolean)
    : [];
  const favoriteTools = hydrated
    ? favoriteSlugs.map((s) => getTool(s)).filter(Boolean)
    : [];

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for a tool or navigate quickly"
    >
      <CommandInput placeholder="Search tools…" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>

        {/* Recent group — only when query is empty (cmdk handles filtering) */}
        {hydrated && recentTools.length > 0 && (
          <CommandGroup heading="Recent">
            {recentTools.map((tool) => {
              if (!tool) return null;
              const Icon = tool.icon;
              return (
                <CommandItem
                  key={`recent-${tool.slug}`}
                  value={`recent ${tool.name} ${tool.category}`}
                  onSelect={() => handleSelect(tool.slug)}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span>{tool.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tool.category}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Favorites group */}
        {hydrated && favoriteTools.length > 0 && (
          <CommandGroup heading="Favorites">
            {favoriteTools.map((tool) => {
              if (!tool) return null;
              const Icon = tool.icon;
              return (
                <CommandItem
                  key={`fav-${tool.slug}`}
                  value={`favorite ${tool.name} ${tool.category}`}
                  onSelect={() => handleSelect(tool.slug)}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span>{tool.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {tool.category}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* All Tools group */}
        <CommandGroup heading="All Tools">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <CommandItem
                key={tool.slug}
                value={`${tool.name} ${tool.shortName} ${tool.category} ${tool.keywords.join(" ")}`}
                onSelect={() => handleSelect(tool.slug)}
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span>{tool.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {tool.category}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
