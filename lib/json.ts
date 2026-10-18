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
