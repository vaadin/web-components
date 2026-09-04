import { createVisualTestsConfig } from './wtr-utils.js';

// Light-DOM Lumo (packages/lumo) checked against the existing Lumo visual test
// files. Compares against `wip-baseline` screenshots produced by `yarn update:wip`
// (web-test-runner-wip-ref.config.js). See `createLumoLightDomPlugin` in wtr-utils.js.
export default createVisualTestsConfig('wip');
