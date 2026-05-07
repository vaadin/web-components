# Testing

Every component ships with unit tests, DOM snapshot tests, and visual
tests. The test stack is described in [Repository](01-repository.md).
This chapter covers **how to author** tests for a new component.

Typings tests are documented in [TypeScript](07-typescript.md).

## General rules

- **Arrange–Act–Assert.** Each test follows the AAA shape: a
  `beforeEach` for arrange (`fixtureSync`, properties, listeners,
  spies), a small act step in the test body, then assertions.
- **One act per test.** Don't chain multiple act / assert pairs in the
  same `it` — split into separate tests.
- **Don't re-assert initial state** in tests that mutate it; the
  initial-state assertion belongs in its own dedicated test.
- **Group with nested `describe`** + `beforeEach` over flat tests —
  the shared setup keeps the act / assert lines short.
- **Clean up in `afterEach`** — `resetMouse()` for tests that move the
  pointer, `clock.restore()` for tests that use fake timers.
- **Don't test mixin / controller internals** in components that
  consume them. The mixin's own tests already cover that.

## Unit tests

Location: `packages/{name}/test/{name}.test.{js,ts}`.

- **Unit tests assert behavior, not rendering.** A unit test asserts
  what the component _does_ in response to a property change, click,
  or keypress. If the assertion examines what the template _renders_
  (a part exists, an attribute is set on the host), it's a snapshot.
- **Structure.** Top-level `describe(componentName)` with nested
  `describe` blocks per feature area, each with its own `beforeEach`.
- **Always `await nextRender()` after `fixtureSync`** so LitElement has
  finished its first render before assertions run. For subsequent
  property changes, use `await nextUpdate(element)`.
- **Use `nextResize(element)` for ResizeObserver-driven logic.** When
  the component reacts to a resize callback (e.g. via `ResizeMixin`),
  awaiting `nextResize(element)` from `@vaadin/testing-helpers` ensures
  the observer has fired before assertions run.
- **Fake timers for tasks > 100 ms.** Never use real `setTimeout` in
  tests unless it's a 0 timeout. In a nested `describe`, set up
  `sinon.useFakeTimers({ shouldClearNativeTimers: true })` in
  `beforeEach`, advance with `clock.tickAsync(ms)`, and
  `clock.restore()` in `afterEach`.
- **Spy on events with sinon.** Attach a `sinon.spy()` as the listener
  in `beforeEach` and assert `spy.calledOnce` (or the event detail)
  after the act step.
- **Prefer `sendKeys()` over synthetic events.** For keyboard tests,
  use `sendKeys({ press: 'Tab' })` from `@vaadin/test-runner-commands`
  to trigger native browser behavior (focus, page scroll). Helpers like
  `tabKeyDown` can be used for faster tests but should be avoided.

When a test file grows long, split by topic into sibling files in the
same directory — common splits include `a11y.test.js`,
`keyboard-navigation.test.js`, and `validation.test.js`.

## Snapshot tests

Location: `packages/{name}/test/dom/{name}.test.js`.
Snapshots are written to `test/dom/__snapshots__/`.

Use separate `describe` blocks — `host` for the light DOM (attributes
set on the host and slotted children) and `shadow` for the template.

- **Call `resetUniqueId()` in `beforeEach`** (from
  `@vaadin/component-base/src/unique-id-utils.js`) so generated IDs
  (e.g. used by FieldMixin ARIA attributes) are stable on every run.
- **One snapshot per state**, not per state transition — write a
  separate `it('disabled', …)` rather than toggling `disabled` on and
  off inside one test.
- **Reordering or inserting tests requires deleting the
  `*.test.snap.js` first** before re-running the snapshot update;
  otherwise the snapshot output and test order drift apart.

## Visual tests

Location: `packages/{name}/test/visual/{base,lumo,aura}/{name}.test.js`.
Baseline screenshots are placed under `screenshots/{name}/baseline/`.

- **Per-theme `common.js`** disables animations and transitions so
  screenshots are stable across runs.
- **Prefer visual tests over unit tests for CSS** — a screenshot
  catches what a `getComputedStyle` assertion can't. Exception: a
  component's logic that _reads_ a CSS custom property from JS, where
  a unit test can assert the value directly.
- **Don't duplicate `field-base` coverage** — shared base styles
  (label, helper, error, focus ring, validity) already have visual
  tests in `field-base`. Per-component visual tests should focus on
  what's specific to the component.

## Integration tests

Location: `test/integration/*.test.js` in a private monorepo workspace.
Write one when the behavior under test involves more than one component.

For components using `TooltipController`, add corresponding assertions in
`test/integration/component-tooltip.test.js` instead of writing a separate
test, unless the component has its own custom tooltip handling.
