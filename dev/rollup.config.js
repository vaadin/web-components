import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from '@rollup-extras/plugin-copy';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import postcss from 'postcss';
import atImport from 'postcss-import';
import url from 'postcss-url';
import { appendStyles, generateListing } from '../wds-utils.js';

export default {
  input: '**/*.html',
  output: { dir: 'dist' },
  plugins: [
    nodeResolve(),
    html({
      bundleAssetsFromCss: true, // Use Aura CSS fonts
      flattenOutput: false, // Preserve "charts" folder
      transformHtml: [
        (html) => appendStyles(html),
        (html, { htmlFileName }) => {
          const folderPath = htmlFileName === 'charts/index.html' ? '/charts' : '';
          return generateListing(html, `.${folderPath}`);
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
      { src: 'assets/*.svg', dest: 'assets' },
      { src: 'charts/demo-data/*.json', dest: 'charts/demo-data' },
    ]),
  ],
};
