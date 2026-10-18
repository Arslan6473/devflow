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
