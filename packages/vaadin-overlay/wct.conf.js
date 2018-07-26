var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  verbose: true,
  testTimeout: 180 * 1000,
  plugins: {
    // MAGI REMOVE START
    istanbul: {
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
    // MAGI REMOVE END
    local: {
      browserOptions: {
        chrome: [
          'headless',
          'disable-gpu',
          'no-sandbox'
        ]
      }
    }
  },

  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'iOS Simulator/iphone@11.3',
      'iOS Simulator/iphone@9.3'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.13/safari@11.1',
      'Windows 10/microsoftedge@17',
      'Windows 10/internet explorer@11'
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

    switch (env) {
      case 'saucelabs:mobile':
        context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;
        break;
      case 'saucelabs:desktop':
        context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop;
        break;
      case 'saucelabs:cron':
        context.options.plugins.sauce.browsers = cronPlatforms;
        break;
    }
  }
};
