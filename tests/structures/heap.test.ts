import assert from "node:assert/strict";
import { test } from "node:test";
import { PriorityQueue } from "../../snippets/structures/heap.ts";

function seeded(seed: number) {
  return () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
}

test("pops in sorted order from any starting array", () => {
  const random = seeded(3);
  for (let round = 0; round < 200; round++) {
    const items = Array.from(
      { length: Math.floor(random() * 30) },
      () => Math.floor(random() * 20),
    );
    const heap = new PriorityQueue<number>((a, b) => a - b, items);
    const popped: number[] = [];
    while (heap.size > 0) popped.push(heap.pop() as number);
    assert.deepEqual(
      popped,
      items.toSorted((a, b) => a - b),
    );
  }
});

test("matches a sorted model under mixed pushes and pops", () => {
  const random = seeded(11);
  const heap = new PriorityQueue<number>((a, b) => b - a);
  const model: number[] = [];
  for (let step = 0; step < 3_000; step++) {
    if (random() < 0.4) {
      model.sort((a, b) => b - a);
      assert.equal(heap.pop(), model.shift());
    } else {
      const value = Math.floor(random() * 100);
      heap.push(value);
      model.push(value);
    }
    assert.equal(heap.size, model.length);
    assert.equal(
      heap.peek(),
      model.length ? Math.max(...model) : undefined,
    );
  }
});

test("does not mutate the starting array", () => {
  const items = [3, 1, 2];
  new PriorityQueue<number>((a, b) => a - b, items).pop();
  assert.deepEqual(items, [3, 1, 2]);
});

test("empty heap", () => {
  const heap = new PriorityQueue<string>((a, b) => a.localeCompare(b));
  assert.equal(heap.pop(), undefined);
  assert.equal(heap.peek(), undefined);
});
