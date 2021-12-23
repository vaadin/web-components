/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-item.js';
import './vaadin-multi-select-combo-box-overlay.js';
import './vaadin-multi-select-combo-box-scroller.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ComboBoxDropdown } from '@vaadin/combo-box/src/vaadin-combo-box-dropdown.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends ComboBoxDropdown
 * @private
 */
class MultiSelectComboBoxDropdown extends ComboBoxDropdown {
  static get is() {
    return 'vaadin-multi-select-combo-box-dropdown';
  }

  static get template() {
    return html`
      <vaadin-multi-select-combo-box-overlay
        id="overlay"
        hidden$="[[_isOverlayHidden(_items.*, loading)]]"
        loading$="[[loading]]"
        opened="{{_overlayOpened}}"
        theme$="[[theme]]"
        position-target="[[positionTarget]]"
        no-vertical-overlap
      ></vaadin-multi-select-combo-box-overlay>
    `;
  }
}

customElements.define(MultiSelectComboBoxDropdown.is, MultiSelectComboBoxDropdown);
