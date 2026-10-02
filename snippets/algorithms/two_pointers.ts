/** Return indices of two sorted values adding to target, or null. */
export function pairWithSum(
  values: number[],
  target: number,
): [number, number] | null {
  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    const total = values[left] + values[right];
    if (total === target) return [left, right];
    if (total < target) left++;
    else right--;
  }
  return null;
}

/** Return every unique triplet that sums to zero. */
export function threeSum(values: number[]): number[][] {
  const sorted = values.toSorted((a, b) => a - b);
  const triplets: number[][] = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let left = i + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const total = sorted[i] + sorted[left] + sorted[right];
      if (total < 0) left++;
      else if (total > 0) right--;
      else {
        triplets.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
        while (left < right && sorted[left] === sorted[left - 1])
          left++;
      }
    }
  }
  return triplets;
}

/** Dedupe sorted values in place and return the new length. */
export function removeDuplicates(values: number[]): number {
  let write = 0;
  for (const value of values) {
    if (write === 0 || value !== values[write - 1]) {
      values[write++] = value;
    }
  }
  return write;
}

/** Return true if text reads the same both ways (letters only). */
export function isPalindrome(text: string): boolean {
  const isAlphanumeric = (char: string) => /[a-z0-9]/i.test(char);
  let left = 0;
  let right = text.length - 1;
  while (left < right) {
    if (!isAlphanumeric(text[left])) left++;
    else if (!isAlphanumeric(text[right])) right--;
    else if (text[left].toLowerCase() !== text[right].toLowerCase()) {
      return false;
    } else {
      left++;
      right--;
    }
  }
  return true;
}
