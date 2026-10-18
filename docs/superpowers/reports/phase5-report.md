# Phase 5 Report — Interactive Tool UIs

## Status: DONE

## Files Created / Modified

### New
- `lib/regex.ts` — `runRegex(pattern, flags, input): Result<RegexMatch[]>` with global/sticky loop protection and zero-length match guard

### Replaced (was placeholder stub)
- `components/tools/json-formatter.tsx`
- `components/tools/jwt-decoder.tsx`
- `components/tools/base64.tsx`
- `components/tools/url-encoder.tsx`
- `components/tools/regex-tester.tsx`

## Build / QA Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✓ 0 errors |
| `npm run lint` | ✓ 0 errors, 0 warnings (fixed unused import and useMemo deps) |
| `npm run build` | ✓ Compiled successfully — all static pages generated |
| Dev server sanity | ✓ Server running on :3000, app serving HTML correctly |

## Component Summary

### json-formatter.tsx
Two-pane (input/output) CodeEditor layout. Toolbar: Format, Minify, Validate with 2/4/Tab indent selector. Inline error banner on `!ok`. Validate shows a green badge. Output has CopyButton + DownloadButton. Sample JSON prefill button.

### jwt-decoder.tsx
Textarea input for JWT, decodes on change via `decodeJwt`. Three Cards (Header, Payload, Signature) with CodeEditor readOnly views. Status badge coloured by `valid/expired/not-yet-valid/no-expiry`. Human-readable timestamps for `issuedAt`, `expiresAt`, `notBefore`. Per-section CopyButton. Privacy notice banner. Sample JWT button.

### base64.tsx
shadcn Tabs (`text` / `file`). Encode⇄Decode direction toggle + URL-safe Switch shared. Text tab: CodeEditor input + output + Copy + Download. File tab: `<input type="file">` with binary-safe `FileReader.readAsArrayBuffer` → local `arrayBufferToBase64` helper (honours urlSafe) for encode; `readAsText` for decode-mode files. Guards against empty file and read errors.

### url-encoder.tsx
Encode⇄Decode section with Textarea input, output `<code>` block, CopyButton. Below a Separator, Query String Parser section: URL input with live `isValidUrl` badge + `parseQuery` table of key/value rows. Sample URL button. Error states on both sections.

### regex-tester.tsx
Pattern input with `/pattern/flags` visual chrome. Six flag toggle chips (g i m s u y) with tooltips. Textarea for test string. 150ms debounced `runRegex`. Invalid-pattern error inline. Highlighted preview with `<mark>` spans (non-overlapping, zero-length-safe). Match table showing #, matched text, index, numbered capture groups (blue), named groups (green). Match count badge. Defaults to a working email-matching example.

## Deviations / Notes

- `lib/regex.ts` did not exist; created it to satisfy the spec (`runRegex` + `RegexMatch` type).
- The app has no `/tools/[slug]` file-based routes — tools are lazy-loaded components rendered within the single `app/page.tsx`. The build only prerendered `/` and `/_not-found`, which is correct for this architecture.
- Lint fix: removed unused `Input` import from regex-tester; wrapped `matches` computation in its own `useMemo` to satisfy `react-hooks/exhaustive-deps`.
- `Badge` component uses `@base-ui/react` `useRender` pattern — coloring done via `className` prop (no `variant` for custom colours), consistent with how other components override it.
