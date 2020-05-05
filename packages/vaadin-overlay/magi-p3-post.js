module.exports = {
  files: [
    'package.json',
    'vaadin-overlay.js'
  ],
  from: [
    '"resolutions": {',
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '"resolutions": {\n"@webcomponents/webcomponentsjs": "2.0.0",\n"@vaadin/vaadin-control-state-mixin": "2.1.2",',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
