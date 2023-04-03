export const shuffleArray = <T>(array: T[]): T[] =>
  array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const arrayRange = (start: number, stop: number, step = 1): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );