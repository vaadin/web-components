/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { FormLayoutMixin } from './vaadin-form-layout-mixin.js';
import { formLayoutStyles } from './vaadin-form-layout-styles.js';

registerStyles('vaadin-form-layout', formLayoutStyles, { moduleId: 'vaadin-form-layout-styles' });

/**
 * `<vaadin-form-layout>` is a Web Component providing configurable responsive
 * layout for form elements.
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item>
 *     <label slot="label">First Name</label>
 *     <input class="full-width" value="Jane">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Last Name</label>
 *     <input class="full-width" value="Doe">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Email</label>
 *     <input class="full-width" value="jane.doe@example.com">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * It supports any child elements as layout items.
 *
 * By default, it makes a layout of two columns if the element width is equal or
 * wider than 40em, and a single column layout otherwise.
 *
 * The number of columns and the responsive behavior are customizable with
 * the `responsiveSteps` property.
 *
 * ### Spanning Items on Multiple Columns
 *
 * You can use `colspan` or `data-colspan` attribute on the items.
 * In the example below, the first text field spans on two columns:
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item colspan="2">
 *     <label slot="label">Address</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">First Name</label>
 *     <input class="full-width" value="Jane">
 *   </vaadin-form-item>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Last Name</label>
 *     <input class="full-width" value="Doe">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * ### Explicit New Row
 *
 * Use the `<br>` line break element to wrap the items on a new row:
 *
 * ```html
 * <vaadin-form-layout>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Email</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 *   <br>
 *
 *   <vaadin-form-item>
 *     <label slot="label">Confirm Email</label>
 *     <input class="full-width">
 *   </vaadin-form-item>
 *
 * </vaadin-form-layout>
 * ```
 *
 * ### CSS Properties Reference
 *
 * The following custom CSS properties are available on the `<vaadin-form-layout>`
 * element:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-form-layout-column-spacing` | Length of the spacing between columns | `2em`
 *
 * @customElement
 * @extends HTMLElement
 * @mixes FormLayoutMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class FormLayout extends FormLayoutMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-form-layout';
  }

  static get template() {
    return html`
      <div id="layout">
        <slot id="slot"></slot>
      </div>
    `;
  }
}

defineCustomElement(FormLayout);

export { FormLayout };
