import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countSubarraysWithSum,
  prefixSums,
} from "../../snippets/algorithms/prefix_sums.ts";
import {
  longestUniqueSubstring,
  longestWithKDistinct,
  maxWindowSum,
} from "../../snippets/algorithms/sliding_window.ts";
import {
  isPalindrome,
  pairWithSum,
  removeDuplicates,
  threeSum,
} from "../../snippets/algorithms/two_pointers.ts";
import { randomInts, seeded } from "../random.ts";

const random = seeded(11);
const lists = Array.from({ length: 200 }, () =>
  randomInts(random, Math.floor(random() * 10), -4, 4),
);
const texts = Array.from({ length: 200 }, () =>
  Array.from(
    { length: Math.floor(random() * 12) },
    () => "abcd"[Math.floor(random() * 4)],
  ).join(""),
);

function substrings(text: string): string[] {
  const all: string[] = [];
  for (let start = 0; start < text.length; start++) {
    for (let end = start + 1; end <= text.length; end++) {
      all.push(text.slice(start, end));
    }
  }
  return all;
}

test("pair with sum", () => {
  assert.deepEqual(pairWithSum([1, 2, 4, 7, 11], 9), [1, 3]);
  assert.equal(pairWithSum([1, 2], 9), null);
  assert.equal(pairWithSum([], 0), null);
});

test("three sum matches brute force", () => {
  for (const values of lists) {
    const expected = new Set<string>();
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        for (let k = j + 1; k < values.length; k++) {
          if (values[i] + values[j] + values[k] !== 0) continue;
          const triplet = [values[i], values[j], values[k]];
          expected.add(String(triplet.sort((a, b) => a - b)));
        }
      }
    }
    const actual = threeSum(values).map(String);
    assert.equal(actual.length, new Set(actual).size);
    assert.deepEqual(new Set(actual), expected);
  }
});

test("remove duplicates", () => {
  for (const original of lists) {
    const values = original.toSorted((a, b) => a - b);
    const length = removeDuplicates(values);
    assert.deepEqual(
      values.slice(0, length),
      [...new Set(original)].sort((a, b) => a - b),
    );
  }
});

test("palindrome", () => {
  assert.ok(isPalindrome("A man, a plan, a canal: Panama"));
  assert.ok(isPalindrome(""));
  assert.ok(isPalindrome(".,"));
  assert.ok(!isPalindrome("race a car"));
});

test("max window sum", () => {
  for (const values of lists) {
    for (let size = 1; size <= values.length; size++) {
      let expected = -Infinity;
      for (let i = 0; i + size <= values.length; i++) {
        const window = values.slice(i, i + size);
        expected = Math.max(
          expected,
          window.reduce((a, b) => a + b, 0),
        );
      }
      assert.equal(maxWindowSum(values, size), expected);
    }
  }
});

test("windows over strings match brute force", () => {
  for (const text of texts) {
    const all = substrings(text);
    for (let k = 0; k < 4; k++) {
      const fits = all.filter((part) => new Set(part).size <= k);
      const expected = Math.max(0, ...fits.map((part) => part.length));
      assert.equal(longestWithKDistinct(text, k), expected);
    }
    const unique = all.filter(
      (part) => new Set(part).size === part.length,
    );
    const expected = Math.max(0, ...unique.map((part) => part.length));
    assert.equal(longestUniqueSubstring(text), expected);
  }
});

test("prefix sums and subarray counts", () => {
  assert.deepEqual(prefixSums([]), [0]);
  for (const values of lists) {
    for (let target = -3; target <= 3; target++) {
      let expected = 0;
      for (let start = 0; start < values.length; start++) {
        let total = 0;
        for (let end = start; end < values.length; end++) {
          total += values[end];
          if (total === target) expected++;
        }
      }
      assert.equal(countSubarraysWithSum(values, target), expected);
    }
  }
});
