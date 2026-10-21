# Lumo injector

Internal documentation for the mechanism that injects Lumo styles into the Shadow DOM of Vaadin components.

> [!WARNING]
> `LumoInjector`, `LumoInjectionMixin` and the related flags are internal APIs. Do not use them in custom components or applications.

## Background

Before Vaadin 25, Lumo was registered in JavaScript through `registerStyles()`. In Vaadin 25, Lumo is a set of plain CSS files loaded like any other stylesheet. Lumo component styles still need to end up inside the components' Shadow DOM. The injector finds them in regular style sheets and copies them into each component's shadow root.

## CSS format

Lumo component styles are defined as modules: `@media` rules whose name starts with `lumo_`. Browsers never match these media queries, so the rules only take effect once injected.

```css
@media lumo_components_map {
  :host {
    font-family: var(--lumo-font-family);
  }
}
```

Each component declares which modules to inject, keyed by its tag name:

```css
:root,
:host {
  --_lumo-vaadin-map-inject: 1;
  --_lumo-vaadin-map-inject-modules: lumo_components_map;
}
```

- `--_lumo-{tag}-inject: 1` signals that styles for the tag are present. When it changes, for example when Lumo is added or removed at runtime, the injector updates the styles.
- `--_lumo-{tag}-inject-modules` lists the modules to inject, in order.

Declaring them on both `:root` and `:host` makes them work whether Lumo is loaded into the document or into a shadow root.

To detect changes of these properties, the injector runs a CSS transition on them and listens for transition events. This approach is adapted from [style-observer](https://github.com/LeaVerou/style-observer).

## Where styles are looked up

Each component is linked to a root: the document, or the closest shadow root that does not belong to another Vaadin component. For example, a component inside `vaadin-grid` in the document uses the document, and a component inside a Lit element's shadow root uses that shadow root.

The injector looks for Lumo in **that root and in the document**:

- **Lumo loaded in the document is injected into Vaadin components in every shadow root on the page.** This is for better backward compatibility with Vaadin 24, where importing a component registered its Lumo styles page-wide, so every instance got Lumo wherever it was in the DOM.
- **Lumo loaded in a shadow root applies only to components in that root.** This is a deliberate change from Vaadin 24, made for embedded Flow components. Flow loads `@CssImport` styles into the exported component's shadow root, and Lumo loaded there no longer affects other Vaadin components on the host page.

## Configuration

Components configure the injector with `static get lumoInjector()`:

```js
static get lumoInjector() {
  return { ...super.lumoInjector, includeBaseStyles: true };
}
```

- `includeBaseStyles`: `false` by default, which means Lumo replaces the component's base styles. Set to `true` to apply Lumo on top of them.
- `is`: the tag name whose Lumo styles to use. Defaults to the component's own tag name. A subclass can use its parent's styles, for example Flow's `vaadin-big-decimal-field` uses `is: 'vaadin-text-field'`.

## Disabling injection for a root

Setting `__lumoInjectorDisabled = true` on a shadow root stops injection for all components in it:

```js
const shadow = this.attachShadow({ mode: 'open' });
shadow.__lumoInjectorDisabled = true;
```

Added for **Copilot**, which uses its own styles on top of the base styles. Without the flag, the application's Lumo would interfere with them.

The flag must be set before any Vaadin component inside the root is connected. It blocks Lumo from both the document and the root itself.

## Limitations

- Style sheets the browser does not allow reading (for example cross-origin without CORS) are skipped with a warning.
- Adding or removing Lumo at runtime is picked up asynchronously, so components can briefly show the old styles.
- Because the `--_lumo-*-inject` properties are declared on `:root` and `:host`, DevTools lists them as inherited styles for every element you inspect, which makes the Styles panel harder to read. Declaring them on the `::before` pseudo-element instead avoided this, but caused a regression: pseudo-element values are not inherited, so components in nested shadow roots did not get Lumo after switching themes at runtime.
