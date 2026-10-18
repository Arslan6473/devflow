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
