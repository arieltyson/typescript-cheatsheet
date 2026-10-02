/**
 * Return nodes 0..count-1 so every edge [a, b] has a before b,
 * or null if the edges contain a cycle.
 */
export function topologicalOrder(
  count: number,
  edges: [number, number][],
): number[] | null {
  const graph: number[][] = Array.from({ length: count }, () => []);
  const inDegree = new Array<number>(count).fill(0);
  for (const [before, after] of edges) {
    graph[before].push(after);
    inDegree[after]++;
  }
  const order: number[] = [];
  for (let node = 0; node < count; node++) {
    if (inDegree[node] === 0) order.push(node);
  }
  // order doubles as the queue: read it with a moving head
  for (let head = 0; head < order.length; head++) {
    for (const next of graph[order[head]]) {
      if (--inDegree[next] === 0) order.push(next);
    }
  }
  return order.length === count ? order : null;
}
