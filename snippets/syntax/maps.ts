import assert from "node:assert/strict";

export function demoMap(): void {
  const ages = new Map<string, number>();
  ages.set("ada", 36).set("bo", 25);
  assert.equal(ages.get("ada"), 36);
  assert.equal(ages.get("cy"), undefined);
  assert.equal(ages.get("cy") ?? 0, 0);
  assert.ok(ages.has("bo"));
  assert.equal(ages.delete("bo"), true);
  assert.equal(ages.size, 1);
  // Maps keep insertion order
  assert.deepEqual([...ages.keys()], ["ada"]);
  assert.deepEqual([...ages], [["ada", 36]]);
  for (const [name, age] of ages) {
    assert.equal(`${name}: ${age}`, "ada: 36");
  }
}

export function demoCounting(): void {
  const counts = new Map<string, number>();
  for (const char of "banana") {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  assert.equal(counts.get("a"), 3);
  assert.equal(counts.get("z") ?? 0, 0);
  const byCount = [...counts].sort((a, b) => b[1] - a[1]);
  assert.deepEqual(byCount[0], ["a", 3]);
  const topTwo = byCount.slice(0, 2).map(([char]) => char);
  assert.deepEqual(topTwo, ["a", "n"]);
}

export function demoGrouping(): void {
  const groups = new Map<string, string[]>();
  for (const word of ["eat", "tea", "tan"]) {
    const key = [...word].sort().join("");
    const group = groups.get(key);
    if (group) group.push(word);
    else groups.set(key, [word]);
  }
  assert.deepEqual(groups.get("aet"), ["eat", "tea"]);
  assert.deepEqual([...groups.values()], [["eat", "tea"], ["tan"]]);
}

export function demoSet(): void {
  const seen = new Set<number>([1, 2]);
  seen.add(3).add(1);
  assert.equal(seen.size, 3);
  assert.ok(seen.has(2));
  seen.delete(2);
  // Remove duplicates but keep the original order
  assert.deepEqual([...new Set([3, 1, 3, 2])], [3, 1, 2]);
  const first = new Set([1, 2, 3]);
  const second = new Set([2, 3, 4]);
  const union = new Set([...first, ...second]);
  assert.deepEqual([...union], [1, 2, 3, 4]);
  const common = [...first].filter((value) => second.has(value));
  assert.deepEqual(common, [2, 3]);
  const onlyFirst = [...first].filter((value) => !second.has(value));
  assert.deepEqual(onlyFirst, [1]);
}

export function demoObjects(): void {
  const scores: Record<string, number> = { ada: 90 };
  scores.bo = 85;
  scores["cy"] = 70;
  assert.deepEqual(Object.keys(scores), ["ada", "bo", "cy"]);
  assert.deepEqual(Object.entries(scores)[0], ["ada", 90]);
  assert.ok("ada" in scores);
  delete scores.cy;
  assert.deepEqual(Object.fromEntries([["x", 1]]), { x: 1 });
  // Object keys are always strings
  const numbered: Record<number, string> = { 1: "one" };
  assert.deepEqual(Object.keys(numbered), ["1"]);
}

export function demoCoordinateKeys(): void {
  const visited = new Set<string>();
  const key = (row: number, col: number) => `${row},${col}`;
  visited.add(key(0, 1));
  assert.ok(visited.has(key(0, 1)));
  // Arrays compare by reference, so they make useless keys
  const pairs = new Set([[0, 1]]);
  assert.equal(pairs.has([0, 1]), false);
  // A number key is faster: row * cols + col
  const cols = 10;
  assert.equal(3 * cols + 4, 34);
}
