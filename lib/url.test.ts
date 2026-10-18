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
