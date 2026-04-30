# New-component checklist

Use this when scaffolding a new component. The checklist is a quick scan,
not a substitute for reading [Component Structure](02-component-structure.md) and the rest.

## Files

- [ ] `packages/{name}/` directory created.
- [ ] Root export `vaadin-{name}.js` re-exports from `src/`.
- [ ] Root type `vaadin-{name}.d.ts` re-exports from `src/`.
- [ ] `src/vaadin-{name}.js` defines the element class.
- [ ] `src/vaadin-{name}-mixin.js` (when component logic warrants a mixin).
- [ ] `src/styles/vaadin-{name}-base-styles.js` defines base styles.
- [ ] `.d.ts` next to every `.js` source file.
- [ ] `package.json`, `README.md`, `LICENSE` in place.
- [ ] License header on every `.js` and `.d.ts` source file (Apache or
      Commercial — see [Component Structure](02-component-structure.md)).

## Implementation

- [ ] Mixin chain ends with `PolylitMixin(LumoInjectionMixin(LitElement))`.
- [ ] `ElementMixin` included for **public** components.
- [ ] `static get is()` returns the tag name.
- [ ] `static get styles()` returns the imported base styles.
- [ ] `static get properties()` declares every reactive property with a
      JSDoc comment (and `@attr` for camelCase ones).
- [ ] Defaults set via field initializers, not a `value:` property option.
- [ ] `firstUpdated()` sets host attributes (e.g. `role`) and attaches
      controllers.
- [ ] `updated(changed)` reacts to property changes (no Polymer observers).
- [ ] `defineCustomElement(...)` called at the bottom of the source file.

## Styling

- [ ] Base styles use `--vaadin-{name}-*` custom properties with fallbacks
      to design tokens.
- [ ] `:host([hidden]) { display: none !important; }` present.
- [ ] State attributes (`disabled`, `focus-ring`, `invalid`, …) styled.
- [ ] Lumo public CSS at `packages/vaadin-lumo-styles/components/{name}.css`
      with the matching `--_lumo-vaadin-{name}-inject*` markers.
- [ ] Lumo source CSS at `packages/vaadin-lumo-styles/src/components/{name}.css`
      wrapped in `@media lumo_components_{name} { … }`.
- [ ] Aura CSS at `packages/aura/src/components/{name}.css` and imported
      in `packages/aura/aura.css`.
- [ ] All `theme` variants (`primary`, `small`, …) covered in both themes
      that support them.

## TypeScript

- [ ] Mixin `.d.ts` returns every constituent mixin class (`Constructor<X>
    & Constructor<Y> & T`).
- [ ] Element `.d.ts` declares event types, an `EventMap`, and overrides
      `addEventListener` / `removeEventListener`.
- [ ] `HTMLElementTagNameMap` augmented for the new tag name.
- [ ] `test/typings/{name}.types.ts` asserts the public type surface and
      passes `yarn lint:types`.

## Testing

- [ ] Unit tests in `test/{name}.test.{js,ts}` cover registration, default
      property values, property reflection, events, keyboard interactions,
      and disabled state.
- [ ] DOM snapshot tests in `test/dom/{name}.test.js` cover the host's
      reflected attributes and the shadow DOM structure.
- [ ] Visual tests in `test/visual/base`, `test/visual/lumo`, and
      `test/visual/aura` cover default, disabled, focus-ring, and major
      variants.

## Documentation

- [ ] Class JSDoc covers the styling tables (parts, state attributes,
      custom CSS properties).
- [ ] Class JSDoc has `@customElement`, `@extends HTMLElement`, `@mixes`,
      `@fires`.
- [ ] Non-`notify` events have `@fires` lines on the class JSDoc.
- [ ] `README.md` follows the same shape as a sibling package.

## Final validation

- [ ] `yarn lint` passes.
- [ ] `yarn lint:types` passes.
- [ ] `yarn test --group {name}` passes.
- [ ] `yarn test:snapshots --group {name}` passes.
- [ ] `yarn test:base --group {name}` passes.
- [ ] `yarn test:lumo --group {name}` passes.
- [ ] `yarn test:aura --group {name}` passes.
- [ ] Component renders correctly on the matching `dev/{name}.html` page in
      both themes.
