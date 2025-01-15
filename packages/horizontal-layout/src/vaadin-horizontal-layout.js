/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { horizontalLayoutStyles } from './vaadin-horizontal-layout-styles.js';

registerStyles('vaadin-horizontal-layout', horizontalLayoutStyles, { moduleId: 'vaadin-horizontal-layout-styles' });

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```
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
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class HorizontalLayout extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`<slot></slot>`;
  }

  static get is() {
    return 'vaadin-horizontal-layout';
  }
}

defineCustomElement(HorizontalLayout);

export { HorizontalLayout };
