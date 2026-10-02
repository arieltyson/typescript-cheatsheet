import assert from "node:assert/strict";

export function demoSorting(): void {
  const values = [10, 9, 1];
  // The default sort compares values as strings
  assert.deepEqual([...values].sort(), [1, 10, 9]);
  assert.deepEqual(
    [...values].sort((a, b) => a - b),
    [1, 9, 10],
  );
}
