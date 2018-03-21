var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/ipad@10.3',
      'Windows 10/microsoftedge@15',
      'Windows 10/internet explorer@11',
      'macOS 10.12/safari@11.0',
      'Windows 10/chrome@59'
    ];

    var saucelabsPlatformsP3 = [
      'macOS 10.12/iphone@11.2',
      'macOS 10.12/ipad@11.2',
      'Windows 10/chrome@63',
      'macOS 10.12/safari@11.0'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@59',
      'Windows 10/firefox@54'
    ];

    if (env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (env === 'saucelabs-p3') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsP3;
    } else if (env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
