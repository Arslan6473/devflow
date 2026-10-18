import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false on the server and on the first client render,
 * then true once hydrated. Use this to guard localStorage/zustand
 * persisted state reads and avoid SSR hydration mismatches.
 *
 * Implemented with useSyncExternalStore so the client/server snapshots
 * differ without a setState-in-effect (which the lint rules flag).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
