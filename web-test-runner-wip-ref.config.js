import { createVisualTestsConfig } from './wtr-utils.js';

// Generates `wip-baseline` reference screenshots from the shadow-DOM Lumo styles
// plus `src/global/index.css`, for comparison by web-test-runner-wip.config.js.
// Run with `yarn update:wip`.
export default createVisualTestsConfig('wip-ref');
