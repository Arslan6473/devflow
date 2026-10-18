# Tool Logic Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a pure client-side tool-logic layer for DevFlow with discriminated Result types, covering JSON, Base64, URL, JWT utilities, clipboard, and download helpers.

**Architecture:** Each module in `lib/` is independently tested with Vitest (jsdom environment). All public APIs return `Result<T>` (never throw), except clipboard and download which are side-effect utilities. Modules are small and focused; `lib/base64.ts` is reused by `lib/jwt.ts` for Base64URL decoding.

**Tech Stack:** TypeScript strict, Vitest 4.x, jsdom, Next.js 16 (not relevant to these pure modules), no external runtime dependencies added.

## Global Constraints

- Do NOT modify `lib/utils.ts` (shadcn's `cn` lives there)
- Every module public API returns `Result<T>` — never throws across module boundary
- 100% client-side: no network, no storage
- TypeScript strict mode — all types explicit, no `any` without cast annotation
- `npm test` runs `vitest run --passWithNoTests`
- `@` alias resolves to repo root (`/home/hp/Projects/Test-Project/devflow`)
- No `git commit` / `git add` — just create files
- Target ES2017+ (TextEncoder/TextDecoder available in jsdom)

---

### Task 1: Result type primitives

**Files:**
- Create: `lib/result.ts`

**Interfaces:**
- Produces: `Result<T>`, `ok<T>(value: T): Result<T>`, `err(error: string): Result<never>`

- [ ] **Step 1: Create `lib/result.ts`**

```ts
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = (error: string): Result<never> => ({ ok: false, error });
```

- [ ] **Step 2: Run TypeScript check to verify no errors**

Run: `cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit`
Expected: no errors

---

### Task 2: JSON utilities

**Files:**
- Create: `lib/json.ts`
- Create: `lib/json.test.ts`

**Interfaces:**
- Consumes: `Result<T>`, `ok`, `err` from `lib/result.ts`
- Produces:
  - `formatJson(input: string, indent?: number | "\t"): Result<string>`
  - `minifyJson(input: string): Result<string>`
  - `validateJson(input: string): Result<true>`

- [ ] **Step 1: Write the failing test `lib/json.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { formatJson, minifyJson, validateJson } from "@/lib/json";

describe("formatJson", () => {
  it("pretty-prints with 2-space indent (default)", () => {
    const result = formatJson('{"a":1}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('{\n  "a": 1\n}');
  });

  it("pretty-prints with tab indent", () => {
    const result = formatJson('{"a":1}', "\t");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('{\n\t"a": 1\n}');
  });

  it("returns err for invalid JSON", () => {
    const result = formatJson("{bad}");
    expect(result.ok).toBe(false);
  });

  it("pretty-prints nested objects with custom indent", () => {
    const result = formatJson('{"x":{"y":2}}', 4);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('{\n    "x": {\n        "y": 2\n    }\n}');
  });
});

describe("minifyJson", () => {
  it('minifies { "a": 1 } to {"a":1}', () => {
    const result = minifyJson('{ "a": 1 }');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe('{"a":1}');
  });

  it("returns err for invalid JSON", () => {
    const result = minifyJson("{bad}");
    expect(result.ok).toBe(false);
  });

  it("minifies arrays", () => {
    const result = minifyJson("[ 1, 2, 3 ]");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("[1,2,3]");
  });
});

describe("validateJson", () => {
  it("validates empty array []", () => {
    const result = validateJson("[]");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(true);
  });

  it("returns err for [ (incomplete)", () => {
    const result = validateJson("[");
    expect(result.ok).toBe(false);
  });

  it("returns err for empty string", () => {
    const result = validateJson("");
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/json.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `lib/json.ts`**

```ts
import { type Result, ok, err } from "@/lib/result";

export function formatJson(input: string, indent: number | "\t" = 2): Result<string> {
  try {
    const parsed = JSON.parse(input);
    return ok(JSON.stringify(parsed, null, indent));
  } catch (e) {
    return err((e as Error).message);
  }
}

export function minifyJson(input: string): Result<string> {
  try {
    const parsed = JSON.parse(input);
    return ok(JSON.stringify(parsed));
  } catch (e) {
    return err((e as Error).message);
  }
}

export function validateJson(input: string): Result<true> {
  try {
    JSON.parse(input);
    return ok(true as const);
  } catch (e) {
    return err((e as Error).message);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/json.test.ts`
Expected: all tests PASS

---

### Task 3: Base64 utilities (UTF-8 safe)

**Files:**
- Create: `lib/base64.ts`
- Create: `lib/base64.test.ts`

**Interfaces:**
- Consumes: `Result<T>`, `ok`, `err` from `lib/result.ts`
- Produces:
  - `encodeBase64(text: string, urlSafe?: boolean): Result<string>`
  - `decodeBase64(input: string, urlSafe?: boolean): Result<string>`

**Implementation note:** Must be UTF-8 safe. Pattern: TextEncoder → Uint8Array → byte string → btoa (encode). atob → byte string → Uint8Array → TextDecoder (decode). For url-safe: replace `+`→`-`, `/`→`_`, strip `=` on encode; restore `=` padding, replace `-`→`+`, `_`→`/` on decode. Validate decode input with a regex before calling atob.

- [ ] **Step 1: Write the failing test `lib/base64.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { encodeBase64, decodeBase64 } from "@/lib/base64";

describe("encodeBase64", () => {
  it('encodes "hello" to "aGVsbG8="', () => {
    const result = encodeBase64("hello");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("aGVsbG8=");
  });

  it("round-trips UTF-8 multibyte string", () => {
    const original = "héllo 🚀";
    const encoded = encodeBase64(original);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeBase64(encoded.value);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(original);
  });

  it("url-safe round-trip", () => {
    const original = "héllo 🚀";
    const encoded = encodeBase64(original, true);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    // url-safe has no + / = chars
    if (encoded.ok) {
      expect(encoded.value).not.toContain("+");
      expect(encoded.value).not.toContain("/");
      expect(encoded.value).not.toContain("=");
    }
    const decoded = decodeBase64(encoded.value, true);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(original);
  });

  it("encodes empty string", () => {
    const result = encodeBase64("");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("");
  });
});

describe("decodeBase64", () => {
  it('decodes "aGVsbG8=" to "hello"', () => {
    const result = decodeBase64("aGVsbG8=");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("hello");
  });

  it('returns err for "!!!notbase64!!!"', () => {
    const result = decodeBase64("!!!notbase64!!!");
    expect(result.ok).toBe(false);
  });

  it("returns err for string with spaces (invalid base64)", () => {
    const result = decodeBase64("not valid base64!");
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/base64.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `lib/base64.ts`**

```ts
import { type Result, ok, err } from "@/lib/result";

// Regex for valid standard base64 (with optional = padding)
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
// Regex for valid url-safe base64 (no padding)
const BASE64URL_REGEX = /^[A-Za-z0-9\-_]*$/;

export function encodeBase64(text: string, urlSafe = false): Result<string> {
  try {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    let encoded = btoa(binary);
    if (urlSafe) {
      encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    return ok(encoded);
  } catch (e) {
    return err((e as Error).message);
  }
}

export function decodeBase64(input: string, urlSafe = false): Result<string> {
  try {
    let base64 = input;
    if (urlSafe) {
      if (!BASE64URL_REGEX.test(input)) {
        return err("Invalid url-safe base64 input");
      }
      // Restore standard base64
      base64 = input.replace(/-/g, "+").replace(/_/g, "/");
      // Re-add padding
      const padLen = (4 - (base64.length % 4)) % 4;
      base64 += "=".repeat(padLen);
    } else {
      if (!BASE64_REGEX.test(input)) {
        return err("Invalid base64 input");
      }
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return ok(new TextDecoder().decode(bytes));
  } catch (e) {
    return err((e as Error).message);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/base64.test.ts`
Expected: all tests PASS

---

### Task 4: URL utilities

**Files:**
- Create: `lib/url.ts`
- Create: `lib/url.test.ts`

**Interfaces:**
- Consumes: `Result<T>`, `ok`, `err` from `lib/result.ts`
- Produces:
  - `encodeUrl(text: string): Result<string>`
  - `decodeUrl(text: string): Result<string>`
  - `parseQuery(url: string): Result<{ key: string; value: string }[]>`
  - `isValidUrl(text: string): boolean`

- [ ] **Step 1: Write the failing test `lib/url.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { encodeUrl, decodeUrl, parseQuery, isValidUrl } from "@/lib/url";

describe("encodeUrl / decodeUrl", () => {
  it("round-trips a string with spaces, &, =", () => {
    const original = "a b&c=d";
    const encoded = encodeUrl(original);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeUrl(encoded.value);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe(original);
  });

  it("encodes special characters", () => {
    const result = encodeUrl("hello world");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("hello%20world");
  });

  it("decodeUrl returns err for malformed % sequence", () => {
    const result = decodeUrl("%");
    expect(result.ok).toBe(false);
  });

  it("decodeUrl returns err for %ZZ (invalid hex)", () => {
    const result = decodeUrl("%ZZ");
    expect(result.ok).toBe(false);
  });
});

describe("parseQuery", () => {
  it("parses a=1&b=two%20words", () => {
    const result = parseQuery("https://x.com/p?a=1&b=two%20words");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([
      { key: "a", value: "1" },
      { key: "b", value: "two words" },
    ]);
  });

  it("returns err for invalid URL", () => {
    const result = parseQuery("not a url");
    expect(result.ok).toBe(false);
  });

  it("returns empty array for URL with no query params", () => {
    const result = parseQuery("https://x.com");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual([]);
  });
});

describe("isValidUrl", () => {
  it("returns true for https://x.com", () => {
    expect(isValidUrl("https://x.com")).toBe(true);
  });

  it("returns false for 'not a url'", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });

  it("returns true for http URL", () => {
    expect(isValidUrl("http://example.com/path?q=1")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isValidUrl("")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/url.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `lib/url.ts`**

```ts
import { type Result, ok, err } from "@/lib/result";

export function encodeUrl(text: string): Result<string> {
  try {
    return ok(encodeURIComponent(text));
  } catch (e) {
    return err((e as Error).message);
  }
}

export function decodeUrl(text: string): Result<string> {
  try {
    return ok(decodeURIComponent(text));
  } catch (e) {
    return err((e as Error).message);
  }
}

export function parseQuery(url: string): Result<{ key: string; value: string }[]> {
  try {
    const parsed = new URL(url);
    const entries: { key: string; value: string }[] = [];
    parsed.searchParams.forEach((value, key) => {
      entries.push({ key, value });
    });
    return ok(entries);
  } catch (e) {
    return err((e as Error).message);
  }
}

export function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/url.test.ts`
Expected: all tests PASS

---

### Task 5: JWT decoder

**Files:**
- Create: `lib/jwt.ts`
- Create: `lib/jwt.test.ts`

**Interfaces:**
- Consumes: `decodeBase64(input: string, urlSafe: boolean): Result<string>` from `lib/base64.ts`; `Result<T>`, `ok`, `err` from `lib/result.ts`
- Produces:
  - `decodeJwt(token: string): Result<JwtDecoded>` where:
    ```ts
    type JwtDecoded = {
      header: Record<string, unknown>;
      payload: Record<string, unknown>;
      signature: string;
      status: "valid" | "expired" | "not-yet-valid" | "no-expiry";
      expiresAt: string | null;
      issuedAt: string | null;
      notBefore: string | null;
    };
    ```

**Status logic:**
- No `exp` claim → `"no-expiry"`
- `exp < Date.now()/1000` → `"expired"`
- `nbf > Date.now()/1000` → `"not-yet-valid"`
- else → `"valid"`

**Date fields:** `new Date(claim * 1000).toISOString()` or `null` when claim absent.

- [ ] **Step 1: Write the failing test `lib/jwt.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { decodeJwt } from "@/lib/jwt";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  → {"alg":"HS256","typ":"JWT"}
// eyJzdWIiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9 → {"sub":"123","exp":9999999999}
const VALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9.sig";

// exp in the past: eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjF9 → {"exp":1}
const EXPIRED_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjF9.sig";

// No exp: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0 → {"sub":"user"}
const NO_EXPIRY_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.sig";

describe("decodeJwt", () => {
  it("decodes valid token correctly", () => {
    const result = decodeJwt(VALID_TOKEN);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.header["alg"]).toBe("HS256");
    expect(result.value.payload["sub"]).toBe("123");
    expect(result.value.signature).toBe("sig");
    expect(result.value.status).toBe("valid");
    expect(result.value.expiresAt).not.toBeNull();
    expect(typeof result.value.expiresAt).toBe("string");
    // should be a valid ISO string
    expect(() => new Date(result.value.expiresAt!)).not.toThrow();
  });

  it("returns ok:false for non-JWT string 'abc'", () => {
    const result = decodeJwt("abc");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for empty string", () => {
    const result = decodeJwt("");
    expect(result.ok).toBe(false);
  });

  it("returns status 'expired' for past exp", () => {
    const result = decodeJwt(EXPIRED_TOKEN);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("expired");
  });

  it("returns status 'no-expiry' when exp is absent", () => {
    const result = decodeJwt(NO_EXPIRY_TOKEN);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("no-expiry");
    expect(result.value.expiresAt).toBeNull();
  });

  it("issuedAt is null when iat is absent", () => {
    const result = decodeJwt(VALID_TOKEN);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.issuedAt).toBeNull();
  });

  it("returns ok:false for two-part token (not 3 parts)", () => {
    const result = decodeJwt("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0");
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/jwt.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `lib/jwt.ts`**

```ts
import { type Result, ok, err } from "@/lib/result";
import { decodeBase64 } from "@/lib/base64";

type JwtStatus = "valid" | "expired" | "not-yet-valid" | "no-expiry";

type JwtDecoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  status: JwtStatus;
  expiresAt: string | null;
  issuedAt: string | null;
  notBefore: string | null;
};

function decodeJsonPart(segment: string): Result<Record<string, unknown>> {
  const decoded = decodeBase64(segment, true);
  if (!decoded.ok) return decoded;
  try {
    const parsed = JSON.parse(decoded.value) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return err("JWT part is not a JSON object");
    }
    return ok(parsed as Record<string, unknown>);
  } catch (e) {
    return err((e as Error).message);
  }
}

function toIso(claim: unknown): string | null {
  if (typeof claim !== "number") return null;
  return new Date(claim * 1000).toISOString();
}

export function decodeJwt(token: string): Result<JwtDecoded> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return err(`JWT must have 3 parts separated by '.', got ${parts.length}`);
  }
  const [headerSeg, payloadSeg, signature] = parts as [string, string, string];

  const headerResult = decodeJsonPart(headerSeg);
  if (!headerResult.ok) return err(`Header decode failed: ${headerResult.error}`);

  const payloadResult = decodeJsonPart(payloadSeg);
  if (!payloadResult.ok) return err(`Payload decode failed: ${payloadResult.error}`);

  const header = headerResult.value;
  const payload = payloadResult.value;

  const now = Date.now() / 1000;
  const exp = payload["exp"];
  const nbf = payload["nbf"];

  let status: JwtStatus;
  if (typeof exp !== "number") {
    status = "no-expiry";
  } else if (exp < now) {
    status = "expired";
  } else if (typeof nbf === "number" && nbf > now) {
    status = "not-yet-valid";
  } else {
    status = "valid";
  }

  return ok({
    header,
    payload,
    signature,
    status,
    expiresAt: toIso(exp),
    issuedAt: toIso(payload["iat"]),
    notBefore: toIso(nbf),
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test -- lib/jwt.test.ts`
Expected: all tests PASS

---

### Task 6: Clipboard + Download side-effect utilities

**Files:**
- Create: `lib/clipboard.ts`
- Create: `lib/download.ts`

**Interfaces:**
- Produces:
  - `copyToClipboard(text: string): Promise<boolean>` — uses `navigator.clipboard.writeText`, returns true/false
  - `downloadText(filename: string, content: string, mime?: string): void` — guards `typeof window === "undefined"`, creates Blob + anchor, clicks, revokes

No tests required for these two files.

- [ ] **Step 1: Create `lib/clipboard.ts`**

```ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Create `lib/download.ts`**

```ts
export function downloadText(
  filename: string,
  content: string,
  mime = "text/plain"
): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit`
Expected: no errors

---

### Task 7: Final verification

- [ ] **Step 1: Run all tests**

Run: `cd /home/hp/Projects/Test-Project/devflow && npm test`
Expected: all test files pass, 0 failures

- [ ] **Step 2: Run TypeScript check**

Run: `cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit`
Expected: exits 0, no errors

- [ ] **Step 3: Write report**

Write summary to `docs/superpowers/reports/phase2-report.md` with:
- Files created
- `npm test` output (test count + pass/fail)
- Any deviations from spec
