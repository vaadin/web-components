# Table of Contents

1. [Style Scopes](#style-scopes)
1. [Adding Styles to Local Scope](#adding-styles-to-local-scope)
1. [Stylable Shadow Parts](#stylable-shadow-parts)
1. [Scoping Styles in a Theme Module](#scoping-styles-in-a-theme-module)
1. [Theme Attribute and Subcomponents](#theme-attribute-and-subcomponents)
1. [External resources](#external-resources)



# Style Scopes

With the addition of Shadow DOM, styles on a webpage can be divided into two groups:
1. Styles affecting elements in the [global scope](#global-style-scope), i.e. traditional styles
2. Styles affecting elements inside a [local scope](#local-style-scope-shadow-dom), i.e. styles inside a shadow DOM

## Global Style Scope

On a regular website, all elements are inside the same global style scope, and can be styled with global stylesheets (either `<link rel="stylesheet">` or `<style>` elements), using regular CSS selectors.

#### Example: Global stylesheet
![](https://www.dropbox.com/s/4nxndstebfjhu4z/vaadin-text-field-light-dom.png?raw=1)

The only thing we can style using global styles is the whole `<vaadin-text-field>` element, but nothing inside it, like the *label* or the *input field*.

For example, we could have the following styles in an imported stylesheet:

```css
vaadin-text-field {
  border: 1px solid gray;
}
```

And it would produce the following result:

![](https://www.dropbox.com/s/4lkvmuudludhey4/vaadin-text-field-border.png?raw=1)

## Local Style Scope (Shadow DOM)

Styling Web Components (or custom elements to be more precise), which use shadow DOM, is different from styling regular websites.

When a custom element has its own shadow DOM, the browser creates a new style scope for the elements that are placed inside the shadow DOM hierarchy, and CSS selectors in global stylesheets can’t affect those elements.

The only CSS selectors that can affect the elements inside a shadow DOM need to be in a `<style>` element which is somewhere inside the shadow DOM hierarchy. At the same time, the styles inside a shadow DOM can’t affect elements outside the shadow DOM. The styles are placed in the “local style scope” of the shadow DOM.

#### Example: Local style

![](https://www.dropbox.com/s/dtl7ha54xnb7un1/vaadin-text-field-shadow-dom.png?raw=1)

Only the `<style>` element highlighted in the inspector can affect the elements inside the `<vaadin-text-field>` element’s shadow DOM.

For example, if we move the same styles from the previous example inside the `<style>` element inside the shadow DOM, the result is the same as without the style rules:

```html
#shadow-root (open)
  <style>
    vaadin-text-field {
      border: 1px solid gray;
    }
  </style>
```

![](https://www.dropbox.com/s/66af3mw26grxdc3/vaadin-text-field.png?raw=1)

That is because there are no `<vaadin-text-field>` elements inside the shadow DOM. If we want the same result as with the global stylesheet, we need to use the `:host` selector to match the element which is the “host” for this shadow DOM or style scope:

```html
#shadow-root (open)
  <style>
    :host {
      border: 1px solid gray;
    }
  </style>
```

Then we get the same result as with the global stylesheet:

![](https://www.dropbox.com/s/4lkvmuudludhey4/vaadin-text-field-border.png?raw=1)

If we wanted to move the border to the actual text input element, we would need to inspect the shadow DOM hierarchy and see which selector would match that particular element. For `<vaadin-text-field>`, the correct selector would be `[part="input-field"]`:

```html
#shadow-root
  <style>
    [part="input-field"] {
      border: 1px solid gray;
    }
  </style>
```
![](https://www.dropbox.com/s/9zo4te8pz74oe9q/vaadin-text-field-input-border.png?raw=1)


# Adding Styles to Local Scope

*Read the documentation about [Styles Scopes](https://github.com/vaadin/vaadin-themable-mixin/wiki/1.-Style-Scopes) before continuing.*


## Property inheritance

Currently, the only global CSS that can affect styles inside a shadow DOM’s local scope are properties that are inherited. Properties can be inherited by default, like `font-family` or all [CSS Custom Properties](https://www.w3.org/TR/css-variables/), or explicitly by the custom element, using the `inherit` property value.


#### Example: using a custom property to affect the styles in a local scope
```html
<custom-style>
  <style>
    vaadin-combo-box {
      --vaadin-combo-box-overlay-max-height: 50vh;
    }
  </style>
</custom-style>
```

> Note: for cross-browser compatibility, [use the `<custom-style>` element](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom#custom-style).

> Note: check the API documentation of each element for the custom properties they expose. See the [API documentation for vaadin-combo-box](https://vaadin.com/elements/vaadin-combo-box/html-api/elements/Vaadin.ComboBoxElement#styling) for example.


#### Example: explicitly inheriting a property value from the global scope into local scope
```html
#shadow-root
  <style>
    :host {
      background-color: inherit;
    }
  </style
```


## Selector matching

The web platform doesn’t currently provide a way to write selectors in the global scope that would match elements in a local scope (Oct 2017). There’s a [CSS spec proposal](http://tabatkins.github.io/specs/css-shadow-parts/) that will add that, but for now, we need to work around this limitation using proprietary solutions, like Vaadin’s [`ThemableMixin`](https://github.com/vaadin/vaadin-themable-mixin).


## Theme modules

Custom elements extending [`ThemableMixin`](https://github.com/vaadin/vaadin-themable-mixin) allow you to inject styles into their local scope by defining new [style modules](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom#style-modules) in the global scope. You specify the targeted element using the `theme-for` attribute.

```html
<!-- Define a theme module (in index.html or in a separate HTML import) -->
<dom-module id="my-theme-module" theme-for="my-element">
  <template>
    <style>
      /* Styles which will be included in my-element local scope */
    </style>
  </template>
</dom-module>
```

You can place these “theme module” definitions directly in your `index.html` or in a separate HTML import.

> Note: a theme module needs to be imported and registered in the DOM before the element(s), which the module targets with the `theme-for` attribute, are registered and upgraded (before the first instantiation of the component).

The `id` attribute of the theme module should be unique. You can also re-use an existing id if you want to override a previously defined/imported module.

> Note: The theme modules are included in an order that enables custom modules to override styles defined by the Vaadin's built-in modules. The built-in theme modules use id's prefixed with `vaadin-`, `lumo-` and `material-` so avoid using these prefixes in your custom theme module `id`'s.

The value of the `theme-for` attribute can be a space-separated list of element names, and can contain wildcard element names as well.</p>

#### Examples of valid `theme-for` attribute values:
 - `"vaadin-button"`
 - `"vaadin-overlay vaadin-date-picker-overlay"`
 - `"vaadin-*"`


### Theme modules are global

When creating a theme module for an element, the styles in that theme module will apply to all instances of that element. The styles are always “global” in that sense and can’t be scoped by default with anything.



# Stylable Shadow Parts

*Read the documentation about [Styles Scopes](https://github.com/vaadin/vaadin-themable-mixin/wiki/1.-Style-Scopes) and [Adding Styles to Local Scope](https://github.com/vaadin/vaadin-themable-mixin/wiki/2.-Adding-Styles-to-Local-Scope) before continuing.*


## Stylable elements

### Host element

The host element is the main element which has a shadow DOM, for example `<vaadin-text-field>`.

### Named parts

In addition to the host element, only certain elements inside a themable element (i.e. an element extending [`ThemableMixin`](https://github.com/vaadin/vaadin-themable-mixin)) should be styled.

Other elements should be **considered as internal implementation details**, and you should not expect these elements to remain constant or be available in the future.

The stylable elements have the `part` attribute, which gives the elements a descriptive name.

#### Example: stylable parts of vaadin-text-field
![](https://www.dropbox.com/s/g6l4xzujk8k7wda/vaadin-text-field-parts.png?raw=1)

You can expect these part names to remain constant and rely on the hierarchy of these parts (i.e. the `value` part will always be contained within `input-field`).


## How do I know what parts are available?

The stylable parts of each Vaadin component are listed in their API documentation. See the [API documentation for vaadin-text-field](https://vaadin.com/components/vaadin-text-field/html-api/elements/Vaadin.TextFieldElement#styling) for example.


## Supported selectors

### :host

The host element can be targeted using the `:host` selector.

```html
<dom-module id="my-button" theme-for="vaadin-button">
  <template>
    <style>
      :host {
        /* Styles for vaadin-button element */
      }
    </style>
  </template>
</dom-module>
```


### [part="..."]

The stylable elements (marked with a `part` attribute) should only be targeted using the `[part="..."]` attribute selector.

```html
<dom-module id="my-text-field" theme-for="vaadin-text-field">
  <template>
    <style>
      [part="input-field"] {
        /* Styles for vaadin-text-field's input-field part */
      }
    </style>
  </template>
</dom-module>
```

### [part~="..."]

Use `part~="..."` to match a part which might have multiple names, for example the cells inside a `<vaadin-grid>` which can have multiple names like `"cell"` and `"body-cell"`.

You can use this kind of attribute selector in all cases, if you want to be safe. It will work for parts with only one name as well.

```html
<dom-module id="my-grid" theme-for="vaadin-grid">
  <template>
    <style>
      [part~="cell"] {
        /* Styles that affect all grid cells, including header, body and footer cells */
      }

      [part~="body-cell"] {
        /* Styles that only affect all body cells */
      }
    </style>
  </template>
</dom-module>
```

**Do not rely on the element type** which a part applies to. For example, given `<input type="text" part="value">`, you should not rely on the information that the element is actually a native `<input>` element. This is considered as an internal implementation detail, and the element type could change in the future (while the part name stays the same), for example to `<div contenteditable="true" part="value">`.

### State attributes

Some custom elements expose some of their internal state as top-level attributes for styling purposes. You can find these attributes in the elements API documentation.

For example, you can target styles for a disabled `<vaadin-button>` using the `disabled` attribute in combination with the `:host` selector:

```html
<dom-module id="my-button" theme-for="vaadin-button">
  <template>
    <style>
      :host([disabled]) {
        /* Styles for disabled vaadin-button element */
      }
    </style>
  </template>
</dom-module>
```

You can also target any named parts in a specific state of the host. For example, you can add a red border for the `input-field` part of a `<vaadin-text-field>` which is marked `invalid`:

```html
<dom-module id="my-text-field" theme-for="vaadin-text-field">
  <template>
    <style>
      :host([invalid]) [part="input-field"] {
        border: 1px solid red;
      }
    </style>
  </template>
</dom-module>
```



Similarly to the host element, the named parts can also expose state attributes for themselves, which can be used for styling. These are also listed in the element’s API documentation.

For example, you can target a selected date in a `<vaadin-date-picker>`:

```html
<dom-module id="my-month-calendar-styles" theme-for="vaadin-month-calendar">
  <template>
    <style>
     [part~="date"][selected] {
       /* Styles for a selected date */
     }
   </style>
  </template>
</dom-module>
```



# Scoping Styles in a Theme Module

The styles defined in a “theme module” affect all the instances of the element the module targets with the `theme-for` attribute.

There are two ways to scope the styles that you write in a theme module.

 1. **Expose new custom properties**
This is the recommended first option for simple situations. If you end up exposing more than a handful of properties, you should consider the second option.
 2. **Use scoping selectors**
This approach is used by the built-in variations in Vaadin themes (Valo and Material), i.e. `theme` attribute. The downside of this approach is that you end up adding the selectors and properties to all instances, even though only some instances will need those styles (they won’t apply unless the scoping selector is used on the host element).

#### Example: expose new custom properties
```html
<!-- Define the theme module (in index.html or in a separate HTML import) -->
<dom-module id="my-text-field-theme" theme-for="vaadin-text-field">
  <template>
    <style>
      [part="input-field"] {
        background-color: var(--input-field-background-color, #fff);
      }
    </style>
  </template>
</dom-module>

<!-- Use the new custom property -->
<custom-style>
  <style>
    .some-part-of-my-app vaadin-text-field {
     --input-field-background-color: #eee;
    }
  </style>
</custom-style>

<div class="some-part-of-my-app">
  <vaadin-text-field></vaadin-text-field>
</div>
```

#### Example: use scoping selectors

```html
<!-- Define the theme module (in index.html or in a separate HTML import) -->
<dom-module id="my-text-field-theme" theme-for="vaadin-text-field">
  <template>
    <style>
      :host(.special-field) [part="input-field"] {
        background-color: #000;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 9px;
        ...
      }
    </style>
  </template>
</dom-module>

<!-- Use the new scoping selector anywhere in your app -->
<div>
  <vaadin-text-field class="special-field"></vaadin-text-field>
</div>
```



# Theme Attribute and Subcomponents

Sometimes components using `VaadinThemableMixin` are contained in Shadow DOM of other components. In such a case, we propagate the `theme` attribute of the host web component to subcomponents.

For example, Vaadin components using `<vaadin-text-field>` is used as an internal input field subcomponent, including `<vaadin-combo-box>`, `<vaadin-date-picker>`, and so on, propagate the `theme` attribute. You can use theme variants defined for `<vaadin-text-field>` in, e. g., `<vaadin-combo-box>`, and this will affect the internal subcomponent:

#### Example: using `small` Lumo theme variant on `<vaadin-combo-box>`

```html
<vaadin-combo-box theme="small"></vaadin-combo-box>
```

If you can define a custom theme variant for `<vaadin-text-field>`, you can use it with other Vaadin components that have an internal `<vaadin-text-field>` too:

#### Example: using a custom text field `theme` variant with `<vaadin-combo-box>`

```html
<!-- Define the theme module (in index.html or in a separate HTML import) -->
<dom-module id="special-field-theme" theme-for="vaadin-text-field">
  <template>
    <style>
      :host([theme~="special-field"]) [part="input-field"] {
        background-color: #000;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 9px;
        ...
      }
    </style>
  </template>
</dom-module>

<!-- Apply the theme attribute to <vaadin-combo-box> -->
<vaadin-combo-box theme="special-field"></vaadin-combo-box>
```

### How to propagate the `theme` attribute in your components

With your Polymer-based web components you can use `VaadinThemePropertyMixin` to propagate the `theme` to subcomponents. The mixin provides the `theme` property that you can bind to descendant attributes.

#### Example: a Polymer-based element that propagates the `theme` to Vaadin subcomponents:

```js
class MyFieldElement extends Vaadin.ThemePropertyMixin(Polymer.Element) {
  static get is() { return 'my-field'; }

  static get template() {
    return html`<vaadin-text-field theme$="[[theme]]"></vaadin-text-field>`;
  }
}

CustomElements.define(MyFieldElement.is, MyFieldElement);
```

```html
<my-field theme="small"></my-field>
```

## List of Vaadin components that propagate `theme` to subcomponents

- `<vaadin-context-menu>`’s theme propagates to internal:
  - `<vaadin-context-menu-overlay>`
- `<vaadin-time-picker>`:
  - `<vaadin-combo-box-light>`
  - `<vaadin-time-picker-text-field>`
- `<vaadin-select>`:
  - `<vaadin-text-field>`
  - `<vaadin-select-overlay>`
- `<vaadin-dialog>`:
  - `<vaadin-dialog-overlay>`
- `<vaadin-combo-box>`:
  - `<vaadin-text-field>`
  - `<vaadin-combo-box-dropdown-wrapper>`
  - `<vaadin-combo-box-dropdown>`
  - `<vaadin-combo-box-item>`
- `<vaadin-combo-box-light>`:
  - `<vaadin-combo-box-dropdown-wrapper>`
  - `<vaadin-combo-box-dropdown>`
  - `<vaadin-combo-box-item>`
- `<vaadin-crud>`:
  - `<vaadin-crud-grid>`
  - `<vaadin-dialog-layout>`
  - `<vaadin-dialog>`
  - `<vaadin-confirm-dialog>`
- `<vaadin-date-picker>`:
  - `<vaadin-text-field>`
  - `<vaadin-date-picker-overlay>`
  - `<vaadin-date-picker-overlay-content>`
  - `<vaadin-month-calendar>`
- `<vaadin-date-picker-light>`:
  - `<vaadin-date-picker-overlay>`
  - `<vaadin-date-picker-overlay-content>`
  - `<vaadin-month-calendar>`
- `<vaadin-notification>`:
  - `<vaadin-notification-card>`
- `<vaadin-login-overlay>`:
  - `<vaadin-login-overlay-wrapper>`
- `<vaadin-login-form>`:
  - `<vaadin-login-form-wrapper>`



# External resources
- [Polymer styling documentation](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom)
