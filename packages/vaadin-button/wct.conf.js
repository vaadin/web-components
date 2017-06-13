var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'OS X 10.12/iphone@10.2',
      'OS X 10.12/ipad@10.2',
      'Windows 10/microsoftedge@14',
      'Windows 10/internet explorer@11',
      'OS X 10.12/safari@10.0'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@58',
      'Windows 10/firefox@53'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
