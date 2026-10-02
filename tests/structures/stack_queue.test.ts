import assert from "node:assert/strict";
import { test } from "node:test";
import {
  Queue,
  isBalanced,
} from "../../snippets/structures/stack_queue.ts";

test("queue matches an array model under random operations", () => {
  const queue = new Queue<number>();
  const model: number[] = [];
  let seed = 7;
  const random = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31);
  for (let step = 0; step < 5_000; step++) {
    if (random() % 3 === 0) {
      assert.equal(queue.dequeue(), model.shift());
    } else {
      queue.enqueue(step);
      model.push(step);
    }
    assert.equal(queue.size, model.length);
    assert.equal(queue.peek(), model[0]);
  }
});

test("empty queue", () => {
  const queue = new Queue<string>();
  assert.equal(queue.dequeue(), undefined);
  assert.equal(queue.peek(), undefined);
  assert.equal(queue.size, 0);
});

test("balanced brackets", () => {
  for (const text of ["", "()", "([]{})", "a(b)c", "{[()()]}"]) {
    assert.ok(isBalanced(text), text);
  }
  for (const text of ["(", ")", "(]", "([)]", "(()", "}{"]) {
    assert.ok(!isBalanced(text), text);
  }
});
