/** Return every subset of values. */
export function subsets(values: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const explore = (start: number): void => {
    result.push([...path]);
    for (let i = start; i < values.length; i++) {
      path.push(values[i]);
      explore(i + 1);
      path.pop();
    }
  };
  explore(0);
  return result;
}

/** Return every way to choose size values, order ignored. */
export function combinations(
  values: number[],
  size: number,
): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const explore = (start: number): void => {
    if (path.length === size) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < values.length; i++) {
      path.push(values[i]);
      explore(i + 1);
      path.pop();
    }
  };
  explore(0);
  return result;
}

/** Return every ordering of values. */
export function permutations(values: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(values.length).fill(false);
  const explore = (): void => {
    if (path.length === values.length) {
      result.push([...path]);
      return;
    }
    for (const [i, value] of values.entries()) {
      if (used[i]) continue;
      used[i] = true;
      path.push(value);
      explore();
      path.pop();
      used[i] = false;
    }
  };
  explore();
  return result;
}
