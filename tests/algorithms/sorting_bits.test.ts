import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bitCount,
  singleNumber,
} from "../../snippets/algorithms/bits.ts";
import {
  kthLargest,
  mergeSort,
  topKLargest,
} from "../../snippets/algorithms/sorting.ts";
import { randomInts, seeded } from "../random.ts";

const random = seeded(17);
const lists = Array.from({ length: 300 }, () =>
  randomInts(random, Math.floor(random() * 16), -5, 5),
);
const descending = (values: number[]) =>
  values.toSorted((a, b) => b - a);

test("merge sort sorts without mutating", () => {
  for (const values of lists) {
    const original = [...values];
    assert.deepEqual(
      mergeSort(values),
      values.toSorted((a, b) => a - b),
    );
    assert.deepEqual(values, original);
  }
});

test("kth largest", () => {
  for (const values of lists) {
    const ranked = descending(values);
    for (let k = 1; k <= values.length; k++) {
      assert.equal(kthLargest(values, k), ranked[k - 1]);
    }
  }
});

test("top k", () => {
  for (const values of lists) {
    for (let k = 0; k <= values.length + 1; k++) {
      assert.deepEqual(
        topKLargest(values, k),
        descending(values).slice(0, k),
      );
    }
  }
});

test("bit count", () => {
  assert.equal(bitCount(0), 0);
  assert.equal(bitCount(0b1011), 3);
  assert.equal(bitCount(-1), 32);
  assert.equal(bitCount(2 ** 31), 1);
  for (let value = 0; value < 1_000; value++) {
    assert.equal(
      bitCount(value),
      value.toString(2).split("1").length - 1,
    );
  }
});

test("single number", () => {
  assert.equal(singleNumber([4, 1, 2, 1, 2]), 4);
  assert.equal(singleNumber([-3]), -3);
});
