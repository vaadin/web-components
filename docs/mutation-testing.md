# Mutation testing (Stryker)

Mutation testing runs [Stryker](https://stryker-mutator.io/) against a package's
source: it makes small changes ("mutants") and checks whether the tests catch
them. Surviving mutants point at weak spots in the test suite.

## Run it

```bash
# Full package (defaults to tabsheet)
STRYKER_GROUP=accordion yarn test:mutation

# Only the lines changed on this branch vs origin/main (grouped per package)
yarn test:mutation:diff
```

- `STRYKER_GROUP` is an environment variable, not a yarn flag.
- The HTML report is written to `reports/mutation/<group>.html`.

Prerequisites are the same as `yarn test` (Chrome installed). For
`test:mutation:diff`, run `git fetch origin main` first so the merge-base
resolves.

## How it works

- **`stryker.conf.js`** — the config, parametrized by `STRYKER_GROUP`. It uses
  Stryker's `command` runner to invoke the real `yarn test --group <pkg>`, so
  the full Web Test Runner environment applies: `@web/test-runner-commands`
  (`sendKeys`/`sendMouse`/…), esbuild, and every plugin behave exactly as in a
  normal test run. `mutate`, the test group, and the per-group incremental and
  report files all derive from `STRYKER_GROUP`.
- **`web-test-runner-stryker.config.js`** — extends the repo's unit-test config
  and forwards the active mutant id into the browser page. Package-agnostic.
- **`scripts/stryker-diff.mjs`** — maps a PR's changed source lines to Stryker
  mutation ranges (`file.js:start-end`), groups them by package, and runs
  Stryker once per package with `STRYKER_GROUP` set, so a PR only mutates its
  own changed lines and multi-package changes are handled.
- **`stryker-ignore-plugin.js`** — a Stryker ignore plugin that skips mutants in
  code the unit suite never covers, so they don't clutter the report as false
  survivors (and don't cost a run each). It currently ignores `static get
  lumoInjector()` / `auraInjector()` — theme injection, exercised only by visual
  tests. To extend it, add a getter name to `IGNORED_GETTERS`, but only after
  confirming the code is genuinely not unit-tested (e.g. `styles` is left in
  because a `getComputedStyle` assertion can catch it). Registered via `plugins`
  and activated via `ignorers` in `stryker.conf.js`.
- **`inPlace: true`** mutates source in place (restored afterwards) so the
  monorepo's workspace symlinks stay intact; **`concurrency: 1`** avoids a Web
  Test Runner dev-server port race; **`incremental`** reuses results between
  runs.

## Why the command runner (and not a custom warm runner)

A custom Web Test Runner Stryker runner was prototyped to keep one browser warm
across mutants (with perTest coverage) instead of re-running the whole suite
each time. On the repo's tests it was only ~2× faster — the suites are
fixture-heavy (most tests build the component in `beforeEach`), so nearly every
test covers the code and per-test filtering helps little. Worse, a warm browser
does not reset one-time side effects such as `customElements.define`, which
produced a ~4% false-survivor rate versus the command runner (measured on
accordion). Because the command runner reuses the real, fresh test environment
per mutant, its results are accurate; that correctness outweighs the modest
speedup, so it is the adopted setup.
