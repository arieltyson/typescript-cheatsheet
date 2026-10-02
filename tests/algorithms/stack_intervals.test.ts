import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mergeIntervals,
  minMeetingRooms,
} from "../../snippets/algorithms/intervals.ts";
import { nextGreater } from "../../snippets/algorithms/monotonic_stack.ts";
import { randomInts, seeded } from "../random.ts";

const random = seeded(5);

function randomIntervals(): [number, number][] {
  return Array.from({ length: Math.floor(random() * 9) }, () => {
    const start = Math.floor(random() * 11);
    return [start, start + 1 + Math.floor(random() * 5)];
  });
}

test("next greater matches brute force", () => {
  for (let round = 0; round < 300; round++) {
    const values = randomInts(random, Math.floor(random() * 10), 0, 5);
    const expected = values.map(
      (value, i) =>
        values.slice(i + 1).find((later) => later > value) ?? -1,
    );
    assert.deepEqual(nextGreater(values), expected);
  }
});

test("merge examples", () => {
  assert.deepEqual(
    mergeIntervals([
      [8, 10],
      [1, 3],
      [2, 6],
      [15, 18],
    ]),
    [
      [1, 6],
      [8, 10],
      [15, 18],
    ],
  );
  assert.deepEqual(
    mergeIntervals([
      [1, 4],
      [4, 5],
    ]),
    [[1, 5]],
  );
  assert.deepEqual(mergeIntervals([]), []);
});

test("merge covers the same points without overlap", () => {
  for (let round = 0; round < 300; round++) {
    const intervals = randomIntervals();
    const original = structuredClone(intervals);
    const merged = mergeIntervals(intervals);
    const covered = (list: [number, number][]) =>
      new Set(
        list.flatMap(([start, end]) =>
          Array.from({ length: end - start + 1 }, (_, i) => start + i),
        ),
      );
    assert.deepEqual(covered(merged), covered(intervals));
    for (let i = 1; i < merged.length; i++) {
      assert.ok(merged[i - 1][1] < merged[i][0]);
    }
    assert.deepEqual(intervals, original);
  }
});

test("meeting rooms match the busiest moment", () => {
  for (let round = 0; round < 300; round++) {
    const intervals = randomIntervals();
    let busiest = 0;
    for (let moment = 0; moment <= 16; moment++) {
      const open = intervals.filter(
        ([s, e]) => s <= moment && moment < e,
      );
      busiest = Math.max(busiest, open.length);
    }
    assert.equal(minMeetingRooms(intervals), busiest);
  }
});
