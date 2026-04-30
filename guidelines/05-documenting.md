# Documenting

## Two analyzers, one source of truth

Two analyzers run today, both reading the JSDoc on each `vaadin-{name}.js` /
`*-mixin.js` source file:

| Analyzer                       | Output                                 | Drives                                                |
| ------------------------------ | -------------------------------------- | ----------------------------------------------------- |
| Custom Elements Manifest (CEM) | `packages/{name}/custom-elements.json` | IDE tooling that consumes CEM.                        |
| Polymer Analyzer               | root `analysis.json`                   | `api-docs`, `web-types.json` and `web-types.lit.json` |

- CEM is configured in `custom-elements-manifest.config.js` and split per
  package by `scripts/split-cem.js`.
- Polymer Analyzer runs via `yarn analyze`; `scripts/buildWebtypes.js` then
  reads `analysis.json` to write the `web-types.*` files.

The long-term direction is to phase out the Polymer Analyzer in favour of
CEM. Until then, components have to satisfy both — which is why JSDoc tags
sometimes look duplicated.

`vscode-lit-plugin` ([lit-analyzer](https://github.com/runem/lit-analyzer))
also reads JSDoc. The `@attr` tag below exists primarily to give it the
right kebab-case attribute name for camelCase properties.

## JSDoc tags

| Tag                       | Where                 | Why                                                                                                        |
| ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `@customElement {tag}`    | Class JSDoc           | CEM doesn't pick up `defineCustomElement()`; this tells it the element's tag name.                         |
| `@extends HTMLElement`    | Class JSDoc           | Hides LitElement's API from Polymer Analyzer output.                                                       |
| `@mixes {Name}`           | Class JSDoc           | Tracked by both analyzers (CEM via the `mixesPlugin` in the config).                                       |
| `@polymerMixin`           | Mixin declaration     | Marks a `(superClass) => class extends superClass …` function as a mixin for Polymer Analyzer.             |
| `@attr {type} dash-name`  | Property JSDoc        | Maps a camelCase property to its kebab-case attribute (used by `vscode-lit-plugin`).                       |
| `@fires {Event} name`     | Class JSDoc           | Class-level event docs. **CEM only** — Polymer Analyzer ignores it.                                        |
| `@event name`             | **Inside** class body | Polymer Analyzer-readable event declaration. Required for non-`notify` events to land in `web-types.json`. |
| `@prop`                   | Class body            | Documents properties **not** declared in `static get properties()`.                                        |
| `@type`                   | Getters               | Documents the type of a getter (e.g. an `i18n` accessor).                                                  |
| `@private` / `@protected` | Class JSDoc           | Marks the whole element as internal — excluded from both `custom-elements.json` and `web-types.json`.      |

`notify: true` on a property declaration auto-generates the matching
`{property}-changed` event in both analyzers' output — no `@event` is
needed for those. See [Events](08-events.md).

## Marking an element as internal

Add `@private` or `@protected` to a class's JSDoc to keep the element out
of the generated documentation:

- CEM's `classPrivacyPlugin` (in `custom-elements-manifest.config.js`) tags
  the declaration, and the `packageLinkPhase` then strips it — so the class
  never lands in `custom-elements.json`.
- The Polymer Analyzer applies the same convention, so the element is also
  skipped when `web-types.json` is generated from `analysis.json`.

Use this for sub-elements that exist only as implementation details
(internal renderers, helper hosts, etc.) — public components must not carry
either tag.

## Component class JSDoc

Use this canonical shape (every public component already follows it):

````js
/**
 * `<vaadin-{name}>` is a [one-sentence description].
 *
 * ```html
 * <vaadin-{name}>Example</vaadin-{name}>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is keyboard focused.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property               |
 * :---------------------------------|
 * | `--vaadin-{name}-background`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the value changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement vaadin-{name}
 * @extends HTMLElement
 * @mixes {Name}Mixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
````

## Property JSDoc

```js
/**
 * The value of the component.
 *
 * @attr {string} value
 */
value: {
  type: String,
  notify: true,
},
```

## `@event` for non-`notify` events

Events that are not driven by `notify: true` need `@event` inside the class
or mixin body so the Polymer Analyzer picks them up:

```js
class MyComponentMixinClass extends superClass {
  // ... methods that dispatch events ...
  /**
   * Fired when the user commits a value change.
   * @event change
   */
}
```

Without this, the event is missing from `web-types.json` even if `@fires`
appears at the class level.
