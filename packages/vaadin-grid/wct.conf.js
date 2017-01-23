module.exports = {
  plugins: {
    'local': true,
    'istanbul': {
      'dir': './coverage',
      'reporters': ['text-summary', 'lcov'],
      'include': [
        '/iron-list-behavior.html',
        '/vaadin-grid-active-item-behavior.html',
        '/vaadin-grid-array-data-source-behavior.html',
        '/vaadin-grid-cell-click-behavior.html',
        '/vaadin-grid-column.html',
        '/vaadin-grid-data-source-behavior.html',
        '/vaadin-grid-dynamic-columns-behavior.html',
        // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
        // '/vaadin-grid-filter-behavior.html',
        '/vaadin-grid-row-details-behavior.html',
        '/vaadin-grid-selection-behavior.html',
        '/vaadin-grid-selection-column.html',
        '/vaadin-grid-sizer.html',
        // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
        // '/vaadin-grid-sort-behavior.html',
        '/vaadin-grid-table-cell.html',
        '/vaadin-grid-table-header-footer.html',
        '/vaadin-grid-table-outer-scroller.html',
        '/vaadin-grid-table-row.html',
        '/vaadin-grid-table-scroll-behavior.html',
        '/vaadin-grid-table.html',
        '/vaadin-grid-templatizer.html',
        '/vaadin-grid.html'
      ],
      'exclude': []
    }
  },
  root: '.'
};
