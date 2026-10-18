"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { runRegex, type RegexMatch } from "@/lib/regex";

const DEFAULT_PATTERN = "(\\w+)@(\\w+)";
const DEFAULT_FLAGS = "g";
const DEFAULT_TEST_STRING =
  "Contact us at hello@devflow.dev or support@example.com\nYou can also reach alice@company.org for enterprise inquiries.";

const ALL_FLAGS = ["g", "i", "m", "s", "u", "y"] as const;
type Flag = (typeof ALL_FLAGS)[number];

const FLAG_DESCRIPTIONS: Record<Flag, string> = {
  g: "Global — find all matches",
  i: "Case insensitive",
  m: "Multiline — ^ and $ match line starts/ends",
  s: "Dot all — . matches newlines",
  u: "Unicode mode",
  y: "Sticky — match from lastIndex only",
};

function buildHighlighted(text: string, matches: RegexMatch[]): React.ReactNode[] {
  if (!matches.length) return [text];

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  // Sort matches by index, filter out overlapping
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const nonOverlapping: RegexMatch[] = [];
  let lastEnd = 0;
  for (const m of sorted) {
    if (m.index >= lastEnd) {
      nonOverlapping.push(m);
      const len = m.match.length || 1;
      lastEnd = m.index + len;
    }
  }

  for (let i = 0; i < nonOverlapping.length; i++) {
    const m = nonOverlapping[i];
    const matchLen = m.match.length;

    // Text before this match
    if (m.index > cursor) {
      nodes.push(text.slice(cursor, m.index));
    }

    if (matchLen === 0) {
      // Zero-length match — show a cursor marker
      nodes.push(
        <mark
          key={i}
          className="bg-violet-500/30 text-violet-300 rounded-sm outline outline-1 outline-violet-400/50"
          title={`Match ${i + 1}: (empty)`}
        >
          &#x200B;
        </mark>
      );
      cursor = m.index;
    } else {
      nodes.push(
        <mark
          key={i}
          className="bg-violet-500/30 text-violet-200 rounded-sm outline outline-1 outline-violet-400/50"
          title={`Match ${i + 1}: "${m.match}" at ${m.index}`}
        >
          {m.match}
        </mark>
      );
      cursor = m.index + matchLen;
    }
  }

  // Remaining text after last match
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [flags, setFlags] = useState(DEFAULT_FLAGS);
  const [testString, setTestString] = useState(DEFAULT_TEST_STRING);

  // Debounced values
  const [debouncedPattern, setDebouncedPattern] = useState(pattern);
  const [debouncedFlags, setDebouncedFlags] = useState(flags);
  const [debouncedTest, setDebouncedTest] = useState(testString);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedPattern(pattern);
      setDebouncedFlags(flags);
      setDebouncedTest(testString);
    }, 150);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pattern, flags, testString]);

  const result = useMemo(
    () => runRegex(debouncedPattern, debouncedFlags, debouncedTest),
    [debouncedPattern, debouncedFlags, debouncedTest]
  );

  const matches: RegexMatch[] = useMemo(
    () => (result.ok ? result.value : []),
    [result]
  );
  const regexError = !result.ok ? result.error : null;

  function toggleFlag(flag: Flag) {
    setFlags((prev) => {
      if (prev.includes(flag)) {
        return prev.replace(flag, "");
      } else {
        // Keep flags in a sensible order
        return ALL_FLAGS.filter((f) => prev.includes(f) || f === flag).join("");
      }
    });
  }

  const highlighted = useMemo(
    () => buildHighlighted(debouncedTest, matches),
    [debouncedTest, matches]
  );

  return (
    <div className="space-y-5">
      {/* Pattern row */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Regular Expression
        </label>
        <div className="flex items-center gap-0 rounded-lg border border-border bg-muted/20 overflow-hidden focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <span className="px-3 py-2 text-muted-foreground font-mono text-sm select-none">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm py-2 text-foreground placeholder:text-muted-foreground/50"
            spellCheck={false}
          />
          <span className="px-1 py-2 text-muted-foreground font-mono text-sm select-none">/</span>
          <span className="pr-3 py-2 text-violet-400 font-mono text-sm select-none min-w-[2ch]">
            {flags || ""}
          </span>
        </div>
      </div>

      {/* Flag toggles */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">Flags:</span>
        {ALL_FLAGS.map((flag) => {
          const active = flags.includes(flag);
          return (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              title={FLAG_DESCRIPTIONS[flag]}
              className={`px-2 py-0.5 rounded-md text-xs font-mono border transition-colors ${
                active
                  ? "bg-violet-600/30 text-violet-300 border-violet-500/50"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {flag}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {regexError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="font-medium">Invalid pattern: </span>
          {regexError}
        </div>
      )}

      {/* Test string */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Test String
        </label>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test your regex against…"
          className="font-mono text-sm min-h-[120px] resize-y"
          spellCheck={false}
        />
      </div>

      {/* Match count badge */}
      {!regexError && (
        <div className="flex items-center gap-2">
          <Badge
            className={
              matches.length > 0
                ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                : "bg-muted text-muted-foreground border-border"
            }
          >
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </Badge>
        </div>
      )}

      {/* Highlighted preview */}
      {!regexError && debouncedTest && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Highlighted Preview
          </label>
          <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[60px]">
            {highlighted}
          </div>
        </div>
      )}

      {/* Match list */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Matches
          </label>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide w-10">
                    #
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Match
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">
                    Index
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Groups
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => {
                  const namedKeys = Object.keys(m.namedGroups);
                  return (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">
                        {i + 1}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-violet-300">
                        {m.match || <span className="italic text-muted-foreground">(empty)</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">
                        {m.index}
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {m.groups.length === 0 && namedKeys.length === 0 ? (
                          <span className="text-muted-foreground italic">none</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {m.groups.map((g, gi) => (
                              <span
                                key={gi}
                                className="inline-flex items-center gap-1 rounded bg-blue-500/15 text-blue-300 px-1.5 py-0.5 font-mono"
                              >
                                <span className="text-muted-foreground">{gi + 1}:</span>
                                {g}
                              </span>
                            ))}
                            {namedKeys.map((k) => (
                              <span
                                key={k}
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 font-mono"
                              >
                                <span className="text-muted-foreground">{k}:</span>
                                {m.namedGroups[k]}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
