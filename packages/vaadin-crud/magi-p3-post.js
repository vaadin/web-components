module.exports = {
  files: [
    'src/vaadin-crud-edit-column.js',
    'src/vaadin-crud-form.js',
    'src/vaadin-crud-grid.js',
    'vaadin-crud.js'
  ],
  from: [
    /@mixes Vaadin\.Crud\./g,
    /@memberof Vaadin*\n.*@extends Vaadin\./g,
    'class extends FormLayoutElement {}',
    'class extends GridElement {}',
    '(class extends GridColumnElement {})',
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '@mixes ',
    '@extends ',
    'FormLayoutElement',
    'GridElement',
    'GridColumnElement',
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
