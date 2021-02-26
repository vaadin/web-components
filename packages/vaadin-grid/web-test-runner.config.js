/* eslint-env node */
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');
const fs = require('fs');

const config = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  testFramework: {
    config: {
      timeout: '10000' // default 2000
    }
  },
  coverageConfig: {
    include: ['**/src/*'],
    threshold: {
      statements: 97,
      branches: 58,
      functions: 95,
      lines: 97
    }
  }
};

const env = process.env.TEST_ENV;

const sauce = {
  firefox: {
    browserName: 'firefox',
    platform: 'Windows 10',
    browserVersion: 'latest'
  },
  safari: {
    browserName: 'safari',
    platform: 'macOS 10.15',
    browserVersion: 'latest'
  }
};

if (env === 'firefox' || env === 'safari') {
  // Exclude some tests to reduce Safari flakiness
  const exclude = [
    'all-imports.test.js',
    'extension.test.js',
    'hidden-grid.test.js',
    'iron-list.test.js',
    'missing-imports.test.js',
    'resizing-material.test.js'
  ];

  const tests = fs
    .readdirSync('./test/')
    .filter((file) => file.includes('test.js') && !exclude.includes(file))
    .map((file) => `test/${file}`);

  const sauceLabsLauncher = createSauceLabsLauncher(
    {
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY
    },
    {
      name: 'vaadin-grid unit tests',
      build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`,
      recordScreenshots: false,
      recordVideo: false
    }
  );

  config.files = tests;
  config.concurrency = env === 'firefox' ? 2 : 1;
  config.browsers = [sauceLabsLauncher(sauce[env])];
}

module.exports = config;
