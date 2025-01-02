/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerOverlayMixin } from './vaadin-date-picker-overlay-mixin.js';
import { datePickerOverlayStyles } from './vaadin-date-picker-overlay-styles.js';

registerStyles('vaadin-date-picker-overlay', [overlayStyles, datePickerOverlayStyles], {
  moduleId: 'vaadin-date-picker-overlay-styles',
});

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DatePickerOverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
class DatePickerOverlay extends DatePickerOverlayMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-date-picker-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineCustomElement(DatePickerOverlay);
