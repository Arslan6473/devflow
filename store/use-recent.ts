import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_RECENT = 6;

interface RecentState {
  recent: string[];
  addRecent: (slug: string) => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (slug: string) =>
        set((state) => {
          const filtered = state.recent.filter((s) => s !== slug);
          return { recent: [slug, ...filtered].slice(0, MAX_RECENT) };
        }),
    }),
    {
      name: "devflow-recent",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
