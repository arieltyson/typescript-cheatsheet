/** Return the largest sum of `size` consecutive values. */
export function maxWindowSum(values: number[], size: number): number {
  let window = 0;
  for (let i = 0; i < size; i++) window += values[i];
  let best = window;
  for (let end = size; end < values.length; end++) {
    window += values[end] - values[end - size];
    best = Math.max(best, window);
  }
  return best;
}

/** Return the longest substring length with at most k distinct. */
export function longestWithKDistinct(text: string, k: number): number {
  const counts = new Map<string, number>();
  let start = 0;
  let best = 0;
  for (let end = 0; end < text.length; end++) {
    counts.set(text[end], (counts.get(text[end]) ?? 0) + 1);
    while (counts.size > k) {
      const leaving = text[start++];
      const remaining = counts.get(leaving)! - 1;
      if (remaining === 0) counts.delete(leaving);
      else counts.set(leaving, remaining);
    }
    best = Math.max(best, end - start + 1);
  }
  return best;
}

/** Return the longest substring length with no repeated chars. */
export function longestUniqueSubstring(text: string): number {
  const lastSeen = new Map<string, number>();
  let start = 0;
  let best = 0;
  for (let end = 0; end < text.length; end++) {
    const previous = lastSeen.get(text[end]) ?? -1;
    if (previous >= start) start = previous + 1;
    lastSeen.set(text[end], end);
    best = Math.max(best, end - start + 1);
  }
  return best;
}

/** Return the largest value in each window of size k. */
export function slidingWindowMax(
  values: number[],
  k: number,
): number[] {
  if (k <= 0) return [];
  // Indices whose values strictly decrease from head to end
  const deque: number[] = [];
  let head = 0;
  const result: number[] = [];
  for (let index = 0; index < values.length; index++) {
    // A smaller, older value can never be the largest again
    while (
      deque.length > head &&
      values[deque[deque.length - 1]] <= values[index]
    ) {
      deque.pop();
    }
    deque.push(index);
    if (deque[head] <= index - k) head++;
    if (index >= k - 1) result.push(values[deque[head]]);
  }
  return result;
}
