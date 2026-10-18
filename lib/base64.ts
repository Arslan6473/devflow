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
