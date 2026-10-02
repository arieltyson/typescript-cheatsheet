import assert from "node:assert/strict";

export function demoLoops(): void {
  const values = ["a", "b"];
  const viaOf: string[] = [];
  for (const value of values) viaOf.push(value);
  assert.deepEqual(viaOf, ["a", "b"]);
  // for...in walks keys, and array keys are strings
  const viaIn: string[] = [];
  for (const key in values) viaIn.push(key);
  assert.deepEqual(viaIn, ["0", "1"]);
  const backwards: string[] = [];
  for (let i = values.length - 1; i >= 0; i--)
    backwards.push(values[i]);
  assert.deepEqual(backwards, ["b", "a"]);
}

export function demoDestructuring(): void {
  const [first, ...rest] = [1, 2, 3];
  assert.deepEqual([first, rest], [1, [2, 3]]);
  let [left, right] = [1, 2];
  [left, right] = [right, left];
  assert.deepEqual([left, right], [2, 1]);
  const person: { name: string; age?: number } = { name: "ada" };
  const { name, age = 0 } = person;
  assert.equal(`${name} ${age}`, "ada 0");
  const merged = { ...person, age: 36 };
  assert.deepEqual(merged, { name: "ada", age: 36 });
  // Spread copies one level; structuredClone copies all levels
  const nested = [[1], [2]];
  const deep = structuredClone(nested);
  deep[0].push(9);
  assert.deepEqual(nested[0], [1]);
}

export class Task {
  readonly priority: number;
  readonly name: string;

  constructor(priority: number, name: string) {
    this.priority = priority;
    this.name = name;
  }

  static compare(a: Task, b: Task): number {
    return a.priority - b.priority || a.name.localeCompare(b.name);
  }
}

export class Counter {
  #count = 0;

  increment(): number {
    this.#count += 1;
    return this.#count;
  }
}

export function demoClasses(): void {
  const tasks = [new Task(2, "write"), new Task(1, "plan")];
  tasks.sort(Task.compare);
  assert.equal(tasks[0].name, "plan");
  const counter = new Counter();
  counter.increment();
  assert.equal(counter.increment(), 2);
}
