import assert from "node:assert/strict";
import { test } from "node:test";
import { assertsAsResults, splitArguments } from "../tools/results.ts";

test("equal becomes a result comment", () => {
  assert.equal(
    assertsAsResults("assert.equal(sum([1, 2]), 3);"),
    "sum([1, 2]); // 3",
  );
});

test("aligns consecutive results", () => {
  assert.equal(
    assertsAsResults(
      'assert.equal(text.length, 5);\nassert.deepEqual(text.split(""), ["a"]);',
    ),
    'text.length;    // 5\ntext.split(""); // ["a"]',
  );
});

test("ok shows true", () => {
  assert.equal(
    assertsAsResults("assert.ok(seen.has(1));"),
    "seen.has(1); // true",
  );
});

test("keeps indentation and other lines", () => {
  assert.equal(
    assertsAsResults(
      "for (const n of [1]) {\n  assert.equal(n, 1);\n}",
    ),
    "for (const n of [1]) {\n  n; // 1\n}",
  );
});

test("leaves messages, throws and multi-line asserts", () => {
  const source = [
    'assert.equal(x, 1, "why");',
    "assert.throws(() => run());",
    "assert.equal(",
    "  x,",
    "  1,",
    ");",
  ].join("\n");
  assert.equal(assertsAsResults(source), source);
});

test("splits only top-level commas", () => {
  assert.deepEqual(
    splitArguments('f(a, b), [1, 2], "x, y", `${a, b}`'),
    ["f(a, b)", "[1, 2]", '"x, y"', "`${a, b}`"],
  );
});
