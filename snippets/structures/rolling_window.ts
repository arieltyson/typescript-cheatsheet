import assert from "node:assert/strict";

export interface TimedValue {
  /** Milliseconds, as from Date.now(). */
  timestamp: number;
  value: number;
}

/** Keeps only the values from the last `durationMs`. */
export class RollingWindow {
  #items: TimedValue[] = [];
  #head = 0;
  #durationMs: number;

  constructor(durationMs: number) {
    this.#durationMs = durationMs;
  }

  get size(): number {
    return this.#items.length - this.#head;
  }

  add(item: TimedValue): void {
    this.#items.push(item);
    const cutoff = item.timestamp - this.#durationMs;
    // Moving head is O(1); shift() would move every item
    while (
      this.#head < this.#items.length &&
      this.#items[this.#head].timestamp < cutoff
    ) {
      this.#head++;
    }
    // Drop the used half now and then so memory stays O(n)
    if (this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
  }

  hasValue(atLeast: number): boolean {
    for (let i = this.#head; i < this.#items.length; i++) {
      if (this.#items[i].value >= atLeast) return true;
    }
    return false;
  }
}

/** The same window, but reads the largest value in O(1). */
export class RollingMax {
  // Values strictly decrease from head to end
  #candidates: TimedValue[] = [];
  #head = 0;
  #durationMs: number;

  constructor(durationMs: number) {
    this.#durationMs = durationMs;
  }

  get peak(): number | undefined {
    return this.#candidates[this.#head]?.value;
  }

  add(item: TimedValue): void {
    const candidates = this.#candidates;
    // A smaller, older value can never be the largest again
    while (
      candidates.length > this.#head &&
      candidates[candidates.length - 1].value <= item.value
    ) {
      candidates.pop();
    }
    candidates.push(item);
    const cutoff = item.timestamp - this.#durationMs;
    while (
      this.#head < candidates.length &&
      candidates[this.#head].timestamp < cutoff
    ) {
      this.#head++;
    }
    if (this.#head * 2 >= candidates.length) {
      this.#candidates = candidates.slice(this.#head);
      this.#head = 0;
    }
  }
}

export function demoRollingWindow(): void {
  const window = new RollingWindow(5_000);
  window.add({ timestamp: 0, value: 5 });
  window.add({ timestamp: 4_000, value: 1 });
  window.add({ timestamp: 6_000, value: 2 });
  // At 6 seconds the cutoff is 1 second, so the first value is gone
  assert.equal(window.size, 2);
  assert.equal(window.hasValue(5), false);
  assert.equal(window.hasValue(2), true);
}

export function demoRollingMax(): void {
  const window = new RollingMax(5_000);
  window.add({ timestamp: 0, value: 5 });
  window.add({ timestamp: 4_000, value: 1 });
  assert.equal(window.peak, 5);
  window.add({ timestamp: 6_000, value: 2 });
  assert.equal(window.peak, 2);
}
