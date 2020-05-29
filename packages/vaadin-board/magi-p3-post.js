module.exports = {
  files: [
    'vaadin-board-row.js',
    'vaadin-board.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
