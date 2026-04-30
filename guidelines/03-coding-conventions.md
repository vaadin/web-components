# Coding conventions

## Mixin chain

Every component uses the same outer wrappers, in this order:

```js
class MyComponent extends MyComponentMixin(
  // Component-specific logic
  ElementMixin(
    // Vaadin element registration (public components only)
    ThemableMixin(
      // Legacy shadow DOM injection (avoid in new components)
      PolylitMixin(
        // Polymer-compat layer (required for all components)
        LumoInjectionMixin(
          // Lumo style injection (required)
          LitElement,
        ),
      ),
    ),
  ),
) {}
```

Field-like components add field mixins inside the component-specific layer
(see [Common packages](04-common-packages.md)).

`PolylitMixin` and `LumoInjectionMixin` are required for every component.
`ElementMixin` is required for **public** components only — internal
sub-elements (e.g. helper elements that aren't exported) skip it.

## Lit lifecycle — when to use what

| Hook                     | Use it for                                                    |
| ------------------------ | ------------------------------------------------------------- |
| `constructor()`          | Instantiate controllers; set non-reactive defaults.           |
| `connectedCallback()`    | Add **global** event listeners (`window`, `document`).        |
| `disconnectedCallback()` | Remove the global listeners added in `connectedCallback()`.   |
| `firstUpdated()`         | Set host attributes (`role`, `tabindex`); attach controllers. |
| `willUpdate(props)`      | Derive values that the template needs _before_ rendering.     |
| `updated(props)`         | React to property changes (replaces Polymer-style observers). |

```js
firstUpdated() {
  super.firstUpdated();
  if (!this.hasAttribute('role')) {
    this.setAttribute('role', 'button');
  }
  this.addController(new TooltipController(this));
}

updated(props) {
  super.updated(props);

  if (props.has('disabled')) {
    this._disabledChanged(this.disabled, props.get('disabled'));
  }
}
```

Always call `super.<hook>()` first — most Vaadin mixins rely on it.

## `firstUpdated()` vs `ready()` (PolylitMixin)

`PolylitMixin` provides Polymer's `ready()` for backwards compatibility. The
order is:

1. `firstUpdated()`
2. Initial property observers
3. `ready()`

For new code, prefer `firstUpdated()`. Reach for `ready()` only when
interoperating with Polymer-era mixins or observers that must have run first.

## `updated()` vs `static get observers()`

Prefer `updated(changed)` with `changed.has('foo')`. Polymer-style
`static get observers()` exists for legacy mixins; do not introduce new ones
in component code.

## `willUpdate()` vs computed properties

Use `willUpdate(changed)` to compute derived values before render:

```js
willUpdate(changed) {
  if (changed.has('value') || changed.has('min') || changed.has('max')) {
    this._isOutOfRange = this.value < this.min || this.value > this.max;
  }
}
```

Avoid PolylitMixin computed properties (`computed: '_compute(a, b)'`) in new
code.

## `ifDefined()` for attribute bindings

Use Lit's `ifDefined` directive to skip an attribute when the bound value is
`null` or `undefined`. The most common case is forwarding `_theme` to a
sub-element's `theme` attribute:

```js
import { ifDefined } from 'lit/directives/if-defined.js';

render() {
  return html`
    <vaadin-popover-overlay theme="${ifDefined(this._theme)}">
      <slot></slot>
    </vaadin-popover-overlay>
  `;
}
```

## Mixins vs reactive controllers

Both extract reusable behavior. The rule of thumb:

- **Mixin** — when the behavior needs to declare reactive properties on the
  host class, or a single component's logic is large enough that splitting
  it across files is useful (e.g. `vaadin-grid-*-mixin.js` files). Mixins
  can also override host lifecycle methods.
- **Reactive controller** — when the behavior is self-contained and runs in
  step with Lit's update cycle. Controllers can be reused across components
  just like mixins, but they cannot add reactive properties to the host
  class — wire any external state through controller constructor arguments
  or methods instead.

See [Common packages](04-common-packages.md) for the controllers shipped
with the repo. Add a controller via `this.addController(controller)` in
`firstUpdated()`.

## Properties

Use Lit's `static properties`. Set defaults with field initializers.

```js
class MyComponent extends ... {
  value = '';
  count = 0;

  static get properties() {
    return {
      /**
       * Whether the component is disabled.
       * @attr {boolean} disabled
       */
      disabled: { type: Boolean, reflect: true },

      /** The value of the component. */
      value: { type: String, notify: true },
    };
  }
}
```

Notes:

- `attribute: false` for internal reactive properties (the codebase prefers
  this over Lit's `state: true`).
- `reflect: true` instead of Polymer's `reflectToAttribute: true`.
- `notify: true` is provided by `PolylitMixin` and dispatches a
  `{property}-changed` `CustomEvent` — see [Events](08-events.md).

For full Lit property options refer to the
[Lit reactive properties guide](https://lit.dev/docs/components/properties/).
