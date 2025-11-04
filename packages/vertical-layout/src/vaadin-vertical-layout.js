/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { verticalLayoutStyles } from './styles/vaadin-vertical-layout-base-styles.js';

/**
 * `<vaadin-vertical-layout>` provides a simple way to vertically align your HTML elements.
 *
 * ```html
 * <vaadin-vertical-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-vertical-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-vertical-layout>` supports the following theme variations:
 *
 * Theme variation    | Description
 * -------------------|---------------
 * `theme="margin"`   | Applies the default amount of CSS margin for the host element
 * `theme="padding"`  | Applies the default amount of CSS padding for the host element
 * `theme="spacing"`  | Applies the default amount of CSS margin between items
 * `theme="wrap"`     | Items wrap to the next row when they exceed the layout width
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                | Description
 * -----------------------------------|-------------
 * `--vaadin-vertical-layout-margin`  | The default CSS margin applied when using `theme="margin"`
 * `--vaadin-vertical-layout-padding` | The default CSS padding applied when using `theme="padding"`
 * `--vaadin-vertical-layout-gap`     | The default CSS gap applied when using `theme="spacing"`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class VerticalLayout extends ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-vertical-layout';
  }

  static get styles() {
    return verticalLayoutStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(VerticalLayout);

export { VerticalLayout };
