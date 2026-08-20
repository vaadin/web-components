# Conventions

## Component Implementation

Use the `defineCustomElement(MyElement)` helper to register custom elements instead of `customElements.define(...)`. The utility derives the tag name from `static get is()` and handles version stamping, duplicate-definition warnings, and experimental feature flags. Test helper elements may call `customElements.define` directly.

Use `issueWarning` to log warnings (e.g. deprecation notice, invalid configuration), which dedupes per exact message string and avoids spamming logs with the same message over and over. Do not invent custom 'already notified' flags or similar.

Do not throw in response to application or user provided values that are out of range or of an unexpected type. Log a warning instead, so that a single bad property value can not break the page.

When a value violates a constraint such as `min` or `max`, keep the value as set and mark the component invalid, instead of clamping it to the nearest valid value. Clamping surprises developers, who see their value change without asking, as well as end users, who see something different from what was assigned.

Calling action methods (`focus()`, `open()`, `scrollToIndex()`) on a component that is not connected to the DOM must silently do nothing, instead of throwing or queuing the action for later. Ensuring that the component is connected is the caller's responsibility.

A component must behave identically whether properties are set before or after it is attached to the DOM.

Any persistent global event listener on `document` or `window` should be removed once not needed. Persistent listeners can be registered in `connectedCallback` and removed in `disconnectedCallback`. Transient listeners tied to an interaction should be removed after the interaction finishes.

When the native `showPopover()`/`hidePopover()` API is called on an overlay from a path that can run more than once (reconnect, re-open, `bringToFront`), guard the call with `matches(':popover-open')` since the native API throws `InvalidStateError` if the element is already in the requested state.

When a component renders elements into its own light DOM, never apply a hard-coded / static `id`. Only exception: an ID that must exist as an ARIA or `label[for]` reference target, which should be generated with `generateUniqueId()` / `SlotController.generateId()` rather than hard-coded.

To clear inline style properties, assign an empty string or use `style.removeProperty()` for custom properties, instead of assigning `null`.

When focusing an element programmatically from a location that can be reached by pointer interaction, pass `focusVisible: isKeyboardActive()` so that the focus ring only renders when using the keyboard. Hardcoding `true` is only correct inside a keyboard handler, e.g. Tab navigation.

To detect whether a default slot has content, do not rely on `querySelector` as it does not cover text nodes. Query the assigned nodes from the slot instead, filtered by `isEmptyTextNode` to ignore formatting related text nodes. `querySelector(':scope > [slot="name"]')` remains fine for named slots, which only ever hold elements.

To detect whether an element implements a mixin that separate components implement (e.g. `ItemMixin`, used by `vaadin-item`, `vaadin-select-item`, `vaadin-context-menu-item`), apply a flag such as `this._hasVaadinItemMixin = true` in the mixin and check for the flag — the implementing components share no common class, so `instanceof` cannot cover them all. To detect a specific element class, use `instanceof` against the exported class (e.g. `node instanceof Checkbox`), which also covers subclasses registered with custom tag names. Never detect by tag name or constructor string checks.

All component classes that are part of the public API (e.g. items, list boxes, columns) must be exported from both the `.js` and `.d.ts` modules so that they can be instantiated imperatively. Purely internal elements stay unexported (e.g. value buttons, chips, containers, scrollers).

## Properties & Attributes

When adding a public property with a simple type that uses camelCase naming, it must declare an `@attr {type} kebab-name` JSDoc tag. Add the tag in both the `.js` source and the matching `.d.ts` (e.g. `fontFamily` → `@attr {string} font-family`). Single-word properties and object- or function-valued ones, which can not be set via an attribute in a sensible manner, do not require it.

Boolean properties that are reflected as attribute should be named after the non-default state. A boolean attribute is defined by its presence or absence, thus adding it should cover the state that is not the default (e.g. `revealButtonHidden` when the button is visible by default). Boolean properties should be `false` by default.

Name boolean properties by adjective, rather than by imperative verb (good: `clearButtonVisible`, bad: `showClearButton`).

In a `static properties` block use PolylitMixin's `reflectToAttribute: true` and `attribute: false` instead of Lit's `reflect: true` and `state: true`.

Set property defaults with the `value:` option in the `static properties` block, not with class-field initializers. A class field shadows the accessor that PolylitMixin installs on the prototype, which silently breaks reactivity.

Only declare new properties with `reflectToAttribute: true` when the existence of the attribute is required for styling / theming purposes.

When a properties declaration requires a complex object (array, object literal) as initial value, use an arrow function to produce the value (`value: () => []`). Otherwise, the default would be shared across all instances.

## Events

When introducing a new public event it requires: an `@fires {CustomEvent} <name> - <description>` tag on the element class JSDoc in both the `.js` and the matching `.d.ts`, an exported `<Component><Name>Event` type alias, an entry for it in the component's `*CustomEventMap`, and an `addEventListener` + `assertType<...>` check in the package's `test/typings/*.types.ts`.

The same applies to the `<property>-changed` event that a `notify: true` property generates. CEM does not infer that event from the property declaration, so without the `@fires` tag it is missing from the API docs, the web types, and the generated React wrappers.

Only use `notify: true` for properties that the component itself mutates and that consumers might want to two-way bind. Do not fire change events for properties that only ever change when application code sets them.

Do not subclass `Event` for custom events. Use `CustomEvent` and pass data in `event.detail`.

When a component fires an internal event that is only needed to facilitate internal logic, annotate the `dispatchEvent()` call in the component source with `/** @internal to not document it in CEM */` so that it does not end up in the public API docs.

When introducing a new event, prefer non-bubbling events (`bubbles: false`) unless the use-case specifically requires the event to reach ancestor elements.

When dispatching a custom event, do not configure options that equal their defaults (`bubbles: false`, `composed: false`, `cancelable: false`).

## Lit Lifecycle & Templates

When overriding a lifecycle hook (`connectedCallback()`, `disconnectedCallback()`, `firstUpdated()`, `willUpdate()`, `updated()`, `ready()`), call the `super` implementation first, since Vaadin mixins rely on it.

Prefer the `updated(props)` Lit lifecycle hook to react to property changes over adding a Polymer-style `static get observers()` entry.

Prefer deriving values in `willUpdate(props)` over declaring a PolylitMixin computed property (`computed: '_compute(a, b)'`).

Do not run property-specific side effects in `updated(props)` unconditionally, gate it with `if (props.has('<prop>'))` so that update cycles only do work related to changed properties.

Do not split one-time setup between `ready()` and `firstUpdated()`, use one or the other. Prefer `firstUpdated()` where possible, fall back to `ready()` for setup that must run after initial property observers.

When rendering an attribute from an existing state property reachable from the template, declare it reactively in the template instead of writing imperative code to update it.

When a conditional branch in a Lit template is supposed to render nothing, then use Lit's `nothing` sentinel instead of an empty string or other fallback value.

When binding a value that can be `null` or `undefined` to an attribute, use Lit's `ifDefined` directive so that the attribute is omitted instead of rendered with an empty value. The most common case is forwarding `_theme` to a sub-element's `theme` attribute.

## Styling & Theming

When adding new CSS custom properties, always spell out the component in full instead of using abbreviations (good: `vaadin-rich-text-editor-*`, bad: `vaadin-rte-*`).

When a CSS custom property only affects one dimension, name it after that dimension instead of using the generic term 'size'.

When a selector matches the `theme` attribute, do not match with exact equality so the rule still applies when multiple variants are combined (good: `[theme~='primary']`, bad: `[theme='primary']`).

When implementing RTL support, prefer logical properties (inset-inline/inset-inline-start/end, margin-inline, padding-inline, border-inline) over physical properties (left/right, margin-left/right, padding-left/right, border-left/right), so that RTL works without a separate style rule.

Styles that govern behavior rather than appearance (e.g. `pointer-events: none`), belong in the component's base styles instead of individual themes.

Declare component styles with `static get styles()`. The `registerStyles()` helper still exists, but is test-only, production component sources must not call it.

## Accessibility

Set a default `role` attribute only when the application has not already supplied one, so that the role stays overridable.

Do not use `tabindex` values greater than `0`.

## Code Style

Imports must not omit the `.js` extension (good: `import { helper } from './module.js'`, bad: `import { helper } from './module'`). Imports in TypeScript modules must also use the `.js` extension (which resolves to the sibling `.d.ts`), never use the `.d.ts` and `.ts` extension.

When referencing properties, methods or event names in the component source, prefer to spell out the full name as string literal instead of concatenating dynamic and static parts (good: `type === 'row' ? 'row-activate' : 'cell-activate'`, bad: `type + '-activate'`). This ensures symbols stay greppable and match references in JSDoc. Generic forwarding layers that relay arbitrary names (PolylitMixin's `*-changed`, Highcharts event bridging) are the exception.

Prefer native private fields / methods in classes (`#field`, `#method()`) when the respective field / method is not shared with other classes / mixins.

Prefer to keep private / internal methods in a trailing private block, instead of mixing them with static getters, constructor, accessors or lifecycle callbacks.

Methods that return a boolean should use an interrogative prefix (`_should...`, `_is...`, `_has...`, or `_can...`), rather than use imperative naming (e.g. `_preventCellActivationOnClick`).

When adding files under `packages/`, `dev/`, or `test/`, name files using dash-case (e.g. `form-layout.types.ts`). Build scripts under `scripts/` are the exception and use camelCase.

## JSDoc

Documentation / JSDoc should describe the public contract and behavior, not internal implementation details on how the behavior is achieved.

The class JSDoc of a public component must carry `@customElement {tag}` and `@extends HTMLElement`. CEM does not pick up the tag name from `defineCustomElement()`, and without `@extends` the inherited LitElement API ends up in the generated docs.

Elements that only exist as an implementation detail (internal renderers, helper hosts) must carry `@private` or `@protected` on the class JSDoc to keep them out of the generated API docs. Public components must not carry either tag.

Every shadow part, state attribute, and CSS custom property that is part of the public API must be documented in the styling tables of the component's class JSDoc.

Every member that is not part of the public API must have a visibility JSDoc tag, such as `/** @private */` or `/** @protected */`. This includes overrides for custom code as well as overrides for lifecycle methods (e.g. `render()`, `ready()`, `updated()`).

When a method overrides or implements a method declared in a mixin or base class, tag it with `@override` in JSDoc plus a leading "Override method from `<BaseMixin>` to ..." that explains what the override does differently.

Module-level constants or utility functions do not need to be tagged with `@private` in JSDoc or named with a `__` prefix. Just not exporting them is sufficient.

Rows in a JSDoc Markdown table must never wrap to a second line using newlines characters, or the Markdown table stops rendering.

## Deprecation

When deprecating API, ensure there is a concrete replacement API in place and cite it from the `@deprecated` tag. The exception is when an API turns out to be broken, in which case the tag should mention that the API is not supported.

Deprecations must not change behavior and test coverage for deprecated API must be preserved.

## TypeScript Definitions

When adding a public property, method, or config-object option to a `.js` module, it must also be declared in the sibling hand-maintained `.d.ts`. The declaration belongs in the `.d.ts` of the same module that implements it — a mixin's property goes in the mixin's `.d.ts`, not the element's, and a controller option goes in that controller's config type.

Any change in JSDoc descriptions in `.js` modules needs to be synced to the sibling hand-maintained `.d.ts` module.

Do not carry over `@type` annotations from `.js` modules into `.d.ts` modules, the TypeScript type signature already states what the type is.

## Testing

Tests should inspect user-observable outcome instead of internal implementation details (good: inspect rendered list, bad: inspect `el.items`).

Cover DOM structure with snapshots tests, instead of multiple hand-written assertions.

When covering new mixins or mixin behavior with tests, cover it once in the mixin's package with tests against a synthetic element, instead of duplicating tests for all components that implement the mixin.

Tests that exercise the interaction of components from more than one package should be placed under `test/integration/`, never in a specific component package.

For tests that assert that an attribute toggles on a specific condition, prefer a single `should toggle <attribute> attribute on <trigger>` test that verifies both states rather than splitting up into two tests. Keep separate tests for genuinely distinct cases (e.g. null/undefined/0 values, whitespace-only content).

Check for attribute presence / absence with `el.hasAttribute('attr')`, since an empty-string attribute is present but falsy. Reserve `getAttribute()` for asserting a specific value.

Use sinon-chai matchers for making assertions against spies (good: `expect(spy).to.be.calledOnce`, bad: `expect(spy.callCount).to.equal(1)`).

When a test attaches an element with `document.createElement` + `appendChild` instead of `fixtureSync()` (e.g. to test setting properties before attach), add an `afterEach()` that removes the element, since only `fixtureSync()` cleans up automatically between tests.

Prefer `sendKeys` from `@vaadin/test-runner-commands` over helpers that dispatch synthetic keyboard events (e.g. `tabKeyDown`), so that tests also cover native browser behavior such as moving focus and scrolling the page.

When using `sendKeys` to simulate keyboard input, prefer `sendKeys({ press: 'X' })` for full key presses over a `sendKeys({ down: 'X' })` / `sendKeys({ up: 'X' })` pair. When the test depends on holding a key, ensure that keys are released properly after the test.

Tests that move the pointer with `sendMouse` / `sendMouseToElement` must call `resetMouse()` in `afterEach`, so that a leftover pointer position or pressed button does not affect other tests.

When a test triggers an action with an async browser command (`sendMouse`, `sendMouseToElement`, `sendKeys`) and then awaits that an event fires (e.g. `vaadin-overlay-open`), register the event listener before sending the command. Since the command is asynchronous the event might fire before the command resolves, which can result in brittle / flaky test setups.

Do not use real timers for tasks that take longer than 100ms. Set up `sinon.useFakeTimers({ shouldClearNativeTimers: true })` in `beforeEach`, advance time with `clock.tickAsync(ms)`, and call `clock.restore()` in `afterEach`.

Call `resetUniqueId()` from `@vaadin/component-base/src/unique-id-utils.js` in the `beforeEach` of snapshot tests, so that generated IDs (e.g. the ones used for FieldMixin ARIA attributes) are stable between runs.

When testing components that use animations (e.g. overlay open/close), import the package's `not-animated-styles.css` or create a similar one for that package if none exists. Animations lead to flaky visual tests or break timing-sensitive unit tests.
