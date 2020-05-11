module.exports = {
  files: [
    'package.json',
    'src/vaadin-grid.js',
    'src/vaadin-grid-column.js',
    'src/vaadin-grid-column-group.js',
    'src/vaadin-grid-filter-column.js',
    'src/vaadin-grid-filter.js',
    'src/vaadin-grid-selection-column.js',
    'src/vaadin-grid-scroller.js',
    'src/vaadin-grid-sort-column.js',
    'src/vaadin-grid-tree-column.js',
    'vaadin-grid-column-group.js',
    'vaadin-grid-column.js',
    'vaadin-grid-filter-column.js',
    'vaadin-grid-filter.js',
    'vaadin-grid-selection-column.js',
    'vaadin-grid-sort-column.js',
    'vaadin-grid-sorter.js',
    'vaadin-grid-tree-column.js',
    'vaadin-grid-tree-toggle.js',
    'vaadin-grid.js'
  ],
  from: [
    '"resolutions": {',
    /@memberof Vaadin\n.*@extends Vaadin\.Grid\.ScrollerElement/g,
    '@mixes Vaadin.Grid.ColumnBaseMixin',
    'class GridFilterElement extends (class extends PolymerElement {}) {',
    /@private\n.*@implements Vaadin\.Grid\.PolymerIronList/g,
    /@mixes Vaadin\.Grid\./g,
    /.*@memberof Vaadin.*\n/g,
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '"resolutions": {\n"@webcomponents/webcomponentsjs": "2.0.0",',
    '@extends ScrollerElement',
    '@extends PolymerElement\n * @mixes ColumnBaseMixin',
    'class GridFilterElement extends PolymerElement {',
    '@implements PolymerIronList',
    '@mixes ',
    '',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
