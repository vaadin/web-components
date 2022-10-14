/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisableUpgradeMixin } from '@polymer/polymer/lib/mixins/disable-upgrade-mixin.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerOverlayStyles } from './vaadin-date-picker-styles.js';

registerStyles('vaadin-date-picker-overlay', datePickerOverlayStyles, {
  moduleId: 'vaadin-date-picker-overlay-styles',
});

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @private
 */
class DatePickerOverlay extends DisableUpgradeMixin(PositionMixin(Overlay)) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.querySelector('[part~="overlay"]').removeAttribute('tabindex');
    }

    return memoizedTemplate;
  }
}

customElements.define(DatePickerOverlay.is, DatePickerOverlay);
