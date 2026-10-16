import fs from 'node:fs';
import { byName } from './lib/cem-helpers.js';
import { classPrivacyPlugin } from './plugins/class-privacy.js';
import { inheritancePlugin } from './plugins/inheritance.js';
import { publicApiPlugin } from './plugins/public-api.js';
import { readonlyPlugin } from './plugins/readonly.js';

export default {
  globs: ['packages/**/src/(vaadin-*.js|*-mixin.js)', 'labs/*/src/(vaadin-*.js|*-mixin.js)'],
  packagejson: false,
  litelement: true,
  // `globby` lists the files in no fixed order, and the analyzer applies
  // inheritance in module order, so sort them for a stable manifest
  overrideModuleCreation({ ts, globs }) {
    return [...globs]
      .sort(byName)
      .map((file) => ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.ES2015, true));
  },
  plugins: [inheritancePlugin(), classPrivacyPlugin(), readonlyPlugin(), publicApiPlugin()],
};
