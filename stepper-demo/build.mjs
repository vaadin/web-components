// Builds a static, self-contained demo that can be served from any static host
// (e.g. raw.githack.com). Run from the repository root: `node stepper-demo/build.mjs`
import { build } from 'esbuild';

const outdir = new URL('.', import.meta.url).pathname;

await build({
  entryPoints: [`${outdir}src/demo.js`],
  outfile: `${outdir}demo.js`,
  bundle: true,
  format: 'esm',
  minify: true,
  legalComments: 'none',
});

await build({
  entryPoints: {
    lumo: 'packages/vaadin-lumo-styles/lumo.css',
    aura: 'packages/aura/aura.css',
  },
  outdir,
  bundle: true,
  minify: true,
  loader: { '.woff2': 'file', '.woff': 'file', '.ttf': 'file' },
  assetNames: 'fonts/[name]',
});
