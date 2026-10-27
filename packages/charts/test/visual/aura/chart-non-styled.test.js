import '@vaadin/aura/aura.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import { defineScreenshotTests } from '../chart.common.js';

// Non-styled mode is the default of the Flow `Chart`. `yarn test:aura:dark`
// renders the same scenarios in the dark colour scheme.
describe('chart non-styled', () => {
  // The theme CSS can only reach the tooltip and the export copy, as the rest is
  // painted with presentation attributes. The base suite covers the chart types.
  defineScreenshotTests(['tooltip', 'tooltip-outside', 'export-svg'], { styledMode: false });
});
