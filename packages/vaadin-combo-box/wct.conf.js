var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  testTimeout: 180 * 1000,
  verbose: false,
  // MAGI REMOVE START
  plugins: {
    'istanbul': {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '**/vaadin-combo-box/src/*.html'
      ],
      exclude: [],
      thresholds: {
        global: {
          statements: 94
        }
      }
    },
    'random-output': true
  },
  // MAGI REMOVE END

  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'macOS 10.12/iphone@10.3',
      'Windows 10/microsoftedge@15',
      'Windows 10/internet explorer@11',
      'macOS 10.12/safari@11.0',
      'macOS 9.3.2/iphone@9.3'
    ];

    const saucelabsPlatformsMicrosoft = [
      'Windows 10/microsoftedge@17',
      'Windows 10/internet explorer@11'
    ];

    const saucelabsPlatformsDesktop = [
      'Windows 10/chrome@65',
      'Windows 10/firefox@59',
      'macOS 10.12/safari@11.0'
    ];

    const cronPlatforms = [
      'Android/chrome',
      'macOS 10.12/ipad@10.3',
      'Windows 10/chrome@59',
      'Windows 10/firefox@54'
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
