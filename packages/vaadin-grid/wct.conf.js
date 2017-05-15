var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'OS X 10.12/iphone@10.2',
      'OS X 10.12/ipad@10.2',
      'Windows 10/microsoftedge@14',
      'Windows 10/internet explorer@11',
      'OS X 10.12/safari@10.0',
      'Windows 10/chrome@58',
      'Windows 10/firefox@53'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@58',
      'Windows 10/firefox@53'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;

    // Add coverage for local tests only
    } else {
      context.options.plugins.istanbul = {
        'dir': './coverage',
        'reporters': ['text-summary', 'lcov'],
        'include': [
          '/iron-list-behavior.html',
          '/vaadin-grid-active-item-behavior.html',
          '/vaadin-grid-array-data-provider-behavior.html',
          '/vaadin-grid-cell-click-behavior.html',
          '/vaadin-grid-column.html',
          '/vaadin-grid-data-provider-behavior.html',
          '/vaadin-grid-dynamic-columns-behavior.html',
          // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
          // '/vaadin-grid-filter-behavior.html',
          '/vaadin-grid-focusable-cell-container-behavior.html',
          '/vaadin-grid-keyboard-navigation-behavior.html',
          '/vaadin-grid-row-details-behavior.html',
          '/vaadin-grid-selection-behavior.html',
          '/vaadin-grid-selection-column.html',
          '/vaadin-grid-sizer.html',
          // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
          // '/vaadin-grid-sort-behavior.html',
          '/vaadin-grid-table-cell.html',
          '/vaadin-grid-table-focus-trap.html',
          '/vaadin-grid-table-header-footer.html',
          '/vaadin-grid-table-outer-scroller.html',
          '/vaadin-grid-table-row.html',
          '/vaadin-grid-table-scroll-behavior.html',
          '/vaadin-grid-table.html',
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
