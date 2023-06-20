import { glob } from 'glob';
import { constants, copyFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const src = new URL('./src/', root);

const files = await glob(['**/*.d.ts'], { cwd: src });
await Promise.all(
  files.map(async (file) => {
    const dest = new URL(file, root);
    await mkdir(new URL('./', dest), { recursive: true });
    return copyFile(new URL(file, src), dest, constants.COPYFILE_FICLONE);
  }),
);
