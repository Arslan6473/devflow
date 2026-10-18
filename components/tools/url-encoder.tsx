"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { encodeUrl, decodeUrl, parseQuery, isValidUrl } from "@/lib/url";

const SAMPLE_URL =
  "https://example.com/search?q=hello%20world&lang=en&tags=foo%2Cbar&empty=";

type Direction = "encode" | "decode";

export default function UrlEncoder() {
  // Encode/Decode section
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Query parser section
  const [queryUrl, setQueryUrl] = useState("");

  function handleProcess() {
    setError(null);
    setOutput("");
    if (!input) return;
    const result = direction === "encode" ? encodeUrl(input) : decodeUrl(input);
    if (result.ok) {
      setOutput(result.value);
    } else {
      setError(result.error);
    }
  }

  const queryTrimmed = queryUrl.trim();
  const urlValid = queryTrimmed ? isValidUrl(queryTrimmed) : null;
  const queryResult = queryTrimmed ? parseQuery(queryTrimmed) : null;

  return (
    <div className="space-y-6">
      {/* Encode / Decode section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">Encode / Decode</h2>
          {/* Direction toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setDirection("encode")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                direction === "encode"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Encode
            </button>
            <div className="w-px bg-border self-stretch" />
            <button
              onClick={() => setDirection("decode")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                direction === "decode"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {direction === "encode" ? "Plain Text" : "URL-encoded String"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "encode"
                ? "Enter text to URL-encode…"
                : "Enter URL-encoded string to decode…"
            }
            className="min-h-[80px] font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        <Button onClick={handleProcess} size="sm">
          {direction === "encode" ? "Encode" : "Decode"}
        </Button>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="font-medium">Error: </span>
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              <CopyButton value={output} size="sm" variant="outline" label="Copy" />
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
              <code className="text-sm font-mono break-all text-foreground">{output}</code>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Query String Parser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Query String Parser</h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setQueryUrl(SAMPLE_URL)}
          >
            Load Sample URL
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Full URL
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={queryUrl}
              onChange={(e) => setQueryUrl(e.target.value)}
              placeholder="https://example.com/path?key=value&foo=bar"
              className="font-mono text-sm flex-1"
              spellCheck={false}
            />
            {queryTrimmed && (
              <Badge
                className={
                  urlValid
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {urlValid ? "Valid URL" : "Invalid URL"}
              </Badge>
            )}
          </div>
        </div>

        {/* Query result table */}
        {queryResult && queryResult.ok && queryResult.value.length > 0 && (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide w-1/3">
                    Key
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {queryResult.value.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2 font-mono text-violet-400 text-xs">
                      {row.key}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-foreground break-all">
                      {row.value || (
                        <span className="text-muted-foreground italic">empty</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {queryResult && queryResult.ok && queryResult.value.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            No query parameters found in this URL.
          </div>
        )}

        {queryResult && !queryResult.ok && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="font-medium">Error: </span>
            {queryResult.error}
          </div>
        )}

        {!queryTrimmed && (
          <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            Enter a URL above to parse its query parameters.
          </div>
        )}
      </div>
    </div>
  );
}
