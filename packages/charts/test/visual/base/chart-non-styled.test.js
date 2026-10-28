import '../../chart-not-animated-styles.js';
import '../../../src/vaadin-chart.js';
import { ALL_FIXTURES, defineScreenshotTests } from '../chart.common.js';

// Non-styled mode (`chart.styledMode: false`) is the default of the Flow `Chart`.
// Highcharts then paints every colour as an SVG presentation attribute, and the
// base styles are scoped to `[styled-mode]` / `.highcharts-styled-mode`, so a
// non-styled chart must look like plain Highcharts. These screenshots are the
// reference for that, and they guard against Vaadin styles leaking into it.
// The theme suites (`*.base-ref.test.js`) render the same fixtures with a theme
// loaded and compare against the baselines of this suite.
describe('chart non-styled', () => {
  defineScreenshotTests(ALL_FIXTURES, { styledMode: false });
});
