/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { formItemStyles } from './styles/vaadin-form-item-base-styles.js';
import { FormItemMixin } from './vaadin-form-item-mixin.js';

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
 * ```css
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes FormItemMixin
 * @mixes ThemableMixin
 */
class FormItem extends FormItemMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-form-item';
  }

  static get styles() {
    return formItemStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <div id="label" part="label" @click="${this.__onLabelClick}">
        <slot name="label" id="labelSlot" @slotchange="${this.__onLabelSlotChange}"></slot>
        <span part="required-indicator" aria-hidden="true"></span>
      </div>
      <div id="spacing"></div>
      <div id="content">
        <slot id="contentSlot" @slotchange="${this.__onContentSlotChange}"></slot>
      </div>
    `;
  }
}

defineCustomElement(FormItem);

export { FormItem };
