"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/shared/code-editor";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { decodeJwt } from "@/lib/jwt";

// A sample expired JWT for demo purposes (safe to share publicly)
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const STATUS_CONFIG = {
  valid: {
    label: "Valid",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  expired: {
    label: "Expired",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  "not-yet-valid": {
    label: "Not Yet Valid",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  "no-expiry": {
    label: "No Expiry",
    className: "bg-muted text-muted-foreground border-border",
  },
} as const;

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const trimmed = token.trim();
  const result = trimmed ? decodeJwt(trimmed) : null;

  const decoded = result?.ok ? result.value : null;
  const error = result && !result.ok ? result.error : null;

  const statusConfig = decoded ? STATUS_CONFIG[decoded.status] : null;

  return (
    <div className="space-y-4">
      {/* Privacy note */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs text-blue-300">
        Decoded entirely in your browser. The signature is not verified and nothing is stored.
      </div>

      {/* JWT Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            JSON Web Token
          </label>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setToken(SAMPLE_JWT)}
          >
            Load Sample
          </Button>
        </div>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT here…"
          className="font-mono text-xs min-h-24 resize-none"
          spellCheck={false}
        />
      </div>

      {/* Error state */}
      {error && trimmed && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="font-medium">Error: </span>
          {error}
        </div>
      )}

      {/* Decoded output */}
      {decoded && (
        <div className="space-y-4">
          {/* Status + timestamps row */}
          <div className="flex flex-wrap items-center gap-3">
            {statusConfig && (
              <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {decoded.issuedAt && (
                <span>
                  Issued:{" "}
                  <span className="text-foreground">{formatDate(decoded.issuedAt)}</span>
                </span>
              )}
              {decoded.expiresAt && (
                <span>
                  Expires:{" "}
                  <span className="text-foreground">{formatDate(decoded.expiresAt)}</span>
                </span>
              )}
              {decoded.notBefore && (
                <span>
                  Not Before:{" "}
                  <span className="text-foreground">{formatDate(decoded.notBefore)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Three cards: Header, Payload, Signature */}
          <div className="grid grid-cols-1 gap-4">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardAction>
                  <CopyButton
                    value={JSON.stringify(decoded.header, null, 2)}
                    size="sm"
                    variant="ghost"
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  value={JSON.stringify(decoded.header, null, 2)}
                  language="json"
                  readOnly
                  height={120}
                />
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <CardTitle>Payload</CardTitle>
                <CardAction>
                  <CopyButton
                    value={JSON.stringify(decoded.payload, null, 2)}
                    size="sm"
                    variant="ghost"
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  value={JSON.stringify(decoded.payload, null, 2)}
                  language="json"
                  readOnly
                  height={180}
                />
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Signature
                  <span className="text-xs font-normal text-muted-foreground">
                    (raw, unverified)
                  </span>
                </CardTitle>
                <CardAction>
                  <CopyButton value={decoded.signature} size="sm" variant="ghost" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
                  <code className="text-xs font-mono text-muted-foreground break-all">
                    {decoded.signature}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
