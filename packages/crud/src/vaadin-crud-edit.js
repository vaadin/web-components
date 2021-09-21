/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-crud-edit>` is a helper element for `<vaadin-grid-column>` that provides
 * an easily themable button that fires an `edit` event with the row item as detail
 * when clicked.
 *
 * Typical usage is in a `<vaadin-grid-column>` of a custom `<vaadin-grid>` inside
 * a `<vaadin-crud>` to enable editing.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class CrudEditElement extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    `;
  }

  static get is() {
    return 'vaadin-crud-edit';
  }

  /** @protected */
  ready() {
    super.ready();
    this.addEventListener('click', this.__onClick);
    this.setAttribute('aria-label', 'Edit');
    this.setAttribute('role', 'button');
  }

  /** @private */
  __onClick(e) {
    const tr = e.target.parentElement.assignedSlot.parentElement.parentElement;
    tr.dispatchEvent(
      new CustomEvent('edit', { detail: { item: tr._item, index: tr.index }, bubbles: true, composed: true })
    );
  }

  /**
   * Fired when user on the icon.
   *
   * @event edit
   * @param {Object} detail.item the item to edit
   * @param {Object} detail.index the index of the item in the data set
   */
}

window.customElements.define(CrudEditElement.is, CrudEditElement);
