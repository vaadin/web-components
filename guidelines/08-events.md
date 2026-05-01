# Events

## `notify: true` for property changes

A property declared with `notify: true` (provided by `PolylitMixin`) auto-fires
a `{property}-changed` `CustomEvent` whenever it changes:

```js
static get properties() {
  return {
    value: { type: String, notify: true },
  };
}
```

Listening:

```js
element.addEventListener('value-changed', (event) => {
  console.log(event.detail.value);
});
```

Use `notify: true` only for properties the **component itself** mutates and
that consumers might want to two-way-bind to. Do not fire change events for
properties that only change in response to user code setting them.

`notify: true` events are picked up by CEM automatically, so no `@fires`
JSDoc is needed for them.

## Field events

Field components fire two events on user-committed value changes:

- **`change`** — a native `Event`, dispatched on the host so it bubbles like
  a native form control. Fired when the user commits a value (blur / Enter /
  selection of a suggestion).
- **`unparsable-change`** — a native `Event`, fired by parsing fields (e.g.
  `vaadin-time-picker`) when the user commits a value the component cannot
  parse. Distinct from `change`, which is only fired when parsing succeeded.

```js
this.dispatchEvent(new Event('change', { bubbles: true }));
```

## `CustomEvent`, not `Event` subclasses

Do **not** subclass `Event` for custom events. Always use `CustomEvent` and
put data on `event.detail` for consistency with the existing codebase.

```js
this.dispatchEvent(
  new CustomEvent('value-changed', {
    detail: { value: this.value },
    bubbles: true,
    composed: true,
  }),
);
```

Set `bubbles` and `composed` based on intent — composed events cross shadow
root boundaries, which can be problematic for low-level interaction events.

## Documenting events

Events that aren't driven by `notify: true` need a `@fires {Event} name -
…` line on the class JSDoc so CEM picks them up. See
[Documenting](05-documenting.md) for the full set of JSDoc tags.
