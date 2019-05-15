var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  testTimeout: 180 * 1000,
  verbose: true,
  plugins: {
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
      'iOS Simulator/iphone@12.2',
      'iOS Simulator/iphone@10.3'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.13/safari@latest',
      'Windows 10/microsoftedge@18',
      'Windows 10/internet explorer@11'
    ];

    const cronPlatforms = [
      {
        deviceName: 'Android GoogleAPI Emulator',
        platformName: 'Android',
        platformVersion: '8.1',
        browserName: 'chrome'
      },
      'iOS Simulator/ipad@12.2',
      'iOS Simulator/iphone@10.3',
      'Windows 10/chrome@latest',
      'Windows 10/firefox@latest'
    ];

    if (env === 'saucelabs:mobile') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;

    } else if (env === 'saucelabs:desktop') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop;

    } else if (env === 'saucelabs') {
      context.options.plugins.sauce.browsers = [
        ...saucelabsPlatformsMobile,
        ...saucelabsPlatformsDesktop
      ];

    } else if (env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;

    // Add coverage for local tests only
    } else {
      /* context.options.plugins.istanbul = {
        'dir': './coverage',
        'reporters': ['text-summary', 'lcov'],
        'include': [
          '/vaadin-grid-active-item-mixin.html',
          '/vaadin-grid-array-data-provider-mixin.html',
          '/vaadin-grid-cell-click-mixin.html',
          '/vaadin-grid-column-group.html',
          '/vaadin-grid-column-reordering-mixin.html',
          '/vaadin-grid-column-resizing-mixin.html',
          '/vaadin-grid-column.html',
          '/vaadin-grid-data-provider-mixin.html',
          '/vaadin-grid-dynamic-columns-mixin.html',
          '/vaadin-grid-filter-mixin.html',
          '/vaadin-grid-filter.html',
          '/vaadin-grid-keyboard-navigation-mixin.html',
          '/vaadin-grid-outer-scroller.html',
          '/vaadin-grid-row-details-mixin.html',
          '/vaadin-grid-scroll-mixin.html',
          '/vaadin-grid-scroller.html',
          '/vaadin-grid-selection-column.html',
          '/vaadin-grid-selection-mixin.html',
          '/vaadin-grid-sort-mixin.html',
          '/vaadin-grid-sorter.html',
          '/vaadin-grid-styles.html',
          '/vaadin-grid-templatizer.html',
          '/vaadin-grid.html'
        ],
        'exclude': []
      };*/
    }
  }
};
