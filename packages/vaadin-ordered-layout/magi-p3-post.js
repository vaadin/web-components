module.exports = {
  files: [
    'vaadin-horizontal-layout.js',
    'vaadin-vertical-layout.js',
    'vaadin-scroller.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
