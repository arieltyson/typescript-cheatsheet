import assert from "node:assert/strict";

export function demoTypeAliases(): void {
  type Point = { row: number; col: number };
  interface Edge {
    from: number;
    to: number;
    weight: number;
  }
  const start: Point = { row: 0, col: 2 };
  const edge: Edge = { from: 0, to: 1, weight: 5 };
  assert.equal(edge.weight + start.col, 7);
  // Optional (?) may be missing; | null must be given
  type Item = { val: number; next?: Item | null };
  const item: Item = { val: 1 };
  assert.equal(item.next, undefined);
}

export function demoUnions(): void {
  type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; side: number };
  // Checking the shared `kind` field narrows the type
  const area = (shape: Shape): number =>
    shape.kind === "circle"
      ? Math.PI * shape.radius ** 2
      : shape.side ** 2;
  assert.equal(area({ kind: "square", side: 3 }), 9);
  const label = (value: string | number): string =>
    typeof value === "string" ? value.toUpperCase() : value.toFixed(1);
  assert.equal(label("a"), "A");
  assert.equal(label(2), "2.0");
}

export function demoGenerics(): void {
  function last<T>(items: readonly T[]): T | undefined {
    return items.at(-1);
  }
  assert.equal(last([1, 2, 3]), 3);
  assert.equal(last<string>([]), undefined);
  const pairs: [string, number][] = [["a", 1]];
  const [name, count] = pairs[0];
  assert.equal(`${name}${count}`, "a1");
  const buckets: Record<string, number[]> = { even: [2, 4] };
  assert.deepEqual(buckets.even, [2, 4]);
  // as const makes a readonly tuple of literal types
  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ] as const;
  assert.equal(DIRECTIONS.length, 4);
}

export function demoNullish(): void {
  const node: { next?: { val: number } } = {};
  assert.equal(node.next?.val, undefined);
  assert.equal(node.next?.val ?? -1, -1);
  // ?? only replaces null and undefined; || replaces every falsy value
  const zero: number = 0;
  assert.equal(zero ?? 5, 0);
  assert.equal(zero || 5, 5);
  const ages = new Map([["ada", 36]]);
  // ! tells the compiler "not undefined": only after a real check
  if (ages.has("ada")) {
    assert.equal(ages.get("ada")! + 1, 37);
  }
}
