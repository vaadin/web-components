var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'macOS 10.13/safari@11.1',
      'Windows 10/firefox@59',
      'Windows 10/microsoftedge@16'
    ];

    var cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@68',
      'Windows 10/firefox@59',
      'Windows 10/internet explorer@11',
      'macOS 10.12/ipad@11.0',
      'macOS 10.12/iphone@10.3'
    ];

    var quickPlatforms = [
      'Windows 10/chrome@68'
    ];

    if (env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    } else if (env === 'saucelabs-quick') {
      context.options.plugins.sauce.browsers = quickPlatforms;
    }
  }
};
