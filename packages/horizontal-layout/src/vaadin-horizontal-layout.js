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
import { horizontalLayoutStyles } from './styles/vaadin-horizontal-layout-core-styles.js';
import { HorizontalLayoutMixin } from './vaadin-horizontal-layout-mixin.js';

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```html
 * <vaadin-horizontal-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-horizontal-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-horizontal-layout>` supports the following theme variations:
 *
 * Theme variation | Description
 * ---|---
 * `theme="margin"` | Applies the default amount of CSS margin for the host element (specified by the theme)
 * `theme="padding"` | Applies the default amount of CSS padding for the host element (specified by the theme)
 * `theme="spacing"` | Applies the default amount of CSS margin between items (specified by the theme)
 * `theme="wrap"` | Items wrap to the next row when they exceed the layout width
 *
 * ### Component's slots
 *
 * The following slots are available to be set:
 *
 * Slot name          | Description
 * -------------------|---------------
 * no name            | Default slot
 * `middle`           | Slot for the content placed in the middle
 * `end`              | Slot for the content placed at the end
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes HorizontalLayoutMixin
 */
class HorizontalLayout extends HorizontalLayoutMixin(
  ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-horizontal-layout';
  }

  static get styles() {
    return horizontalLayoutStyles;
  }

  static get lumoInjector() {
    return {
      includeBaseStyles: true,
    };
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>
      <slot name="middle"></slot>
      <slot name="end"></slot>
    `;
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
