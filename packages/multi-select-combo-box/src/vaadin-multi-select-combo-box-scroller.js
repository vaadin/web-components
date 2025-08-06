/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { ComboBoxScrollerMixin } from '@vaadin/combo-box/src/vaadin-combo-box-scroller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { multiSelectComboBoxScrollerStyles } from './styles/vaadin-multi-select-combo-box-scroller-base-styles.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxScrollerMixin
 * @private
 */
export class MultiSelectComboBoxScroller extends ComboBoxScrollerMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-scroller';
  }

  static get styles() {
    return multiSelectComboBoxScrollerStyles;
  }

  /** @protected */
  render() {
    return html`
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
