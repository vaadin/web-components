import {esbuildPlugin} from '@web/dev-server-esbuild';
import {fromRollup} from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import rollupReplace from '@rollup/plugin-replace';
import {DevServerConfig} from '@web/dev-server';

const commonjs = fromRollup(rollupCommonjs);
const nodeResolve = fromRollup(rollupNodeResolve);
const replace = fromRollup(rollupReplace);

const devServerConfig: DevServerConfig = {
  plugins: [
    nodeResolve({
      browser: true,
      extensions: [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
      ],
    }),
    commonjs({
      include: [
        '**/node_modules/rbush/**/*',
        '**/node_modules/react/**/*',
        '**/node_modules/react-dom/**/*',
        '**/node_modules/scheduler/**/*',
      ],
    }),
    replace({
      values: {
        'process.env.NODE_ENV': '"DEVELOPMENT"',
      },
      preventAssignment: true,
    }),
    esbuildPlugin({
      ts: true,
      jsx: true,
      tsx: true,
    }),
  ],
};

export default devServerConfig;