# Vaadin React components

React wrappers for Vaadin components.

## Using Local React Components in a Vaadin Project

When developing React components locally, you may want to test your changes in a Vaadin application. To configure an application to import React components from a local repository, add this Vite plugin to the app's `vite.config.ts`:

```ts
function useLocalReactComponents(nodeModules: string): PluginOption {
  return {
    name: 'use-local-react-components',
    enforce: 'pre',
    config(config) {
      config.server ??= {};
      config.server.fs ??= {};
      config.server.fs.allow ??= [];
      config.server.fs.allow.push(nodeModules);
      config.server.watch ??= {};
      config.server.watch.ignored = [`!${nodeModules}/**`];
      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude = [
        ...(config.optimizeDeps.exclude ?? []),
        '@vaadin/react-components',
        '@vaadin/react-components-pro',
      ];
    },
    resolveId(id) {
      if (/^(@vaadin|@polymer)/.test(id)) {
        return this.resolve(path.join(nodeModules, id));
      }
    },
  };
}

const customConfig: UserConfigFn = (env) => ({
  plugins: [useLocalReactComponents('/path/to/react-components/node_modules')],
});

export default overrideVaadinConfig(customConfig);
```
