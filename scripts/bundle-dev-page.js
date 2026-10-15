#!/usr/bin/env node
/**
 * Bundles a dev page into a standalone HTML file:
 * - Bundles all module scripts (external + inline) with esbuild
 * - Bundles the Aura theme CSS (flattens @imports)
 * - Inlines both into a copy of the page
 *
 * Run from the workspace root, the page path is resolved
 * relative to the current working directory:
 *
 *   node scripts/bundle-dev-page.js dev/<page>.html [output.html] [--theme=aura:light]
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const theme = args.find((arg) => arg.startsWith('--theme='))?.slice('--theme='.length) ?? 'aura:light';
const [input, output = input?.replace(/\.html$/u, '.standalone.html')] = args.filter((arg) => !arg.startsWith('--'));

if (!input || !input.endsWith('.html')) {
  console.error('Usage: node scripts/bundle-dev-page.js dev/<page>.html [output.html] [--theme=aura:light]');
  process.exit(1);
}

const inputPath = path.resolve(input);
let html = fs.readFileSync(inputPath, 'utf8');

// Collect module scripts in document order and remove them from the HTML
const entryParts = [];
html = html.replace(
  /[ \t]*<script type="module"(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>\n?/gu,
  (_match, src, code) => {
    if (src) {
      entryParts.push(`import '${src.startsWith('.') ? src : `./${src}`}';`);
    } else {
      entryParts.push(code);
    }
    return '';
  },
);

if (entryParts.length === 0) {
  console.error(`No module scripts found in ${input}`);
  process.exit(1);
}

// Bundle JS (entry is the concatenated scripts, resolved relative to the page)
const jsResult = await build({
  stdin: {
    contents: entryParts.join('\n'),
    resolveDir: path.dirname(inputPath),
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  target: 'esnext',
  write: false,
  legalComments: 'none',
});
// Keep the inline script parser-safe
const js = jsResult.outputFiles[0].text.replace(/<\/script/gu, '<\\/script');

// Bundle the Aura theme CSS (flattens the @import tree)
const cssResult = await build({
  entryPoints: [path.join(rootDir, 'packages/aura/aura.css')],
  bundle: true,
  write: false,
  loader: { '.woff2': 'dataurl' },
  legalComments: 'none',
});
const css = cssResult.outputFiles[0].text;

// Set the theme attributes on <html>, mirroring the dev server behavior
const themeAttrs = theme.endsWith('dark') ? `data-theme="${theme}" theme="dark"` : `data-theme="${theme}"`;
html = html.replace('<html', `<html ${themeAttrs}`);

// Inline the theme CSS in <head> and the JS bundle at the end of <body>.
// Function replacements keep "$" sequences in the bundles from being
// interpreted as replacement patterns.
html = html.replace('</title>', () => `</title>\n    <style>\n${css}</style>`);
html = html.replace('</body>', () => `  <script type="module">\n${js}</script>\n</body>`);

fs.writeFileSync(output, html);
console.log(`Wrote ${output} (js: ${(js.length / 1024).toFixed(1)} kB, css: ${(css.length / 1024).toFixed(1)} kB)`);
