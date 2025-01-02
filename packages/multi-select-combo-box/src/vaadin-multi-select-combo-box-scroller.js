/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { ComboBoxScrollerMixin } from '@vaadin/combo-box/src/vaadin-combo-box-scroller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxScrollerMixin
 * @private
 */
export class MultiSelectComboBoxScroller extends ComboBoxScrollerMixin(PolymerElement) {
  static get is() {
    return 'vaadin-multi-select-combo-box-scroller';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-height: 1px;
          overflow: auto;

          /* Fixes item background from getting on top of scrollbars on Safari */
          transform: translate3d(0, 0, 0);

          /* Enable momentum scrolling on iOS */
          -webkit-overflow-scrolling: touch;

          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
          box-shadow: 0 0 0 white;
        }

        #selector {
          border-width: var(--_vaadin-multi-select-combo-box-items-container-border-width);
          border-style: var(--_vaadin-multi-select-combo-box-items-container-border-style);
          border-color: var(--_vaadin-multi-select-combo-box-items-container-border-color, transparent);
          position: relative;
        }
      </style>
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('aria-multiselectable', 'true');
  }

  /**
   * @protected
   * @override
   */
  _isItemSelected(item, _selectedItem, itemIdPath) {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    }

    if (this.owner.readonly) {
      return false;
    }

    return this.owner._findIndex(item, this.owner.selectedItems, itemIdPath) > -1;
  }

  /**
   * @param {HTMLElement} el
   * @param {number} index
   * @protected
   * @override
   */
  _updateElement(el, index) {
    super._updateElement(el, index);

    el.toggleAttribute('readonly', this.owner.readonly);
  }
}

defineCustomElement(MultiSelectComboBoxScroller);
