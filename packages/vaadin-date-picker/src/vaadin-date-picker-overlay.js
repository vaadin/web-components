/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { DisableUpgradeMixin } from '@polymer/polymer/lib/mixins/disable-upgrade-mixin.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class DatePickerOverlayElement extends DisableUpgradeMixin(OverlayElement) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }
}

customElements.define(DatePickerOverlayElement.is, DatePickerOverlayElement);
