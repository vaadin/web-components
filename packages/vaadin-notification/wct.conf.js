var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'Windows 10/chrome@65',
      'Windows 10/firefox@59',
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/ipad@11.0',
      'Windows 10/microsoftedge@15',
      'Windows 10/internet explorer@11',
      'macOS 10.12/safari@11.0',
      'macOS 9.3.2/iphone@9.3'
    ];

    var saucelabsPlatformsP3 = [
      'macOS 10.12/iphone@11.2',
      'macOS 10.12/ipad@11.2',
      'Windows 10/chrome@65',
      'macOS 10.12/safari@11.0',
      'Windows 10/firefox@59',
      'Windows 10/microsoftedge@16'
    ];

    var cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@65',
      'Windows 10/firefox@59'
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
