import assert from "node:assert/strict";

export function demoDateMath(): void {
  // getTime() is milliseconds since 1970, a plain number
  const windowMs = 5_000;
  const now = new Date(1_000_000);
  // Subtract to move back: five seconds before now
  const cutoff = new Date(now.getTime() - windowMs);
  assert.equal(cutoff.getTime(), 995_000);
  // The gap between two dates, in milliseconds
  assert.equal(now.getTime() - cutoff.getTime(), 5_000);
  assert.ok(cutoff.getTime() < now.getTime());
}

export function demoElapsedTime(): void {
  const start = performance.now();
  const elapsedMs = performance.now() - start;
  assert.ok(elapsedMs >= 0);
}
