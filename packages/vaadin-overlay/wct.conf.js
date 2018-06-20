var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  verbose: true,
  testTimeout: 180 * 1000,
  plugins: {
    'istanbul': {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '**/vaadin-overlay/src/*.html'
      ],
      exclude: [],
      thresholds: {
        global: {
          statements: 85
        }
      }
    },
    'random-output': true
  },
  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/ipad@11.2',
      'macOS 9.3.2/iphone@9.3'
    ];

    const saucelabsPlatformsMicrosoft = [
      'Windows 10/microsoftedge@16',
      'Windows 10/internet explorer@11'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.12/safari@11.0',
      'Windows 10/chrome@65',
      'Windows 10/firefox@59'
    ];

    const cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@65',
      'Windows 10/firefox@59'
    ];

    switch (env) {
      case 'saucelabs:mobile':
        context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;
        break;
      case 'saucelabs:microsoft':
        context.options.plugins.sauce.browsers = saucelabsPlatformsMicrosoft;
        break;
      case 'saucelabs:desktop':
        context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop;
        break;
      case 'saucelabs-cron':
        context.options.plugins.sauce.browsers = cronPlatforms;
        break;
      case 'saucelabs':
        context.options.plugins.sauce.browsers = [
          ...saucelabsPlatformsMobile,
          ...saucelabsPlatformsMicrosoft,
          ...saucelabsPlatformsDesktop
        ];
        break;
    }
  }
};
