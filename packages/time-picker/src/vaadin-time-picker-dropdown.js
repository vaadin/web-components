/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-time-picker-item.js';
import './vaadin-time-picker-overlay.js';
import './vaadin-time-picker-scroller.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ComboBoxDropdown } from '@vaadin/combo-box/src/vaadin-combo-box-dropdown.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends ComboBoxDropdown
 * @private
 */
class TimePickerDropdown extends ComboBoxDropdown {
  static get is() {
    return 'vaadin-time-picker-dropdown';
  }

  static get template() {
    return html`
      <vaadin-time-picker-overlay
        id="overlay"
        hidden$="[[_isOverlayHidden(_items.*, loading)]]"
        loading$="[[loading]]"
        opened="{{_overlayOpened}}"
        theme$="[[theme]]"
        position-target="[[positionTarget]]"
        no-vertical-overlap
      ></vaadin-time-picker-overlay>
    `;
  }
}

customElements.define(TimePickerDropdown.is, TimePickerDropdown);
