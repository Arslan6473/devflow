"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  height?: number | string;
  className?: string;
}

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full animate-pulse bg-muted rounded-md">
        <span className="text-xs text-muted-foreground">Loading editor…</span>
      </div>
    ),
  }
);

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  height = 320,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  const monacoTheme =
    !hydrated || resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme={monacoTheme}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          readOnly,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
