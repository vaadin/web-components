var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  testTimeout: 180 * 1000,
  verbose: false,
  plugins: {
    local: {
      browserOptions: {
        chrome: [
          'headless',
          'disable-gpu',
          'no-sandbox'
        ]
      }
    },
    // MAGI REMOVE START
    istanbul: {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '**/vaadin-ordered-layout/src/*.html'
      ],
      exclude: [],
      thresholds: {
        global: {
          statements: 83
        }
      }
    }
    // MAGI REMOVE END
  },

  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'iOS Simulator/iphone@11.3',
      'iOS Simulator/iphone@9.3'
    ];

    const saucelabsPlatformsMicrosoft = [
      'Windows 10/microsoftedge@17',
      'Windows 10/internet explorer@11'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.13/safari@11.1'
    ];

    const saucelabsPlatforms = [
      ...saucelabsPlatformsMobile,
      ...saucelabsPlatformsMicrosoft,
      ...saucelabsPlatformsDesktop
    ];

    const cronPlatforms = [
      {
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '7.1',
        browserName: 'chrome'
      },
      'iOS Simulator/ipad@11.3',
      'iOS Simulator/iphone@10.3',
      'Windows 10/chrome@latest',
      'Windows 10/firefox@latest'
    ];

    if (env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    }
  }
};
