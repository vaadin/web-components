/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-date-picker-month-scroller.js';
import './vaadin-date-picker-year-scroller.js';
import './vaadin-date-picker-year.js';
import './vaadin-month-calendar.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerOverlayContentMixin } from './vaadin-date-picker-overlay-content-mixin.js';
import { overlayContentStyles } from './vaadin-date-picker-overlay-content-styles.js';

registerStyles('vaadin-date-picker-overlay-content', overlayContentStyles, {
  moduleId: 'vaadin-date-picker-overlay-content-styles',
});

/**
 * @customElement
 * @extends HTMLElement
 * @private
 */
class DatePickerOverlayContent extends DatePickerOverlayContentMixin(
  ControllerMixin(ThemableMixin(DirMixin(PolymerElement))),
) {
  static get template() {
    return html`
      <div part="overlay-header" on-touchend="_preventDefault" aria-hidden="true">
        <div part="label">[[_formatDisplayed(selectedDate, i18n, label)]]</div>
        <div part="clear-button" hidden$="[[!selectedDate]]"></div>
        <div part="toggle-button"></div>

        <div part="years-toggle-button" hidden$="[[_desktopMode]]" aria-hidden="true">
          [[_yearAfterXMonths(_visibleMonthIndex)]]
        </div>
      </div>

      <div id="scrollers">
        <slot name="months"></slot>
        <slot name="years"></slot>
      </div>

      <div on-touchend="_preventDefault" role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <slot name="cancel-button"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-date-picker-overlay-content';
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'dialog');

    this._addListeners();
    this._initControllers();
  }
}

defineCustomElement(DatePickerOverlayContent);
