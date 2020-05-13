module.exports = {
  files: [
    'vaadin-dialog.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
