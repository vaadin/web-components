/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-date-picker-month-scroller.js';
import './vaadin-date-picker-year-scroller.js';
import './vaadin-date-picker-year.js';
import './vaadin-month-calendar.js';
import { html, LitElement } from 'lit';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { loaderStyles } from '@vaadin/component-base/src/styles/loader-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { overlayContentStyles } from './styles/vaadin-date-picker-overlay-content-base-styles.js';
import { DatePickerOverlayContentMixin } from './vaadin-date-picker-overlay-content-mixin.js';

/**
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-date-picker-overlay-content
 * @extends HTMLElement
 * @private
 */
class DatePickerOverlayContent extends DatePickerOverlayContentMixin(
  ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-date-picker-overlay-content';
  }

  static get styles() {
    return [loaderStyles, screenReaderOnly, overlayContentStyles];
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    // Touch screen readers move through the calendar by swiping, which follows DOM order and
    // stops at the edges of the visible month. The buttons bracket the months so that a swipe
    // past either edge reaches a control that moves to the adjacent month.
    return html`
      <button
        id="previousMonthButton"
        class="sr-only"
        type="button"
        tabindex="-1"
        @click="${this.__onPreviousMonthClick}"
      >
        ${this.i18n?.previousMonth}
      </button>
      <slot name="months"></slot>
      <button id="nextMonthButton" class="sr-only" type="button" tabindex="-1" @click="${this.__onNextMonthClick}">
        ${this.i18n?.nextMonth}
      </button>
      <slot name="years"></slot>

      <div part="loader" aria-hidden="true"></div>

      <div role="toolbar" part="toolbar">
        <slot name="today-button"></slot>
        <div
          part="years-toggle-button"
          ?hidden="${this._desktopMode}"
          aria-hidden="true"
          @click="${this._toggleYearScroller}"
        >
          ${this._yearAfterXMonths(this._visibleMonthIndex)}
        </div>
        <slot name="cancel-button"></slot>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'dialog');

    this._initControllers();
  }
}

defineCustomElement(DatePickerOverlayContent);
