# Stepper Developer API

> Status: draft. The component ships behind the `stepperComponent` feature flag:
> `window.Vaadin.featureFlags.stepperComponent = true`.

## 1. Basic stepper

Covers requirement(s): 1, 2, 3

```html
<vaadin-stepper>
  <vaadin-step completed>Shopping cart</vaadin-step>
  <vaadin-step current>Shipping & billing</vaadin-step>
  <vaadin-step>Payment method</vaadin-step>
  <vaadin-step>Confirmation</vaadin-step>
</vaadin-stepper>
```

**Why this shape:** Declarative children, following Tabs, Side Nav and Breadcrumbs. Step state is expressed with independent boolean attributes (`current`, `completed`, `invalid`) rather than a single `state` enum: booleans are the established way to expose state attributes for styling (`[current]`, `[completed]`), they compose (a step can be both current and invalid while the user is fixing it), and they map directly to Flow `setCurrent(boolean)` style API. The stepper numbers the steps automatically, so no index has to be maintained by the application.

---

## 2. Invalid steps

Covers requirement(s): 4

```html
<vaadin-step completed invalid>Nebulicious configuration</vaadin-step>
```

**Why this shape:** `invalid` matches the attribute name that every Vaadin field uses for validation errors. It wins over `completed` visually (error icon, error colour) because the user needs to act on it.

---

## 3. Description

Covers requirement(s): 5

```html
<vaadin-step>
  Hyperspectral calibrations
  <span slot="description">Optimise the quantum entanglement matrices</span>
</vaadin-step>
```

**Why this shape:** The label is the default slot (like Tab, Side Nav Item, Breadcrumbs Item), the secondary line is a named `description` slot so it can contain rich content and be styled separately (`::part(description)`).

---

## 4. Steps as links

Covers requirement(s): 6, 7

```html
<vaadin-stepper>
  <vaadin-step completed path="/checkout/cart">Shopping cart</vaadin-step>
  <vaadin-step current path="/checkout/shipping">Shipping & billing</vaadin-step>
  <vaadin-step path="/checkout/payment" disabled>Payment method</vaadin-step>
  <vaadin-step>Confirmation</vaadin-step>
</vaadin-stepper>
```

**Why this shape:** Same convention as Side Nav and Breadcrumbs: a step with `path` renders an `<a part="link">`, a step without one renders a non-interactive `<div part="nolink">`. Client-side routers that intercept anchor clicks (Vaadin Router, Hilla, Flow) work out of the box. `disabled` keeps the step visible but removes the `href` and takes it out of the tab order.

---

## 5. Orientation

Covers requirement(s): 8

```html
<vaadin-stepper orientation="vertical"> … </vaadin-stepper>
```

**Why this shape:** `orientation` with `horizontal` (default) / `vertical` values is the property name Tabs already uses for the same concept. The stepper forwards the value to its steps as an `orientation` attribute (as Tabs does for its tabs) so steps can be styled per orientation. Switching orientation responsively (e.g. vertical on narrow screens) is left to the application for now; see Discussion.

---

## 6. Compact variant

Covers requirement(s): 9

```html
<vaadin-stepper theme="small">…</vaadin-stepper>
```

**Why this shape:** `small` is the established theme variant name across Vaadin components.

---

## 7. Dynamic steps

Covers requirement(s): 10

```js
const stepper = document.querySelector('vaadin-stepper');
const step = document.createElement('vaadin-step');
step.textContent = 'Review';
stepper.insertBefore(step, stepper.lastElementChild);
stepper.lastElementChild.previousElementSibling.hidden = true;
```

**Why this shape:** The stepper reflects whatever `<vaadin-step>` children are in its light DOM and renumbers on add / remove / `hidden` changes. No parallel `items` property is exposed, for the same reasons as Breadcrumbs.

---

## 8. Localisation

Covers requirement(s): 11

```js
stepper.i18n = {
  completed: 'Valmis',
  invalid: 'Virhe',
};
```

**Why this shape:** `I18nMixin` on the stepper, which hands the effective i18n object to its steps, so applications configure it once.

---

## 9. Styling

Covers requirement(s): 12

| Custom CSS property                        | Description                                           |
| ------------------------------------------ | ----------------------------------------------------- |
| `--vaadin-stepper-gap`                     | Space between steps                                   |
| `--vaadin-stepper-font-size`               | Font size of the step labels                          |
| `--vaadin-stepper-indicator-size`          | Width and height of the step indicator                |
| `--vaadin-stepper-indicator-font-size`     | Font size of the step number                          |
| `--vaadin-stepper-indicator-border-radius` | Shape of the indicator (circle by default)            |
| `--vaadin-stepper-indicator-background`    | Background of upcoming / current indicators           |
| `--vaadin-stepper-indicator-border-color`  | Border of upcoming indicators                         |
| `--vaadin-stepper-accent-color`            | Current / completed indicator and completed connector |
| `--vaadin-stepper-accent-contrast-color`   | Check mark on completed indicators                    |
| `--vaadin-stepper-error-color`             | Invalid indicator and label                           |
| `--vaadin-stepper-error-contrast-color`    | Icon on invalid indicators                            |
| `--vaadin-stepper-connector-color`         | Connector line                                        |
| `--vaadin-stepper-connector-width`         | Connector line thickness                              |
| `--vaadin-stepper-completed-icon`          | Mask image used for completed steps                   |
| `--vaadin-stepper-invalid-icon`            | Mask image used for invalid steps                     |

Step parts: `link`, `nolink`, `indicator`, `content`, `label`, `description`, `connector`.
Step state attributes: `current`, `completed`, `invalid`, `disabled`, `focused`, `focus-ring`, `orientation`.

The properties use the `vaadin-stepper-` prefix even when consumed by `<vaadin-step>`, so that they can be set once on the stepper (as Breadcrumbs does for its items).

---

## Accessibility

- `<vaadin-stepper>` gets `role="list"`, each `<vaadin-step>` `role="listitem"` (both overridable). Applications that use the stepper as navigation can wrap it in `<nav aria-label="…">`.
- The current step has `aria-current="step"` on its link / nolink element.
- Completed and invalid states are announced through visually hidden text ("Completed", "Error"), localisable through `i18n`.
- The indicator (number / icon) is `aria-hidden`, since list semantics already convey position ("2 of 4").

---

## Discussion / open questions

- **Responsive orientation.** Reindeer+ switches to vertical below 1024 px. Options: leave it to the application (current draft), add an `orientation="auto"` that switches on a container width threshold, or let horizontal steps collapse to "indicator only" except for the current step (Material / Carbon). Needs design input.
- **Labels below indicators** (Material "alternative label"). Could be a `theme` variant; not in the draft.
- **Custom indicator content** (icons per step). Could be an `indicator` slot that replaces the number; not in the draft.
- **Non-link interactive steps** for in-page wizards (no routing). Currently an application can use `path="#…"`, or listen to clicks on the host; a proper `button` mode with a `step-click` / `selected-changed` event may be needed.
- **Tag name.** `vaadin-step` reads naturally and mirrors `vaadin-tab`; `vaadin-stepper-item` would mirror Side Nav / Breadcrumbs.
