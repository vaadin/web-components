module.exports = {
  files: [
    'src/vaadin-chart.js',
    'theme/vaadin-chart-default-theme.js',
    'test/exporting-test.html'
  ],

  from: [
    `window.ShadyCSS.nativeShadow`,

    /window.ShadyCSS.ScopingShim/g,

    'import \'highcharts/js/es-modules/masters/highstock.src.js\';',

    '/*\n' +
    '  FIXME(polymer-modulizer): the above comments were extracted\n' +
    '  from HTML and may be out of place here. Review them and\n' +
    '  then delete this comment!\n' +
    '*/',

    /import '..\/vaadin-chart.js';/g
  ],

  to: [
    `nativeShadow`,

    `ScopingShim.prototype`,

    `import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';

     import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';

     import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';`,

    ``,

    `import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';
     import '../vaadin-chart.js';`
  ]
};
