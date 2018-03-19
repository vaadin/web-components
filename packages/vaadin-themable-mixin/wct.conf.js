var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/ipad@10.3',
      'Windows 10/microsoftedge@15',
      'Windows 10/internet explorer@11',
      'macOS 10.12/safari@11.0'
    ];

    var saucelabsPlatformsP3 = [
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/ipad@10.3',
      'Windows 10/chrome@59',
      'macOS 10.12/safari@11.0'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@59',
      'Windows 10/firefox@54'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (argv.env === 'saucelabs-p3') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsP3;
    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
