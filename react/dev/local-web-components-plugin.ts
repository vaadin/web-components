import path from 'node:path';
import type { PluginOption } from 'vite';

export default function (webComponentsRepoPath: string): PluginOption {
  const nodeModulesPath = path.resolve(__dirname, '../', `${webComponentsRepoPath}/node_modules`);

  return {
    name: 'local-web-components',
    enforce: 'pre',
    config() {
      return {
        server: {
          watch: {
            ignored: [`!${nodeModulesPath}/**`],
          },
        },
        resolve: {
          dedupe: ['lit', 'lit-html', 'ol'],
          preserveSymlinks: true,
        },
        optimizeDeps: {
          exclude: ['lit', 'lit-html', 'ol'],
        },
      };
    },
    resolveId(id: string) {
      if (id.startsWith('@vaadin')) {
        return this.resolve(path.join(nodeModulesPath, id));
      }
    },
  };
}
