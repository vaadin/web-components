var envIndex = process.argv.indexOf('--env') + 1;
var env = envIndex ? process.argv[envIndex] : undefined;

module.exports = {
  testTimeout: 180 * 1000,
  verbose: true,
  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'macOS 10.12/iphone@11.2',
      'macOS 9.3.2/iphone@9.3'
    ];

    const saucelabsPlatformsMicrosoft = [
      'Windows 10/microsoftedge@17',
      'Windows 10/internet explorer@11'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.12/safari@11.0',
      'Windows 10/chrome@65',
      'Windows 10/firefox@60'
    ];

    const cronPlatforms = [
      'Windows 10/chrome@65',
      'Windows 10/firefox@60'
    ];

    if (env === 'saucelabs:mobile') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;

    } else if (env === 'saucelabs:microsoft') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsMicrosoft;

    } else if (env === 'saucelabs:desktop') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop;

    } else if (env === 'saucelabs') {
      context.options.plugins.sauce.browsers = [
        ...saucelabsPlatformsMobile,
        ...saucelabsPlatformsMicrosoft,
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
