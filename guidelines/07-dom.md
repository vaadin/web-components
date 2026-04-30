# DOM

A component's public DOM surface is made up of three things: the
**shadow parts** it exposes for styling, the **attributes** it toggles
on the host, and the **slots** it renders content into.

## Shadow parts

### Declaring parts

Shadow parts are part of a component's public API: they are how end-users
style internals from outside the shadow root. Document every publicly
stylable part in the class JSDoc as a Markdown table — see
[Documenting](05-documenting.md).

```js
render() {
  return html`
    <span part="prefix"><slot name="prefix"></slot></span>
    <span part="label"><slot></slot></span>
    <span part="suffix"><slot name="suffix"></slot></span>
  `;
}
```

```css
::part(label) {
  font-weight: 600;
}
```

### Parts as state

The `part` attribute is a space-separated list — an element can carry
several part names at once. This lets parts double as **state** for
elements that live inside the shadow DOM and therefore cannot be styled
via reflected attributes on the host.

The date-picker's month calendar uses this for date cells: each cell has
the base `date` part, plus any combination of `focused`, `selected`,
`today`, and `disabled`:

```html
<div part="date today selected">15</div>
<div part="date focused">16</div>
<div part="date disabled">17</div>
```

`::part()` accepts multiple identifiers and matches elements whose
`part` attribute contains **all** of them, so consumer CSS can target
combinations:

```css
::part(date) { … }          /* every date cell */
::part(date focused) { … }  /* the focused cell */
::part(date selected) { … } /* the selected cell */
```

### `exportparts`

If a component contains another Vaadin component whose parts should remain
stylable from outside the host, re-export them with the `exportparts`
attribute:

```html
<vaadin-tooltip-overlay exportparts="overlay, content"></vaadin-tooltip-overlay>
```

This way `vaadin-tooltip::part(overlay)` still resolves even though
`vaadin-tooltip-overlay` lives inside the tooltip's shadow root.

## Attributes

### State attributes

State is exposed as **reflected boolean attributes** on the host element so
that user CSS can target them with tag name + attribute selectors.

| Attribute     | Meaning                                                        |
| ------------- | -------------------------------------------------------------- |
| `disabled`    | Component is disabled.                                         |
| `readonly`    | Component is read-only.                                        |
| `invalid`     | Field failed validation.                                       |
| `focused`     | Element has focus (any focus).                                 |
| `focus-ring`  | Element has keyboard focus (use this for outlines).            |
| `opened`      | Overlay is open.                                               |
| `active`      | Pointer/key is currently down.                                 |
| `has-label`   | A label slot has visible content.                              |
| `has-value`   | A field has a non-empty value.                                 |
| `has-helper`  | A helper text slot has visible content.                        |
| `has-tooltip` | The host has a slotted tooltip.                                |

The `has-*` family is set by mixins / slot controllers when matching slot
content appears.

### `hidden` attribute

Always include the standard rule so `hidden` actually hides the element:

```js
:host([hidden]) {
  display: none !important;
}
```

### `popover` attribute

Overlay components extending `OverlayMixin` use the native popover API:

```js
firstUpdated() {
  super.firstUpdated();

  this.popover = 'manual';
}
```

This gives overlays the top-layer rendering and click-outside semantics
provided by the platform without re-implementing them.

## Slots

### Internal elements in light DOM

Internal child elements that are themselves Vaadin components — for example
the buttons inside `vaadin-menu-bar`, or the chips inside
`vaadin-multi-select-combo-box` — are slotted into the **light DOM** of the
host, not rendered inside its shadow DOM.

This keeps them reachable by global CSS (both user stylesheets and the Aura
theme), which targets them through their tag names. Children inside a
shadow root are unreachable that way, so confining them to the light DOM is
what makes the theme system work end-to-end.

The host then arranges these children using `<slot>` elements in its
template, typically with a controller (`SlotController` or a subclass)
managing creation, ordering, and observation.

### Named slots and default content

Components commonly accept content via slots **and** offer a property as a
shortcut for the default case. The convention is: if the slot is empty, the
component creates a default node from the property; if the slot has content,
the property is ignored. `SlotController` from `@vaadin/component-base` and
controllers extending it in `@vaadin/field-base` implement this pattern.

Field components use the named slots `label`, `helper`, and `error-message`
plus the matching `label`, `helperText`, and `errorMessage` properties.

```html
<vaadin-text-field label="Name"></vaadin-text-field>

<vaadin-text-field>
  <span slot="label">Custom <strong>name</strong></span>
</vaadin-text-field>
```

## DOM snapshot tests

The `test/dom/` folder contains snapshot tests that lock in shadow DOM
output and the host's reflected state attributes. They cover exactly the
public surface described above: parts, state attrs, slot wiring. When you
introduce or rename a part / attribute / slot, expect to update snapshots.
