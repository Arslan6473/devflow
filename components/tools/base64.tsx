"use client";

import { useState, useRef } from "react";
import { CodeEditor } from "@/components/shared/code-editor";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { encodeBase64, decodeBase64 } from "@/lib/base64";

type Direction = "encode" | "decode";

function arrayBufferToBase64(buffer: ArrayBuffer, urlSafe: boolean): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  let encoded = btoa(binary);
  if (urlSafe) {
    encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  return encoded;
}

export default function Base64Tool() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  // Text tab
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [textError, setTextError] = useState<string | null>(null);

  // File tab
  const [fileOutput, setFileOutput] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleTextProcess() {
    setTextError(null);
    setTextOutput("");
    if (!textInput) return;
    const result =
      direction === "encode"
        ? encodeBase64(textInput, urlSafe)
        : decodeBase64(textInput, urlSafe);
    if (result.ok) {
      setTextOutput(result.value);
    } else {
      setTextError(result.error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileError(null);
    setFileOutput("");
    setFileProcessing(true);

    if (direction === "encode") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const buffer = ev.target?.result as ArrayBuffer;
          if (!buffer) {
            setFileError("Failed to read file.");
            return;
          }
          const encoded = arrayBufferToBase64(buffer, urlSafe);
          setFileOutput(encoded);
        } catch (err) {
          setFileError((err as Error).message);
        } finally {
          setFileProcessing(false);
        }
      };
      reader.onerror = () => {
        setFileError("File read error.");
        setFileProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Decode mode: read file as text (base64 string), decode it
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          const result = decodeBase64(text.trim(), urlSafe);
          if (result.ok) {
            setFileOutput(result.value);
          } else {
            setFileError(result.error);
          }
        } catch (err) {
          setFileError((err as Error).message);
        } finally {
          setFileProcessing(false);
        }
      };
      reader.onerror = () => {
        setFileError("File read error.");
        setFileProcessing(false);
      };
      reader.readAsText(file);
    }
  }

  const directionLabel = direction === "encode" ? "Encode" : "Decode";
  const outputDownloadName =
    direction === "encode" ? "output.b64.txt" : "output.txt";

  return (
    <div className="space-y-4">
      {/* Shared controls */}
      <div className="flex flex-wrap items-center gap-4">
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

        {/* URL-safe switch */}
        <Label className="flex items-center gap-2 cursor-pointer">
          <Switch
            checked={urlSafe}
            onCheckedChange={setUrlSafe}
            size="sm"
          />
          <span className="text-sm">URL-safe</span>
        </Label>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>

        {/* Text tab */}
        <TabsContent value="text" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {direction === "encode" ? "Plain Text" : "Base64 Input"}
            </label>
            <CodeEditor
              value={textInput}
              language="plaintext"
              onChange={setTextInput}
              height={200}
            />
          </div>

          <Button onClick={handleTextProcess} size="sm">
            {directionLabel}
          </Button>

          {textError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span className="font-medium">Error: </span>
              {textError}
            </div>
          )}

          {textOutput && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {direction === "encode" ? "Base64 Output" : "Decoded Text"}
                </label>
                <div className="flex items-center gap-1">
                  <CopyButton value={textOutput} size="sm" variant="outline" label="Copy" />
                  <DownloadButton
                    filename={outputDownloadName}
                    content={textOutput}
                    mime="text/plain"
                    label="Download"
                  />
                </div>
              </div>
              <CodeEditor
                value={textOutput}
                language="plaintext"
                readOnly
                height={200}
              />
            </div>
          )}
        </TabsContent>

        {/* File tab */}
        <TabsContent value="file" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {direction === "encode" ? "Select a File to Encode" : "Select Base64 File to Decode"}
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="base64-file-input"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
              {fileName && (
                <span className="text-sm text-muted-foreground truncate max-w-[260px]">
                  {fileName}
                </span>
              )}
              {fileProcessing && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Processing…
                </span>
              )}
            </div>
          </div>

          {fileError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span className="font-medium">Error: </span>
              {fileError}
            </div>
          )}

          {fileOutput && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {direction === "encode" ? "Base64 Output" : "Decoded Output"}
                </label>
                <div className="flex items-center gap-1">
                  <CopyButton value={fileOutput} size="sm" variant="outline" label="Copy" />
                  <DownloadButton
                    filename={outputDownloadName}
                    content={fileOutput}
                    mime="text/plain"
                    label="Download"
                  />
                </div>
              </div>
              <CodeEditor
                value={fileOutput}
                language="plaintext"
                readOnly
                height={240}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
