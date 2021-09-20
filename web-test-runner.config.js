/* eslint-env node */
const { createUnitTestsConfig } = require('./wtr-utils.js');

module.exports = createUnitTestsConfig({
  coverageConfig: {
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 75,
      branches: 50,
      functions: 60,
      lines: 75
    }
  }
});
