import '@vaadin/aura/aura.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import { defineScreenshotTests, NON_STYLED_FIXTURES } from '../chart.common.js';

// Non-styled mode is the default of the Flow `Chart`. Highcharts paints it with
// presentation attributes, so the Aura CSS must not change it, in the light or
// in the dark colour scheme (`yarn test:aura:dark`). The `.base-ref` suffix
// compares these renders against the `chart-non-styled` baselines of the base
// styles run, which loads no theme.
describe('chart non-styled', () => {
  defineScreenshotTests(NON_STYLED_FIXTURES, { styledMode: false });
});
