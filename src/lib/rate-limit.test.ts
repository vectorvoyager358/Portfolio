import { afterEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimitBuckets } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  afterEach(() => {
    resetRateLimitBuckets();
  });

  it("allows requests under the limit", () => {
    const first = checkRateLimit("tester", 2, 60_000);
    const second = checkRateLimit("tester", 2, 60_000);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it("blocks when the limit is exceeded", () => {
    checkRateLimit("tester", 1, 60_000);
    const blocked = checkRateLimit("tester", 1, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
