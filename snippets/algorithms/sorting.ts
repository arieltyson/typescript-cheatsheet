import { PriorityQueue } from "../structures/heap.ts";

/** Return a new sorted array (stable). */
export function mergeSort(values: number[]): number[] {
  if (values.length <= 1) return [...values];
  const middle = values.length >> 1;
  const left = mergeSort(values.slice(0, middle));
  const right = mergeSort(values.slice(middle));
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return merged.concat(left.slice(i), right.slice(j));
}

/** Return the k-th largest value (k = 1 is the maximum). */
export function kthLargest(values: number[], k: number): number {
  let candidates = values;
  while (true) {
    const pivot = candidates[candidates.length >> 1];
    const larger = candidates.filter((value) => value > pivot);
    const equal = candidates.filter((value) => value === pivot).length;
    if (k <= larger.length) {
      candidates = larger;
    } else if (k <= larger.length + equal) {
      return pivot;
    } else {
      k -= larger.length + equal;
      candidates = candidates.filter((value) => value < pivot);
    }
  }
}

/** Return the k largest values, largest first. */
export function topKLargest(values: number[], k: number): number[] {
  // Min-heap of the best k so far; peek() is the weakest of them
  const best = new PriorityQueue<number>((a, b) => a - b);
  for (const value of values) {
    if (best.size < k) best.push(value);
    else if (best.size > 0 && value > best.peek()!) {
      best.pop();
      best.push(value);
    }
  }
  const result: number[] = [];
  while (best.size > 0) result.push(best.pop()!);
  return result.reverse();
}
