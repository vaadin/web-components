/**
 * Stryker mutation testing config (command runner).
 *
 * Runs against the real package source inside the monorepo so the private
 * workspace packages (@vaadin/chai-plugins, @vaadin/test-runner-commands,
 * testing-helpers) resolve through yarn symlinks instead of being copied.
 *
 * - `command` runner reruns the real Web Test Runner suite per mutant via
 *   `yarn test`, so the full browser environment is used — including the
 *   @web/test-runner-commands plugins (sendKeys/sendMouse/…) and esbuild — and
 *   any package's tests run exactly as they do normally.
 * - `inPlace` mutates the source in place (restored afterwards) so the
 *   monorepo's node_modules workspace symlinks stay intact; the default sandbox
 *   copy would break them.
 * - `concurrency: 1` avoids the Web Test Runner dev-server port race.
 *
 * Target a package with STRYKER_GROUP (defaults to tabsheet); scope to a PR's
 * changed lines with `node scripts/stryker-diff.mjs`.
 *
 *   STRYKER_GROUP=accordion npx stryker run
 *
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
/* global process */
const group = process.env.STRYKER_GROUP || 'tabsheet';

export default {
  testRunner: 'command',
  commandRunner: {
    command: `yarn test --group ${group} --config web-test-runner-stryker.config.js`,
  },
  inPlace: true,
  mutate: [`packages/${group}/src/**/*.js`, `!packages/${group}/src/styles/**`],
  // Source is plain JS with nothing to strip; skip parsing every file in the
  // repo (avoids noisy HTML parse warnings on generated docs/coverage output).
  disableTypeChecks: false,
  // Keep Stryker's project scan off large generated/artifact trees.
  ignorePatterns: ['coverage', 'api-docs', 'dev'],
  concurrency: 1,
  reporters: ['html', 'clear-text', 'progress'],
  tempDirName: '.stryker-tmp',
  htmlReporter: { fileName: `reports/mutation/${group}.html` },
  // Reuse results across runs: unchanged mutants are not re-tested. Kept per
  // group so switching packages does not invalidate the cache.
  incremental: true,
  incrementalFile: `reports/mutation/${group}-incremental.json`,
};
