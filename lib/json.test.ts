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
