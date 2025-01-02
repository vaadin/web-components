/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import './vaadin-date-picker-month-scroller.js';
import './vaadin-date-picker-year-scroller.js';
import './vaadin-lit-date-picker-year.js';
import './vaadin-lit-month-calendar.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerOverlayContentMixin } from './vaadin-date-picker-overlay-content-mixin.js';
import { overlayContentStyles } from './vaadin-date-picker-overlay-content-styles.js';

/**
 * @extends HTMLElement
 * @private
 */
class DatePickerOverlayContent extends DatePickerOverlayContentMixin(
  ThemableMixin(DirMixin(PolylitMixin(LitElement))),
) {
  static get is() {
    return 'vaadin-date-picker-overlay-content';
  }

  static get styles() {
    return overlayContentStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="overlay-header" @touchend="${this._preventDefault}" aria-hidden="true">
        <div part="label">${this._formatDisplayed(this.selectedDate, this.i18n, this.label)}</div>
        <div part="clear-button" ?hidden="${!this.selectedDate}"></div>
        <div part="toggle-button"></div>

        <div part="years-toggle-button" ?hidden="${this._desktopMode}" aria-hidden="true">
          ${this._yearAfterXMonths(this._visibleMonthIndex)}
        </div>
      </div>

      <div id="scrollers">
        <slot name="months"></slot>
        <slot name="years"></slot>
      </div>

      <div @touchend="${this._preventDefault}" role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <slot name="cancel-button"></slot>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'dialog');

    this._addListeners();
    this._initControllers();
  }
}

defineCustomElement(DatePickerOverlayContent);
