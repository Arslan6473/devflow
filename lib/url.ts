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
