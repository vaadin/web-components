import { nodeResolve } from '@rollup/plugin-node-resolve';
import { posix as path } from 'path';
import { RollupOptions } from 'rollup';
import { bundleInfoRollupPlugin } from './src/lib/bundle-info-rollup-plugin';

// Use the modules from the workspace root
const modulesDirectory = path.resolve(__dirname, '../../node_modules');

const rollupOptions: RollupOptions = {
  input: 'src/vaadin.js',
  preserveSymlinks: true,
  plugins: [bundleInfoRollupPlugin({ modulesDirectory }), nodeResolve({})],
  output: {
    format: 'esm',
    dir: path.resolve('./'),
    sourcemap: false,
    inlineDynamicImports: true
  }
};

export default rollupOptions;
