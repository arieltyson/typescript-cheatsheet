import assert from "node:assert/strict";

/** A binary heap: pop() returns the item that compare puts first. */
export class PriorityQueue<T> {
  #items: T[];
  readonly #compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number, items: T[] = []) {
    this.#compare = compare;
    this.#items = [...items];
    // Heapify bottom-up in O(n)
    for (let i = (this.#items.length >> 1) - 1; i >= 0; i--) {
      this.#siftDown(i);
    }
  }

  get size(): number {
    return this.#items.length;
  }

  peek(): T | undefined {
    return this.#items[0];
  }

  push(item: T): void {
    this.#items.push(item);
    this.#siftUp(this.#items.length - 1);
  }

  pop(): T | undefined {
    const top = this.#items[0];
    const last = this.#items.pop();
    if (this.#items.length > 0 && last !== undefined) {
      this.#items[0] = last;
      this.#siftDown(0);
    }
    return top;
  }

  #siftUp(index: number): void {
    const items = this.#items;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.#compare(items[index], items[parent]) >= 0) return;
      [items[index], items[parent]] = [items[parent], items[index]];
      index = parent;
    }
  }

  #siftDown(index: number): void {
    const items = this.#items;
    while (true) {
      let first = index;
      for (const child of [2 * index + 1, 2 * index + 2]) {
        const inRange = child < items.length;
        if (inRange && this.#compare(items[child], items[first]) < 0) {
          first = child;
        }
      }
      if (first === index) return;
      [items[index], items[first]] = [items[first], items[index]];
      index = first;
    }
  }
}

export function demoPriorityQueue(): void {
  const minHeap = new PriorityQueue<number>((a, b) => a - b, [5, 1, 4]);
  minHeap.push(2);
  assert.equal(minHeap.peek(), 1);
  assert.equal(minHeap.pop(), 1);
  assert.equal(minHeap.pop(), 2);
  assert.equal(minHeap.size, 2);
  // Flip the comparator for a max-heap
  const maxHeap = new PriorityQueue<number>((a, b) => b - a, [5, 1, 4]);
  assert.equal(maxHeap.pop(), 5);
}

export function demoHeapOfTuples(): void {
  type Task = [priority: number, name: string];
  const tasks = new PriorityQueue<Task>(
    ([priorityA, nameA], [priorityB, nameB]) =>
      priorityA - priorityB || nameA.localeCompare(nameB),
  );
  tasks.push([2, "write"]);
  tasks.push([1, "plan"]);
  tasks.push([2, "test"]);
  assert.deepEqual(tasks.pop(), [1, "plan"]);
  assert.deepEqual(tasks.pop(), [2, "test"]);
}
