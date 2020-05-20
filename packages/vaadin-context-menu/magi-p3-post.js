module.exports = {
  files: [
    'vaadin-context-menu.js',
    'src/vaadin-context-menu.js',
    'src/vaadin-contextmenu-items-mixin.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/,
    '@mixes Vaadin.ContextMenu.',
    /@memberof Vaadin\n.*@extends Vaadin\./g,
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`,
    '@mixes ',
    '@extends '
  ]
};
