import type { Dirent } from 'fs';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';

export type WalkOptions = Readonly<{
  recursive?: boolean;
  yieldDirs?: boolean;
}>;
export type FsWalkResult = readonly [path: string, entry: Dirent];

export async function* fswalk(dir: string, options?: WalkOptions): AsyncGenerator<FsWalkResult, void> {
  const subdirs: Dirent[] = [];

  for await (const entry of await opendir(dir)) {
    if (entry.isDirectory()) {
      subdirs.push(entry);

      if (options?.yieldDirs) {
        yield [join(dir, entry.name), entry];
      }
    } else if (entry.isFile()) {
      yield [join(dir, entry.name), entry];
    }
  }

  if (options?.recursive) {
    for (const subdir of subdirs) {
      yield* fswalk(join(dir, subdir.name));
    }
  }
}
