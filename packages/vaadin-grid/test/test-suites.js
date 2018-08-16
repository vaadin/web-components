const isPolymer2 = document.querySelector('script[src*="wct-browser-legacy"]') === null;

window.VaadinGridSuites = [
  'accessibility.html',
  'array-data-provider.html',
  'basic.html',
  'column-group.html',
  'column-groups.html',
  'column-reordering.html',
  'column-resizing.html',
  'column.html',
  'data-provider.html',
  'dynamic-item-size.html',
  'filtering.html',
  'frozen-columns.html',
  'hidden-grid.html',
  'tree-toggle.html',
  'iron-list.html',
  'keyboard-navigation.html',
  'lazy-import.html',
  'light-dom-observing.html',
  'million-dollar-scrolling.html',
  'outer-scroller.html',
  'physical-count.html',
  'resizing.html',
  'row-details.html',
  'row-height.html',
  'scroll-to-index.html',
  'scrolling-mode.html',
  'selecting.html',
  'sorting.html',
  'style-scope.html',
  'templates.html'
];

if (isPolymer2) {
  window.VaadinGridSuites.push('app-localize-behavior.html');
}
