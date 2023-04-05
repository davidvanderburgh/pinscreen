import { promises } from "fs";
import { resolve } from "path";

export const shuffleArray = <T>(array: T[]): T[] =>
  array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const arrayRange = (start: number, stop: number, step = 1): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export async function* getFiles(dir: string): AsyncGenerator<string, void, unknown> {
  const dirents = await promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(`${dir}`, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export const getPublicVideosPath = (fileName: string): string =>
  (fileName.match(/videos(\/|\\).*/) ?? ['invalid'])[0]