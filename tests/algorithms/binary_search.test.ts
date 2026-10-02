import assert from "node:assert/strict";
import { test } from "node:test";
import {
  binarySearch,
  firstTrue,
  lowerBound,
  minEatingSpeed,
  upperBound,
} from "../../snippets/algorithms/binary_search.ts";
import { randomInts, seeded } from "../random.ts";

const random = seeded(7);
const lists = Array.from({ length: 300 }, () =>
  randomInts(random, Math.floor(random() * 13), -5, 5).sort(
    (a, b) => a - b,
  ),
);

test("binary search finds present values and rejects absent ones", () => {
  for (const values of lists) {
    for (let target = -6; target <= 6; target++) {
      const index = binarySearch(values, target);
      if (values.includes(target)) assert.equal(values[index], target);
      else assert.equal(index, -1);
    }
  }
});

test("bounds match a linear scan", () => {
  for (const values of lists) {
    for (let target = -6; target <= 6; target++) {
      const firstAtLeast = values.findIndex((value) => value >= target);
      const firstAbove = values.findIndex((value) => value > target);
      assert.equal(
        lowerBound(values, target),
        firstAtLeast === -1 ? values.length : firstAtLeast,
      );
      assert.equal(
        upperBound(values, target),
        firstAbove === -1 ? values.length : firstAbove,
      );
    }
  }
});

test("first true", () => {
  assert.equal(
    firstTrue(0, 100, (x) => x * x >= 50),
    8,
  );
  assert.equal(
    firstTrue(5, 5, () => true),
    5,
  );
  assert.equal(
    firstTrue(1, 10, () => true),
    1,
  );
});

test("min eating speed", () => {
  assert.equal(minEatingSpeed([3, 6, 7, 11], 8), 4);
  assert.equal(minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
  assert.equal(minEatingSpeed([30, 11, 23, 4, 20], 6), 23);
  assert.equal(minEatingSpeed([1], 1), 1);
});
