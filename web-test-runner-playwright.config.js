/* eslint-env node */
const fs = require('fs');
const { playwrightLauncher } = require('@web/test-runner-playwright');

const packages = fs
  .readdirSync('packages')
  .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`));

module.exports = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  browsers: [playwrightLauncher({ product: 'firefox' }), playwrightLauncher({ product: 'webkit' })],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  },
  groups: packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`
    };
  })
};
