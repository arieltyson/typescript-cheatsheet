/** Return an index of target in sorted values, or -1. */
export function binarySearch(values: number[], target: number): number {
  let low = 0;
  let high = values.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (values[middle] === target) return middle;
    if (values[middle] < target) low = middle + 1;
    else high = middle - 1;
  }
  return -1;
}

/** Return the first index with value >= target (length if none). */
export function lowerBound(values: number[], target: number): number {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (values[middle] < target) low = middle + 1;
    else high = middle;
  }
  return low;
}

/** Return the first index with value > target (length if none). */
export function upperBound(values: number[], target: number): number {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (values[middle] <= target) low = middle + 1;
    else high = middle;
  }
  return low;
}

/**
 * Return the smallest x in [low, high] with isValid(x) true.
 * isValid must be false...false, true...true, and true at high.
 */
export function firstTrue(
  low: number,
  high: number,
  isValid: (candidate: number) => boolean,
): number {
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (isValid(middle)) high = middle;
    else low = middle + 1;
  }
  return low;
}

/** Return the slowest speed that finishes every pile in time. */
export function minEatingSpeed(piles: number[], hours: number): number {
  const canFinish = (speed: number): boolean =>
    piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0) <=
    hours;
  return firstTrue(1, Math.max(...piles), canFinish);
}
