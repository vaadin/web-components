module.exports = {
  // See https://github.com/Polymer/web-component-tester/blob/master/runner/config.js#L47-54
  activeBrowsers: [],
  plugins: {
    local: true,
    "istanbul": {
      "dir": "./coverage",
      "reporters": ["text-summary", "lcov"],
      "include": [
        "/iron-list-behavior.html",
        "/vaadin-grid-table-cell.html",
        "/vaadin-grid-column.html",
        "/vaadin-grid-data-source-behavior.html",
        "/vaadin-grid-table-edge-behavior.html",
        "/vaadin-grid-table-header-footer.html",
        "/vaadin-grid-table-outer-scroller.html",
        "/vaadin-grid-row-details-behavior.html",
        "/vaadin-grid-table-row.html",
        "/vaadin-grid-table-scroll-behavior.html",
        "/vaadin-grid-table.html",
        "/vaadin-grid-selection-behavior.html",
        "/vaadin-grid-sizer.html",
        "/vaadin-grid.html"
      ],
      "exclude": []
    }
  },
  root: '.'
};
