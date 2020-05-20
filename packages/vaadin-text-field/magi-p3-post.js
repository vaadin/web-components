module.exports = {
  files: [
    'vaadin-*.js',
    'src/*.js',
  ],
  from: [
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/,
    /@memberof Vaadin*\n.*@extends Vaadin\./g,
  ],
  to: [
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`,
    '@extends '
  ]
};
