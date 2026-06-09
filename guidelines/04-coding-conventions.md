# Coding conventions

## Mixin chain

Every component uses the same outer wrappers, in this order:

```js
class MyComponent
  // Component-specific logic
  extends MyComponentMixin(
    // Vaadin element registration (public components only)
    ElementMixin(
      // Legacy shadow DOM injection (avoid in new components)
      ThemableMixin(
        // Polymer-compat layer (required for all components)
        PolylitMixin(
          // Lumo style injection (required)
          LumoInjectionMixin(LitElement),
        ),
      ),
    ),
  ) {}
```

Field-like components add field mixins inside the component-specific layer
(see [Common packages](05-common-packages.md)).

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

Prefer `updated(changed)` with `changed.has('foo')` for new code:

```js
updated(changed) {
  super.updated(changed);

  if (changed.has('disabled')) {
    this._disabledChanged(this.disabled, changed.get('disabled'));
  }
}
```

Polymer-style `static get observers()` exists for legacy mixins; don't
introduce new ones in component code.

## Dynamic observers

PolylitMixin provides two helpers. Both register inside `ready()` and
skip the initial property value (typical use: field validation):

- **`_createPropertyObserver(prop, method)`** — single-property
  observer with access to the previous value
  (`this[method](newValue, oldValue)`).
- **`_createMethodObserver(observer)`** — multi-property observer
  taking a Polymer-style observer string
  (e.g. `'_rangeChanged(min, max)'`).

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

See [Common packages](05-common-packages.md) for the controllers shipped
with the repo. Add a controller via `this.addController(controller)` in
`firstUpdated()`.

## Properties

Declare reactive properties in the `static properties` block. Set defaults
via the `value:` option, not class-field initializers.

```js
static get properties() {
  return {
    /**
     * Whether the component is disabled.
     */
    disabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * The value of the component.
     */
    value: {
      type: String,
      value: '',
      notify: true,
    },
  };
}
```

Why Polymer-style options instead of plain Lit:

- **`value:` not field initializers.** PolylitMixin (in the canonical
  mixin chain) installs property accessors on the prototype. ES
  class-field initializers (`value = ''`) shadow those accessors with a
  same-named instance property, silently breaking reactivity — Lit's
  dev mode logs a `class-field-shadowing` warning. Set defaults with
  `value:` in the property declaration instead.
- **`reflectToAttribute:` not `reflect:`.** PolylitMixin's
  `createProperty` recognises the Polymer-style option name, and every
  field-style component in the repo uses it. Match that.

Other notes:

- `attribute: false` for internal reactive properties (the codebase
  prefers this over Lit's `state: true`).
- `notify: true` is provided by PolylitMixin and dispatches a
  `{property}-changed` `CustomEvent` — see [Events](09-events.md).
- `readOnly: true` replaces the public setter with a no-op — even
  `host.toggleAttribute(...)` won't update the property because the
  reflected change still hits the no-op. PolylitMixin generates a
  protected `_set{Name}(value)` accessor; use it instead.

For full Lit property options refer to the
[Lit reactive properties guide](https://lit.dev/docs/components/properties/).
