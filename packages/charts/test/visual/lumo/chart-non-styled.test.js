import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/charts.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import { defineScreenshotTests } from '../chart.common.js';

// Non-styled mode is the default of the Flow `Chart`.
describe('chart non-styled', () => {
  // The theme CSS can only reach the tooltip and the export copy, as the rest is
  // painted with presentation attributes. The base suite covers the chart types.
  defineScreenshotTests(['tooltip', 'tooltip-outside', 'export-svg'], { styledMode: false });
});
