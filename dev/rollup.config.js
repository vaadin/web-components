import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from '@rollup-extras/plugin-copy';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import url from 'postcss-url';
import { appendStyles, generateListing, isIndexPage } from '../wds-utils.js';

const IMPORT_META_URL_RE = /(new Worker\(\s*)?new URL\(\s*(['"])([^'"]+)\2\s*,\s*import\.meta\.url\s*\)/gu;

/**
 * Emits files referenced with `new URL('./file', import.meta.url)`. Rollup
 * leaves these URLs untouched, so the files would be missing from the build.
 * A URL passed to `new Worker()` is bundled as a chunk, any other is copied.
 */
function importMetaUrls() {
  return {
    name: 'import-meta-urls',
    async transform(code, id) {
      if (!code.includes('import.meta.url')) {
        return null;
      }
      let result = code;
      for (const [match, worker, , specifier] of code.matchAll(IMPORT_META_URL_RE)) {
        const resolved = await this.resolve(specifier, id);
        if (!resolved) {
          this.error(`Cannot resolve ${specifier} from ${id}`);
        }
        const ref = worker
          ? this.emitFile({ type: 'chunk', id: resolved.id })
          : this.emitFile({ type: 'asset', name: basename(resolved.id), source: await readFile(resolved.id) });
        result = result.replace(match, `${worker || ''}new URL(import.meta.ROLLUP_FILE_URL_${ref})`);
      }
      return result === code ? null : { code: result, map: null };
    },
  };
}

export default {
  input: '**/*.html',
  output: { dir: 'dist' },
  plugins: [
    importMetaUrls(),
    nodeResolve(),
    html({
      bundleAssetsFromCss: true, // Use Aura CSS fonts
      flattenOutput: false, // Preserve sub-folder structure
      transformHtml: [
        (html) => appendStyles(html),
        (html, { htmlFileName }) => {
          // Index page listing
          if (isIndexPage(html)) {
            const path = htmlFileName.replace(/\/?(index.html)?$/u, '');
            const dir = `./${path}`;
            html = generateListing(html, dir);
          }
          return html;
        },
      ],
      transformAsset: [
        async (content, filePath) => {
          if (filePath.endsWith('.css')) {
            const result = await postcss()
              .use(atImport())
              .use(url({ url: 'rebase' }))
              .process(content, {
                from: filePath,
              });
            return result.css;
          }
        },
      ],
    }),
    terser(),
    copy([
      { src: 'assets/**/*', dest: 'assets' },
      { src: 'charts/demo-data/*.json', dest: 'charts/demo-data' },
    ]),
  ],
};
