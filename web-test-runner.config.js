/* eslint-env node */
const config = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  coverageConfig: {
    include: ['packages/**/src/*'],
    threshold: {
      statements: 94,
      branches: 58,
      functions: 90,
      lines: 94
    }
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  }
};

module.exports = config;
