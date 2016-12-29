var args = require('yargs').argv;

module.exports = {
  extraScripts: args.dom === 'shadow' ? ['test/enable-shadow-dom.js'] : [],
  registerHooks: function(context) {
    // run Saucelabs tests for
    //  - internal PRs, except cases when branch contains 'quick/'
    //  - daily builds, triggered by cron
    if (
      (process.env.TRAVIS_EVENT_TYPE === 'push' && process.env.TRAVIS_BRANCH.indexOf('quick/') === -1) ||
      process.env.TRAVIS_EVENT_TYPE === 'cron'
    ) {
      context.options.plugins.sauce.browsers = [
        // desktop
        'Windows 10/chrome@54',
        'Windows 10/firefox@50',
        'Windows 10/microsoftedge@13',
        'Windows 10/internet explorer@11',
        'OS X 10.11/safari@9.0',
        // mobile
        'OS X 10.11/iphone@9.2',
        'OS X 10.11/ipad@9.2',
        'Linux/android@5.1'
      ];
    }
  }
};
