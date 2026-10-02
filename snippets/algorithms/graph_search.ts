import { gridNeighbors } from "../structures/graphs.ts";

/** Return nodes reachable from start, nearest first. */
export function bfsOrder(graph: number[][], start: number): number[] {
  const visited = new Array<boolean>(graph.length).fill(false);
  visited[start] = true;
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    for (const neighbor of graph[node]) {
      if (visited[neighbor]) continue;
      visited[neighbor] = true;
      queue.push(neighbor);
    }
  }
  return queue;
}

/** Return the fewest steps from start to goal on 0 cells, or -1. */
export function shortestPathGrid(
  grid: number[][],
  [startRow, startCol]: [number, number],
  [goalRow, goalCol]: [number, number],
): number {
  const steps = grid.map((line) => line.map(() => -1));
  steps[startRow][startCol] = 0;
  const queue: [number, number][] = [[startRow, startCol]];
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    if (row === goalRow && col === goalCol) return steps[row][col];
    for (const [nextRow, nextCol] of gridNeighbors(grid, row, col)) {
      if (grid[nextRow][nextCol] === 1) continue;
      if (steps[nextRow][nextCol] !== -1) continue;
      steps[nextRow][nextCol] = steps[row][col] + 1;
      queue.push([nextRow, nextCol]);
    }
  }
  return -1;
}

/** Return nodes reachable from start in depth-first order. */
export function dfsRecursive(
  graph: number[][],
  start: number,
): number[] {
  const visited = new Array<boolean>(graph.length).fill(false);
  const order: number[] = [];
  const visit = (node: number): void => {
    visited[node] = true;
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) visit(neighbor);
    }
  };
  visit(start);
  return order;
}

/** Return the dfsRecursive order using an explicit stack. */
export function dfsIterative(
  graph: number[][],
  start: number,
): number[] {
  const visited = new Array<boolean>(graph.length).fill(false);
  const order: number[] = [];
  const stack = [start];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited[node]) continue;
    visited[node] = true;
    order.push(node);
    // Push in reverse so the first neighbour is visited first
    for (const neighbor of graph[node].toReversed()) {
      if (!visited[neighbor]) stack.push(neighbor);
    }
  }
  return order;
}

/** Return the number of 4-connected groups of "1" cells. */
export function countIslands(grid: string[][]): number {
  const seen = grid.map((line) => line.map(() => false));
  let islands = 0;
  for (const [row, line] of grid.entries()) {
    for (const [col, cell] of line.entries()) {
      if (cell !== "1" || seen[row][col]) continue;
      islands++;
      seen[row][col] = true;
      const stack: [number, number][] = [[row, col]];
      while (stack.length > 0) {
        const cell = stack.pop()!;
        for (const [nextRow, nextCol] of gridNeighbors(grid, ...cell)) {
          if (grid[nextRow][nextCol] !== "1") continue;
          if (seen[nextRow][nextCol]) continue;
          seen[nextRow][nextCol] = true;
          stack.push([nextRow, nextCol]);
        }
      }
    }
  }
  return islands;
}
