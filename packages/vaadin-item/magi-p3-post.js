module.exports = {
  files: [
    'vaadin-item.js',
    'vaadin-item-mixin.js'
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/,
    /import ('\.\/src\/vaadin-item-mixin\.js');/
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`,
    `export * from $1;`
  ]
};
