import { glob } from 'glob';
import { constants, copyFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const src = new URL('./src/', root);

const files = await glob(['**/*.d.ts'], { cwd: src });
await Promise.all(
  files.map(async (file) => copyFile(new URL(file, src), new URL(file, root), constants.COPYFILE_FICLONE)),
);
