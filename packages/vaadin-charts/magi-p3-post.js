module.exports = {
  files: [
    'src/vaadin-chart.js',
    'theme/vaadin-chart-default-theme.js',
    'test/exporting-test.html',
    'package.json'
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

    /import '..\/vaadin-chart.js';/g,

    `"resolutions": {`
  ],

  to: [
    `nativeShadow`,

    `ScopingShim.prototype`,

    `import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';

     import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';

     import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';`,

    ``,

    `import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';
     import '../vaadin-chart.js';`,

    `"resolutions": {
      "@webcomponents/webcomponentsjs": "2.0.4",
      "@vaadin/vaadin-element-mixin": "1.1.2",
      "@vaadin/vaadin-usage-statistics": "1.1.0-beta1",
      "@vaadin/vaadin-development-mode-detector": "1.1.0-beta1",`
  ]
};