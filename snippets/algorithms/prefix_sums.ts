import assert from "node:assert/strict";

/** Return sums where prefix[i] is the sum of values[0..i-1]. */
export function prefixSums(values: number[]): number[] {
  const prefix = [0];
  for (const value of values) prefix.push(prefix.at(-1)! + value);
  return prefix;
}

export function demoRangeSum(): void {
  const prefix = prefixSums([3, 1, 4, 1]);
  assert.deepEqual(prefix, [0, 3, 4, 8, 9]);
  // Sum of values[left..right] inclusive, in O(1)
  const [left, right] = [1, 3];
  assert.equal(prefix[right + 1] - prefix[left], 6);
}

/** Return how many contiguous subarrays sum to target. */
export function countSubarraysWithSum(
  values: number[],
  target: number,
): number {
  const seen = new Map<number, number>([[0, 1]]);
  let running = 0;
  let count = 0;
  for (const value of values) {
    running += value;
    count += seen.get(running - target) ?? 0;
    seen.set(running, (seen.get(running) ?? 0) + 1);
  }
  return count;
}
