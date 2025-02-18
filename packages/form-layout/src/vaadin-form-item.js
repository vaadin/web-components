/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { FormItemMixin } from './vaadin-form-item-mixin.js';
import { formItemStyles } from './vaadin-form-layout-styles.js';

registerStyles('vaadin-form-item', formItemStyles, { moduleId: 'vaadin-form-item-styles' });

/**
 * `<vaadin-form-item>` is a Web Component providing labelled form item wrapper
 * for using inside `<vaadin-form-layout>`.
 *
 * `<vaadin-form-item>` accepts a single child as the input content,
 * and also has a separate named `label` slot:
 *
 * ```html
 * <vaadin-form-item>
 *   <label slot="label">Label aside</label>
 *   <input>
 * </vaadin-form-item>
 * ```
 *
 * The label is optional and can be omitted:
 *
 * ```html
 * <vaadin-form-item>
 *   <input type="checkbox"> Subscribe to our Newsletter
 * </vaadin-form-item>
 * ```
 *
 * By default, the `label` slot content is displayed aside of the input content.
 * When `label-position="top"` is set, the `label` slot content is displayed on top:
 *
 * ```html
 * <vaadin-form-item label-position="top">
 *   <label slot="label">Label on top</label>
 *   <input>
 * </vaadin-form-item>
 * ```
 *
 * **Note:** Normally, `<vaadin-form-item>` is used as a child of
 * a `<vaadin-form-layout>` element. Setting `label-position` is unnecessary,
 * because the `label-position` attribute is triggered automatically by the parent
 * `<vaadin-form-layout>`, depending on its width and responsive behavior.
 *
 * **Deprecation note:** The `label-position` attribute is deprecated since 24.7 and
 * will be removed in Vaadin 25, when a new approach for setting the label position
 * will be introduced.
 *
 * ### Input Width
 *
 * By default, `<vaadin-form-item>` does not manipulate the width of the slotted
 * input element. Optionally you can stretch the child input element to fill
 * the available width for the input content by adding the `full-width` class:
 *
 * ```html
 * <vaadin-form-item>
 *   <label slot="label">Label</label>
 *   <input class="full-width">
 * </vaadin-form-item>
 * ```
 *
 * ### Styling
 *
 * The `label-position` host attribute can be used to target the label on top state:
 *
 * ```
 * :host([label-position="top"]) {
 *   padding-top: 0.5rem;
 * }
 * ```
 *
 * **Deprecation note:** The `label-position` attribute is deprecated since 24.7 and
 * will be removed in Vaadin 25, when a new approach to styling the form-item
 * based on the label position will be introduced.
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * label | The label slot container
 *
 * ### Custom CSS Properties Reference
 *
 * The following custom CSS properties are available on the `<vaadin-form-item>`
 * element:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-form-item-label-width` | (DEPRECATED: Use `--vaadin-form-layout-label-width` on `<vaadin-form-layout>` instead) Width of the label column when the labels are aside | `8em`
 * `--vaadin-form-item-label-spacing` | (DEPRECATED: Use `--vaadin-form-layout-label-spacing` on `<vaadin-form-layout>` instead) Spacing between the label column and the input column when the labels are aside | `1em`
 * `--vaadin-form-item-row-spacing` | (DEPRECATED: Use `--vaadin-form-layout-row-spacing` on `<vaadin-form-layout>` instead) Height of the spacing between the form item elements | `1em`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes FormItemMixin
 * @mixes ThemableMixin
 */
class FormItem extends FormItemMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-form-item';
  }

  static get template() {
    return html`
      <div id="label" part="label" on-click="__onLabelClick">
        <slot name="label" id="labelSlot" on-slotchange="__onLabelSlotChange"></slot>
        <span part="required-indicator" aria-hidden="true"></span>
      </div>
      <div id="spacing"></div>
      <div id="content">
        <slot id="contentSlot" on-slotchange="__onContentSlotChange"></slot>
      </div>
    `;
  }
}

defineCustomElement(FormItem);

export { FormItem };
