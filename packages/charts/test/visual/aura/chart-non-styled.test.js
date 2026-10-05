import '@vaadin/aura/aura.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import { defineScreenshotTests, NON_STYLED_FIXTURES, SHARED_FIXTURES } from '../chart.common.js';

// Non-styled mode is the default of the Flow `Chart`. `yarn test:aura:dark`
// renders the same scenarios in the dark colour scheme.
describe('chart non-styled', () => {
  defineScreenshotTests([...SHARED_FIXTURES, ...NON_STYLED_FIXTURES], { styledMode: false });
});
