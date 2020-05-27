module.exports = {
  files: [
    'src/vaadin-login-form.js',
    'src/vaadin-login-overlay.js',
    'vaadin-login-form.js',
    'vaadin-login-overlay.js'
  ],
  from: [
    /@mixes Vaadin\.Login\./g,
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '@mixes ',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
