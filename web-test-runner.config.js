/* eslint-env node */
const { createUnitTestsConfig } = require('./wtr-utils.js');

module.exports = createUnitTestsConfig({
  coverageConfig: {
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 95,
      branches: 90,
      functions: 92,
      lines: 95,
    },
  },
});
