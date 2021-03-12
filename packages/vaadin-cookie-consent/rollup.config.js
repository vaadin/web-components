/* eslint-env node */
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const html = require('@open-wc/rollup-plugin-html');

module.exports = {
  input: './index.html',
  output: {
    dir: './dist'
  },
  plugins: [html(), nodeResolve(), terser()]
};
