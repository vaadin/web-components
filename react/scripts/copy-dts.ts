import { glob } from 'glob';
import { constants, copyFile, mkdir } from 'node:fs/promises';
import { packageURL, srcURL } from './utils/config.js';

const files = await glob(['**/*.d.ts'], { cwd: srcURL });
await Promise.all(
  files.map(async (file) => {
    const dest = new URL(file, packageURL);
    await mkdir(new URL('./', dest), { recursive: true });
    return copyFile(new URL(file, srcURL), dest, constants.COPYFILE_FICLONE);
  }),
);
