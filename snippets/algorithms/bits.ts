import assert from "node:assert/strict";

export function demoBits(): void {
  const value = 0b1100;
  assert.equal(value & 1, 0);
  assert.equal(value >> 2, 0b11);
  assert.equal((value >> 3) & 1, 1);
  assert.equal(value | (1 << 0), 0b1101);
  assert.equal(value ^ (1 << 2), 0b1000);
  // Clear the lowest set bit, and isolate it
  assert.equal(value & (value - 1), 0b1000);
  assert.equal(value & -value, 0b100);
  const isPowerOfTwo = value > 0 && (value & (value - 1)) === 0;
  assert.equal(isPowerOfTwo, false);
}

export function demoThirtyTwoBits(): void {
  // Bitwise operators work on 32-bit signed integers
  assert.equal(1 << 31, -2147483648);
  assert.equal((1 << 31) >>> 0, 2147483648);
  assert.equal((2 ** 32) | 0, 0);
  // Use BigInt for wider masks
  assert.equal(1n << 40n, 1099511627776n);
}

/** Return how many 1 bits value has as a 32-bit integer. */
export function bitCount(value: number): number {
  let count = 0;
  for (let rest = value | 0; rest !== 0; rest &= rest - 1) count++;
  return count;
}

export function demoBitmaskSubsets(): void {
  const items = ["a", "b", "c"];
  const subsets = Array.from({ length: 1 << items.length }, (_, mask) =>
    items.filter((_, i) => (mask >> i) & 1),
  );
  assert.equal(subsets.length, 8);
  assert.deepEqual(subsets[0b101], ["a", "c"]);
}

/** Return the value that appears once when the rest appear twice. */
export function singleNumber(values: number[]): number {
  return values.reduce((result, value) => result ^ value, 0);
}
