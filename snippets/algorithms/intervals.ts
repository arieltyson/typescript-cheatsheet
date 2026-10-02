import { PriorityQueue } from "../structures/heap.ts";

export type Interval = [start: number, end: number];

/** Return the union of intervals as sorted, non-overlapping ones. */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = intervals.toSorted((a, b) => a[0] - b[0]);
  const merged: Interval[] = [];
  for (const [start, end] of sorted) {
    const last = merged.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

/** Return how many rooms the meetings need at the busiest time. */
export function minMeetingRooms(intervals: Interval[]): number {
  const endTimes = new PriorityQueue<number>((a, b) => a - b);
  for (const [start, end] of intervals.toSorted(
    (a, b) => a[0] - b[0],
  )) {
    if (endTimes.size > 0 && endTimes.peek()! <= start) endTimes.pop();
    endTimes.push(end);
  }
  return endTimes.size;
}
