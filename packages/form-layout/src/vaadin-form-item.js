/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-form-item>` is a Web Component providing labelled form item wrapper
 * for using inside `<vaadin-form-layout>`.
 *
 * `<vaadin-form-item>` accepts any number of children as the input content,
 * and also has a separate named `label` slot:
 *
 * ```html
 * <vaadin-form-item>
 *   <label slot="label">Label aside</label>
 *   <input>
 * </vaadin-form-item>
 * ```
 *
 * Any content can be used. For instance, you can have multiple input elements
 * with surrounding text. The label can be an element of any type:
 *
 * ```html
 * <vaadin-form-item>
 *   <span slot="label">Date of Birth</span>
 *   <input placeholder="YYYY" size="4"> -
 *   <input placeholder="MM" size="2"> -
 *   <input placeholder="DD" size="2"><br>
 *   <em>Example: 1900-01-01</em>
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
 * ### Input Width
 *
 * By default, `<vaadin-form-item>` does not manipulate the width of the slotted
 * input elements. Optionally you can stretch the child input element to fill
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
 * `--vaadin-form-item-label-width` | Width of the label column when the labels are aside | `8em`
 * `--vaadin-form-item-label-spacing` | Spacing between the label column and the input column when the labels are aside | `1em`
 * `--vaadin-form-item-row-spacing` | Height of the spacing between the form item elements | `1em`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class FormItemElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          flex-direction: row;
          align-items: baseline;

          /* CSS API for host */
          --vaadin-form-item-label-width: 8em;
          --vaadin-form-item-label-spacing: 1em;
          --vaadin-form-item-row-spacing: 1em;

          margin: calc(0.5 * var(--vaadin-form-item-row-spacing)) 0;
        }

        :host([label-position='top']) {
          flex-direction: column;
          align-items: stretch;
        }

        :host([hidden]) {
          display: none !important;
        }

        #label {
          width: var(--vaadin-form-item-label-width);
          flex: 0 0 auto;
        }

        :host([label-position='top']) #label {
          width: auto;
        }

        #spacing {
          width: var(--vaadin-form-item-label-spacing);
          flex: 0 0 auto;
        }

        #content {
          flex: 1 1 auto;
        }

        #content ::slotted(.full-width) {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }
      </style>
      <div id="label" part="label" on-click="_onLabelClick">
        <slot name="label" id="labelSlot"></slot>
      </div>
      <div id="spacing"></div>
      <div id="content">
        <slot id="contentSlot"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-form-item';
  }

  /** @private */
  _onLabelClick() {
    const firstContentElementChild = Array.prototype.find.call(
      this.$.contentSlot.assignedNodes(),
      (e) => e.nodeType === Node.ELEMENT_NODE
    );
    if (firstContentElementChild) {
      firstContentElementChild.focus();
      firstContentElementChild.click();
    }
  }
}

customElements.define(FormItemElement.is, FormItemElement);

export { FormItemElement };
