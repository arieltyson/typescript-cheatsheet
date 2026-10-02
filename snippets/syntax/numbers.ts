import assert from "node:assert/strict";

export function demoIntegerDivision(): void {
  assert.equal(7 / 2, 3.5);
  assert.equal(Math.trunc(7 / 2), 3);
  // floor and trunc differ for negative numbers
  assert.equal(Math.floor(-7 / 2), -4);
  assert.equal(Math.trunc(-7 / 2), -3);
  assert.equal(Math.ceil(7 / 2), 4);
  // % keeps the sign of the left side
  assert.equal(-7 % 2, -1);
  assert.equal(((-7 % 2) + 2) % 2, 1);
}

export function demoBigNumbers(): void {
  assert.equal(Number.MAX_SAFE_INTEGER, 9007199254740991);
  // Past 2^53, adding 1 can be lost
  assert.equal(2 ** 53 + 1, 2 ** 53);
  const MOD = 1_000_000_007;
  const [a, b] = [123456789, 987654321];
  // Wrong: the product passed 2^53 before the %
  assert.equal((a * b) % MOD, 259106854);
  const product = Number((BigInt(a) * BigInt(b)) % BigInt(MOD));
  assert.equal(product, 259106859);
  assert.equal(String(2n ** 64n), "18446744073709551616");
  assert.equal(typeof 10n, "bigint");
}

export function demoMath(): void {
  assert.equal(Math.abs(-7), 7);
  assert.equal(Math.floor(Math.sqrt(17)), 4);
  assert.equal(Math.log2(8), 3);
  assert.equal(Math.hypot(3, 4), 5);
  assert.equal(Math.sign(-3), -1);
  assert.ok(Infinity > Number.MAX_SAFE_INTEGER);
  assert.equal(Math.min(Infinity, 5), 5);
  assert.ok(Number.isInteger(5.0));
  assert.ok(!Number.isSafeInteger(2 ** 53));
}

/** Return the greatest common divisor of a and b. */
export function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

export function demoGcd(): void {
  assert.equal(gcd(12, 18), 6);
  const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
  assert.equal(lcm(4, 6), 12);
}
