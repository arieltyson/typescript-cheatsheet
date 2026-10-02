import assert from "node:assert/strict";
import { test } from "node:test";
import {
  combinations,
  permutations,
  subsets,
} from "../../snippets/algorithms/backtracking.ts";
import {
  climbStairs,
  climbStairsMemo,
  coinChange,
  houseRobber,
  knapsack,
  longestCommonSubsequence,
  longestIncreasingSubsequence,
  uniqueGridPaths,
} from "../../snippets/algorithms/dynamic_programming.ts";
import { randomInts, seeded } from "../random.ts";

const random = seeded(13);
const sortedKeys = (lists: number[][]) => lists.map(String).sort();

/** Every subset of indexes 0..count-1, by bitmask. */
function masks(count: number): number[][] {
  return Array.from({ length: 2 ** count }, (_, mask) =>
    Array.from({ length: count }, (_, i) => i).filter(
      (i) => (mask >> i) & 1,
    ),
  );
}

test("subsets and combinations", () => {
  const values = [1, 2, 3, 4];
  const all = masks(4).map((indexes) => indexes.map((i) => values[i]));
  assert.deepEqual(sortedKeys(subsets(values)), sortedKeys(all));
  for (let size = 0; size <= 4; size++) {
    assert.deepEqual(
      sortedKeys(combinations(values, size)),
      sortedKeys(all.filter((subset) => subset.length === size)),
    );
  }
  assert.deepEqual(subsets([]), [[]]);
});

test("permutations", () => {
  const result = permutations([1, 2, 3]);
  assert.equal(result.length, 6);
  assert.equal(new Set(result.map(String)).size, 6);
  assert.deepEqual(permutations([]), [[]]);
});

test("climbing stairs", () => {
  const expected = [1, 1, 2, 3, 5, 8, 13];
  for (const [steps, ways] of expected.entries()) {
    assert.equal(climbStairs(steps), ways);
    assert.equal(climbStairsMemo(steps), ways);
  }
});

test("house robber matches brute force", () => {
  for (let round = 0; round < 200; round++) {
    const values = randomInts(random, Math.floor(random() * 9), 0, 9);
    const best = Math.max(
      ...masks(values.length)
        .filter((indexes) =>
          indexes.every((i, k) => k === 0 || i - indexes[k - 1] > 1),
        )
        .map((indexes) =>
          indexes.reduce((sum, i) => sum + values[i], 0),
        ),
    );
    assert.equal(houseRobber(values), best);
  }
});

test("coin change", () => {
  assert.equal(coinChange([1, 2, 5], 11), 3);
  assert.equal(coinChange([2], 3), -1);
  assert.equal(coinChange([1], 0), 0);
  assert.equal(coinChange([3, 7], 12), 4);
});

test("knapsack matches brute force", () => {
  for (let round = 0; round < 200; round++) {
    const count = Math.floor(random() * 7);
    const weights = randomInts(random, count, 1, 6);
    const values = randomInts(random, count, 0, 9);
    const capacity = Math.floor(random() * 13);
    const best = Math.max(
      ...masks(count)
        .filter(
          (chosen) =>
            chosen.reduce((s, i) => s + weights[i], 0) <= capacity,
        )
        .map((chosen) => chosen.reduce((s, i) => s + values[i], 0)),
    );
    assert.equal(knapsack(weights, values, capacity), best);
  }
});

test("grid paths and LCS", () => {
  assert.equal(uniqueGridPaths(3, 7), 28);
  assert.equal(uniqueGridPaths(1, 1), 1);
  assert.equal(uniqueGridPaths(3, 2), 3);
  assert.equal(longestCommonSubsequence("abcde", "ace"), 3);
  assert.equal(longestCommonSubsequence("abc", "def"), 0);
  assert.equal(longestCommonSubsequence("", "abc"), 0);
});

test("LIS matches the quadratic DP", () => {
  for (let round = 0; round < 300; round++) {
    const values = randomInts(random, Math.floor(random() * 11), 0, 6);
    const lengths = values.map(() => 1);
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < i; j++) {
        if (values[j] < values[i]) {
          lengths[i] = Math.max(lengths[i], lengths[j] + 1);
        }
      }
    }
    assert.equal(
      longestIncreasingSubsequence(values),
      Math.max(0, ...lengths),
    );
  }
});
