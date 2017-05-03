var argv = require('yargs').argv;

module.exports = {
  plugins: {
    'random-output': true
  },
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'OS X 10.11/iphone@9.3',
      'OS X 10.11/ipad@9.3',
      'Windows 10/microsoftedge@13',
      'Windows 10/internet explorer@11',
      'OS X 10.12/safari@10.0'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@50'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
