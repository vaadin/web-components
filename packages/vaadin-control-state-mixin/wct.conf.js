var argv = require('yargs').argv;

module.exports = {
  testTimeout: 180 * 1000,

  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'macOS 10.12/iphone@11.0',
      'macOS 10.12/ipad@11.0',
    ];

    const saucelabsPlatformsPolyfilled = [
      'Windows 10/microsoftedge@15',
      'Windows 10/internet explorer@11',
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.12/safari@11.0'
    ];

    const cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@60',
      'Windows 10/firefox@54'
    ];

    switch (argv.env) {
      case 'saucelabs:mobile':
        context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;
        break;
      case 'saucelabs:polyfilled':
        context.options.plugins.sauce.browsers = saucelabsPlatformsPolyfilled;
        break;
      case 'saucelabs:desktop':
        context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop;
        break;
      case 'saucelabs-cron':
        context.options.plugins.sauce.browsers = cronPlatforms;
        break;
      case 'saucelabs':
        context.options.plugins.sauce.browsers = cronPlatforms.concat(
          saucelabsPlatformsDesktop,
          saucelabsPlatformsMobile,
          saucelabsPlatformsPolyfilled
        );
        break;
    }
  },

  plugins: {
    'random-output': true
  }
};
