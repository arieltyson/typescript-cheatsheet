import assert from "node:assert/strict";

export function demoStack(): void {
  const stack: number[] = [];
  stack.push(1, 2);
  assert.equal(stack.at(-1), 2);
  assert.equal(stack.pop(), 2);
  assert.equal(stack.length, 1);
  stack.pop();
  assert.equal(stack.pop(), undefined);
}

export function demoHeadIndexQueue(): void {
  // shift() is O(n); reading with a moving head index is O(1)
  const queue = [1];
  let head = 0;
  const order: number[] = [];
  while (head < queue.length) {
    const value = queue[head++];
    order.push(value);
    if (value < 4) queue.push(value * 2);
  }
  assert.deepEqual(order, [1, 2, 4]);
}

/** A FIFO queue with O(1) amortized enqueue and dequeue. */
export class Queue<T> {
  #items: T[] = [];
  #head = 0;

  get size(): number {
    return this.#items.length - this.#head;
  }

  enqueue(item: T): void {
    this.#items.push(item);
  }

  dequeue(): T | undefined {
    if (this.#head === this.#items.length) return undefined;
    const item = this.#items[this.#head++];
    // Drop the used half now and then so memory stays O(n)
    if (this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return item;
  }

  peek(): T | undefined {
    return this.#items[this.#head];
  }
}

export function demoQueue(): void {
  const queue = new Queue<string>();
  queue.enqueue("first");
  queue.enqueue("second");
  assert.equal(queue.peek(), "first");
  assert.equal(queue.dequeue(), "first");
  assert.equal(queue.size, 1);
}

/** Return true if every bracket in text closes in order. */
export function isBalanced(text: string): boolean {
  const openingFor: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  const stack: string[] = [];
  for (const char of text) {
    if ("([{".includes(char)) {
      stack.push(char);
    } else if (char in openingFor) {
      if (stack.pop() !== openingFor[char]) return false;
    }
  }
  return stack.length === 0;
}
