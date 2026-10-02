/** Return the ways to climb taking 1 or 2 steps (top-down). */
export function climbStairsMemo(steps: number): number {
  const memo = new Map<number, number>([
    [0, 1],
    [1, 1],
  ]);
  const ways = (remaining: number): number => {
    const known = memo.get(remaining);
    if (known !== undefined) return known;
    const total = ways(remaining - 1) + ways(remaining - 2);
    memo.set(remaining, total);
    return total;
  };
  return ways(steps);
}

/** Return the ways to climb taking 1 or 2 steps (bottom-up). */
export function climbStairs(steps: number): number {
  let [previous, current] = [1, 1];
  for (let step = 2; step <= steps; step++) {
    [previous, current] = [current, previous + current];
  }
  return current;
}

/** Return the largest sum with no two adjacent values taken. */
export function houseRobber(values: number[]): number {
  // Best totals up to two houses back and up to the previous house
  let [previous, current] = [0, 0];
  for (const value of values) {
    [previous, current] = [
      current,
      Math.max(current, previous + value),
    ];
  }
  return current;
}

/** Return the fewest coins that sum to amount, or -1. */
export function coinChange(coins: number[], amount: number): number {
  const fewest = new Array<number>(amount + 1).fill(Infinity);
  fewest[0] = 0;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) {
        fewest[total] = Math.min(
          fewest[total],
          fewest[total - coin] + 1,
        );
      }
    }
  }
  return fewest[amount] === Infinity ? -1 : fewest[amount];
}

/** Return the best total value using each item at most once. */
export function knapsack(
  weights: number[],
  values: number[],
  capacity: number,
): number {
  const best = new Array<number>(capacity + 1).fill(0);
  for (const [item, weight] of weights.entries()) {
    // Go downward so each item is counted at most once
    for (let room = capacity; room >= weight; room--) {
      best[room] = Math.max(
        best[room],
        best[room - weight] + values[item],
      );
    }
  }
  return best[capacity];
}

/** Return the right/down paths from top-left to bottom-right. */
export function uniqueGridPaths(rows: number, cols: number): number {
  const row = new Array<number>(cols).fill(1);
  for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
    for (let col = 1; col < cols; col++) row[col] += row[col - 1];
  }
  return row[cols - 1];
}

/** Return the length of the longest common subsequence. */
export function longestCommonSubsequence(
  first: string,
  second: string,
): number {
  const table = Array.from({ length: first.length + 1 }, () =>
    new Array<number>(second.length + 1).fill(0),
  );
  for (let i = 1; i <= first.length; i++) {
    for (let j = 1; j <= second.length; j++) {
      table[i][j] =
        first[i - 1] === second[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }
  return table[first.length][second.length];
}

/** Return the length of the longest strictly rising subsequence. */
export function longestIncreasingSubsequence(values: number[]): number {
  // tails[k] = smallest tail of any increasing run of length k + 1
  const tails: number[] = [];
  for (const value of values) {
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (tails[middle] < value) low = middle + 1;
      else high = middle;
    }
    tails[low] = value;
  }
  return tails.length;
}
