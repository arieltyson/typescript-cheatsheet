import assert from "node:assert/strict";
import { test } from "node:test";
import { dijkstra } from "../../snippets/algorithms/dijkstra.ts";
import { seeded } from "../random.ts";

function bellmanFord(
  count: number,
  edges: [number, number, number][],
  source: number,
): number[] {
  const distances = new Array<number>(count).fill(Infinity);
  distances[source] = 0;
  for (let round = 1; round < count; round++) {
    for (const [from, to, weight] of edges) {
      distances[to] = Math.min(distances[to], distances[from] + weight);
    }
  }
  return distances;
}

test("example", () => {
  const graph: [number, number][][] = [
    [
      [1, 4],
      [2, 1],
    ],
    [[3, 1]],
    [
      [1, 2],
      [3, 5],
    ],
    [],
  ];
  assert.deepEqual(dijkstra(graph, 0), [0, 3, 1, 4]);
});

test("unreachable nodes stay at Infinity", () => {
  assert.deepEqual(dijkstra([[], []], 0), [0, Infinity]);
});

test("matches Bellman-Ford on random graphs", () => {
  const random = seeded(21);
  for (let round = 0; round < 300; round++) {
    const count = 1 + Math.floor(random() * 8);
    const edges: [number, number, number][] = Array.from(
      { length: Math.floor(random() * 20) },
      () => [
        Math.floor(random() * count),
        Math.floor(random() * count),
        Math.floor(random() * 10),
      ],
    );
    const graph: [number, number][][] = Array.from(
      { length: count },
      () => [],
    );
    for (const [from, to, weight] of edges)
      graph[from].push([to, weight]);
    assert.deepEqual(dijkstra(graph, 0), bellmanFord(count, edges, 0));
  }
});
