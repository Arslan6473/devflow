"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/shared/code-editor";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatJson, minifyJson, validateJson } from "@/lib/json";

const SAMPLE_JSON = `{
  "name": "DevFlow",
  "version": "1.0.0",
  "features": ["formatter", "validator", "minifier"],
  "meta": {
    "author": "DevTeam",
    "tags": ["json", "tools", "dev"]
  }
}`;

type IndentOption = 2 | 4 | "\t";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [indent, setIndent] = useState<IndentOption>(2);

  function clearState() {
    setError(null);
    setValidated(false);
    setOutput("");
  }

  function handleFormat() {
    clearState();
    const result = formatJson(input, indent);
    if (result.ok) {
      setOutput(result.value);
    } else {
      setError(result.error);
    }
  }

  function handleMinify() {
    clearState();
    const result = minifyJson(input);
    if (result.ok) {
      setOutput(result.value);
    } else {
      setError(result.error);
    }
  }

  function handleValidate() {
    clearState();
    const result = validateJson(input);
    if (result.ok) {
      setValidated(true);
    } else {
      setError(result.error);
    }
  }

  function loadSample() {
    setInput(SAMPLE_JSON);
    clearState();
  }

  const indentOptions: { label: string; value: IndentOption }[] = [
    { label: "2", value: 2 },
    { label: "4", value: 4 },
    { label: "Tab", value: "\t" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleFormat} size="sm">
          Format
        </Button>
        <Button onClick={handleMinify} size="sm" variant="outline">
          Minify
        </Button>
        <Button onClick={handleValidate} size="sm" variant="outline">
          Validate
        </Button>

        {/* Indent selector */}
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground">Indent:</span>
          {indentOptions.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setIndent(opt.value)}
              className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                indent === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button onClick={loadSample} size="sm" variant="ghost" className="ml-auto text-xs">
          Load Sample
        </Button>
      </div>

      {/* Feedback area */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="font-medium">Error: </span>
          {error}
        </div>
      )}
      {validated && !error && (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Valid JSON
          </Badge>
        </div>
      )}

      {/* Main two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input pane */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Input
          </div>
          <CodeEditor
            value={input}
            language="json"
            onChange={setInput}
            height={400}
          />
        </div>

        {/* Output pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Output
            </div>
            <div className="flex items-center gap-1">
              <CopyButton value={output} label="Copy" size="sm" variant="outline" />
              <DownloadButton
                filename="formatted.json"
                content={output}
                mime="application/json"
                label="Download"
              />
            </div>
          </div>
          <CodeEditor
            value={output}
            language="json"
            readOnly
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
