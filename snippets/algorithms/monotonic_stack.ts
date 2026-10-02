/** Return the next larger value to the right of each item, or -1. */
export function nextGreater(values: number[]): number[] {
  const result = new Array<number>(values.length).fill(-1);
  // Indices still waiting for a larger value; their values decrease
  const waiting: number[] = [];
  for (const [i, value] of values.entries()) {
    while (waiting.length > 0 && values[waiting.at(-1)!] < value) {
      result[waiting.pop()!] = value;
    }
    waiting.push(i);
  }
  return result;
}
