module.exports = {
  files: [
    'package.json',
    'vaadin-menu-bar.js',
    'src/vaadin-menu-bar.js',
  ],
  from: [
    '"resolutions": {',
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/,
    /@mixes Vaadin\.MenuBar\./g
  ],
  to: [
    '"resolutions": {\n  "@webcomponents/webcomponentsjs": "2.2.0",',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`,
    '@mixes '
  ]
};
