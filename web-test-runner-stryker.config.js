/**
 * Web Test Runner config used by the Stryker command runner.
 *
 * Extends the default unit-test config (browsers, plugins, esbuild, commands)
 * and injects the active mutant id into the test page. Stryker sets
 * `__STRYKER_ACTIVE_MUTANT__` on the runner process; the instrumented source
 * reads `globalThis.__stryker__.activeMutant` in the browser, so the id has to
 * be forwarded into the page. Package-agnostic — `--group <pkg>` selects tests.
 */
import baseConfig from './web-test-runner.config.js';

const activeMutant = process.env.__STRYKER_ACTIVE_MUTANT__;
const baseTestRunnerHtml = baseConfig.testRunnerHtml;

export default {
  ...baseConfig,
  // Stryker does its own coverage analysis; the command runner needs none.
  coverage: false,
  testRunnerHtml: (testFramework) =>
    baseTestRunnerHtml(testFramework).replace(
      '<body>',
      `<body>
      <script>
        window.__stryker__ = window.__stryker__ || {};
        window.__stryker__.activeMutant = ${JSON.stringify(activeMutant)};
        window.process = { env: { __STRYKER_ACTIVE_MUTANT__: ${JSON.stringify(activeMutant)} } };
      </script>`,
    ),
};
