import '../../chart-not-animated-styles.js';
import '../../../src/vaadin-chart.js';
import { BASE_ONLY_FIXTURES, defineScreenshotTests, NON_STYLED_FIXTURES, SHARED_FIXTURES } from '../chart.common.js';

// Non-styled mode (`chart.styledMode: false`) is the default of the Flow `Chart`.
// Highcharts then paints with presentation attributes, so the base styles,
// which are scoped to `[styled-mode]`, apply to none of it except the tooltip.
describe('chart non-styled', () => {
  const names = [...SHARED_FIXTURES, ...BASE_ONLY_FIXTURES, ...NON_STYLED_FIXTURES];

  // Only the tooltip, HTML labels, the exporting menu and the export copy render
  // outside the SVG paint attributes, so a colour scheme can only reach those.
  const colorSchemeNames = ['tooltip', 'tooltip-outside', 'use-html', 'exporting-menu', 'export-svg'];

  describe('light', () => {
    defineScreenshotTests(names, { styledMode: false });
  });

  // `color-scheme: dark` on the page, which `light-dark()` in the Vaadin tokens follows.
  describe('dark', () => {
    defineScreenshotTests(colorSchemeNames, { styledMode: false, dark: true });
  });

  // `prefers-color-scheme: dark`, which the Highcharts Adaptive theme follows.
  describe('prefers dark', () => {
    defineScreenshotTests(colorSchemeNames, { styledMode: false, prefersDark: true });
  });
});
