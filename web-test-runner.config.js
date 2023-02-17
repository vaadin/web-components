/* eslint-env node */
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');
const { esbuildPlugin } = require('@web/dev-server-esbuild');

const unitTestsConfig = createUnitTestsConfig({
  coverageConfig: {
    include: ['packages/**/src/**/*', 'packages/*/*.js'],
    threshold: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
});

module.exports = {
  plugins: [esbuildPlugin({ ts: true, tsconfig: './tsconfig.json' })],
  ...unitTestsConfig,
  ...devServerConfig,
};
