module.exports = {
  registerHooks: function(context) {
    var crossPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@50'
    ];

    var otherPlatforms = [
      'OS X 10.11/iphone@9.3',
      'OS X 10.11/ipad@9.3',
      'Windows 10/microsoftedge@14',
      'OS X 10.11/safari@10.0'
    ];

    // run SauceLabs tests for pushes, except cases when branch contains 'quick/'
    if (process.env.TRAVIS_EVENT_TYPE === 'push' && process.env.TRAVIS_BRANCH.indexOf('quick/') === -1) {
      // crossPlatforms are not tested here, but in Selenium WebDriver (see .travis.yml)
      context.options.plugins.sauce.browsers = otherPlatforms;

    // Run SauceLabs for daily builds, triggered by cron
    } else if (process.env.TRAVIS_EVENT_TYPE === 'cron') {
      context.options.plugins.sauce.browsers = crossPlatforms.concat(otherPlatforms);

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
