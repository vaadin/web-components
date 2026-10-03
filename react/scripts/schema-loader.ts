import { compile } from 'json-schema-to-typescript';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { typesDir } from './utils/config.js';
import { warnAboutExistingFile } from './utils/errors.js';
import { exists, hasOverrideKey } from './utils/misc.js';

const schemaFilePath = resolve(typesDir, 'schema.d.ts');

const shouldOverride = hasOverrideKey(process.argv.slice(2));

if (!(await exists(schemaFilePath)) || shouldOverride) {
  const schema = await fetch('https://json.schemastore.org/web-types').then((response) => response.json());
  const ts = await compile(schema, 'WebTypes');
  await writeFile(schemaFilePath, ts, 'utf8');
  console.log(`[LOG]: Schema is successfully written to ${schemaFilePath}`);
} else {
  warnAboutExistingFile(schemaFilePath);
}
