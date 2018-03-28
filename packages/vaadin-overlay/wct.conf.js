var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

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

    var saucelabsPlatformsP3 = [
      'macOS 10.12/iphone@11.2',
      'macOS 10.12/ipad@11.2',
      'Windows 10/chrome@65',
      'macOS 10.12/safari@11.0'
    ];


    switch (env) {
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
      case 'saucelabs-p3':
        context.options.plugins.sauce.browsers = saucelabsPlatformsP3;
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
