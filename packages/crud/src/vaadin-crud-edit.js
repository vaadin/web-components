/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// Override core styles of vaadin-button
const crudEdit = css`
  :host {
    display: block;
  }
`;

/**
 * `<vaadin-crud-edit>` is a helper element for `<vaadin-grid-column>` that provides
 * an easily themable button that fires an `edit` event with the row item as detail
 * when clicked.
 *
 * Typical usage is in a `<vaadin-grid-column>` of a custom `<vaadin-grid>` inside
 * a `<vaadin-crud>` to enable editing.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class CrudEdit extends Button {
  static get styles() {
    return [...super.styles, crudEdit];
  }

  static get template() {
    const style = document.createElement('template');
    style.innerHTML = `<style>${this.styles.join(' ')}</style>`;

    return html`
      ${style}
      <div part="icon"></div>
      <slot name="tooltip"></slot>
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
  }

  /** @private */
  __onClick(e) {
    const tr = e.target.parentElement.assignedSlot.parentElement.parentElement;
    tr.dispatchEvent(
      new CustomEvent('edit', { detail: { item: tr._item, index: tr.index }, bubbles: true, composed: true }),
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

defineCustomElement(CrudEdit);

export { CrudEdit };
