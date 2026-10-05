import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/charts.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import { defineScreenshotTests, NON_STYLED_FIXTURES, SHARED_FIXTURES } from '../chart.common.js';

// Non-styled mode is the default of the Flow `Chart`.
describe('chart non-styled', () => {
  defineScreenshotTests([...SHARED_FIXTURES, ...NON_STYLED_FIXTURES], { styledMode: false });
});
