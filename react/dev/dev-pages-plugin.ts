import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin, ViteDevServer } from 'vite';

// Serves `/dev/` with a listing of `pages/*.tsx`, and `/dev/<dash-case-name>.html` with
// `page.html` rendering that page, like the web components dev pages.
const BASE = '/dev';
const dev = dirname(fileURLToPath(import.meta.url));

function toDashCase(camelCase: string): string {
  return camelCase
    .split(/(?=[A-Z])/u)
    .map((part) => part.toLowerCase())
    .join('-');
}

export default function devPagesPlugin(): Plugin {
  return {
    name: 'react-dev-pages',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0].replace(/\/(index\.html)?$/u, '');
        if (path !== BASE && !new RegExp(`^${BASE}/[a-z-]+\\.html$`, 'u').test(path)) {
          next();
          return;
        }

        const components = (await readdir(resolve(dev, 'pages')))
          .filter((file) => file.endsWith('.tsx'))
          .map((file) => file.replace('.tsx', ''));

        let html: string;
        if (path === BASE) {
          const listing = components
            .map((component) => `<li><a href="${BASE}/${toDashCase(component)}.html">${component}</a></li>`)
            .join('');
          html = (await readFile(resolve(dev, 'index.html'), 'utf8')).replace(
            '<ul id="listing"></ul>',
            `<ul id="listing">${listing}</ul>`,
          );
        } else {
          const component = components.find((name) => `${toDashCase(name)}.html` === path.split('/').pop());
          if (!component) {
            next();
            return;
          }
          html = (await readFile(resolve(dev, 'page.html'), 'utf8')).replaceAll('{component}', component);
        }

        res.setHeader('Content-Type', 'text/html');
        res.end(await server.transformIndexHtml(req.url ?? '', html));
      });
    },
  };
}
