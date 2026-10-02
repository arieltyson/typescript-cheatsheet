import assert from "node:assert/strict";

/** Return adjacency lists for nodes 0..count-1. */
export function buildGraph(
  count: number,
  edges: [number, number][],
  directed = false,
): number[][] {
  const graph: number[][] = Array.from({ length: count }, () => []);
  for (const [from, to] of edges) {
    graph[from].push(to);
    if (!directed) graph[to].push(from);
  }
  return graph;
}

/** Return graph[from] = [[to, weight], ...] for directed edges. */
export function buildWeightedGraph(
  count: number,
  edges: [number, number, number][],
): [number, number][][] {
  const graph: [number, number][][] = Array.from(
    { length: count },
    () => [],
  );
  for (const [from, to, weight] of edges)
    graph[from].push([to, weight]);
  return graph;
}

/** Yield the in-bounds cells up, down, left and right of a cell. */
export function* gridNeighbors(
  grid: readonly ArrayLike<unknown>[],
  row: number,
  col: number,
): Generator<[number, number]> {
  const steps = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;
  for (const [rowStep, colStep] of steps) {
    const [nextRow, nextCol] = [row + rowStep, col + colStep];
    const inRows = nextRow >= 0 && nextRow < grid.length;
    if (inRows && nextCol >= 0 && nextCol < grid[nextRow].length) {
      yield [nextRow, nextCol];
    }
  }
}

export function demoGraphs(): void {
  const graph = buildGraph(3, [
    [0, 1],
    [1, 2],
  ]);
  assert.deepEqual(graph[1], [0, 2]);
  const weighted = buildWeightedGraph(3, [[0, 2, 7]]);
  assert.deepEqual(weighted[0], [[2, 7]]);
  const grid = ["01", "11"];
  assert.deepEqual(
    [...gridNeighbors(grid, 0, 0)],
    [
      [1, 0],
      [0, 1],
    ],
  );
}
