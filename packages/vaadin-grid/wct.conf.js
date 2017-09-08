var argv = require('yargs').argv;

module.exports = {
  testTimeout: 180 * 1000,
  registerHooks: function(context) {
    const saucelabsPlatformsMobile = [
      'macOS 10.12/iphone@10.3'
    ];

    const saucelabsPlatformsPolyfilled = [
      'Windows 10/microsoftedge@14',
      // 'Windows 10/internet explorer@11'
    ];

    const saucelabsPlatformsDesktop = [
      'macOS 10.12/safari@10.0'
    ];

    const cronPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@54'
    ];

    if (argv.env === 'saucelabs:mobile') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsMobile;

    } else if (argv.env === 'saucelabs:polyfilled') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsPolyfilled;

    } else if (argv.env === 'saucelabs:desktop') {
      context.options.plugins.sauce.browsers = saucelabsPlatformsDesktop.concat(cronPlatforms);

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;

    // Add coverage for local tests only
    } else {
      context.options.plugins.istanbul = {
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
      };
    }
  },

  plugins: {
    'random-output': true
  }
};
