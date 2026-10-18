import { describe, it, expect } from "vitest";
import { runRegex } from "./regex";

describe("runRegex", () => {
  it("finds all global matches with capture groups", () => {
    const r = runRegex("(\\d+)", "g", "a12 b34");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toHaveLength(2);
    expect(r.value[0].match).toBe("12");
    expect(r.value[0].index).toBe(1);
    expect(r.value[0].groups[0]).toBe("12");
    expect(r.value[1].match).toBe("34");
    expect(r.value[1].groups[0]).toBe("34");
  });

  it("captures named groups", () => {
    const r = runRegex("(?<year>\\d{4})", "g", "year 2026 here");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toHaveLength(1);
    expect(r.value[0].namedGroups.year).toBe("2026");
  });

  it("returns a single match when not global", () => {
    const r = runRegex("\\d+", "", "a12 b34");
    expect(r.ok && r.value).toHaveLength(1);
    expect(r.ok && r.value[0].match).toBe("12");
  });

  it("returns an error for an invalid pattern", () => {
    const r = runRegex("(", "", "anything");
    expect(r.ok).toBe(false);
  });

  it("does not infinite-loop on zero-length global matches", () => {
    const r = runRegex("a*", "g", "aba");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    // Must terminate and produce a bounded result set.
    expect(r.value.length).toBeGreaterThan(0);
    expect(r.value.length).toBeLessThan(100);
  });

  it("returns an empty result for an empty pattern", () => {
    const r = runRegex("", "g", "abc");
    expect(r.ok && r.value).toEqual([]);
  });
});
