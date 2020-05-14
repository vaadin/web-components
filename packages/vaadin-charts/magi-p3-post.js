module.exports = {
  files: [
    'src/vaadin-chart.js',
    'src/vaadin-chart-series.js',
    'theme/vaadin-chart-default-theme.js',
    'test/exporting-test.html',
    'vaadin-chart.js'
  ],

  from: [
    `window.ShadyCSS.nativeShadow`,

    /window.ShadyCSS.ScopingShim/g,

    'import \'highcharts/es-modules/masters/highstock.src.js\';',

    '/*\n' +
    '  FIXME(polymer-modulizer): the above comments were extracted\n' +
    '  from HTML and may be out of place here. Review them and\n' +
    '  then delete this comment!\n' +
    '*/',

    /import '..\/vaadin-chart.js';/g,

    /import '\.\/src\/vaadin-(.+)\.js';/,

    'class ChartSeriesElement extends (class extends PolymerElement {}) {'
  ],

  to: [
    `nativeShadow`,

    `ScopingShim.prototype`,

    `import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';

     import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';

     import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';`,

    ``,

    `import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
     import '../vaadin-chart.js';`,

    `import './src/vaadin-$1.js';\nexport * from './src/vaadin-$1.js';`,

    'class ChartSeriesElement extends PolymerElement {'
  ]
};
