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
        "/vaadin-grid-cell.html",
        "/vaadin-grid-column.html",
        "/vaadin-grid-data-source-behavior.html",
        "/vaadin-grid-edge-behavior.html",
        "/vaadin-grid-footer.html",
        "/vaadin-grid-header.html",
        "/vaadin-grid-outer-scroller.html",
        "/vaadin-grid-row-details-behavior.html",
        "/vaadin-grid-row.html",
        "/vaadin-grid-scroll-behavior.html",
        "/vaadin-grid-scroller.html",
        "/vaadin-grid-selection-behavior.html",
        "/vaadin-grid-sizer.html",
        "/vaadin-grid.html"
      ],
      "exclude": []
    }
  },
  root: '.'
};
