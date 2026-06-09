# Common packages

This chapter is a map of the shared mixins, controllers, and utilities. Read
the source for full APIs — most files have JSDoc on every exported member.

## `@vaadin/component-base`

Core utilities used by every component.

| Export                 | Source                          | Purpose                                                                                             |
| ---------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `ElementMixin`         | `src/element-mixin.js`          | Registers the component for telemetry; required for **public** components.                          |
| `PolylitMixin`         | `src/polylit-mixin.js`          | Forces initial sync render; provides Polymer-style `ready()`, observers, computed properties.       |
| `DirMixin`             | `src/dir-mixin.js`              | Mirrors `<html dir>` to the host; exposes `__isRTL` for RTL-specific styles.                        |
| `ResizeMixin`          | `src/resize-mixin.js`           | ResizeObserver-driven `_onResize()` callback; supports parent-resize observation.                   |
| `DelegateStateMixin`   | `src/delegate-state-mixin.js`   | Forwards properties and attributes from the host to a `stateTarget` (see below).                    |
| `SlotStylesMixin`      | `src/slot-styles-mixin.js`      | Injects styles into the outer scope to reach slotted children when `::slotted()` isn't enough.      |
| `I18nMixin`            | `src/i18n-mixin.js`             | Adds an `i18n` property that deep-merges over a default object — the standard localization pattern. |
| `defineCustomElement`  | `src/define.js`                 | Wraps `customElements.define`; logs a warning if the tag is already registered.                     |
| `SlotController`       | `src/slot-controller.js`        | Observes a named slot; can create a default node when empty.                                        |
| `TooltipController`    | `src/tooltip-controller.js`     | Wires up a slotted `vaadin-tooltip`.                                                                |
| `MediaQueryController` | `src/media-query-controller.js` | Reactive `window.matchMedia` callback.                                                              |
| `OverflowController`   | `src/overflow-controller.js`    | Sets an `overflow` attribute on a scroll container.                                                 |
| Virtualizer            | `src/virtualizer.js`            | List virtualization engine. Used by `grid`, `combo-box`, `virtual-list`.                            |
| Gestures               | `src/gestures.js`               | Polymer-era cross-platform `down`/`up`/`tap`/`track` events. Used by `context-menu`, `ActiveMixin`. |

## `@vaadin/a11y-base`

Accessibility primitives. See [Accessibility](11-a11y.md) for how these
fit together.

| Export                       | Purpose                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ActiveMixin`                | Toggles the `active` attribute on pointer-down / activation key.                                                |
| `DelegateFocusMixin`         | Forwards focus from the host to an internal slotted focusable element.                                          |
| `DisabledMixin`              | Provides `disabled` property and `aria-disabled` attribute logic.                                               |
| `FocusMixin`                 | Sets `focused` and `focus-ring` attributes (the latter only for keyboard focus).                                |
| `KeyboardMixin`              | Centralizes keydown handling; subclasses override `_onKeyDown`.                                                 |
| `KeyboardDirectionMixin`     | Keyboard navigation across child items (vertical or horizontal).                                                |
| `ListMixin`                  | Builds on `KeyboardDirectionMixin` to add item selection and `selected` index.                                  |
| `TabindexMixin`              | Manages `tabindex`; sets `-1` when `disabled`, restores prior value when enabled.                               |
| `AriaModalController`        | Sets `aria-hidden` on siblings outside an open modal so AT users can't reach background content.                |
| `FocusTrapController`        | Traps Tab and Shift+Tab inside a modal region.                                                                  |
| `FocusRestorationController` | Saves the previously-focused element on overlay open and restores it on close.                                  |
| `FieldAriaController`        | Wires `aria-labelledby` / `aria-describedby` / `aria-required` on form fields. Used internally by `FieldMixin`. |
| `announce()`                 | Writes a text to a live region (`polite`, `alert`, or `assertive` mode) to trigger screen reader announcements. |

## `@vaadin/field-base`

Mixins for input field components.

| Export                  | Purpose                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `FieldMixin`            | Combines label, helper, error-message slots and ARIA wiring.                                 |
| `InputMixin`            | Manages slotted `input` element, provides `value` property and `has-value` attribute.        |
| `InputConstraintsMixin` | Based on `ValidateMixin`, re-validates whenever any of the listed constraints change.        |
| `InputControlMixin`     | Comprehensive input behavior: `allowedCharPattern`, autoselect, paste/drop validation, ARIA. |
| `LabelMixin`            | Manages slotted `label` element, provides `label` property and `has-label` attribute.        |
| `ValidateMixin`         | Provides `invalid` and `manualValidation` properties, `validate()` and `checkValidity()`.    |

### `static get constraints()`

`InputConstraintsMixin` watches a list of attribute names; whenever one
changes, it re-runs validation:

```js
static get constraints() {
  return [...super.constraints, 'min', 'max', 'step'];
}
```

### `static get delegateProps()` / `static get delegateAttrs()`

`DelegateStateMixin` syncs properties and attributes from the host to a
`stateTarget` element (typically a native `<input>` or `<textarea>`):

```js
static get delegateProps() {
  return [...super.delegateProps, 'indeterminate'];
}

static get delegateAttrs() {
  return [...super.delegateAttrs, 'name', 'invalid', 'required'];
}
```

## `@vaadin/overlay`

Overlay positioning primitives. Every popup / dropdown / dialog uses these:

- **`OverlayMixin`** — modal/non-modal behavior, focus trap, Escape handling.
- **`PositionMixin`** — anchored-overlay positioning logic.

`packages/overlay` uses the native `popover` attribute (`popover="manual"`)
and the `:popover-open` pseudo-class.

## `@vaadin/lit-renderer`

A Lit directive that lets a component accept a `renderer` callback returning
a Lit template. Used by `combo-box` (item renderer), `grid` (cell renderer),
`virtual-list`, and `dialog`.

## `@vaadin/vaadin-themable-mixin`

Theme infrastructure (covered in [Theming](10-theming.md)):

- **`ThemableMixin`** — registers theme styles and applies them.
- **`LumoInjectionMixin`** — internal; injects Lumo styles via CSS custom
  properties. Not for use by add-ons.
- **`ThemeDetectionMixin`** — public; sets `data-application-theme="lumo"`
  or `"aura"` on the host so add-ons can branch on the active theme.
