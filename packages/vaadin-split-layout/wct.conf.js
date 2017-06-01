module.exports = {
  registerHooks: function(context) {
    var crossPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@50'
    ];

    var otherPlatforms = [
      'macOS 10.12/iphone@10.3',
      // iPad simulator does not start on Saucelabs for some reason
      // TODO: enable back
      // 'macOS 10.12/ipad@10.3',
      'Windows 10/microsoftedge@14',
      'Windows 10/internet explorer@11',
      'macOS 10.12/safari@10.0'
    ];

    // run SauceLabs tests for pushes, except cases when branch contains 'quick/'
    if (process.env.TRAVIS_EVENT_TYPE === 'push' && process.env.TRAVIS_BRANCH.indexOf('quick/') === -1) {
      // crossPlatforms are not tested here, but in Selenium WebDriver (see .travis.yml)
      context.options.plugins.sauce.browsers = otherPlatforms;

    // Run SauceLabs for daily builds, triggered by cron
    } else if (process.env.TRAVIS_EVENT_TYPE === 'cron') {
      context.options.plugins.sauce.browsers = crossPlatforms.concat(otherPlatforms);
    }
  }
};
