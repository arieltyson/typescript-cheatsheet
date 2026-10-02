import assert from "node:assert/strict";

export function demoCreateArrays(): void {
  assert.deepEqual(new Array<number>(3).fill(0), [0, 0, 0]);
  const squares = Array.from({ length: 4 }, (_, i) => i * i);
  assert.deepEqual(squares, [0, 1, 4, 9]);
  assert.deepEqual([...Array(3).keys()], [0, 1, 2]);
  const [rows, cols] = [2, 3];
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  grid[0][1] = 7;
  assert.deepEqual(grid[0], [0, 7, 0]);
  assert.deepEqual(grid[1], [0, 0, 0]);
  // Bug: fill() puts the same inner array in every row
  const shared = new Array<number[]>(2).fill([]);
  shared[0].push(1);
  assert.deepEqual(shared[1], [1]);
}

export function demoArrayOperations(): void {
  const items = [3, 1];
  items.push(4, 5);
  assert.equal(items.pop(), 5);
  assert.equal(items.shift(), 3);
  items.unshift(2);
  assert.deepEqual(items, [2, 1, 4]);
  assert.equal(items.at(-1), 4);
  assert.deepEqual(items.slice(1), [1, 4]);
  assert.ok(items.includes(4));
  assert.equal(items.indexOf(9), -1);
  // splice(start, deleteCount, ...inserted) edits in place
  assert.deepEqual(items.splice(1, 1, 7, 8), [1]);
  assert.deepEqual(items, [2, 7, 8, 4]);
  assert.deepEqual([...items, 0], [2, 7, 8, 4, 0]);
}

export function demoSorting(): void {
  const values = [10, 9, 1];
  // The default sort compares values as strings
  assert.deepEqual([...values].sort(), [1, 10, 9]);
  assert.deepEqual(
    values.toSorted((a, b) => a - b),
    [1, 9, 10],
  );
  assert.deepEqual(
    values.toSorted((a, b) => b - a),
    [10, 9, 1],
  );
  // sort() sorts in place and returns the same array
  values.sort((a, b) => a - b);
  assert.deepEqual(values, [1, 9, 10]);
  const words = ["pear", "Fig", "apple"];
  assert.deepEqual(words.toSorted(), ["Fig", "apple", "pear"]);
  const byName = words.toSorted((a, b) => a.localeCompare(b));
  assert.deepEqual(byName, ["apple", "Fig", "pear"]);
}

export function demoSortKeys(): void {
  const people: [string, number][] = [
    ["bo", 85],
    ["ada", 90],
    ["cy", 85],
  ];
  // Score descending, then name ascending
  people.sort(
    ([nameA, scoreA], [nameB, scoreB]) =>
      scoreB - scoreA || nameA.localeCompare(nameB),
  );
  const names = people.map(([name]) => name);
  assert.deepEqual(names, ["ada", "bo", "cy"]);
}

export function demoTransforms(): void {
  const values = [3, -1, 4];
  assert.deepEqual(
    values.map((value) => value * 2),
    [6, -2, 8],
  );
  assert.deepEqual(
    values.filter((value) => value > 0),
    [3, 4],
  );
  assert.equal(
    values.reduce((sum, value) => sum + value, 0),
    6,
  );
  assert.deepEqual([[1, 2], [3]].flat(), [1, 2, 3]);
  for (const [index, value] of values.entries()) {
    assert.equal(values[index], value);
  }
}

export function demoSearchArrays(): void {
  const values = [3, -1, 4];
  assert.equal(
    values.find((value) => value > 3),
    4,
  );
  assert.equal(
    values.find((value) => value > 9),
    undefined,
  );
  assert.equal(
    values.findIndex((value) => value < 0),
    1,
  );
  assert.equal(
    values.findLast((value) => value > 0),
    4,
  );
  assert.ok(values.some((value) => value < 0));
  assert.ok(values.every((value) => value !== 0));
}

export function demoMinMax(): void {
  const values = [3, -1, 4];
  assert.equal(Math.max(...values), 4);
  assert.equal(Math.min(...values), -1);
  assert.equal(Math.max(), -Infinity);
  // Spreading a very large array can overflow the call stack
  const largest = values.reduce((best, value) => Math.max(best, value));
  assert.equal(largest, 4);
  const scores = new Map([
    ["ada", 90],
    ["bo", 85],
  ]);
  const [topName] = [...scores].reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  );
  assert.equal(topName, "ada");
}
