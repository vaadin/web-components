module.exports = {
  files: [
    'package.json',
    'test/accessibility-test.html',
    'vaadin-cookie-consent.js',
  ],
  from: [
    '"dependencies": {',
    '"devDependencies": {',
    `import '../../../node_modules/axe-core/axe.min.js';`,
    `import {axeReport} from '../../../node_modules/pwa-helpers/axe-report.js';`,
    /import '\.\/theme\/lumo\/vaadin-(.+)\.js';/
  ],
  to: [
    '"dependencies": {\n"cookieconsent": "^3.0.6",',
    '"devDependencies": {\n"axe-core": "^3.0.3",\n"pwa-helpers": "^0.8.3",',
    `import 'axe-core/axe.min.js';`,
    `import {axeReport} from 'pwa-helpers/axe-report.js';`,
    `import './theme/lumo/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`
  ]
};
