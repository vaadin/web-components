var argv = require('yargs').argv;

module.exports = {
  plugins: {
    'random-output': true
  },
  registerHooks: function(context) {
    var cronPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@50'
    ];

    var saucelabsPlatforms = [
      'OS X 10.11/iphone@10.2',
      'OS X 10.11/ipad@10.2',
      'Windows 10/microsoftedge@14',
      'Windows 10/internet explorer@11',
      'OS X 10.12/safari@10.0'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
