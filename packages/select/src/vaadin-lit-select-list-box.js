/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectListBox extends ListMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-select-list-box';
  }

  static get styles() {
    return css`
      :host {
        --vaadin-item-checkmark-display: block;
        display: flex;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part='items'] {
        height: 100%;
        overflow-y: auto;
        width: 100%;
      }

      [part='items'] ::slotted(hr) {
        border-color: var(--_vaadin-border-color);
        border-width: 0 0 1px 0;
        margin: 4px 8px 4px
          calc(var(--vaadin-icon-size, 1lh) + var(--vaadin-item-gap, var(--_vaadin-gap-container-inline)) + 8px);
      }
    `;
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  /**
   * @return {!HTMLElement}
   * @protected
   * @override
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @protected */
  render() {
    return html`
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'listbox');
  }
}

defineCustomElement(SelectListBox);

export { SelectListBox };
