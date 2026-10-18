import { type Result, ok, err } from "@/lib/result";

export type RegexMatch = {
  match: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
};

export function runRegex(
  pattern: string,
  flags: string,
  input: string
): Result<RegexMatch[]> {
  if (!pattern) return ok([]);
  try {
    const re = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes("g") || flags.includes("y")) {
      let m: RegExpExecArray | null;
      let lastIndex = -1;
      while ((m = re.exec(input)) !== null) {
        // Guard against infinite loops on zero-length matches
        if (re.lastIndex === lastIndex) {
          re.lastIndex++;
          continue;
        }
        lastIndex = re.lastIndex;
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1).map((g) => g ?? ""),
          namedGroups: (m.groups as Record<string, string> | undefined) ?? {},
        });
        if (matches.length > 10000) break; // safety
      }
    } else {
      const m = re.exec(input);
      if (m) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1).map((g) => g ?? ""),
          namedGroups: (m.groups as Record<string, string> | undefined) ?? {},
        });
      }
    }

    return ok(matches);
  } catch (e) {
    return err((e as Error).message);
  }
}
