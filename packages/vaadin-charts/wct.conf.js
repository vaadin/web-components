var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'macOS 10.13/safari@11.1',
      'Windows 10/firefox@58',
      'Windows 10/microsoftedge@16'
    ];

    var cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@64',
      'Windows 10/firefox@58',
      'Windows 10/internet explorer@11',
      'macOS 10.12/ipad@11.0',
      'macOS 10.12/iphone@10.3'
    ];

    var quickPlatforms = [
      'Windows 10/chrome@64'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    } else {
      context.options.plugins.sauce.browsers = quickPlatforms;
    }
  }
};
