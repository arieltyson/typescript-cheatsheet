// A small seeded generator so randomized tests are repeatable.

export function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2 ** 31;
    return state / 2 ** 31;
  };
}

export function randomInts(
  random: () => number,
  count: number,
  low: number,
  high: number,
): number[] {
  return Array.from(
    { length: count },
    () => low + Math.floor(random() * (high - low + 1)),
  );
}
