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
import { DisableUpgradeMixin } from '@polymer/polymer/lib/mixins/disable-upgrade-mixin.js';
import { OverlayElement } from '@vaadin/vaadin-overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/vaadin-overlay/src/vaadin-overlay-position-mixin.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerOverlayStyles } from './vaadin-date-picker-styles.js';

registerStyles('vaadin-date-picker-overlay', datePickerOverlayStyles, {
  moduleId: 'vaadin-date-picker-overlay-styles',
});

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends OverlayElement
 * @private
 */
class DatePickerOverlay extends DisableUpgradeMixin(PositionMixin(OverlayElement)) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }
}

customElements.define(DatePickerOverlay.is, DatePickerOverlay);
