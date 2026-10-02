import assert from "node:assert/strict";

export class UnionFind {
  readonly #parent: number[];
  readonly #size: number[];
  #components: number;

  constructor(count: number) {
    this.#parent = Array.from({ length: count }, (_, i) => i);
    this.#size = new Array<number>(count).fill(1);
    this.#components = count;
  }

  get components(): number {
    return this.#components;
  }

  find(node: number): number {
    const parent = this.#parent;
    // Path halving: point each visited node at its grandparent
    while (parent[node] !== node) {
      parent[node] = parent[parent[node]];
      node = parent[node];
    }
    return node;
  }

  /** Join two sets; return false if they were already one set. */
  union(first: number, second: number): boolean {
    let rootA = this.find(first);
    let rootB = this.find(second);
    if (rootA === rootB) return false;
    if (this.#size[rootA] < this.#size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }
    this.#parent[rootB] = rootA;
    this.#size[rootA] += this.#size[rootB];
    this.#components--;
    return true;
  }
}

export function demoUnionFind(): void {
  const groups = new UnionFind(4);
  assert.equal(groups.union(0, 1), true);
  assert.equal(groups.union(2, 3), true);
  // Already connected: in an edge list this edge closes a cycle
  assert.equal(groups.union(1, 0), false);
  assert.equal(groups.find(0), groups.find(1));
  assert.equal(groups.components, 2);
}
