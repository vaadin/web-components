var path = require('path');
var VisualRegressionCompare = require('wdio-visual-regression-service/compare');
function getScreenshotName(basePath) {
  return function(context) {
    var testName = context.test.title;
    var suite = context.test.parent;
    var browserVersion = parseInt(context.browser.version, 10) + (context.browser.userAgent.indexOf('iPhone') >= 0 ? '-iPhone' : '');
    var browserName = context.browser.name;
    return path.join(basePath, `${suite}/${testName}_${browserName}_v${browserVersion}.png`);
  };
}
exports.config = {
  specs: [
    'test/visual/test.js'
  ],
  capabilities: [
    // this setup actually works if we want to use it.
    // {
    //   browserName: 'Safari',
    //   deviceName: 'iPhone Simulator',
    //   deviceOrientation: 'portrait',
    //   platformVersion: '10.3',
    //   platformName: 'iOS'
    // },
    {
      browserName: 'chrome',
      version: '58',
      platform: 'Windows 10'
    },
    {
      browserName: 'firefox',
      version: '53.0',
      platform: 'Windows 10'
    },
    {
      browserName: 'microsoftedge',
      version: '14',
      platform: 'Windows 10'
    },
    {
      browserName: 'safari',
      version: '10.0',
      platform: 'macOS 10.12'
    }
  ],
  services: [
    'visual-regression', 'static-server', 'sauce'
  ],

  staticServerFolders: [
    {mount: '/', path: './bower_components'},
    {mount: '/vaadin-themes/material/', path: './material'},
    {mount: '/vaadin-themes/test', path: './test'}
  ],

  framework: 'mocha',
  mochaOpts: {
    timeout: 120000
  },
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  sauceConnect: true,
  visualRegression: {
    compare: new VisualRegressionCompare.LocalCompare({
      referenceName: getScreenshotName(path.join(process.cwd(), 'test/visual/screenshots/reference')),
      screenshotName: getScreenshotName(path.join(process.cwd(), 'test/visual/screenshots/screen')),
      diffName: getScreenshotName(path.join(process.cwd(), 'test/visual/screenshots/diff')),
      misMatchTolerance: 0.01,
    }),
    orientations: ['portrait'],
  },

  before: function() {
    var chai = require('chai');
    global.expect = chai.expect;
    chai.Should();
  }
};