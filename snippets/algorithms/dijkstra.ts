import { PriorityQueue } from "../structures/heap.ts";

/**
 * Return the shortest distance from source to every node (Infinity if
 * unreachable). graph[node] = [[neighbor, weight], ...], weights >= 0.
 */
export function dijkstra(
  graph: [number, number][][],
  source: number,
): number[] {
  const distances = new Array<number>(graph.length).fill(Infinity);
  distances[source] = 0;
  const heap = new PriorityQueue<[number, number]>(
    (a, b) => a[0] - b[0],
    [[0, source]],
  );
  while (heap.size > 0) {
    const [distance, node] = heap.pop()!;
    // Skip stale entries left behind by a later, shorter path
    if (distance > distances[node]) continue;
    for (const [neighbor, weight] of graph[node]) {
      const candidate = distance + weight;
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        heap.push([candidate, neighbor]);
      }
    }
  }
  return distances;
}
