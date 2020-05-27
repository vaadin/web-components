module.exports = {
  files: [
    'src/vaadin-grid-pro.js',
    'src/vaadin-grid-pro-edit-column.js',
    'vaadin-grid-pro.js',
    'vaadin-grid-pro-edit-column.js'
  ],
  from: [
    /@mixes Vaadin\.GridPro\./g,
    /@memberof Vaadin*\n.*@extends Vaadin\./g,
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '@mixes ',
    '@extends ',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
