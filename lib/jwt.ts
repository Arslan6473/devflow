import { type Result, ok, err } from "@/lib/result";
import { decodeBase64 } from "@/lib/base64";

type JwtStatus = "valid" | "expired" | "not-yet-valid" | "no-expiry";

type JwtDecoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  status: JwtStatus;
  expiresAt: string | null;
  issuedAt: string | null;
  notBefore: string | null;
};

function decodeJsonPart(segment: string): Result<Record<string, unknown>> {
  const decoded = decodeBase64(segment, true);
  if (!decoded.ok) return decoded;
  try {
    const parsed = JSON.parse(decoded.value) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return err("JWT part is not a JSON object");
    }
    return ok(parsed as Record<string, unknown>);
  } catch (e) {
    return err((e as Error).message);
  }
}

function toIso(claim: unknown): string | null {
  if (typeof claim !== "number") return null;
  return new Date(claim * 1000).toISOString();
}

export function decodeJwt(token: string): Result<JwtDecoded> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return err(`JWT must have 3 parts separated by '.', got ${parts.length}`);
  }
  const [headerSeg, payloadSeg, signature] = parts as [string, string, string];

  const headerResult = decodeJsonPart(headerSeg);
  if (!headerResult.ok) return err(`Header decode failed: ${headerResult.error}`);

  const payloadResult = decodeJsonPart(payloadSeg);
  if (!payloadResult.ok) return err(`Payload decode failed: ${payloadResult.error}`);

  const header = headerResult.value;
  const payload = payloadResult.value;

  const now = Date.now() / 1000;
  const exp = payload["exp"];
  const nbf = payload["nbf"];

  let status: JwtStatus;
  if (typeof exp !== "number") {
    status = "no-expiry";
  } else if (exp < now) {
    status = "expired";
  } else if (typeof nbf === "number" && nbf > now) {
    status = "not-yet-valid";
  } else {
    status = "valid";
  }

  return ok({
    header,
    payload,
    signature,
    status,
    expiresAt: toIso(exp),
    issuedAt: toIso(payload["iat"]),
    notBefore: toIso(nbf),
  });
}
