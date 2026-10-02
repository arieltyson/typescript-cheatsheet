import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bfsOrder,
  countIslands,
  dfsIterative,
  dfsRecursive,
  shortestPathGrid,
} from "../../snippets/algorithms/graph_search.ts";
import { topologicalOrder } from "../../snippets/algorithms/topological_sort.ts";
import { seeded } from "../random.ts";

//   0 - 1 - 3
//   |   |
//   2   4 - 5
const GRAPH = [[1, 2], [0, 3, 4], [0], [1], [1, 5], [4]];

test("bfs visits by distance", () => {
  assert.deepEqual(bfsOrder(GRAPH, 0), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(bfsOrder([[]], 0), [0]);
});

test("dfs orders agree", () => {
  assert.deepEqual(dfsRecursive(GRAPH, 0), [0, 1, 3, 4, 5, 2]);
  assert.deepEqual(dfsIterative(GRAPH, 0), [0, 1, 3, 4, 5, 2]);
  const random = seeded(3);
  for (let round = 0; round < 200; round++) {
    const graph = Array.from({ length: 8 }, () =>
      Array.from({ length: Math.floor(random() * 4) }, () =>
        Math.floor(random() * 8),
      ),
    );
    assert.deepEqual(dfsIterative(graph, 0), dfsRecursive(graph, 0));
  }
});

test("shortest path in a grid", () => {
  const grid = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  assert.equal(shortestPathGrid(grid, [0, 0], [2, 0]), 6);
  assert.equal(shortestPathGrid(grid, [0, 0], [0, 0]), 0);
  grid[1][2] = 1;
  assert.equal(shortestPathGrid(grid, [0, 0], [2, 0]), -1);
});

test("islands", () => {
  const grid = ["11000", "11000", "00100", "00011"].map((row) => [
    ...row,
  ]);
  assert.equal(countIslands(grid), 3);
  assert.equal(countIslands([["0"]]), 0);
  assert.equal(countIslands([["1"]]), 1);
  const large = Array.from({ length: 300 }, () =>
    new Array(300).fill("1"),
  );
  assert.equal(countIslands(large), 1);
});

test("topological order respects every edge", () => {
  const random = seeded(9);
  for (let round = 0; round < 200; round++) {
    const count = 1 + Math.floor(random() * 8);
    const rank = Array.from({ length: count }, () => random());
    const edges: [number, number][] = [];
    for (let a = 0; a < count; a++) {
      for (let b = 0; b < count; b++) {
        if (rank[a] < rank[b] && random() < 0.3) edges.push([a, b]);
      }
    }
    const order = topologicalOrder(count, edges)!;
    const position = new Map(order.map((node, index) => [node, index]));
    assert.deepEqual(
      order.toSorted((a, b) => a - b),
      Array.from({ length: count }, (_, i) => i),
    );
    for (const [before, after] of edges) {
      assert.ok(position.get(before)! < position.get(after)!);
    }
  }
});

test("topological order detects cycles", () => {
  assert.equal(
    topologicalOrder(3, [
      [0, 1],
      [1, 2],
      [2, 0],
    ]),
    null,
  );
  assert.equal(topologicalOrder(1, [[0, 0]]), null);
  assert.deepEqual(topologicalOrder(3, []), [0, 1, 2]);
  assert.deepEqual(topologicalOrder(0, []), []);
});
